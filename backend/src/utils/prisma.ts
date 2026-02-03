import { Prisma } from "../../generated/prisma/client";
import {
  QuestionType,
  VerificationContactSource,
  VerificationType,
} from "../../generated/prisma/enums";

export function validateAnswer(
  type: QuestionType,
  value: unknown,
): Prisma.InputJsonValue {
  if (value === undefined || value === null) {
    throw new Error("Answer is required");
  }

  switch (type) {
    case "YES_NO":
      if (typeof value !== "boolean") {
        throw new Error("Expected boolean answer");
      }
      return value;

    case "TEXT":
      if (typeof value !== "string") {
        throw new Error("Expected text answer");
      }
      return value;

    case "DATE":
      if (typeof value !== "string") {
        throw new Error("Expected ISO date string");
      }
      return value;

    case "MCQ":
      if (typeof value !== "string") {
        throw new Error("Expected selected option");
      }
      return value;

    case "DATE_RANGE":
      if (typeof value !== "object" || value === null) {
        throw new Error("Expected date range object");
      }
      return value as Prisma.InputJsonValue;

    default:
      return value as Prisma.InputJsonValue;
  }
}

export function mapVerificationTypeToSource(
  type: VerificationType,
): VerificationContactSource {
  switch (type) {
    case "PREVIOUS_EMPLOYMENT":
      return VerificationContactSource.HR;

    case "REFERENCE":
      return VerificationContactSource.REFERENCE;

    case "BACKGROUND":
      return VerificationContactSource.BACKGROUND;

    default:
      return VerificationContactSource.HR;
  }
}
