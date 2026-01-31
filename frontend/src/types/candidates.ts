export type VerificationStatus = "pending" | "completed" | "failed";

export interface Candidate {
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
