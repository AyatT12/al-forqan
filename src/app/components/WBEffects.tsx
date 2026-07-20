// @ts-nocheck
import { useEffect } from "react";
import { motion } from "motion/react";
import IslamicPattern from "./IslamicPattern";

// ── Balloon celebration overlay ──────────────────────────
export function BalloonCelebrationOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  const colors = ["#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#A855F7","#EC4899","#06B6D4"];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[90]">
      {Array.from({ length: 24 }, (_, i) => {
        // Store random values per balloon so they don't change on re-render
        const randomX = 3 + Math.random() * 94;
        const randomDuration = 2.2 + Math.random() * 1.5;
        const randomDelay = Math.random() * 0.8;
        const swingAmount = (Math.random() - 0.5) * 100; // Random swing

        return (
          <motion.div
            key={i}
            className="absolute flex flex-col items-center"
            initial={{ 
              left: `${randomX}%`, 
              bottom: "-80px",
              opacity: 0
            }}
            animate={{ 
              bottom: "110%",  // Changed from y: "-120%" to animate bottom property
              x: [0, swingAmount, -swingAmount, 0],
              opacity: [0, 1, 1, 0] // Fade in and out
            }}
            transition={{ 
              duration: randomDuration, 
              delay: randomDelay, 
              ease: "easeOut" 
            }}
          >
            <div
              className="w-10 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
              style={{ background: colors[i % colors.length] }}
            >
              🎈
            </div>
            <div 
              style={{ 
                background: colors[i % colors.length], 
                width: 1, 
                height: 32, 
                opacity: 0.6 
              }} 
            />
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Star celebration overlay ─────────────────────────────
export function StarCelebrationOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  const starEmojis = ["⭐", "🌟", "✨", "💫"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 flex items-center justify-center">
      {Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const dist = 80 + Math.random() * 200;
        return (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1.8 }}
            transition={{ duration: 1.6 + Math.random() * 0.6, delay: Math.random() * 0.3, ease: "easeOut" }}
          >
            {starEmojis[i % 4]}
          </motion.div>
        );
      })}
      <motion.div
        className="text-5xl"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1], rotate: [0, 20, -20, 0] }}
        transition={{ duration: 0.8 }}
      >
        🌟
      </motion.div>
    </div>
  );
}

// ── Alarm effect ─────────────────────────────────────────
export function AlarmEffect({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <motion.div
        className="absolute inset-0 border-8"
        animate={{ borderColor: ["#EF4444","transparent","#EF4444","transparent","#EF4444","transparent"] }}
        transition={{ duration: 1.8, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl"
        animate={{ scale: [0.5, 1.4, 1, 1.4, 1], rotate: [0, -15, 15, -15, 0] }}
        transition={{ duration: 1.8 }}
      >
        🔔
      </motion.div>
    </div>
  );
}

// ── Curtain ──────────────────────────────────────────────
export function Curtain({ visible, onReveal }: { visible: boolean; onReveal: () => void }) {
  return (
    <div
      onClick={onReveal}
      className="absolute inset-0 z-20 cursor-pointer overflow-hidden"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.75s cubic-bezier(0.4,0,0.2,1)",
        background: "linear-gradient(180deg,rgb(65, 27, 77) 0%,rgb(14, 45, 35) 100%)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <IslamicPattern opacity={0.1} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-5">
        <div className="text-8xl">🕌</div>
        <p className="text-3xl font-bold" style={{ fontFamily: "Cairo, serif" }}>
          انقر في أي مكان لرفع الستارة
        </p>
        <p className="text-sm opacity-50" style={{ fontFamily: "Cairo, sans-serif" }}>
          Click anywhere to reveal
        </p>
      </div>
    </div>
  );
}