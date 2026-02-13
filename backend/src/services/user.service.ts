import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export async function createUser(input: {
  email: string;
  role: UserRole;
  organizationId: string;
}) {
  return prisma.user.create({
    data: {
      email: input.email,
      role: input.role,
      organizationId: input.organizationId,
    },
  });
}
