import {
  ExecutionMode,
  QuestionType,
  VerificationType,
} from "../../generated/prisma/enums";

export interface VerificationQuestionDTO {
  key: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: any;
  order: number;
}

export interface VerificationTypeDTO {
  type: VerificationType;
  enabled: boolean;
  mandatory: boolean;
  minContacts: number;
  maxContacts?: number;
  executionMode: ExecutionMode;
  questions: VerificationQuestionDTO[];
}

export interface VerificationConfigDTO {
  organizationId: string;
  verificationTypes: VerificationTypeDTO[];
}
