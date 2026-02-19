import { Prisma } from "../../generated/prisma/client";
import {
  VerificationContactStatus,
  VerificationStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { verifierMsgTemplate } from "../templates/verifierMessage";
import { buildVerificationLink } from "../utils/linkBuilder";
import { mapVerificationTypeToSource } from "../utils/prisma";
import { generateVerificationToken } from "../utils/token";
import { sendNotification } from "./notification.service";

type SubmittedContact = {
  name: string;
  email: string;
  phone?: string;
};

type SubmittedSection = {
  verificationItemId: string;
  contacts: SubmittedContact[];
};

export async function createContactsFromCandidateForm(
  verificationCaseId: string,
  sections: SubmittedSection[],
) {
  const result = await prisma.$transaction(async (tx) => {
    const verificationCase = await tx.verificationCase.findUnique({
      where: {
        id: verificationCaseId,
      },
      include: {
        candidate: true,
      },
    });

    if (!verificationCase) {
      throw new Error("Verification case not found");
    }

    if (verificationCase.candidateFormSubmitted) {
      return { createdContacts: [], alreadySubmitted: true };
    }

    const items = await tx.verificationItem.findMany({
      where: {
        verificationCaseId,
        id: {
          in: sections.map((s) => s.verificationItemId),
        },
      },
      include: {
        verificationTypeConfig: true,
      },
    });

    if (items.length !== sections.length) {
      throw new Error(
        "One or more verification items do not belong to this case",
      );
    }

    const itemMap = new Map(items.map((i) => [i.id, i]));

    const contactsToCreate: Prisma.VerificationContactCreateManyInput[] = [];

    for (const section of sections) {
      const item = itemMap.get(section.verificationItemId);

      if (!item) {
        throw new Error(
          `Invalid verificationItemId: ${section.verificationItemId}`,
        );
      }

      const { minContacts, maxContacts } = item.verificationTypeConfig;

      if (section.contacts.length < minContacts) {
        throw new Error(`Minimum ${minContacts} contacts required`);
      }

      if (maxContacts && section.contacts.length > maxContacts) {
        throw new Error(`Maximum ${maxContacts} contacts allowed`);
      }

      let index = 0;
      for (const contact of section.contacts) {
        contactsToCreate.push({
          verificationItemId: item.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          status:
            item.executionMode === "SEQUENTIAL"
              ? index === 0
                ? VerificationContactStatus.PENDING
                : VerificationContactStatus.BLOCKED
              : VerificationContactStatus.PENDING,
          source: mapVerificationTypeToSource(item.verificationTypeConfig.type),
          token: generateVerificationToken(),
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        index++;
      }
    }

    await tx.verificationContact.createMany({
      data: contactsToCreate,
      skipDuplicates: true,
    });

    const createdContacts = await tx.verificationContact.findMany({
      where: {
        verificationItemId: {
          in: sections.map((s) => s.verificationItemId),
        },
        status: VerificationContactStatus.PENDING,
      },
    });

    await tx.verificationItem.updateMany({
      where: {
        id: {
          in: sections.map((s) => s.verificationItemId),
        },
      },
      data: {
        status: VerificationStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    await tx.verificationCase.update({
      where: { id: verificationCaseId },
      data: { candidateFormSubmitted: true },
    });

    const organization = await tx.organization.findUnique({
      where: {
        id: verificationCase.candidate.organizationId,
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return {
      createdContacts,
      candidate: verificationCase.candidate,
      organization,
    };
  });

  if (!result.alreadySubmitted) {
    for (const contact of result.createdContacts) {
      const verifierLink = buildVerificationLink({
        type: "VERIFIER",
        token: contact.token,
      });

      await sendNotification(["EMAIL", "WHATSAPP"], "VERIFIER", {
        receiverId: contact.id,
        organizationName: result.organization!.name,
        candidateName: result.candidate!.name,
        link: verifierLink,
        toEmail: contact.email,
        toPhone: contact.phone ?? undefined,
        subject: "Employment Verification Request",
        message: verifierMsgTemplate(
          result.organization!.name,
          result.candidate!.name,
          verifierLink,
        ),
      });
    }
  }

  return {
    createdContacts: result.createdContacts.length,
    alreadySubmitted: result.alreadySubmitted,
  };
}
