import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

const SLA_DAYS = 7;
const SLA_MS = SLA_DAYS * 24 * 60 * 60 * 1000;

export async function getVerificationDashboardStats() {
  const cases = await prisma.verificationCase.findMany({
    select: {
      status: true,
      startedAt: true,
      completedAt: true,
    },
  });

  const total = cases.length;

  let pending = 0;
  let completed = 0;
  let failed = 0;
  let discrepancy = 0;

  let tatSum = 0;
  let tatCount = 0;

  let slaMet = 0;
  let slaEligible = 0;

  for (const c of cases) {
    switch (c.status) {
      case VerificationStatus.PENDING:
      case VerificationStatus.IN_PROGRESS:
        pending++;
        break;
      case VerificationStatus.CLEAR:
        completed++;
        break;
      case VerificationStatus.FAILED:
        failed++;
        break;
      default:
        discrepancy++;
        break;
    }

    if (
      c.completedAt &&
      (c.status === VerificationStatus.CLEAR ||
        c.status === VerificationStatus.FAILED ||
        c.status === VerificationStatus.DISCREPANCY)
    ) {
      const tat = c.completedAt.getTime() - c.startedAt.getTime();

      tatSum += tat;
      tatCount++;
      slaEligible++;

      if (tat <= SLA_MS) {
        slaMet++;
      }
    }
  }

  const averageTatDays =
    tatCount === 0
      ? 0
      : Number((tatSum / tatCount / (24 * 60 * 60 * 1000)).toFixed(2));

  const slaCompliancePercent =
    slaEligible === 0 ? 100 : Number(((slaMet / slaEligible) * 100).toFixed(2));

  return {
    totalVerifications: total,
    pending,
    completed,
    failed,
    discrepancy,
    averageTatDays,
    slaCompliancePercent,
    slaTargetDays: SLA_DAYS,
  };
}
