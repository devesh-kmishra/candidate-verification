export type VerificationStatus =
  | "pending"
  | "completed"
  | "clear"
  | "discrepancy"
  | "failed";

export interface Candidate {
  c: any;
  id: string;
  name: string;
  email: string;
  city: string;
  joiningDesignation: string;
  verificationStatus: VerificationStatus;
  riskScore: number;
  progress: string;
  tatDays: number;
  lastUpdated: string;
}

export interface CandidateQueueResponse {
  count: number;
  results: Candidate[];
}
