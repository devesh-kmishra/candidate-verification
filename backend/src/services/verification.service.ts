import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import {
  applyDiscrepancy,
  deriveCaseStatus,
  deriveItemStatus,
} from "../utils/verificationStatus";
import { evaluateAndPersistDiscrepancies } from "./discrepancy.service";

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
