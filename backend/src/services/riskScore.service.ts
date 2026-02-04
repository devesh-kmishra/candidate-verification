import { prisma } from "../lib/prisma";
import {
  riskForDiscrepancyResolution,
  riskForItemStatus,
  riskForVerificationType,
} from "../utils/riskRules";

// Call after discrepancy resolution, or after item status becomes FAILED or CLEAR
export async function calculateAndPersistRiskScore(verificationCaseId: string) {
  const verificationCase = await prisma.verificationCase.findUnique({
    where: { id: verificationCaseId },
    include: {
      verificationItems: {
        include: {
          verificationTypeConfig: true,
          verificationDiscrepancies: true,
        },
      },
    },
  });

  if (!verificationCase) {
    throw new Error("Verification case not found");
  }

  let riskScore = 0;
  const remarks: string[] = [];

  for (const item of verificationCase.verificationItems) {
    const baseRisk = riskForItemStatus(item.status);
    riskScore += baseRisk;

    if (baseRisk > 0) {
      remarks.push(
        `${item.verificationTypeConfig.type} verification has status ${item.status}`,
      );
    }

    const typeRisk = riskForVerificationType(
      item.verificationTypeConfig.type,
      item.status,
    );

    if (typeRisk > 0) {
      riskScore += typeRisk;
      remarks.push(`${item.verificationTypeConfig.type} verification failed`);
    }

    for (const d of item.verificationDiscrepancies) {
      const drisk = riskForDiscrepancyResolution(d.status);

      if (drisk > 0) {
        riskScore += drisk;
        remarks.push(`Discrepancy accepted for ${d.questionKey}`);
      }
    }
  }

  riskScore = Math.min(riskScore, 100);

  await prisma.verificationCase.update({
    where: { id: verificationCaseId },
    data: {
      riskScore,
    },
  });

  return { riskScore, riskLevel: getRiskLevel(riskScore), remarks };
}

export function getRiskLevel(score: number) {
  if (score <= 20) {
    return "LOW";
  }
  if (score <= 50) {
    return "MEDIUM";
  }
  return "HIGH";
}
