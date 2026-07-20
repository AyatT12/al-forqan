// @ts-nocheck
import { motion } from "motion/react";

const EMOJIS = ["🎉","⭐","🌟","✨","🎊","🏆","💛","🎈","🌈","👏","🎀","💫"];

export default function Confetti({ message }: { message: string }) {
  const items = Array.from({ length: 22 }, (_, i) => ({
    emoji: EMOJIS[i % EMOJIS.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: Math.random() * 1.2 + 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          style={{ left: `${item.x}%`, top: -60 }}
          animate={{ y: "110vh", rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
          transition={{ duration: item.dur, delay: item.delay, ease: "easeIn" }}
        >
          {item.emoji}
        </motion.div>
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
          className="text-2xl lg:text-3xl font-bold px-8 py-5 rounded-3xl text-white shadow-2xl text-center"
          style={{
            background: "linear-gradient(135deg,#6d32a3,#2d7a63)",
            fontFamily: "Cairo, serif",
            maxWidth: "80vw",
          }}
        >
          {message}
        </div>
      </motion.div>
    </div>
  );
}
