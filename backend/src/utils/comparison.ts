import { Prisma } from "../../generated/prisma/client";

// todo: add smarter comparisons later
export type ComparisonResult = {
  matched: boolean;
  reason?: string;
};

export function compareValues(
  claimed: Prisma.JsonValue,
  verified: Prisma.JsonValue,
): ComparisonResult {
  if (claimed === null || verified === null) {
    return { matched: false, reason: "Missing value" };
  }

  if (JSON.stringify(claimed) === JSON.stringify(verified)) {
    return { matched: true };
  }

  return { matched: false, reason: "Value mismatch" };
}
