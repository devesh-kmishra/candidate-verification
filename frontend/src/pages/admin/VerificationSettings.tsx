import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

type QuestionType = "text" | "yesno" | "mcq" | "date";

interface Question {
  id: string;
  label: string;
  type: QuestionType;
}

interface VerificationType {
  id: string;
  name: string;
  enabled: boolean;
  requiredCount: number;
  mandatory: boolean;
  mode: "sequential" | "parallel";
  questions: Question[];
}

const initialVerifications: VerificationType[] = [
  {
    id: "background",
    name: "Background Verification",
    enabled: true,
    requiredCount: 1,
    mandatory: true,
    mode: "parallel",
    questions: [
      { id: "q1", label: "Any criminal record?", type: "yesno" },
    ],
  },
  {
    id: "employment",
    name: "Previous Employment Verification",
    enabled: true,
    requiredCount: 2,
    mandatory: true,
    mode: "sequential",
    questions: [
      { id: "q2", label: "Confirm designation", type: "text" },
      { id: "q3", label: "Reason for exit", type: "text" },
    ],
  },
  {
    id: "reference",
    name: "Reference Check",
    enabled: false,
    requiredCount: 2,
    mandatory: false,
    mode: "parallel",
    questions: [
      { id: "q4", label: "Would you rehire this candidate?", type: "yesno" },
    ],
  },
];

/* ---------------- PAGE ---------------- */

const VerificationSettingsPage = () => {
  const [verifications, setVerifications] =
    useState<VerificationType[]>(initialVerifications);

  const toggleVerification = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, enabled: !v.enabled } : v
      )
    );
  };

  const updateField = (
    id: string,
    field: keyof VerificationType,
    value: any
  ) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  const addQuestion = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              questions: [
                ...v.questions,
                {
                  id: crypto.randomUUID(),
                  label: "New Question",
                  type: "text",
                },
              ],
            }
          : v
      )
    );
  };

  const removeQuestion = (vid: string, qid: string) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === vid
          ? {
              ...v,
              questions: v.questions.filter((q) => q.id !== qid),
            }
          : v
      )
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Verification Settings
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Configure verification rules & reusable question templates
        </p>
      </div>

      {/* VERIFICATION TYPES */}
      <div className="space-y-6">
        {verifications.map((v) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-[#0B1020] p-6"
          >
            {/* TOP ROW */}
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
                      : "bg-white/10 text-white/50"
                  }`}
              >
                {v.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {/* RULES */}
            {v.enabled && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* COUNT */}
                <div>
                  <label className="text-xs text-white/50">
                    Required Contacts
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={v.requiredCount}
                    onChange={(e) =>
                      updateField(v.id, "requiredCount", +e.target.value)
                    }
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  />
                </div>

                {/* MANDATORY */}
                <div>
                  <label className="text-xs text-white/50">
                    Requirement
                  </label>
                  <select
                    value={v.mandatory ? "mandatory" : "optional"}
                    onChange={(e) =>
                      updateField(
                        v.id,
                        "mandatory",
                        e.target.value === "mandatory"
                      )
                    }
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  >
                    <option value="mandatory">Mandatory</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>

                {/* MODE */}
                <div>
                  <label className="text-xs text-white/50">
                    Execution Mode
                  </label>
                  <select
                    value={v.mode}
                    onChange={(e) =>
                      updateField(v.id, "mode", e.target.value)
                    }
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                  >
                    <option value="parallel">Parallel</option>
                    <option value="sequential">Sequential</option>
                  </select>
                </div>
              </div>
            )}

            {/* QUESTIONS */}
            {v.enabled && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-white/70">
                    Custom Questions
                  </p>
                  <button
                    onClick={() => addQuestion(v.id)}
                    className="flex items-center gap-1 text-xs text-orange-400 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Add Question
                  </button>
                </div>

                <div className="space-y-2">
                  {v.questions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2"
                    >
                      <span className="text-sm text-white">
                        {q.label}
                      </span>
                      <button
                        onClick={() => removeQuestion(v.id, q.id)}
                        className="text-white/40 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VerificationSettingsPage;
