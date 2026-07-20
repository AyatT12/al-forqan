// @ts-nocheck
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Star } from "lucide-react";
import { ANIMALS, BALLOONS, CARTOON_CHARS, COLORS_GAME, CHEERS } from "../../lib/constants";
import { shuffleArr, randomCheer } from "../../lib/helpers";
import type { FunGame } from "../../lib/types";
import Confetti from "../components/Confetti";

// ── Encouraging mascot popup (shown on every win) ──────────
function MascotCheer({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="fixed inset-x-0 top-5 z-[60] flex justify-center px-4 pointer-events-none"
        >
          <div
            className="flex items-end gap-3 rounded-[28px] px-4 py-3 shadow-xl border-4 border-white max-w-sm"
            style={{ background: "linear-gradient(135deg,#FDF3E4,#F6EAF7)" }}
          >
            <motion.svg
              width="60"
              height="60"
              viewBox="0 0 64 64"
              animate={{ rotate: [0, -8, 8, -6, 0], y: [0, -5, 0, -3, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              style={{ flexShrink: 0 }}
            >
              <path
                d="M32 5 L39.5 23.5 L59 24.5 L43.5 37 L48.5 56 L32 45.5 L15.5 56 L20.5 37 L5 24.5 L24.5 23.5 Z"
                fill="#FBD879"
                stroke="#F0BE55"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="24.5" cy="30.5" r="3.4" fill="#3F4A47" />
              <circle cx="39.5" cy="30.5" r="3.4" fill="#3F4A47" />
              <ellipse cx="20" cy="36.5" rx="3.4" ry="2.3" fill="#F6A8A0" opacity="0.8" />
              <ellipse cx="44" cy="36.5" rx="3.4" ry="2.3" fill="#F6A8A0" opacity="0.8" />
              <path d="M25 39 Q32 45 39 39" stroke="#3F4A47" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </motion.svg>
            <p
              className="font-bold text-[15px] leading-snug pb-1"
              style={{ fontFamily: "Cairo, sans-serif", color: "#5B4A63" }}
            >
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Animal Memory ─────────────────────────────────────────
function AnimalMemoryGame({ onWin }: { onWin: () => void }) {
  const BG = ["#FEF9C3","#DCFCE7","#DBEAFE","#FCE7F3","#FFF7ED","#F3E8FF","#CCFBF1","#FEE2E2"];
  const make = () => shuffleArr([...ANIMALS,...ANIMALS].map((a,i) => ({ id:i, emoji:a.emoji, name:a.name, flipped:false, matched:false })));
  const [cards, setCards] = useState(make);
  const [sel, setSel] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const flip = (id: number) => {
    if (locked || sel.length >= 2) return;
    const card = cards.find(c => c.id === id)!;
    if (card.flipped || card.matched) return;
    setCards(p => p.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSel(p => {
      const next = [...p, id];
      if (next.length === 2) {
        const [a, b] = next.map(x => cards.find(c => c.id === x)!);
        setLocked(true);
        setTimeout(() => {
          if (a.emoji === b.emoji) {
            setCards(prev => {
              const updated = prev.map(c => c.id === a.id || c.id === b.id ? { ...c, matched: true } : c);
              if (updated.every(c => c.matched)) setTimeout(onWin, 500);
              return updated;
            });
          } else {
            setCards(prev => prev.map(c => c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c));
          }
          setSel([]); setLocked(false);
        }, 950);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <p className="font-semibold" style={{ fontFamily: "Cairo, sans-serif", color: "#6d32a3" }}>{cards.filter(c => c.matched).length / 2}/{ANIMALS.length} 🐾</p>
        <button onClick={() => { setCards(make()); setSel([]); setLocked(false); }} className="p-2 rounded-lg hover:bg-muted"><RotateCcw size={18} /></button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, idx) => (
          <motion.button key={card.id} whileHover={{ scale: card.matched ? 1 : 1.06 }} whileTap={{ scale: 0.92 }} onClick={() => flip(card.id)}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all shadow-sm ${card.matched ? "opacity-60 cursor-default" : "cursor-pointer"}`}
            style={{ background: card.flipped || card.matched ? BG[idx % BG.length] : "linear-gradient(135deg,#c289f7,#6d32a3)", border: card.matched ? "3px solid #22C55E" : card.flipped ? "3px solid #D4A843" : "3px solid transparent" }}>
            {card.flipped || card.matched
              ? <><span className="text-3xl">{card.emoji}</span><span className="text-xs font-medium" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>{card.name}</span></>
              : <span className="text-2xl" style={{color:"white"}}>{idx + 1}</span>
            }
          </motion.button>
        ))} 
      </div>
    </div>
  );
}

// ── Balloon Game ──────────────────────────────────────────
function BalloonGame({ onWin }: { onWin: () => void }) {
  const [qs] = useState(() => shuffleArr(BALLOONS.map((_, i) => i)).slice(0, 4));
  const [qIdx, setQIdx] = useState(0);
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const q = BALLOONS[qs[qIdx]];

  const pop = (i: number) => {
    if (feedback) return;
    if (i === qs[qIdx]) {
      const np = new Set(popped); np.add(i); setPopped(np);
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); if (qIdx + 1 < qs.length) setQIdx(p => p + 1); else onWin(); }, 1100);
    } else { setFeedback("wrong"); setTimeout(() => setFeedback(null), 700); }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="text-center bg-card border border-border rounded-2xl p-4">
        <p className="text-lg font-medium mb-1" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>اضغط على البالون</p>
        <div className="text-4xl font-bold" style={{ color: q.hex, fontFamily: "Cairo, serif" }}>🎈 {q.label}</div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {BALLOONS.map((b, i) => (
          <motion.button key={i} whileHover={{ scale: popped.has(i) ? 1 : 1.1, y: popped.has(i) ? 0 : -8 }} whileTap={{ scale: 0.85 }} onClick={() => pop(i)}
            className={`flex flex-col items-center gap-1 ${popped.has(i) ? "opacity-20 cursor-default" : "cursor-pointer"}`}>
            <div className="w-20 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl" style={{ background: `radial-gradient(circle at 35% 30%, ${b.hex}dd, ${b.hex})` }}>🎈</div>
            <div className="w-0.5 h-8 mx-auto bg-gray-400" />
            <span className="text-xs font-bold" style={{ fontFamily: "Cairo, sans-serif", color: b.hex }}>{b.label}</span>
          </motion.button>
        ))}
      </div>
      {feedback === "correct" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-5xl">👏👏👏</motion.div>}
      {feedback === "wrong" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xl font-bold" style={{ fontFamily: "Cairo, sans-serif", color: "#EF4444" }}>❌ حاول مرة أخرى!</motion.div>}
    </div>
  );
}

// ── Color Game ────────────────────────────────────────────
function ColorGame({ onWin }: { onWin: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [res, setRes] = useState<boolean | null>(null);
  const [qs] = useState(() => shuffleArr(COLORS_GAME).map(c => ({ correct: c, opts: shuffleArr([c, ...shuffleArr(COLORS_GAME.filter(cc => cc.name !== c.name)).slice(0, 3)]) })));
  const q = qs[qIdx % qs.length];

  const choose = (name: string) => {
    if (sel) return; setSel(name); const ok = name === q.correct.name; setRes(ok); if (ok) setTimeout(onWin, 1400);
  };

  return (
    <div className="space-y-5 text-center" dir="rtl">
      <div className="bg-card border border-border rounded-2xl p-8">
        <p className="text-lg mb-4" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>ما لون هذه الصورة؟</p>
        <div className="flex flex-col items-center gap-3">
          <div className="text-8xl">{q.correct.obj}</div>
          <div className="w-16 h-16 rounded-full shadow-lg border-4 border-white" style={{ background: q.correct.color }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.opts.map((opt, i) => {
          let cls = "border-border bg-card";
          if (sel === opt.name) cls = res ? "border-green-400 bg-green-100" : "border-red-400 bg-red-100";
          else if (sel && opt.name === q.correct.name) cls = "border-green-400 bg-green-100";
          return (
            <motion.button key={i} whileHover={{ scale: sel ? 1 : 1.04 }} onClick={() => choose(opt.name)} disabled={!!sel}
              className={`py-4 px-4 rounded-2xl border-2 flex items-center gap-3 text-right transition-all ${cls}`}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white shadow" style={{ background: opt.color }} />
              <span className="font-bold text-lg" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>{opt.name}</span>
            </motion.button>
          );
        })}
      </div>
      {res !== null && (
        <div className="flex gap-3">
          <div className={`flex-1 rounded-xl p-3 text-center font-bold text-lg ${res ? "bg-green-100 border border-green-300 text-green-700" : "bg-red-100 border border-red-300 text-red-700"}`} style={{ fontFamily: "Cairo, sans-serif" }}>
            {res ? "🌈 ممتاز!" : `اللون الصحيح: ${q.correct.name}`}
          </div>
          {qIdx < qs.length - 1 && <button onClick={() => { setQIdx(p => p + 1); setSel(null); setRes(null); }} className="px-4 rounded-xl border border-border hover:bg-muted" style={{ fontFamily: "Cairo, sans-serif" }}>التالي →</button>}
        </div>
      )}
    </div>
  );
}

// ── Cartoon Game ──────────────────────────────────────────
function CartoonGame({ onWin }: { onWin: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [res, setRes] = useState<boolean | null>(null);
  const [qs] = useState(() => shuffleArr(CARTOON_CHARS).map(c => ({ correct: c, opts: shuffleArr([c.name, ...c.wrong]) })));
  const q = qs[qIdx % qs.length];
  const COLS = ["#FEF3C7","#DCFCE7","#DBEAFE","#FCE7F3"];
  const choose = (name: string) => { if (sel) return; setSel(name); const ok = name === q.correct.name; setRes(ok); if (ok) setTimeout(onWin, 1400); };

  return (
    <div className="space-y-5 text-center" dir="rtl">
      <div className="bg-card border border-border rounded-2xl p-8">
        <p className="text-lg mb-4" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>من هذه الشخصية؟</p>
        <motion.div key={qIdx} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-9xl my-4">{q.correct.emoji}</motion.div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.opts.map((opt, i) => {
          let border = "border-border", bg = COLS[i % COLS.length];
          if (sel === opt) { border = res ? "border-green-400" : "border-red-400"; bg = res ? "#DCFCE7" : "#FEE2E2"; }
          else if (sel && opt === q.correct.name) { border = "border-green-400"; bg = "#DCFCE7"; }
          return (
            <motion.button key={i} whileHover={{ scale: sel ? 1 : 1.06 }} whileTap={{ scale: 0.92 }} onClick={() => choose(opt)} disabled={!!sel}
              className={`py-5 px-4 rounded-2xl border-2 font-bold text-xl transition-all ${border}`} style={{ background: bg, fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>
              {opt}
            </motion.button>
          );
        })}
      </div>
      {res !== null && (
        <div className="flex gap-3">
          <div className={`flex-1 rounded-xl p-3 text-center font-bold text-lg ${res ? "bg-green-100 border border-green-300 text-green-700" : "bg-red-100 border border-red-300 text-red-700"}`} style={{ fontFamily: "Cairo, sans-serif" }}>
            {res ? "🎉 صحيح!" : `هي ${q.correct.name} ${q.correct.emoji}`}
          </div>
          {qIdx < qs.length - 1 && <button onClick={() => { setQIdx(p => p + 1); setSel(null); setRes(null); }} className="px-4 rounded-xl border border-border hover:bg-muted text-xl" style={{ fontFamily: "Cairo, sans-serif" }}>التالي</button>}
        </div>
      )}
    </div>
  );
}

// ── XO Game — two players on the same device ───────────────
function XOGame({ onWin }: { onWin: () => void }) {
  const [mark, setMark] = useState<"X" | "O" | null>(null);
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  const checkW = (b: typeof board) => { for (const [a,bb,c] of LINES) { if (b[a] && b[a]===b[bb] && b[a]===b[c]) return b[a]; } return null; };

  const click = (i: number) => {
    if (board[i] || winner) return;
    const nb = [...board]; nb[i] = turn;
    const w = checkW(nb);
    setBoard(nb);
    if (w) { setWinner(w); if (w === mark) setTimeout(onWin, 600); return; }
    if (nb.every(Boolean)) { setWinner("draw"); return; }
    setTurn(t => (t === "X" ? "O" : "X"));
  };

  const resetBoard = () => { setBoard(Array(9).fill(null)); setTurn("X"); setWinner(null); };
  const chooseMark = (m: "X" | "O") => { setMark(m); resetBoard(); };
  const changeMark = () => { setMark(null); resetBoard(); };

  // ── mark selection screen ──
  if (!mark) {
    return (
      <div className="space-y-6 text-center" dir="rtl">
        <div>
          <p className="text-lg font-bold" style={{ fontFamily: "Cairo, sans-serif", color: "#3F4A47" }}>اختر علامتك يا بطل!</p>
          <p className="text-sm mt-1" style={{ fontFamily: "Cairo, sans-serif", color: "#8A8F8C" }}>العب مع صديق أو أحد أفراد العائلة على نفس الجهاز</p>
        </div>
        <div className="flex justify-center gap-6">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => chooseMark("X")}
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-md"
            style={{ background: "#DCEFFB", border: "3px solid #8FC1E8", color: "#2F6690" }}>❌</motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => chooseMark("O")}
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-md"
            style={{ background: "#FBE1E4", border: "3px solid #E8A0AA", color: "#A94A56" }}>⭕</motion.button>
        </div>
      </div>
    );
  }

  const turnLabel = winner
    ? null
    : turn === mark
      ? `👤 دورك أنت (${mark === "X" ? "❌" : "⭕"})`
      : `🧑‍🤝‍🧑 دور اللاعب الآخر (${turn === "X" ? "❌" : "⭕"})`;

  return (
    <div className="space-y-5 text-center" dir="rtl">
      <div className="text-xl font-bold" style={{ fontFamily: "Cairo, sans-serif", color: "#3F4A47" }}>
        {winner
          ? winner === "draw" ? "🤝 تعادل!" : winner === mark ? "🎉 فزت يا بطل!" : "🎊 فاز اللاعب الآخر!"
          : turnLabel}
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {board.map((cell, i) => (
          <motion.button key={i} whileHover={{ scale: cell||winner ? 1 : 1.08 }} whileTap={{ scale: 0.88 }} onClick={() => click(i)}
            className={`h-24 rounded-2xl text-5xl font-bold transition-all shadow-sm ${!cell && !winner ? "hover:shadow-lg cursor-pointer" : "cursor-default"}`}
            style={{ background: cell==="X" ? "#DCEFFB" : cell==="O" ? "#FBE1E4" : "#F7F4EE", border: `3px solid ${cell==="X"?"#8FC1E8":cell==="O"?"#E8A0AA":"#E3D9C4"}` }}>
            {cell==="X" ? "❌" : cell==="O" ? "⭕" : <span className="text-2xl" style={{ color: "#B9AF9A" }}>{i + 1}</span>}
          </motion.button>
        ))}
      </div>
      <p className="text-xs" style={{ fontFamily: "Cairo, sans-serif", color: "#8A8F8C" }}>يمكن للطفل اختيار المربع بذكر رقمه (١-٩)</p>
      {winner && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className={`rounded-2xl p-4 font-bold text-lg ${winner===mark?"bg-green-100 border border-green-300 text-green-700":winner==="draw"?"bg-muted border border-border text-foreground":"bg-amber-100 border border-amber-300 text-amber-700"}`}
          style={{ fontFamily: "Cairo, sans-serif" }}>
          {winner===mark?"🏆 رائع! ربحت!":winner==="draw"?"لعبة جيدة!":"حظ أوفر في المرة القادمة!"}
        </motion.div>
      )}
      <div className="flex justify-center gap-3">
        <button onClick={resetBoard} className="px-6 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-medium" style={{ fontFamily: "Cairo, sans-serif" }}>🔄 جولة جديدة</button>
        <button onClick={changeMark} className="px-6 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-medium" style={{ fontFamily: "Cairo, sans-serif" }}>تغيير العلامة</button>
      </div>
    </div>
  );
}

// ── Scratch / Reveal ──────────────────────────────────────
const AYAHS = [
  { ayah: "قُلْ هُوَ اللَّهُ أَحَدٌ", surah: "الإخلاص" },
  { ayah: "اللَّهُ الصَّمَدُ", surah: "الإخلاص" },
  { ayah: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", surah: "الفاتحة" },
  { ayah: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", surah: "الكوثر" },
  { ayah: "وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", surah: "العصر" },
  { ayah: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", surah: "الشرح" },
  { ayah: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "الشرح" },
  { ayah: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ", surah: "الضحى" },
  { ayah: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ", surah: "الضحى" },
  { ayah: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", surah: "النصر" },
  { ayah: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", surah: "الفلق" },
  { ayah: "مِن شَرِّ مَا خَلَقَ", surah: "الفلق" },
  { ayah: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", surah: "الناس" },
  { ayah: "مَلِكِ النَّاسِ", surah: "الناس" },
  { ayah: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", surah: "الفيل" },
  { ayah: "لِإِيلَافِ قُرَيْشٍ", surah: "قريش" },
  { ayah: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ", surah: "قريش" },
  { ayah: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", surah: "الماعون" },
  { ayah: "فَوَيْلٌ لِّلْمُصَلِّينَ", surah: "الماعون" },
  { ayah: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", surah: "القدر" },
  { ayah: "لَمْ يَلِدْ وَلَمْ يُولَدْ", surah: "الإخلاص" },
  { ayah: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", surah: "المسد" },
  { ayah: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", surah: "الكافرون" },
  { ayah: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", surah: "الكافرون" },
  { ayah: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ", surah: "الهمزة" },
  { ayah: "أَلْهَاكُمُ التَّكَاثُرُ", surah: "التكاثر" },
  { ayah: "أَرَأَيْتَ الَّذِي يَنْهَىٰ", surah: "العلق" },
  { ayah: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", surah: "العلق" },
];

function shuffleOrder(avoidFirst?: number) {
  const arr = shuffleArr(AYAHS.map((_, i) => i));
  if (avoidFirst !== undefined && arr.length > 1 && arr[0] === avoidFirst) {
    const j = 1 + Math.floor(Math.random() * (arr.length - 1));
    [arr[0], arr[j]] = [arr[j], arr[0]];
  }
  return arr;
}

function ScratchGame({ onWin }: { onWin: () => void }) {
  const [order, setOrder] = useState<number[]>(() => shuffleOrder());
  const [pos, setPos] = useState(0);
  const current = AYAHS[order[pos]];
  const words = current.ayah.split(" ");
  const [revealed, setReveal] = useState<Set<number>>(new Set());

  const revealWord = (i: number) => {
    const nr = new Set(revealed); nr.add(i); setReveal(nr);
    if (nr.size === words.length) setTimeout(onWin, 800);
  };

  const nextAyah = () => {
    setPos(p => {
      const np = p + 1;
      if (np >= order.length) { setOrder(shuffleOrder(order[p])); return 0; }
      return np;
    });
    setReveal(new Set());
  };

  return (
    <div className="space-y-5 text-center" dir="rtl">
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>سورة {current.surah}</p>
        <p className="text-xs" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>اضغط على النجوم لاكتشاف كلمات الآية</p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {words.map((w, i) => (
          <motion.button key={i} onClick={() => !revealed.has(i) && revealWord(i)}
            whileHover={{ scale: revealed.has(i) ? 1 : 1.1 }} whileTap={{ scale: 0.85 }}
            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className={`px-4 py-3 rounded-2xl text-lg font-medium border-2 transition-all min-w-16 shadow-sm ${revealed.has(i) ? "cursor-default border-green-400" : "cursor-pointer border-amber-400"}`}
            style={{ background: revealed.has(i) ? "#DCFCE7" : "#6d32a3", color: revealed.has(i) ? "#166534" : "#fff", fontFamily: "Noto Naskh Arabic, serif" }}>
            {revealed.has(i) ? w : <span className="text-2xl">⭐</span>}
          </motion.button>
        ))}
      </div>
      <div className="text-sm text-muted-foreground" style={{ fontFamily: "Cairo, sans-serif" }}>{revealed.size} / {words.length} كلمات مكتشفة</div>
      {revealed.size === words.length && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="bg-green-100 border border-green-300 rounded-2xl p-4 text-green-700 font-bold" style={{ fontFamily: "Cairo, sans-serif" }}>🎉 اكتشفت الآية كاملة!</div>
          <button onClick={nextAyah} className="mt-3 px-6 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-medium" style={{ fontFamily: "Cairo, sans-serif" }}>آية أخرى →</button>
        </motion.div>
      )}
    </div>
  );
}

// ── Hub ───────────────────────────────────────────────────
const FUN_LIST = [
  { id:"animal-memory" as FunGame, title:"ذاكرة الحيوانات", desc:"أوجد أزواج الحيوانات",     emoji:"🦁🐯🐘", bg:"linear-gradient(135deg,#FBE3C7,#FAD9B0)", fg:"#8A5A2B" },
  { id:"balloons"      as FunGame, title:"لعبة البالونات",  desc:"اضغط البالون الصحيح",     emoji:"🎈🎈🎈", bg:"linear-gradient(135deg,#F3DCEA,#E7D7F5)", fg:"#7A4E7D" },
  { id:"colors"        as FunGame, title:"لعبة الألوان",   desc:"تعرف على الألوان",          emoji:"🌈🎨🖌️", bg:"linear-gradient(135deg,#D9EBFA,#CFEFEF)", fg:"#3A6B82" },
  { id:"cartoon"       as FunGame, title:"مسابقة الكرتون", desc:"تعرف على الشخصيات",        emoji:"👸🤖🧙", bg:"linear-gradient(135deg,#D9F2E3,#CFEAD9)", fg:"#3F7A5C" },
  { id:"xo"            as FunGame, title:"لعبة XO",        desc:"العب مع صديقك",             emoji:"❌⭕✨", bg:"linear-gradient(135deg,#E3DFF7,#EAE1F9)", fg:"#6A5F96" },
  { id:"scratch"       as FunGame, title:"اكتشف الآية",   desc:"اكشف الكلمات المخفية",     emoji:"⭐🌟✨", bg:"linear-gradient(135deg,#FBEAD0,#F8DEB8)", fg:"#96712F" },
];

export default function Fun() {
  const [game, setGame] = useState<FunGame>(null);
  const [score, setScore] = useState(0);
  const [cheer, setCheer] = useState("");

  const win = () => {
    setScore(s => s + 15);
    const msg = randomCheer(CHEERS);
    setCheer(msg);
    setTimeout(() => setCheer(""), 2800);
  };

  return (
    <div className="p-5 lg:p-8" dir="rtl">
      {cheer && <Confetti message={cheer} />}
      <MascotCheer message={cheer} />

      <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Cairo, serif", color: "#6d32a3" }}>ألعاب ترفيهية 🎪</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm" style={{ background: "linear-gradient(135deg,#FBE3C7,#FAD9B0)", color: "#8A5A2B" }}>
          <Star size={16} /><span className="font-bold" style={{ fontFamily: "Cairo, sans-serif" }}>{score}</span>
        </div>
      </div>

      {!game ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {FUN_LIST.map(g => (
            <motion.button key={g.id} whileHover={{ scale: 1.04, y: -5 }} whileTap={{ scale: 0.96 }} onClick={() => setGame(g.id)}
              className="relative overflow-hidden rounded-3xl p-6 flex flex-col gap-2 border-4 border-white cursor-pointer shadow-md" style={{ background: g.bg, color: g.fg }}>
              <div className="text-3xl">{g.emoji}</div>
              <h3 className="text-lg font-bold" style={{ fontFamily: "Cairo, serif" }}>{g.title}</h3>
              <p className="text-xs opacity-80" style={{ fontFamily: "Cairo, sans-serif" }}>{g.desc}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setGame(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted text-sm" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>← العودة</button>
            <h3 className="font-bold text-lg" style={{ fontFamily: "Cairo, serif", color: "#6d32a3" }}>{FUN_LIST.find(g => g.id === game)?.title}</h3>
          </div>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            {game === "animal-memory" && <AnimalMemoryGame onWin={win} />}
            {game === "balloons"      && <BalloonGame onWin={win} />}
            {game === "colors"        && <ColorGame onWin={win} />}
            {game === "cartoon"       && <CartoonGame onWin={win} />}
            {game === "xo"            && <XOGame onWin={win} />}
            {game === "scratch"       && <ScratchGame onWin={win} />}
          </div>
        </div>
      )}
    </div>
  );
}