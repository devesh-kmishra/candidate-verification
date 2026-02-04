export interface SummaryResponse {
  candidateId: string;
  overallStatus: number;
  riskScore: number;
  remarks: string[];
  employmentBreakdown: {
    company: string;
    status: "CLEAR" | "DISCREPANCY" | "PENDING";
    risk: number;
  }[];
  hrNotes: string[];
}
