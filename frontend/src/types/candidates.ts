export type VerificationStatus =
  | "PENDING"
  | "completed"
  | "clear"
  | "discrepancy"
  | "failed"
   | "in_progress";


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
