import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { getRiskLevel } from "./riskScore.service";

export async function createCandidateSummary(candidateId: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: {
      verificationCases: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          verificationItems: true,
        },
      },
    },
  });

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  const verificationCase = candidate.verificationCases[0];

  if (!verificationCase) {
    return {
      candidate: basicCandidate(candidate),
      verification: null,
      progress: null,
      flags: null,
    };
  }

  const items = verificationCase.verificationItems;

  const totalItems = items.length;
  const completedItems = items.filter(
    (i) =>
      i.status === VerificationStatus.CLEAR ||
      i.status === VerificationStatus.FAILED,
  ).length;

  const hasDiscrepancy = items.some(
    (i) => i.status === VerificationStatus.DISCREPANCY,
  );

  const hasFailure = items.some((i) => i.status === VerificationStatus.FAILED);

  const lastUpdatedAt = items.reduce(
    (latest, i) => (i.updatedAt > latest ? i.updatedAt : latest),
    verificationCase.startedAt,
  );

  const tatMs = verificationCase.completedAt
    ? verificationCase.completedAt.getTime() -
      verificationCase.startedAt.getTime()
    : Date.now() - verificationCase.startedAt.getTime();

  const tatDays = Number((tatMs / (24 * 60 * 60 * 1000)).toFixed(2));

  return {
    candidate: basicCandidate(candidate),
    verification: {
      status: verificationCase.status,
      riskScore: verificationCase.riskScore,
      riskLevel: getRiskLevel(verificationCase.riskScore),
      remarks: buildRiskRemarks(items),
    },
    progress: {
      totalItems,
      completedItems,
      progressText: `${completedItems} / ${totalItems}`,
      startedAt: verificationCase.startedAt,
      lastUpdatedAt,
      tatDays,
    },
    flags: {
      hasDiscrepancy,
      hasFailure,
    },
  };
}

function basicCandidate(candidate: any) {
  return {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    city: candidate.city,
    joiningDesignation: candidate.joiningDesignation,
  };
}

function buildRiskRemarks(items: any[]) {
  const remarks: string[] = [];

  if (items.some((i) => i.status === VerificationStatus.DISCREPANCY)) {
    remarks.push("One or more verifications have discrepancies");
  }

  if (items.some((i) => i.status === VerificationStatus.FAILED)) {
    remarks.push("One or more verifications have failed");
  }

  return remarks;
}
