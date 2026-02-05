import { prisma } from "../lib/prisma";
import { VerificationConfigDTO } from "../types/verificationConfig.dto";

export async function createVerificationConfig(input: VerificationConfigDTO) {
  const lastConfig = await prisma.verificationConfig.findFirst({
    where: {
      organizationId: input.organizationId,
    },
    orderBy: { version: "desc" },
  });

  const nextVersion = lastConfig ? lastConfig.version + 1 : 1;

  if (lastConfig) {
    await prisma.verificationConfig.update({
      where: { id: lastConfig.id },
      data: { isActive: false },
    });
  }

  return prisma.verificationConfig.create({
    data: {
      organizationId: input.organizationId,
      version: nextVersion,
      isActive: true,
      verificationTypes: {
        create: input.verificationTypes.map((vt) => ({
          type: vt.type,
          enabled: vt.enabled,
          mandatory: vt.mandatory,
          minContacts: vt.minContacts,
          maxContacts: vt.maxContacts,
          executionMode: vt.executionMode,
          questions: {
            create: vt.questions.map((q) => ({
              key: q.key,
              label: q.label,
              type: q.type,
              required: q.required,
              options: q.options,
              order: q.order,
            })),
          },
        })),
      },
    },
    include: {
      verificationTypes: {
        include: { questions: true },
      },
    },
  });
}

// Used by candidate form generation, verificationcase creation, admin view
export async function getActiveVerificationConfig(organizationId: string) {
  return prisma.verificationConfig.findFirst({
    where: {
      organizationId,
      isActive: true,
    },
    include: {
      verificationTypes: {
        where: { enabled: true },
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}
