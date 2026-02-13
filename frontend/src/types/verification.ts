export type VerificationStatus =
  | "pending"
  | "in_completed"
  | "clear"
  | "discrepancy"
  | "failed";

export type VerificationType =
  | "PREVIOUS_EMPLOYMENT"
  | "REFERENCE"
  | "BACKGROUND"
  | "CUSTOM";

export type ExecutionMode = "PARALLEL" | "SEQUENTIAL";

export type VerificationContactSource =
  | "HR"
  | "REFERENCE"
  | "BACKGROUND"
  | "VENDOR";

export type VerificationContactStatus =
  | "PENDING"
  | "CONTACTED"
  | "RESPONDED"
  | "EXPIRED";

export type DiscrepancyStatus = "OPEN" | "ACCEPTED" | "REJECTED" | "OVERRIDDEN";

export type VerificationConfigDTO = {
  id: string;
  organisationId: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  verificationType: VerificationTypeConfigDTO[];
};

export type VerificationTypeConfigDTO = {
  id: string;
  type: VerificationType;
  enabled: boolean;
  mandatory: boolean;
  executionMode: ExecutionMode;
  minContacts: number;
  maxContacts?: number | null;
  createdAt: string;
  questions: VerificationQuestionTempletDTO[];
};

export type VerificationQuestionTempletDTO = {
  id: string;
  key: string;
  label: string;
  type: QuestionType;
  required: boolean;
  order: number;
  options?: string[] | null;
  createdAt: string;
};

export type Question = {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[]; // only used when type is mcq
};

export type QuestionType = "TEXT" | "YES_NO" | "MCQ" | "DATE_RANGE" | "FILE";

export type VerificationCaseDTO = {
  id: string;
  candidateId: string;
  verificationConfigId: string;
  status: VerificationStatus;
  riskScore: number;
  startedAt: string;
  completedAt?: string | null;
  items: VerificationItemDTO[];
};

export type VerificationItemDTO = {
  id: string;
  verificationTypeConfigId: string;
  verificationType: VerificationType;

  status: VerificationStatus;
  mandatory: boolean;
  executionMode: ExecutionMode;
  startedAt?: string | null;
  completedAt?: string | null;
  contacts: VerificationContactDTO[];
  discrepancies: VerificationDiscrepanciesDTO[];
};

export type VerificationContactDTO = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  source: VerificationContactStatus;
  contactedAt?: string | null;
  respondedAt?: string | null;
  response: VerificationResponseDTO[];
  documents: VerificationDocumentDTO[];
};

export type VerificationResponseDTO = {
  id: string;
  questionKey: string;
  questionLabel: string;
  questionType: QuestionType;
  answer: any;
  createdAt: string;
};

export type VerificationDocumentDTO = {
  id: string;
  tyoe: string;
  fileURL: string;
  uploadedAt: string;
};

export type VerificationDiscrepanciesDTO = {
  id: string;
  questionKey: string;
  claimedValue: any;
  verifiedValue: any;
  reason: string;
  status: DiscrepancyStatus;
  resolvedBy?: string | null;
  resolutionNote?: string;
  resolvedAt: string | null;
  createdAt: string;
};

export type SaveVerificationConfigPayload = {
  verificationTypes: {
    type: VerificationType;
    enabled: boolean;
    mandatory: boolean;
    minContacts: number;
    maxContacts?: number;
    executionMode: ExecutionMode;
    questions: {
      key: string;
      label: string;
      type: QuestionType;
      required: boolean;
      options?: string[];
      order: number;
    }[];
  }[];
};

export type CreateVerificationCasePayload = {
  candidateId: string;
  verificationTypes: VerificationType[];
  initiatedBy: string;
};

export type AddVerificationContactPayload = {
  verificationCaseId: string;
  verificationType: VerificationType;
  contacts: {
    name: string;
    email: string;
    phone?: string;
    organisationId: string;
    designationId: string;
  };
};

export type SubmitVerificationResponsePayload = {
  token: string;
  answer: VerificationAnswerPayloadDTP[];
  overallStatus: VerificationStatus[];
};

export type VerificationAnswerPayloadDTP = {
  questionId: string;
  answer: string | boolean | string[] | Date | null;
};
