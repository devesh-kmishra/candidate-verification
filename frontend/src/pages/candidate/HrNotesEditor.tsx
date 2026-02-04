import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { HrNote } from "../../types/HrNote";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HrNotesEditor = ({ candidateId }: { candidateId: string }) => {
  const [notes, setNotes] = useState<HrNote[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/candidates/${candidateId}/hr-notes`)
      .then((r) => r.json())
      .then(setNotes);
  }, [candidateId]);

  const addNote = async () => {
    if (!text.trim()) return;

    setLoading(true);
    const res = await fetch(
      `${API_BASE_URL}/api/candidates/${candidateId}/hr-notes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: text }),
      }
    );

    const newNote = await res.json();
    setNotes((p) => [newNote, ...p]);
    setText("");
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        flex flex-col
        rounded-2xl
        border border-white/10
        bg-white/[0.03]
        backdrop-blur
        p-6
      "
    >
      <h3 className="text-sm font-semibold text-white">
        HR Notes (Internal)
      </h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add internal remark for audit & decision tracking..."
        className="
          mt-4 min-h-[120px] resize-none
          rounded-xl bg-black/40 p-4
          text-sm text-white/80
          placeholder:text-white/30
          outline-none
          focus:ring-2 focus:ring-orange-500/40
        "
      />

      <button
        onClick={addNote}
        disabled={loading}
        className="
          mt-4 self-end
          rounded-lg bg-orange-500 px-5 py-2
          text-sm font-semibold
          hover:bg-orange-600
          disabled:opacity-50
        "
      >
        Add Note
      </button>

      <div className="mt-6 space-y-3">
        {notes.length === 0 && (
          <p className="text-sm text-white/40">
            No internal notes added yet
          </p>
        )}

        {notes.map((n) => (
          <div key={n.id} className="rounded-lg bg-black/30 px-4 py-3">
            <p className="text-sm text-white/80">{n.note}</p>
            <p className="mt-1 text-xs text-white/40">
              {n.createdBy} • {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HrNotesEditor;
