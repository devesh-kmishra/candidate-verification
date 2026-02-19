import {
  AuditEntityType,
  VerificationContactStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { sendEmail } from "../utils/mailer";
import { createAuditLog } from "./audit.service";
import {
  sendCandidateVerificationWhatsApp,
  sendVerifierWhatsApp,
} from "./whatsAppApi.service";

type NotificationChannel = "EMAIL" | "WHATSAPP";
type NotificationReceiver = "CANDIDATE" | "VERIFIER";
type NotificationPayload = {
  receiverId: string;
  candidateName?: string;
  organizationName?: string;
  link?: string;
  expiryDays?: number;
  toEmail?: string;
  toPhone?: string;
  subject?: string;
  message?: string;
};

export async function sendNotification(
  channels: NotificationChannel[],
  receiver: NotificationReceiver,
  payload: NotificationPayload,
) {
  try {
    if (channels.includes("EMAIL") && payload.toEmail) {
      await sendEmail({
        to: payload.toEmail,
        subject: payload.subject ?? "Verification Required",
        html: payload.message!,
      });

      if (receiver === "CANDIDATE") {
        await createAuditLog({
          entityType: AuditEntityType.CANDIDATE,
          entityId: payload.receiverId,
          action: "EMAIL_SENT",
          metadata: {
            email: payload.toEmail,
          },
          performedBy: "SYSTEM",
        });
      } else if (receiver === "VERIFIER") {
        await createAuditLog({
          entityType: AuditEntityType.VERIFICATION_CONTACT,
          entityId: payload.receiverId,
          action: "EMAIL_SENT",
          metadata: {
            email: payload.toEmail,
          },
          performedBy: "SYSTEM",
        });
      }
    }

    if (channels.includes("WHATSAPP") && payload.toPhone) {
      if (receiver === "CANDIDATE") {
        await sendCandidateVerificationWhatsApp({
          to: payload.toPhone,
          candidateName: payload.candidateName!,
          link: payload.link!,
          expiryDays: payload.expiryDays || 7,
        });

        await createAuditLog({
          entityType: AuditEntityType.CANDIDATE,
          entityId: payload.receiverId,
          action: "WHATSAPP_SENT",
          metadata: {
            phone: payload.toPhone,
          },
          performedBy: "SYSTEM",
        });
      } else if (receiver === "VERIFIER") {
        await sendVerifierWhatsApp({
          to: payload.toPhone,
          organizationName: payload.organizationName!,
          candidateName: payload.candidateName!,
          link: payload.link!,
        });

        await createAuditLog({
          entityType: AuditEntityType.VERIFICATION_CONTACT,
          entityId: payload.receiverId,
          action: "WHATSAPP_SENT",
          metadata: {
            phone: payload.toPhone,
          },
          performedBy: "SYSTEM",
        });
      }
    }

    if (receiver === "VERIFIER") {
      await prisma.verificationContact.update({
        where: { id: payload.receiverId },
        data: {
          status: VerificationContactStatus.CONTACTED,
          contactedAt: new Date(),
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
}
