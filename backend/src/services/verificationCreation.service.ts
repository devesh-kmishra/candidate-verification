import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

// Based on current active VerificationConfig
export async function createVerificationCaseFromConfig(
  candidateId: string,
  organizationId: string,
) {
  const config = await prisma.verificationConfig.findFirst({
    where: {
      organizationId,
      isActive: true,
    },
    include: {
      verificationTypes: true,
    },
  });

  if (!config) {
    throw new Error("No active verification config found");
  }

  const verificationCase = await prisma.verificationCase.create({
    data: {
      candidateId,
      verificationConfigId: config.id,
      status: VerificationStatus.PENDING,
    },
  });

  // Create one per enabled type
  const itemsData = config.verificationTypes
    .filter((vt) => vt.enabled)
    .map((vt) => ({
      verificationCaseId: verificationCase.id,
      verificationTypeConfigId: vt.id,
      status: VerificationStatus.PENDING,
      mandatory: vt.mandatory,
      executionMode: vt.executionMode,
    }));

  if (itemsData.length > 0) {
    await prisma.verificationItem.createMany({
      data: itemsData,
    });
  }

  return verificationCase;
}
