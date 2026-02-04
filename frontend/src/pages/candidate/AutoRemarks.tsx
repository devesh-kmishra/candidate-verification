import { motion } from "framer-motion";
import type { SummaryResponse } from "../../types/SummaryResponse";

type EmploymentItem =
  SummaryResponse["employmentBreakdown"][number];

type Props = {
  remarks: SummaryResponse["remarks"];
  employmentBreakdown: EmploymentItem[];
};

const statusMeta = {
  CLEAR: "text-green-400",
  DISCREPANCY: "text-orange-400",
  PENDING: "text-yellow-400",
};

const AutoRemarks = ({ remarks, employmentBreakdown }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-2xl
        border border-white/10
        bg-white/[0.03]
        backdrop-blur
        p-6
      "
    >
      <h3 className="mb-4 text-sm font-semibold text-white">
        Auto Remarks
      </h3>

      <div className="space-y-3">
        {remarks.length === 0 ? (
          <p className="text-sm text-white/50">
            No system remarks generated
          </p>
        ) : (
          remarks.map((r, i) => (
            <div key={i} className="flex gap-3 text-sm text-white/75">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
              {r}
            </div>
          ))
        )}
      </div>

      {employmentBreakdown.length > 0 && (
        <>
          <div className="my-5 h-px bg-white/10" />
          <div className="space-y-2">
            {employmentBreakdown.map((emp) => (
              <div
                key={emp.company}
                className="flex items-center justify-between rounded-lg bg-black/30 px-4 py-2"
              >
                <span className="text-sm text-white/80">
                  {emp.company}
                </span>
                <span
                  className={`text-xs font-semibold ${statusMeta[emp.status]}`}
                >
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AutoRemarks;
