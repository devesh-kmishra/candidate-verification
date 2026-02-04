import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { deriveCaseStatus } from "../utils/verificationStatus";
import { calculateAndPersistRiskScore } from "./riskScore.service";

// Setting VerificationItem + Case status
export async function applyDiscrepancyResolution(discrepancyId: string) {
  const discrepancy = await prisma.verificationDiscrepancy.findUnique({
    where: { id: discrepancyId },
    include: {
      verificationItem: {
        include: {
          verificationCase: {
            include: {
              verificationItems: true,
            },
          },
        },
      },
    },
  });

  if (!discrepancy) {
    throw new Error("Discrepancy not found");
  }

  const item = discrepancy.verificationItem;

  let newItemStatus: VerificationStatus | null = null;

  switch (discrepancy.status) {
    case "REJECTED":
      newItemStatus = VerificationStatus.FAILED;
      break;
    case "OVERRIDDEN":
      newItemStatus = VerificationStatus.CLEAR;
      break;
    case "ACCEPTED":
      newItemStatus = VerificationStatus.DISCREPANCY;
      break;
    default:
      return;
  }

  await prisma.verificationItem.update({
    where: { id: item.id },
    data: {
      status: newItemStatus,
      completedAt:
        newItemStatus === VerificationStatus.CLEAR ||
        newItemStatus === VerificationStatus.FAILED
          ? new Date()
          : null,
    },
  });

  const updatedItems = await prisma.verificationItem.findMany({
    where: {
      verificationCaseId: item.verificationCaseId,
    },
    select: {
      status: true,
      mandatory: true,
    },
  });

  const newCaseStatus = deriveCaseStatus(updatedItems);

  await prisma.verificationCase.update({
    where: { id: item.verificationCaseId },
    data: {
      status: newCaseStatus,
      completedAt:
        newCaseStatus === VerificationStatus.CLEAR ||
        newCaseStatus === VerificationStatus.FAILED ||
        newCaseStatus === VerificationStatus.DISCREPANCY
          ? new Date()
          : null,
    },
  });

  await calculateAndPersistRiskScore(item.verificationCaseId);
}
