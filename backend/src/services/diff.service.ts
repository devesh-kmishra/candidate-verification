import { prisma } from "../lib/prisma";
import { compareValues } from "../utils/comparison";

export async function getVerificationItemDiff(verificationItemId: string) {
  const item = await prisma.verificationItem.findUnique({
    where: { id: verificationItemId },
    include: {
      verificationTypeConfig: {
        include: {
          questions: true,
        },
      },
      verificationDiscrepancies: true,
      contacts: {
        include: {
          verificationResponses: true,
        },
      },
    },
  });

  if (!item) {
    throw new Error("Verification item not found");
  }

  // todo: Replace with candidate-claimed answers
  const claimedAnswers: Record<string, any> = {};

  const responsesByKey: Record<string, any[]> = {};

  for (const contact of item.contacts) {
    for (const r of contact.verificationResponses) {
      if (!responsesByKey[r.questionKey]) {
        responsesByKey[r.questionKey] = [];
      }
      responsesByKey[r.questionKey].push(r.answer);
    }
  }

  const discrepanciesByKey = Object.fromEntries(
    item.verificationDiscrepancies.map((d) => [d.questionKey, d]),
  );

  const questions = item.verificationTypeConfig.questions.map((q) => {
    const claimed = claimedAnswers[q.key];
    const verifiedValues = responsesByKey[q.key] ?? [];
    const verified = verifiedValues.length > 0 ? verifiedValues[0] : null;

    const comparison =
      claimed !== undefined && verified !== null
        ? compareValues(claimed, verified)
        : { matched: true };

    const discrepancy = discrepanciesByKey[q.key];

    return {
      questionKey: q.key,
      label: q.label,
      type: q.type,
      claimed,
      verified,
      match: comparison.matched,
      discrepancy: discrepancy
        ? {
            status: discrepancy.status,
            reason: discrepancy.reason,
            resolvedBy: discrepancy.resolvedBy,
            resolutionNote: discrepancy.resolutionNote,
          }
        : null,
    };
  });

  return {
    verificationItemId: item.id,
    verificationType: item.verificationTypeConfig.type,
    status: item.status,
    questions,
  };
}
