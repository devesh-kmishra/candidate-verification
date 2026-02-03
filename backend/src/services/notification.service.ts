import { VerificationContactStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { verificationEmailTemplate } from "../templates/verificationEmail";
import { sendEmail } from "../utils/mailer";

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
    html: email.subject,
  });

  await prisma.verificationContact.update({
    where: { id: contact.id },
    data: {
      status: VerificationContactStatus.CONTACTED,
      contactedAt: new Date(),
    },
  });
}
