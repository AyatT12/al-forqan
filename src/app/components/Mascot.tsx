// @ts-nocheck
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import kidClap from "../../Assets/images/kid-clap.png";
import kidCheer from "../../Assets/images/kid-cheer.png";
import kidPoint from "../../Assets/images/kid-point.png";
import kidPaint from "../../Assets/images/kid-paint.png";

const MESSAGES = [
  "أحسنت! 👏",
  "ما شاء الله!",
  "رائع جداً!",
  "استمر يا بطل!",
  "بارك الله فيك!",
];

/**
 * Global interactive mascot pair. Two cartoon Muslim kids float at the
 * bottom corners of every page. Clicking them bounces + shows a speech
 * bubble. Any page can trigger a celebration by dispatching:
 *   window.dispatchEvent(new CustomEvent("mascot:cheer", { detail: "message" }))
 */
export default function Mascot() {
  const [bubble, setBubble] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      const msg = e?.detail || MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setBubble(msg);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1800);
      setTimeout(() => setBubble(null), 2600);
    };
    window.addEventListener("mascot:cheer", handler);
    return () => window.removeEventListener("mascot:cheer", handler);
  }, []);

  const tap = () => {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setBubble(msg);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1400);
    setTimeout(() => setBubble(null), 2200);
  };

  const characters = [
    { src: celebrate ? kidClap : kidPoint, side: "right", alt: "صديقك" },
    { src: celebrate ? kidCheer : kidPaint, side: "left", alt: "صديقتك" },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden md:block">
      <div className="relative mx-auto max-w-[1600px] px-4">
        {characters.map((c, i) => (
          <motion.button
            key={c.side}
            onClick={tap}
            aria-label={c.alt}
            className="pointer-events-auto absolute -bottom-2 select-none"
            style={{ [c.side]: 12 } as any}
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: celebrate ? [0, -18, 0, -12, 0] : [0, -6, 0],
              opacity: 1,
              rotate: celebrate ? [0, -6, 6, -3, 0] : 0,
            }}
            transition={{
              y: { duration: celebrate ? 0.9 : 2.4, repeat: celebrate ? 0 : Infinity, delay: i * 0.15 },
              rotate: { duration: 0.8 },
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
          >
            <img
              src={c.src}
              alt={c.alt}
              className="w-24 lg:w-32 drop-shadow-2xl"
              draggable={false}
            />
          </motion.button>
        ))}

        <AnimatePresence>
          {bubble && (
            <motion.div
              key={bubble}
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 rounded-3xl px-6 py-3 text-white text-lg lg:text-xl font-black shadow-2xl"
              style={{
                background: "linear-gradient(135deg,var(--kid-teal),var(--kid-grape))",
                fontFamily: "Amiri, serif",
              }}
            >
              {bubble}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti sparkles on celebrate */}
        <AnimatePresence>
          {celebrate && (
            <>
              {Array.from({ length: 14 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-16 text-2xl"
                  style={{ left: `${10 + i * 6}%` }}
                  initial={{ y: 0, opacity: 1, scale: 0.6 }}
                  animate={{ y: -180 - Math.random() * 80, opacity: 0, scale: 1.2 }}
                  transition={{ duration: 1.2, delay: i * 0.04 }}
                >
                  {["⭐","✨","🌟","💫"][i % 4]}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
