import { prisma } from "../lib/prisma";

export async function generateCandidateVerificationForm(
  verificationCaseId: string,
) {
  const verificationCase = await prisma.verificationCase.findUnique({
    where: { id: verificationCaseId },
    include: {
      verificationItems: {
        include: {
          verificationTypeConfig: {
            include: {
              questions: true,
            },
          },
        },
      },
    },
  });

  if (!verificationCase) {
    throw new Error("Verification case not found");
  }

  const sections = verificationCase.verificationItems.map((item) => ({
    verificationItemId: item.id,
    verificationType: item.verificationTypeConfig.type,
    mandatory: item.mandatory,
    executionMode: item.executionMode,
    minContacts: item.verificationTypeConfig.minContacts,
    maxContacts: item.verificationTypeConfig.maxContacts,
    questions: item.verificationTypeConfig.questions
      .sort((a, b) => a.order - b.order)
      .map((q) => ({
        key: q.key,
        label: q.label,
        type: q.type,
        required: q.required,
        options: q.options,
      })),
  }));

  return { verificationCaseId, sections };
}
