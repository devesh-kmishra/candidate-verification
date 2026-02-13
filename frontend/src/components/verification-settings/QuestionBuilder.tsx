import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import type { Question, QuestionType } from "../../types/verification";

interface Props {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onSave: (updated: Question) => void;
}

const QuestionBuilderModal = ({
  isOpen,
  question,
  onClose,
  onSave,
}: Props) => {
  const [localQuestion, setLocalQuestion] =
    useState<Question | null>(null);

  /* Sync question when modal opens */
  useEffect(() => {
    if (question) {
      setLocalQuestion(question);
    }
  }, [question]);

  if (!isOpen || !localQuestion) return null;

  const updateField = <K extends keyof Question>(
    field: K,
    value: Question[K]
  ) => {
    setLocalQuestion((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const addOption = () => {
    if (!localQuestion) return;

    const updatedOptions = [
      ...(localQuestion.options || []),
      "New Option",
    ];

    updateField("options", updatedOptions);
  };

  const updateOption = (index: number, value: string) => {
    if (!localQuestion?.options) return;

    const updated = [...localQuestion.options];
    updated[index] = value;

    updateField("options", updated);
  };

  const removeOption = (index: number) => {
    if (!localQuestion?.options) return;

    const updated = localQuestion.options.filter(
      (_, i) => i !== index
    );

    updateField("options", updated);
  };

  const handleSave = () => {
    if (!localQuestion.label.trim()) return;

    onSave(localQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#0F172A] rounded-2xl p-6 border border-white/10"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            Edit Question
          </h2>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-white/50" />
          </button>
        </div>

        {/* LABEL */}
        <div className="mb-4">
          <label className="text-xs text-white/50">
            Question Label
          </label>
          <input
            value={localQuestion.label}
            onChange={(e) =>
              updateField("label", e.target.value)
            }
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
          />
        </div>

        {/* TYPE */}
        <div className="mb-4">
          <label className="text-xs text-white/50">
            Question Type
          </label>
          <select
            value={localQuestion.type}
            onChange={(e) => {
              const newType =
                e.target.value as QuestionType;

              updateField("type", newType);

              // Clear options if not MCQ
              if (newType !== "MCQ") {
                updateField("options", undefined);
              } else {
                updateField("options", ["Option 1"]);
              }
            }}
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
          >
            <option value="text">Text</option>
            <option value="yesno">Yes / No</option>
            <option value="date">Date</option>
            <option value="mcq">Multiple Choice</option>
          </select>
        </div>

        {/* OPTIONS (MCQ only) */}
        {localQuestion.type === "MCQ" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/50">
                Options
              </label>
              <button
                onClick={addOption}
                className="flex items-center gap-1 text-xs text-orange-400"
              >
                <Plus className="h-3 w-3" />
                Add Option
              </button>
            </div>

            <div className="space-y-2">
              {localQuestion.options?.map(
                (opt, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={opt}
                      onChange={(e) =>
                        updateOption(
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                    />
                    <button
                      onClick={() =>
                        removeOption(index)
                      }
                      className="text-white/40 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-white/10 text-white/60"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-md bg-orange-500 text-white"
          >
            Save Question
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionBuilderModal;
