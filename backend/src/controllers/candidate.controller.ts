import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { VerificationStatus } from "../../generated/prisma/enums";
import cloudinary from "../lib/cloudinary";
import { createCandidateSummary } from "../services/candidateSummary.service";

type TimelineEventType =
  | "CASE_STARTED"
  | "ITEM_CREATED"
  | "CANDIDATE_FORM_SUBMITTED"
  | "CONTACT_ADDED"
  | "CONTACT_RESPONDED"
  | "DOCUMENT_UPLOADED"
  | "CALL_LOGGED"
  | "DISCREPANCY_CREATED"
  | "ITEM_COMPLETED"
  | "CASE_COMPLETED";

type Timeline = {
  timestamp: Date;
  type: TimelineEventType;
  verificationCaseId: string;
  verificationItemId?: string;
  verificationContactId?: string;
  company?: string;
  contactName?: string;
  message: string;
  metadata?: any;
};

type QueueStatus =
  | "all"
  | "PENDING"
  | "IN_PROGRESS"
  | "CLEAR"
  | "DISCREPANCY"
  | "FAILED";

export const createCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { organizationId, name, email, phone, city, joiningDesignation } =
      req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        organizationId,
        name,
        email,
        phone,
        city,
        joiningDesignation,
      },
    });

    res.status(201).json(candidate);
  } catch (err) {
    next(err);
  }
};

// export const getCandidateOverview = async (req: Request, res: Response) => {
//   const candidateId = req.params.candidateId as string;

//   const candidate = await prisma.candidate.findUnique({
//     where: { id: candidateId },
//     include: {
//       employments: {
//         orderBy: { createdAt: "desc" },
//         take: 1,
//       },
//     },
//   });

//   if (!candidate) {
//     return res.status(404).json({ message: "Candidate not found" });
//   }

//   const latestEmployment = candidate.employments[0];

//   const allStatuses = await prisma.employmentVerification.findMany({
//     where: { candidateId },
//     select: { status: true },
//   });

//   const verificationStatus = getOverallStatusFromEmployments(
//     allStatuses.map((e: { status: VerificationStatus }) => e.status),
//   );

//   res.json({
//     candidateId: candidate.id,
//     name: candidate.name,
//     email: candidate.email,
//     phone: candidate.phone,
//     city: candidate.city,
//     position:
//       candidate.joiningDesignation ?? latestEmployment?.designation ?? "-",
//     verificationStatus,
//   });
// };

