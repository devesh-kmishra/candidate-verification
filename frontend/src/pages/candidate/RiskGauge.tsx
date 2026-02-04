import { motion } from "framer-motion";

type Props = { score: number };

const getRiskMeta = (score: number) => {
  if (score >= 70) return { label: "HIGH RISK", color: "#EF4444" };
  if (score >= 30) return { label: "REVIEW", color: "#F97316" };
  return { label: "LOW RISK", color: "#22C55E" };
};

const RiskGauge = ({ score }: Props) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const { label, color } = getRiskMeta(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="160" height="160" className="-rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#1F2937"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold" style={{ color }}>
          {score}
        </span>
        <span className="mt-1 text-xs font-semibold tracking-wide" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default RiskGauge;
