import {
  VerificationContactStatus,
  VerificationStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { mapVerificationTypeToSource } from "../utils/prisma";
import { generateVerificationToken } from "../utils/token";
import { sendVerificationEmail } from "./notification.service";

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
  const items = await prisma.verificationItem.findMany({
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

  const contactsToCreate = [];

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

    for (const contact of section.contacts) {
      contactsToCreate.push({
        verificationItemId: item.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        status: VerificationContactStatus.PENDING,
        source: mapVerificationTypeToSource(item.verificationTypeConfig.type),
        token: generateVerificationToken(),
        tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }
  }

  await prisma.verificationContact.createMany({
    data: contactsToCreate,
  });

  const createdContacts = await prisma.verificationContact.findMany({
    where: {
      verificationItemId: {
        in: sections.map((s) => s.verificationItemId),
      },
    },
  });

  for (const contact of createdContacts) {
    await sendVerificationEmail(contact.id);
  }

  await prisma.verificationItem.updateMany({
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

  return { createdContacts: contactsToCreate.length };
}