export const getEmploymentTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const candidateId = req.params.candidateId as string;

    const cases = await prisma.verificationCase.findMany({
      where: { candidateId },
      include: {
        verificationItems: {
          include: {
            candidateVerificationResponses: true,
            contacts: {
              include: {
                verificationResponses: true,
                verificationDocuments: true,
                callingLogs: true,
              },
            },
            verificationDiscrepancies: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const timeline: Timeline[] = [];

    for (const verificationCase of cases) {
      timeline.push({
        timestamp: verificationCase.startedAt,
        type: "CASE_STARTED",
        verificationCaseId: verificationCase.id,
        message: "Verification case started",
      });

      if (verificationCase.candidateFormSubmitted) {
        timeline.push({
          timestamp: verificationCase.updatedAt,
          type: "CANDIDATE_FORM_SUBMITTED",
          verificationCaseId: verificationCase.id,
          message: "Candidate submitted verification form",
        });
      }

      for (const item of verificationCase.verificationItems) {
        const metadata = item.metadata as any;
        const companyName = metadata?.companyName || "Employment Verification";

        timeline.push({
          timestamp: item.createdAt,
          type: "ITEM_CREATED",
          verificationCaseId: verificationCase.id,
          verificationItemId: item.id,
          company: companyName,
          message: `${companyName} verification initiated`,
          metadata,
        });

        for (const response of item.candidateVerificationResponses) {
          timeline.push({
            timestamp: response.createdAt,
            type: "CANDIDATE_FORM_SUBMITTED",
            verificationCaseId: verificationCase.id,
            verificationItemId: item.id,
            company: companyName,
            message: `Candidate answered: ${response.questionLabel}`,
          });
        }

        for (const contact of item.contacts) {
          timeline.push({
            timestamp: contact.createdAt,
            type: "CONTACT_ADDED",
            verificationCaseId: verificationCase.id,
            verificationItemId: item.id,
            company: companyName,
            contactName: contact.name,
            message: `Verification contact added: ${contact.name}`,
          });

          if (contact.respondedAt) {
            timeline.push({
              timestamp: contact.respondedAt,
              type: "CONTACT_RESPONDED",
              verificationCaseId: verificationCase.id,
              verificationItemId: item.id,
              verificationContactId: contact.id,
              company: companyName,
              contactName: contact.name,
              message: `${contact.name} submitted verification response`,
            });
          }

          for (const doc of contact.verificationDocuments) {
            timeline.push({
              timestamp: doc.uploadedAt,
              type: "DOCUMENT_UPLOADED",
              verificationCaseId: verificationCase.id,
              verificationItemId: item.id,
              verificationContactId: contact.id,
              company: companyName,
              contactName: contact.name,
              message: `${doc.type.replace("_", " ")} uploaded by ${contact.name}`,
              metadata: {
                fileUrl: doc.fileUrl,
                documentType: doc.type,
              },
            });
          }

          for (const call of contact.callingLogs) {
            timeline.push({
              timestamp: call.callTime,
              type: "CALL_LOGGED",
              verificationCaseId: verificationCase.id,
              verificationItemId: item.id,
              verificationContactId: contact.id,
              company: companyName,
              contactName: contact.name,
              message: `Manual call logged with ${contact.name}: ${call.outcome}`,
            });
          }
        }

        for (const discrepancy of item.verificationDiscrepancies) {
          timeline.push({
            timestamp: discrepancy.createdAt,
            type: "DISCREPANCY_CREATED",
            verificationCaseId: verificationCase.id,
            verificationItemId: item.id,
            company: companyName,
            message: `Discrepancy found in ${discrepancy.questionKey}`,
            metadata: {
              claimedValue: discrepancy.claimedValue,
              verifiedValue: discrepancy.verifiedValue,
              status: discrepancy.status,
            },
          });
        }

        if (item.completedAt) {
          timeline.push({
            timestamp: item.completedAt,
            type: "ITEM_COMPLETED",
            verificationCaseId: verificationCase.id,
            verificationItemId: item.id,
            company: companyName,
            message: `${companyName} verification completed`,
          });
        }
      }

      if (verificationCase.completedAt) {
        timeline.push({
          timestamp: verificationCase.completedAt,
          type: "CASE_COMPLETED",
          verificationCaseId: verificationCase.id,
          message: "Verification case completed",
        });
      }
    }

    timeline.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    res.json({ candidateId, timeline });
  } catch (err) {
    next(err);
  }
};

export const getCandidateSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const candidateId = req.params.candidateId as string;

    const summary = await createCandidateSummary(candidateId);

    res.json(summary);
  } catch (err) {
    next(err);
  }
};

export const addCandidateNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const candidateId = req.params.candidateId as string;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ message: "Note is required" });
    }

    const createdNote = await prisma.candidateNote.create({
      data: {
        candidateId,
        note,
      },
    });

    res.status(201).json(createdNote);
  } catch (err) {
    next(err);
  }
};

// export const searchCandidates = async (req: Request, res: Response) => {
//   const query = req.query.q as string | undefined;

//   if (!query || query.trim().length < 2) {
//     return res.status(400).json({
//       message: "Search query must be at least 2 characters",
//     });
//   }

//   const candidates = await prisma.candidate.findMany({
//     where: {
//       OR: [
//         { name: { contains: query, mode: "insensitive" } },
//         { email: { contains: query, mode: "insensitive" } },
//         { phone: { contains: query } },
//       ],
//     },
//     take: 10,
//     include: {
//       employments: {
//         select: { status: true },
//       },
//     },
//   });

//   const results = candidates.map((candidate) => {
//     const statuses = candidate.employments.map((e) => e.status);

