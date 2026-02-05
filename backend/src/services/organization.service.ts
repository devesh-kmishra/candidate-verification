import { prisma } from "../lib/prisma";

export async function createOrganization(input: {
  name: string;
  domain?: string;
}) {
  return prisma.organization.create({
    data: {
      name: input.name,
      domain: input.domain,
    },
  });
}
