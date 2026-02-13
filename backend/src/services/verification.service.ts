import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { verifierMsgTemplate } from "../templates/verifierMessage";
import { buildVerificationLink } from "../utils/linkBuilder";
import {
  applyDiscrepancy,
  deriveCaseStatus,
  deriveItemStatus,
} from "../utils/verificationStatus";
import { evaluateAndPersistDiscrepancies } from "./discrepancy.service";
import { sendNotification } from "./notification.service";

// Recalculate item + case status after a contact responds
export async function recalculateVerificationStatus(
  verificationItemId: string,
) {
  const item = await prisma.verificationItem.findUnique({
    where: { id: verificationItemId },
    include: {
      contacts: true,
      verificationCase: {
        include: {
          verificationItems: true,
        },
      },
    },
  });

  if (!item) {
    throw new Error("VerificationItem not found");
  }

  const baseItemStatus = deriveItemStatus(
    item.contacts,
    item.mandatory,
    item.verificationTypeConfigId ? 1 : 1, // todo: wire minContacts later
  );

  let finalItemStatus = baseItemStatus;

  if (baseItemStatus === VerificationStatus.CLEAR) {
    const { hasDiscrepancy } = await evaluateAndPersistDiscrepancies(item.id);
    finalItemStatus = applyDiscrepancy(baseItemStatus, hasDiscrepancy);
  }

  await prisma.verificationItem.update({
    where: { id: item.id },
    data: {
      status: finalItemStatus,
      completedAt:
        finalItemStatus === "CLEAR" ||
        finalItemStatus === "FAILED" ||
        finalItemStatus === "DISCREPANCY"
          ? new Date()
          : null,
    },
  });

  const caseStatus = deriveCaseStatus(
    item.verificationCase.verificationItems.map((i) => ({
      status: i.status,
      mandatory: i.mandatory,
    })),
  );

  await prisma.verificationCase.update({
    where: { id: item.verificationCaseId },
    data: {
      status: caseStatus,
      completedAt:
        caseStatus === "CLEAR" ||
        caseStatus === "FAILED" ||
        caseStatus === "DISCREPANCY"
          ? new Date()
          : null,
    },
  });
}

export async function handleContactResponse(verificationContactId: string) {
  const contact = await prisma.verificationContact.findUnique({
    where: { id: verificationContactId },
    include: {
      verificationItem: {
        include: {
          contacts: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!contact) return;

  const item = contact.verificationItem;

  // Only applies to SEQUENTIAL
  if (item.executionMode !== "SEQUENTIAL") return;

  if (item.status === "CLEAR") return;

  const nextContact = item.contacts.find((c) => c.status === "BLOCKED");

  if (!nextContact) return;

  await prisma.verificationContact.update({
    where: { id: nextContact.id },
    data: { status: "PENDING" },
  });

  const verificationItem = await prisma.verificationItem.findUnique({
    where: {
      id: nextContact.verificationItemId,
    },
    include: {
      verificationCase: {
        include: {
          candidate: true,
        },
      },
    },
  });

  if (!verificationItem) {
    throw new Error("Verification case not found");
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: verificationItem.verificationCase.candidate.organizationId,
    },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const candidateName = verificationItem.verificationCase.candidate.name;

  const verifierLink = buildVerificationLink({
    type: "VERIFIER",
    token: nextContact.token,
  });

  await sendNotification(["EMAIL", "WHATSAPP"], "VERIFIER", {
    receiverId: nextContact.id,
    organizationName: organization.name,
    candidateName: candidateName,
    link: verifierLink,
    toEmail: nextContact.email,
    toPhone: nextContact.phone ?? undefined,
    subject: "Employment Verification Request",
    message: verifierMsgTemplate(
      organization.name,
      candidateName,
      verifierLink,
    ),
  });
}
