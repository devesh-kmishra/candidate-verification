import type { VerificationStatus } from "./candidates";

export type VerificationConfig = {
  is: string;
  isActive: boolean;
  version: number;
  verificationTypes: VerificationTypeConfig[];
};

export type VerificationType =
  | "PREVIOUS_EMPLOYMENT"
  | "REFERENCE"
  | "BACKGROUND"
  | "CUSTOM";

export type verificationContactSource = {};

export type VerificationContact = {
  id: string;
  verificationItemId: string;
  name: string;
  email: string;
  phone?: string;
  source: verificationContactSource;
};

export type VerificationDiscrepancy = {
  id: string;
  verificationItemId: string;
  reason: string;
};

export type VerificationItem = {
  id: string;
  candidateId: string;
  verificationConfigId: string;
  status: VerificationStatus;
  mandatory: boolean;
  executionMode: "PARALLEL" | "SEQUENTIAL";
  verificationTypeConfig: VerificationTypeConfig;
  contacts: VerificationContact[];
  verificationDiscrepancies: VerificationDiscrepancy[];
};

export type VerificationTypeConfig = {
  id: string;
  type: VerificationType;
  enabled: boolean;
  mandatory: boolean;
  executionMode: "PARALLEL" | "SEQUENTIAL";
  minContacts: number;
  maxContacts: number;
  verificationConfig: VerificationConfig;
  questions: VerificationQuestionTemplate[];
  verificationsItem: VerificationItem[];
};

export type QuestionType = "TEXT" | "YES_NO" | "MCQ" | "DATE" | "FILE";

export type VerificationQuestionTemplate = {
  id: string;
  verificationTypeConfigId: string;
  key: string;
  label: string;
  type: QuestionType;
  required: boolean;
  order: number;
  options?: string;
};
