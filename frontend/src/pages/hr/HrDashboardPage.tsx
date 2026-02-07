import { ShieldCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import VerificationQueue from "../../components/verification/VerificationQueue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />
);

const StatCardSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-linear-to-b from-[#0E1322] to-[#090E1A] p-5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-4 w-10" />
    </div>

    <div className="mt-4 space-y-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

const StatCard = ({
  icon,
  value,
  label,
  change,
  changeColor = "text-green-400",
  iconBg,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  change: string;
  changeColor?: string;
  iconBg: string;
}) => (
  <div className="rounded-xl border border-white/10 bg-linear-to-b from-[#0E1322] to-[#090E1A] p-5">
    <div className="flex items-center justify-between">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
      >
        {icon}
      </div>
      <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
    </div>

    <div className="mt-4">
      <h3 className="text-2xl font-semibold">{value}</h3>
      <p className="mt-1 text-sm text-white/50">{label}</p>
    </div>
  </div>
);

export default function VerificationDashboard() {
  const [stats, setStats] = useState<null | {
    totalVerifications: number;
    pendingVerifications: number;
    completedVerifications: number;
    failedOrDiscrepancy: number;
    averageTatDays: number;
    slaComplianceRate: number;
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error("VITE_API_BASE_URL is not defined");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/dashboard/verifications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const result = await response.json();
        console.log("API RESULT", result);

        setStats(result);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <main className="flex-1 px-8 py-6 xl:px-10">
      {/* HEADER */}
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
              Verification Dashboard
            </h1>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/55">
              Track applicants, performance, and hiring insights—all from one
              place.
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

      {/* TOP STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <StatCard
                icon={<ShieldCheck className="h-5 w-5 text-sky-400" />}
                value={stats?.totalVerifications ?? "--"}
                label="Total Verifications"
                change="+12%"
                iconBg="bg-sky-500/20"
              />
            </motion.div>

            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <StatCard
                icon={<Clock className="h-5 w-5 text-orange-400" />}
                value={stats?.pendingVerifications ?? "--"}
                label="Pending Verification"
                change="+5%"
                iconBg="bg-orange-500/20"
              />
            </motion.div>

            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <StatCard
                icon={<CheckCircle2 className="h-5 w-5 text-green-400" />}
                value={stats?.completedVerifications ?? "--"}
                label="Completed"
                change="+8%"
                iconBg="bg-green-500/20"
              />
            </motion.div>

            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <StatCard
                icon={<XCircle className="h-5 w-5 text-red-400" />}
                value={stats?.failedOrDiscrepancy ?? "--"}
                label="Failed / Discrepancy"
                change="-3%"
                changeColor="text-red-400"
                iconBg="bg-red-500/20"
              />
            </motion.div>
          </>
        )}
      </div>

      {/* BOTTOM CARDS */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Average TAT */}
        {loading ? (
          <>
            <Skeleton className="h-55 rounded-xl border border-white/10" />
            <Skeleton className="h-55 rounded-xl border border-white/10" />
          </>
        ) : (
          <>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-xl border border-white/10 bg-linear-to-b from-[#0E1322] to-[#090E1A] p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Average TAT</h3>
                  <p className="text-sm text-white/50">Turn Around Time</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-3xl font-semibold">
                  {stats?.averageTatDays ?? "--"}{" "}
                  <span className="text-sm font-normal text-white/50">
                    days
                  </span>
                </h2>

                <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width: `${Math.min((stats?.averageTatDays ?? 0) * 15, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-white/40">Target: 7 days</p>
              </div>
            </motion.div>

            {/* SLA */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-xl border border-white/10 bg-linear-to-b from-[#0E1322] to-[#090E1A] p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">SLA Compliance</h3>
                  <p className="text-sm text-white/50">
                    On-time completion rate
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-3xl font-semibold">
                  {stats?.slaComplianceRate ?? "--"}%
                </h2>

                <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${stats?.slaComplianceRate ?? 0}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-white/40">Target: 95%</p>
              </div>
            </motion.div>
          </>
        )}
      </div>
      <VerificationQueue />
    </main>
  );
}
