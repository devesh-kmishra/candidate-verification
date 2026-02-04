import { prisma } from "../lib/prisma";
import { compareValues } from "../utils/comparison";
import { toInputJson } from "../utils/prisma";

export async function evaluateAndPersistDiscrepancies(
  verificationItemId: string,
): Promise<{ hasDiscrepancy: boolean }> {
  const item = await prisma.verificationItem.findUnique({
    where: { id: verificationItemId },
    include: {
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

  // todo: replace with actual candidate-claimed answers
  const claimedAnswers: Record<string, any> = {};

  await prisma.verificationDiscrepancy.deleteMany({
    where: {
      verificationItemId,
      status: "OPEN",
    },
  });

  let hasDiscrepancy = false;

  for (const contact of item.contacts) {
    for (const response of contact.verificationResponses) {
      const claimed = claimedAnswers[response.questionKey];

      if (claimed === undefined) continue;

      const result = compareValues(claimed, response.answer);

      if (!result.matched) {
        hasDiscrepancy = true;

        await prisma.verificationDiscrepancy.create({
          data: {
            verificationItemId,
            questionKey: response.questionKey,
            claimedValue: claimed,
            verifiedValue: toInputJson(response.answer),
            reason: result.reason ?? "Value mismatch",
          },
        });
      }
    }
  }

  return { hasDiscrepancy };
}
