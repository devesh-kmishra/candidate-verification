import { motion } from "framer-motion";
const bars = [12, 18, 24, 16, 28, 20, 14];

export const AILoadingDots = () => {
  return (
    <div className="mt-4 flex h-10 items-end gap-1.5">
      {bars.map((height, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
          animate={{
            height: [height * 0.4, height, height * 0.6, height * 0.9],
            opacity: [0.6, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
};
