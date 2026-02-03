import { motion } from "framer-motion";

const previousQuestions = [
  {
    question: "What motivated you to apply for this position?",
    difficulty: "Easy",
    category: "Behavioral",
    color: "green",
  },
  {
    question:
      "Describe a challenging project you worked on and how you overcame obstacles.",
    difficulty: "Medium",
    category: "Problem Solving",
    color: "yellow",
  },
  {
    question:
      "How do you handle tight deadlines and pressure in a fast-paced environment?",
    difficulty: "Medium",
    category: "Stress Management",
    color: "yellow",
  },
  {
    question:
      "Explain a situation where you had to work with a difficult team member.",
    difficulty: "Hard",
    category: "Teamwork",
    color: "red",
  },
];

export function PreviousQuestions() {
  return (
    <div className="mt-4 space-y-3 text-xs text-black/80">
      <p>PREVIOUS QUESTIONS</p>

      {previousQuestions.map((q, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: "easeOut",
          }}
          className="rounded-md border border-black/10 p-2"
        >
          <p className="text-sm text-black/70">{q.question}</p>

          <div className="mt-2 flex items-center gap-2">
            {/* Difficulty Badge */}
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium
              ${
                q.color === "green"
                  ? "bg-green-500/20 text-green-400"
                  : q.color === "yellow"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {q.difficulty}
            </span>

            <span className="text-black/30">•</span>

            {/* Category */}
            <span className="text-[11px] text-sky-400 bg-sky-500/20 rounded-full px-2 py-0.5">
              {q.category}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
