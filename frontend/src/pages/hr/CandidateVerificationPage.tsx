import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import CandidateRiskSummary from "../candidate/CandidateRiskSummary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Candidate = {
  candidateId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  position: string;
  verificationStatus: "REVIEW" | "APPROVED" | "REJECTED";
};

const CandidateSkeleton = () => (
  <div className="animate-pulse rounded-xl bg-[#0E1322] p-6">
    <div className="flex items-center gap-5">
      <div className="h-14 w-14 rounded-full bg-white/10" />

      <div className="flex-1 space-y-3">
        <div className="h-5 w-48 rounded bg-white/10" />
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="flex gap-6">
          <div className="h-4 w-40 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-4 w-24 rounded bg-white/10" />
        </div>
      </div>
    </div>
  </div>
);

const CandidateVerificationView = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!candidateId) return;

    const fetchCandidate = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/candidates/${candidateId}/overview`,
        );

        if (!res.ok) throw new Error("Failed to fetch candidate");

        const data: Candidate = await res.json();
        setCandidate(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/60">
        <CandidateSkeleton />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-400">
        Candidate not found
      </div>
    );
  }

  return (
    <main className="flex-1 px-8 py-6 xl:px-10 xl:py-8 space-y-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            {/* Subtle glow */}
            <div className="absolute -left-3 top-2 h-8 w-1 rounded-full bg-orange-500/60 blur-sm" />

            <h1 className="text-2xl font-semibold tracking-tight text-white">
              HR Verification View
            </h1>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/55">
              Review and verify candidate details and documents efficiently
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0E1322] px-4 py-2">
          <span className="text-sm text-white/60">Hiring Mode:</span>
          <button className="rounded-md bg-orange-500 px-4 py-1.5 text-sm font-medium cursor-pointer">
            Direct Company
          </button>
          <button className="rounded-md px-4 py-1.5 text-sm text-white/60 hover:bg-white/5 cursor-pointer">
            Manpower / Staffing
          </button>

          <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold">
            A
          </div>
        </div>
      </div>

      {/* Candidate Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full rounded-2xl border border-white/5 bg-gradient-to-br from-[#0B1020] to-[#060A14] px-6 py-6 md:px-8 lg:px-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
      >
        {/* top glow */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

        {/* 🔹 TOP ACTION BAR */}
        <div className="absolute left-6 right-6 top-5 flex items-center justify-between">
          {/* Back */}
          <button
            onClick={() => navigate("/verification")}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 transition"
          >
            ← Back to Dashboard
          </button>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 transition">
              Export Report
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(249,115,22,0.45)] hover:bg-orange-600 transition">
              Send Update
            </button>
          </div>
        </div>

        {/* 🔹 MAIN CONTENT */}
        <div className="pt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT: Avatar + Name */}
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-semibold text-white shadow-[0_0_20px_rgba(249,115,22,0.45)]">
              {candidate.name?.[0]}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  {candidate.name}
                </h2>

                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-400">
                  {candidate.verificationStatus}
                </span>
              </div>

              <p className="mt-1 text-sm text-white/55">{candidate.position}</p>
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-white/40" />
              <span className="truncate">{candidate.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-white/40" />
              <span>{candidate.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-white/40" />
              <span>{candidate.city}</span>
            </div>
          </div>
        </div>
      </motion.div>
      {candidateId && <CandidateRiskSummary candidateId={candidateId} />}
    </main>
  );
};

export default CandidateVerificationView;
