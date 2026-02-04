import { Search, Filter, Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCandidateQueue } from "../../api/candidates";
import type { Candidate } from "../../types/candidates";
import { timeAgo } from "../../utils/time";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const statusProgressColorMap = {
  completed: "bg-green-500",
  pending: "bg-orange-500",
  failed: "bg-red-500",
} as const;

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const searchCandidates = async (query: string) => {
  const res = await axios.get(`${API_BASE_URL}/api/candidates/search`, {
    params: { q: query },
  });
  return res.data;
};

export default function VerificationQueue() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const handleOnClick = (candidateId: string) => {
    navigate(`/verification/candidate-verification/${candidateId}`);
  };

  useEffect(() => {
    if (searchTerm) return;

    async function loadQueue() {
      try {
        const data = await fetchCandidateQueue(activeTab);
        setCandidates(data.results);

        if (activeTab === "all") {
          const statusCount = {
            all: data.count,
            pending: 0,
            completed: 0,
            failed: 0,
          };

          data.results.forEach((c) => {
            statusCount[c.verificationStatus]++;
          });

          setCounts(statusCount);
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadQueue();
  }, [activeTab, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await searchCandidates(searchTerm);
        setCandidates(data.results);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <section className="mx-auto mt-8 max-w-360 rounded-2xl border border-white/10 bg-linear-to-br from-[#0b0f1a] to-[#0a0e17] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="relative inline-flex items-center gap-3 text-lg font-semibold tracking-wide">
          <span className="h-5 w-1 rounded-full bg-linear-to-b from-orange-400 to-orange-600" />
          <span className="bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
            Verification Queue
          </span>
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none placeholder:text-white/40"
            />
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/5">
            <Filter className="h-4 w-4" />
            Filters
          </button>

          <button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/5">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {(["all", "pending", "completed", "failed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize ${
              activeTab === tab
                ? "bg-orange-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Candidate</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Risk Score</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-left">TAT</th>
              <th className="px-4 py-3 text-left">Last Updated</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c) => {
              const progressParts = c.progress?.split("/") ?? ["0", "1"];
              const progressPercent =
                (Number(progressParts[0]) / Number(progressParts[1])) * 100;

              const riskScore = c.riskScore ?? 0;

              const riskLabel =
                riskScore < 30 ? "LOW" : riskScore < 60 ? "MEDIUM" : "HIGH";

              return (
                <tr
                  key={c.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-white/40">{c.email}</div>
                  </td>

                  <td className="px-4 py-3">{c.joiningDesignation}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        c.verificationStatus === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : c.verificationStatus === "pending"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {capitalizeFirstLetter(c.verificationStatus)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-1 text-xs ${
                        riskLabel === "LOW"
                          ? "bg-green-500/20 text-green-400"
                          : riskLabel === "MEDIUM"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {c.riskScore}
                    </span>
                    <span className="ml-2 text-xs text-white/50">
                      {riskLabel}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="h-2 w-24 rounded-full bg-white/10">
                      <div
                        className={`h-2 rounded-full transition-all duration-300
    ${statusProgressColorMap[c.verificationStatus]}
  `}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium">{c.tatDays ?? "--"}d</td>

                  <td className="px-4 py-3 text-white/60">
                    {c.lastUpdated ? timeAgo(c.lastUpdated) : "--"}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleOnClick(c.id)}
                      className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-blue-400 hover:bg-white/5"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}