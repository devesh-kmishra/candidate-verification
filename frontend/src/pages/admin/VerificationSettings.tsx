import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Plus, Trash2, Pencil } from "lucide-react";
import QuestionBuilderModal from "../../components/verification-settings/QuestionBuilder";
import type {
  Question,
} from "../../types/verification";

/* ---------------- LOCAL UI TYPE ---------------- */

interface VerificationUIType {
  id: string;
  name: string;
  enabled: boolean;
  requiredCount: number;
  mandatory: boolean;
  mode: "PARALLEL" | "SEQUENTIAL";
  questions: Question[];
}

/* ---------------- MOCK DATA ---------------- */

const initialVerifications: VerificationUIType[] = [
  {
    id: "background",
    name: "Background Verification",
    enabled: true,
    requiredCount: 1,
    mandatory: true,
    mode: "PARALLEL",
    questions: [
      { id: "q1", label: "Any criminal record?", type: "YES_NO" },
    ],
  },
  {
    id: "employment",
    name: "Previous Employment Verification",
    enabled: true,
    requiredCount: 2,
    mandatory: true,
    mode: "SEQUENTIAL",
    questions: [
      { id: "q2", label: "Confirm designation", type: "TEXT" },
      { id: "q3", label: "Reason for exit", type: "TEXT" },
    ],
  },
];

/* ---------------- PAGE ---------------- */

const VerificationSettingsPage = () => {
  const [verifications, setVerifications] =
    useState<VerificationUIType[]>(initialVerifications);

  const [selectedQuestion, setSelectedQuestion] =
    useState<Question | null>(null);

  const [activeVerificationId, setActiveVerificationId] =
    useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ---------------- TOGGLE ---------------- */

  const toggleVerification = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, enabled: !v.enabled } : v
      )
    );
  };

  /* ---------------- UPDATE FIELD ---------------- */

  const updateField = <K extends keyof VerificationUIType>(
    id: string,
    field: K,
    value: VerificationUIType[K]
  ) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  /* ---------------- ADD QUESTION ---------------- */

  const addQuestion = (verificationId: string) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      label: "New Question",
      type: "TEXT",
    };

    setVerifications((prev) =>
      prev.map((v) =>
        v.id === verificationId
          ? {
              ...v,
              questions: [...v.questions, newQuestion],
            }
          : v
      )
    );
  };

  /* ---------------- REMOVE QUESTION ---------------- */

  const removeQuestion = (
    verificationId: string,
    questionId: string
  ) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === verificationId
          ? {
              ...v,
              questions: v.questions.filter(
                (q) => q.id !== questionId
              ),
            }
          : v
      )
    );
  };

  /* ---------------- OPEN EDIT MODAL ---------------- */

  const openEditModal = (
    verificationId: string,
    question: Question
  ) => {
    setActiveVerificationId(verificationId);
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  /* ---------------- SAVE QUESTION ---------------- */

  const handleSaveQuestion = (updated: Question) => {
    if (!activeVerificationId) return;

    setVerifications((prev) =>
      prev.map((v) =>
        v.id === activeVerificationId
          ? {
              ...v,
              questions: v.questions.map((q) =>
                q.id === updated.id ? updated : q
              ),
            }
          : v
      )
    );
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#0B1020] p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Verification Settings
          </h1>
          <p className="text-sm text-white/50 mt-2">
            Configure rules and question templates for each verification type
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-6">
          {verifications.map((v) => (
            <motion.div
              key={v.id}
              whileHover={{ scale: 1.01 }}
              className={`rounded-2xl border backdrop-blur-lg p-6 transition
              ${
                v.enabled
                  ? "border-white/10 bg-white/5"
                  : "border-white/5 bg-white/5 opacity-60"
              }`}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-orange-400 h-5 w-5" />
                  <h3 className="text-lg font-medium text-white">
                    {v.name}
                  </h3>
                </div>

                <button
                  onClick={() => toggleVerification(v.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition
                  ${
                    v.enabled
                      ? "bg-green-500/15 text-green-400"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {v.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* RULES */}
              {v.enabled && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="number"
                      min={1}
                      value={v.requiredCount}
                      onChange={(e) =>
                        updateField(
                          v.id,
                          "requiredCount",
                          Math.max(1, Number(e.target.value))
                        )
                      }
                      className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                    />

                    <select
                      value={v.mandatory ? "mandatory" : "optional"}
                      onChange={(e) =>
                        updateField(
                          v.id,
                          "mandatory",
                          e.target.value === "mandatory"
                        )
                      }
                      className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                    >
                      <option value="mandatory">Mandatory</option>
                      <option value="optional">Optional</option>
                    </select>

                    <select
                      value={v.mode}
                      onChange={(e) =>
                        updateField(
                          v.id,
                          "mode",
                          e.target.value as "PARALLEL" | "SEQUENTIAL"
                        )
                      }
                      className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                    >
                      <option value="PARALLEL">Parallel</option>
                      <option value="SEQUENTIAL">Sequential</option>
                    </select>
                  </div>

                  {/* QUESTIONS */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/70">
                        Questions
                      </p>
                      <button
                        onClick={() => addQuestion(v.id)}
                        className="flex items-center gap-1 text-xs text-orange-400"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>

                    {v.questions.map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 transition"
                      >
                        <div>
                          <p className="text-sm text-white">
                            {q.label}
                          </p>
                          <span className="text-[10px] text-white/40">
                            {q.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              openEditModal(v.id, q)
                            }
                            className="text-white/40 hover:text-orange-400"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              removeQuestion(v.id, q.id)
                            }
                            className="text-white/40 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <QuestionBuilderModal
        isOpen={isModalOpen}
        question={selectedQuestion}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};

export default VerificationSettingsPage;
