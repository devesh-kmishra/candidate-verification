import {
  AuditEntityType,
  VerificationContactStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { verificationEmailTemplate } from "../templates/verificationEmail";
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
}

export async function sendVerificationEmail(contactId: string) {
  const contact = await prisma.verificationContact.findUnique({
    where: { id: contactId },
    include: {
      verificationItem: {
        include: {
          verificationCase: {
            include: {
              candidate: true,
            },
          },
          verificationTypeConfig: true,
        },
      },
    },
  });

  if (!contact) {
    throw new Error("Contact not found");
  }

  const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify/${contact.token}`;

  const email = verificationEmailTemplate({
    contactName: contact.name,
    candidateName: contact.verificationItem.verificationCase.candidate.name,
    verificationType: contact.verificationItem.verificationTypeConfig.type,
    verificationLink,
  });

  await sendEmail({
    to: contact.email,
    subject: email.subject,
    html: email.html,
  });

  await createAuditLog({
    entityType: AuditEntityType.VERIFICATION_CONTACT,
    entityId: contact.id,
    action: "EMAIL_SENT",
    metadata: {
      email: contact.email,
      verificationType: contact.verificationItem.verificationTypeConfig.type,
    },
    performedBy: "SYSTEM",
  });

  await prisma.verificationContact.update({
    where: { id: contact.id },
    data: {
      status: VerificationContactStatus.CONTACTED,
      contactedAt: new Date(),
    },
  });
}
