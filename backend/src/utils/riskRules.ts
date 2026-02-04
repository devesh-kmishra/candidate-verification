import {
  DiscrepancyStatus,
  VerificationStatus,
  VerificationType,
} from "../../generated/prisma/enums";

export function riskForItemStatus(status: VerificationStatus): number {
  switch (status) {
    case "FAILED":
      return 40;
    case "DISCREPANCY":
      return 20;
    default:
      return 0;
  }
}

export function riskForDiscrepancyResolution(
  status: DiscrepancyStatus,
): number {
  switch (status) {
    case "ACCEPTED":
      return 10;
    case "REJECTED":
      return 20;
    case "OVERRIDDEN":
      return 0;
    default:
      return 0;
  }
}

export function riskForVerificationType(
  type: VerificationType,
  status: VerificationStatus,
): number {
  if (type === "BACKGROUND" && status === "FAILED") {
    return 50;
  }

  return 0;
}
