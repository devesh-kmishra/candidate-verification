import { prisma } from "../lib/prisma";
import {
  applyDiscrepancy,
  deriveCaseStatus,
  deriveItemStatus,
} from "../utils/verificationStatus";

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

  // todo: real mismatch detection
  const hasMismatch = false;

  const finalItemStatus = applyDiscrepancy(baseItemStatus, hasMismatch);

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
