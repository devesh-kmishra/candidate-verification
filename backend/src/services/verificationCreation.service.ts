import crypto from "crypto";
import axios from "axios";
import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { buildVerificationLink } from "../utils/linkBuilder";
import { sendNotification } from "./notification.service";
import { candidateVerificationMsgTemplate } from "../templates/candidateVerificationMessage";

// Based on current active VerificationConfig
export async function createVerificationCaseFromConfig(
  candidateId: string,
  organizationId: string,
) {
  try {
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

    const candidateToken = crypto.randomUUID();
    const candidateTokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const verificationCase = await prisma.verificationCase.create({
      data: {
        candidateId,
        verificationConfigId: config.id,
        status: VerificationStatus.PENDING,
        candidateToken,
        candidateTokenExp,
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

    const candidateLink = buildVerificationLink({
      type: "CANDIDATE",
      token: verificationCase.candidateToken,
    });

    const candidate = await prisma.candidate.findUnique({
      where: {
        id: candidateId,
        organizationId,
      },
    });

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    await sendNotification(["EMAIL", "WHATSAPP"], "CANDIDATE", {
      receiverId: candidate.id,
      candidateName: candidate.name,
      link: candidateLink,
      expiryDays: 7,
      toEmail: candidate.email,
      toPhone: candidate.phone ?? undefined,
      subject: "Verification Required",
      message: candidateVerificationMsgTemplate(candidateLink),
    });

    return verificationCase;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("WHATSAPP AXIOS ERROR STATUS:", err.response?.status);
      console.error("WHATSAPP AXIOS ERROR DATA:", err.response?.data);

      throw {
        statusCode: err.response?.status || 500,
        message: err.response?.data?.error?.message || "WhatsApp API error",
        details: err.response?.data,
      };
    }

    throw {
      statusCode: 500,
      message: err.message || "Verification start failed",
    };
  }
}