//     return {
//       id: candidate.id,
//       name: candidate.name,
//       email: candidate.email,
//       phone: candidate.phone,
//       city: candidate.city,
//       joiningDesignation: candidate.joiningDesignation,
//       verificationStatus: getOverallStatusFromEmployments(statuses),
//     };
//   });

//   res.json({
//     count: results.length,
//     results,
//   });
// };

export const getVerificationQueue = async (req: Request, res: Response) => {
  const status = (req.query.status as QueueStatus) || "all";
  const city = req.query.city as string | undefined;
  const designation = req.query.designation as string | undefined;
  const q = req.query.q as string | undefined;

  const candidates = await prisma.candidate.findMany({
    where: {
      ...(city && {
        city: { equals: city, mode: "insensitive" },
      }),
      ...(designation && {
        joiningDesignation: {
          contains: designation,
          mode: "insensitive",
        },
      }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
        ],
      }),
    },
    include: {
      verificationCases: {
        include: {
          verificationItems: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const results = candidates
    .map((candidate) => {
      const allItems = candidate.verificationCases.flatMap(
        (vc) => vc.verificationItems,
      );

      const statuses = allItems.map((item) => item.status);

      const queueStatus = deriveQueueStatus(statuses);
      const riskScore = calculateCandidateRisk(statuses);
      const progress = calculateProgress(statuses);

      const tatDays = calculateTAT(
        candidate.verificationCases.map((vc) => vc.startedAt),
      );

      const lastUpdated =
        allItems.length > 0
          ? allItems.reduce(
              (latest, item) =>
                item.updatedAt > latest ? item.updatedAt : latest,
              candidate.createdAt,
            )
          : candidate.createdAt;

      return {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        city: candidate.city,
        joiningDesignation: candidate.joiningDesignation,
        verificationStatus: queueStatus,
        riskScore,
        progress,
        tatDays,
        lastUpdated,
      };
    })
    .filter((candidate) => {
      if (status === "all") return true;
      return candidate.verificationStatus === status;
    });

  res.json({
    count: results.length,
    results,
  });
};

export const uploadCandidateResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const candidateId = req.params.candidateId as string;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(req.file?.buffer);
    });

    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        resumeUrl: uploadResult.secure_url,
        resumeUploadedAt: new Date(),
      },
    });

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: candidate.resumeUrl,
    });
  } catch (err) {
    next(err);
  }
};

function getOverallStatusFromEmployments(statuses: VerificationStatus[]) {
  if (statuses.includes("FAILED")) return "HIGH_RISK";
  if (statuses.includes("DISCREPANCY")) return "REVIEW";
  if (statuses.some((s) => s === "PENDING" || s === "IN_PROGRESS")) {
    return "IN_PROGRESS";
  }
  return "CLEAR";
}

function getRiskForStatus(status: string): number {
  switch (status) {
    case "CLEAR":
      return 0;
    case "PENDING":
    case "IN_PROGRESS":
      return 10;
    case "DISCREPANCY":
      return 40;
    case "FAILED":
      return 70;
    default:
      return 0;
  }
}

function deriveQueueStatus(statuses: VerificationStatus[]): QueueStatus {
  if (statuses.length === 0) return "all";

  if (
    statuses.includes(VerificationStatus.FAILED) ||
    statuses.includes(VerificationStatus.DISCREPANCY)
  ) {
    return "FAILED";
  }

  if (
    statuses.includes(VerificationStatus.PENDING) ||
    statuses.includes(VerificationStatus.IN_PROGRESS)
  ) {
    return "PENDING";
  }

  return "CLEAR";
}

function calculateCandidateRisk(statuses: VerificationStatus[]): number {
  return Math.max(...statuses.map(getRiskForStatus), 0);
}

function calculateProgress(statuses: VerificationStatus[]): string {
  if (statuses.length === 0) return "0/0";

  const completed = statuses.filter(
    (s) => s === "CLEAR" || s === "FAILED" || s === "DISCREPANCY",
  ).length;

  return `${completed}/${statuses.length}`;
}

function calculateTAT(createdDates: Date[]): number {
  const start = Math.min(...createdDates.map((d) => d.getTime()));
  const now = Date.now();
  const diffMs = now - start;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
