import { Camera, Mic, RotateCcw, LogOut, Sparkles } from "lucide-react";
import { AILoadingDots } from "../../components/common/AlloadingDots"
import { PreviousQuestions } from "../../components/verification/PreviousQuestions"
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const InterviewPage = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-slate-900 font-(--font-inter)">
      {/* HEADER */}
      <header className="flex flex-col gap-2 border-b border-white/10 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="relative space-y-1">
          {/* Glow */}
          <div className="pointer-events-none absolute -left-2 -top-1 h-8 w-40 rounded-full bg-orange-500/20 blur-xl" />

          {/* Title Row */}
          <div className="flex items-center gap-2">
            {/* Animated Pulse Icon */}
            <motion.div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(249,115,22,0.0)",
                  "0 0 12px rgba(249,115,22,0.6)",
                  "0 0 0px rgba(249,115,22,0.0)",
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Mic className="h-3.5 w-3.5 text-orange-400" />
            </motion.div>

            {/* Heading */}
            <h1 className="bg-linear-to-r from-white to-white/70 bg-clip-text text-lg font-semibold tracking-tight text-black/80 sm:text-xl">
              AI Mock Interview
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-md text-xs leading-relaxed text-black/60 sm:text-sm">
            Real-time AI interviewer tailored to your job role
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
            ● Waiting for Response
          </span>
          <span className="rounded-full border border-black/10 px-3 py-1 text-xs">
            {formatTime(seconds)}
          </span>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="grid gap-4 px-4 py-6 md:grid-cols-[1fr_1.4fr_0.9fr] md:px-6">
        {/* LEFT – CAMERA */}
        <section className="relative flex min-h-180 items-center justify-center rounded-xl border border-gray-400/20 bg-linear-to-b from-[#ffffff] to-[#edf2ff]">
          <div className="flex flex-col items-center gap-3 text-white/70">
            {/* Animated Camera */}
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(249,115,22,0.0)",
                  "0 0 16px rgba(249,115,22,0.6)",
                  "0 0 0px rgba(249,115,22,0.0)",
                ],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Camera className="h-6 w-6 text-white" />
            </motion.div>

            {/* Animated Text */}
            <motion.p
              className="text-sm text-black/70"
              // animate={{ opacity: [0.6, 1, 0.6], y: [0, -4, 0] }}
              // transition={{
              //   duration: 2.5,
              //   repeat: Infinity,
              //   ease: "easeInOut",
              // }}
            >
              Camera feed will appear here
            </motion.p>
          </div>

          {/* Bottom-left label */}
          <span className="absolute bottom-3 left-3 rounded bg-black/60 text-white px-2 py-1 text-xs">
            You • mic
          </span>

          {/* Bottom-right controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/60 px-2 py-1">
            <Camera className="h-4 w-4 text-white/80 hover:text-white" />
            <Mic className="h-4 w-4 text-white/80 hover:text-white" />
          </div>
        </section>

        {/* CENTER – AI INTERVIEWER */}
        <section className="relative flex h-180 flex-col items-center justify-center rounded-xl border border-cyan-200/20 bg-linear-to-br from-[#ffffff] to-[#edf2ff]">
          {/* AI Icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-blue-600"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>

          {/* Waveform */}
          <AILoadingDots />

          {/* Status Text */}
          <motion.p
            className="mt-2 text-xs tracking-wide text-cyan-400/80"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Volkai AI is listening…
          </motion.p>

          {/* Label */}
          <span className="absolute bottom-3 left-3 rounded-md border border-blue-500/30 bg-black/50 px-2 py-1 text-xs text-white">
            Volkai AI Interviewer
          </span>
        </section>

        {/* RIGHT – QUESTIONS */}
        <aside className="rounded-xl border border-white/10 bg-linear-to-br from-[#ffffff] to-[#edf2ff] p-4">
          <h3 className="mb-4 text-sm font-semibold text-black/80">
            Interview Questions
          </h3>

          {/* Current Question */}
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
            <span className="text-xs text-orange-400">CURRENT QUESTION</span>
            <p className="mt-2 text-sm text-black/80">
              Tell me about yourself and your experience in software
              development.
            </p>

            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                Difficulty: Easy
              </span>
              <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-xs text-sky-400">
                Skill: Communication
              </span>
            </div>
          </div>

          {/* Upcoming */}
          <PreviousQuestions />
        </aside>
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 px-6 py-4">
        <button
          className="
    flex items-center gap-2
    rounded-xl
    bg-orange-500
    px-6 py-3
    text-sm font-semibold text-white
    shadow-lg shadow-orange-500/30
    transition-all duration-200 ease-out
    hover:scale-[1.03]
    hover:bg-orange-600
    active:scale-[0.97]
  "
        >
          <Mic className="h-4 w-4" />
          Start Recording Answer
        </button>

        <button
          className="
    flex items-center gap-2
    rounded-xl
    border border-white/20
    px-5 py-3
    text-sm
    shadow-md shadow-black/30
    transition-all duration-200 ease-out
    hover:scale-[1.03]
    hover:border-white/40
    hover:bg-white/10
    active:scale-[0.97]
  "
        >
          <RotateCcw className="h-4 w-4" />
          Repeat Question
        </button>

        <button
          className="
    flex items-center gap-2
    rounded-xl
    border border-white/20
    px-5 py-3
    text-sm
    shadow-md shadow-black/30
    transition-all duration-200 ease-out
    hover:scale-[1.03]
    hover:border-red-500/40
    hover:bg-red-500/10
    active:scale-[0.97]
  "
        >
          <LogOut className="h-4 w-4" />
          Exit Interview
        </button>
      </footer>
    </div>
  );
};

export default InterviewPage;
