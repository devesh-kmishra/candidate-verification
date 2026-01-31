import type { CandidateQueueResponse } from "../types/candidates";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchCandidateQueue(
  status?: "all" | "pending" | "completed" | "failed",
): Promise<CandidateQueueResponse> {
  const url =
    status && status !== "all"
      ? `${API_BASE_URL}/api/candidates/queue?status=${status}`
      : `${API_BASE_URL}/api/candidates/queue`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch candidate queue");
  }

  return res.json();
}
