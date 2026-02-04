import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import type { SummaryResponse } from "../../types/SummaryResponse";
import RiskGauge from "./RiskGauge";
import HrNotesEditor from "./HrNotesEditor";
import AutoRemarks from "./AutoRemarks";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const CandidateRiskSummary = ({ candidateId }: { candidateId: string }) => {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidateId) return;

    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/candidates/${candidateId}/summary`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch summary");
        setData(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    return () => controller.abort();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 rounded-3xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-16 text-center text-white/60">
        No risk summary available
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        grid grid-cols-1 gap-8
        xl:grid-cols-[1.2fr_1fr_0.9fr]
        rounded-3xl
        border border-white/10
        bg-gradient-to-br from-[#0A0F1C] to-[#050812]
        p-8
      "
    >
      {/* Risk */}
      <div className="relative flex flex-col items-center justify-center rounded-3xl bg-[#0B1020] border border-white/10 p-10">
        <div className="absolute inset-0 rounded-3xl bg-orange-500/10 blur-3xl" />

        <p className="relative mb-6 flex items-center gap-2 text-sm text-white/60">
          <ShieldAlert className="h-4 w-4 text-orange-400" />
          Risk Summary
        </p>

        <RiskGauge score={Math.max(0, Math.min(100, data.riskScore ?? 0))} />
      </div>

      {/* Auto Remarks */}
      <AutoRemarks
        remarks={data.remarks}
        employmentBreakdown={data.employmentBreakdown}
      />

      {/* HR Notes */}
      <HrNotesEditor candidateId={candidateId} />
    </motion.section>
  );
};

export default CandidateRiskSummary;
