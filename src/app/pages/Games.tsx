// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, RotateCcw, Shuffle, Volume2, BookOpen, ChevronDown, Check, X, Plus, Trash2 } from "lucide-react";

// ─── TYPES ───────────────────────────────────────────
interface Surah {
  id: number;
  name: string;
  ayahs: number;
}

interface Ayah {
  numberInSurah: number;
  text: string;
  [key: string]: any;
}

interface Question {
  ayahText: string;
  ayahNum: number;
  correctWord: string;
  options: string[];
}

interface ListeningQuestion {
  correct: Ayah;
  options: Ayah[];
}

interface Pair {
  a: string;
  b: string;
  ayahNum: number;
}

interface Card {
  id: number;
  text: string;
  flipped: boolean;
  matched: boolean;
}

interface RainItem {
  id: number;
  emoji: string;
  x: number;
  size: number;
  delay: number;
  dur: number;
  rotate: boolean;
}

interface WheelSurah {
  id: number;
  name: string;
}

interface Game {
  id: string;
  title: string;
  icon: string;
  bg: string;
  badge: string;
  desc: string;
}

// ─── ALL SURAHS ───────────────────────────────────────────
const ALL_SURAHS: Surah[] = [
  {id:1,  name:"الفاتحة",    ayahs:7},
  {id:2,  name:"البقرة",     ayahs:286},
  {id:3,  name:"آل عمران",   ayahs:200},
  {id:4,  name:"النساء",     ayahs:176},
  {id:5,  name:"المائدة",    ayahs:120},
  {id:6,  name:"الأنعام",    ayahs:165},
  {id:7,  name:"الأعراف",    ayahs:206},
  {id:8,  name:"الأنفال",    ayahs:75},
  {id:9,  name:"التوبة",     ayahs:129},
  {id:10, name:"يونس",       ayahs:109},
  {id:11, name:"هود",        ayahs:123},
  {id:12, name:"يوسف",       ayahs:111},
  {id:13, name:"الرعد",      ayahs:43},
  {id:14, name:"إبراهيم",    ayahs:52},
  {id:15, name:"الحجر",      ayahs:99},
  {id:16, name:"النحل",      ayahs:128},
  {id:17, name:"الإسراء",    ayahs:111},
  {id:18, name:"الكهف",      ayahs:110},
  {id:19, name:"مريم",       ayahs:98},
  {id:20, name:"طه",         ayahs:135},
  {id:21, name:"الأنبياء",   ayahs:112},
  {id:22, name:"الحج",       ayahs:78},
  {id:23, name:"المؤمنون",   ayahs:118},
  {id:24, name:"النور",      ayahs:64},
  {id:25, name:"الفرقان",    ayahs:77},
  {id:26, name:"الشعراء",    ayahs:227},
  {id:27, name:"النمل",      ayahs:93},
  {id:28, name:"القصص",      ayahs:88},
  {id:29, name:"العنكبوت",   ayahs:69},
  {id:30, name:"الروم",      ayahs:60},
  {id:31, name:"لقمان",      ayahs:34},
  {id:32, name:"السجدة",     ayahs:30},
  {id:33, name:"الأحزاب",    ayahs:73},
  {id:34, name:"سبأ",        ayahs:54},
  {id:35, name:"فاطر",       ayahs:45},
  {id:36, name:"يس",         ayahs:83},
  {id:37, name:"الصافات",    ayahs:182},
  {id:38, name:"ص",          ayahs:88},
  {id:39, name:"الزمر",      ayahs:75},
  {id:40, name:"غافر",       ayahs:85},
  {id:41, name:"فصلت",       ayahs:54},
  {id:42, name:"الشورى",     ayahs:53},
  {id:43, name:"الزخرف",     ayahs:89},
  {id:44, name:"الدخان",     ayahs:59},
  {id:45, name:"الجاثية",    ayahs:37},
  {id:46, name:"الأحقاف",    ayahs:35},
  {id:47, name:"محمد",       ayahs:38},
  {id:48, name:"الفتح",      ayahs:29},
  {id:49, name:"الحجرات",    ayahs:18},
  {id:50, name:"ق",          ayahs:45},
  {id:51, name:"الذاريات",   ayahs:60},
  {id:52, name:"الطور",      ayahs:49},
  {id:53, name:"النجم",      ayahs:62},
  {id:54, name:"القمر",      ayahs:55},
  {id:55, name:"الرحمن",     ayahs:78},
  {id:56, name:"الواقعة",    ayahs:96},
  {id:57, name:"الحديد",     ayahs:29},
  {id:58, name:"المجادلة",   ayahs:22},
  {id:59, name:"الحشر",      ayahs:24},
  {id:60, name:"الممتحنة",   ayahs:13},
  {id:61, name:"الصف",       ayahs:14},
  {id:62, name:"الجمعة",     ayahs:11},
  {id:63, name:"المنافقون",  ayahs:11},
  {id:64, name:"التغابن",    ayahs:18},
  {id:65, name:"الطلاق",     ayahs:12},
  {id:66, name:"التحريم",    ayahs:12},
  {id:67, name:"الملك",      ayahs:30},
  {id:68, name:"القلم",      ayahs:52},
  {id:69, name:"الحاقة",     ayahs:52},
  {id:70, name:"المعارج",    ayahs:44},
  {id:71, name:"نوح",        ayahs:28},
  {id:72, name:"الجن",       ayahs:28},
  {id:73, name:"المزمل",     ayahs:20},
  {id:74, name:"المدثر",     ayahs:56},
  {id:75, name:"القيامة",    ayahs:40},
  {id:76, name:"الإنسان",    ayahs:31},
  {id:77, name:"المرسلات",   ayahs:50},
  {id:78, name:"النبأ",      ayahs:40},
  {id:79, name:"النازعات",   ayahs:46},
  {id:80, name:"عبس",        ayahs:42},
  {id:81, name:"التكوير",    ayahs:29},
  {id:82, name:"الانفطار",   ayahs:19},
  {id:83, name:"المطففين",   ayahs:36},
  {id:84, name:"الانشقاق",   ayahs:25},
  {id:85, name:"البروج",     ayahs:22},
  {id:86, name:"الطارق",     ayahs:17},
  {id:87, name:"الأعلى",     ayahs:19},
  {id:88, name:"الغاشية",    ayahs:26},
  {id:89, name:"الفجر",      ayahs:30},
  {id:90, name:"البلد",      ayahs:20},
  {id:91, name:"الشمس",      ayahs:15},
  {id:92, name:"الليل",      ayahs:21},
  {id:93, name:"الضحى",      ayahs:11},
  {id:94, name:"الشرح",      ayahs:8},
  {id:95, name:"التين",      ayahs:8},
  {id:96, name:"العلق",      ayahs:19},
  {id:97, name:"القدر",      ayahs:5},
  {id:98, name:"البينة",     ayahs:8},
  {id:99, name:"الزلزلة",    ayahs:8},
  {id:100,name:"العاديات",   ayahs:11},
  {id:101,name:"القارعة",    ayahs:11},
  {id:102,name:"التكاثر",    ayahs:8},
  {id:103,name:"العصر",      ayahs:3},
  {id:104,name:"الهمزة",     ayahs:9},
  {id:105,name:"الفيل",      ayahs:5},
  {id:106,name:"قريش",       ayahs:4},
  {id:107,name:"الماعون",    ayahs:7},
  {id:108,name:"الكوثر",     ayahs:3},
  {id:109,name:"الكافرون",   ayahs:6},
  {id:110,name:"النصر",      ayahs:3},
  {id:111,name:"المسد",      ayahs:5},
  {id:112,name:"الإخلاص",    ayahs:4},
  {id:113,name:"الفلق",      ayahs:5},
  {id:114,name:"الناس",      ayahs:6},
];


const SECTOR_COLORS: string[] = [
  "#F472B6","#FBBF24","#34D399","#60A5FA","#A78BFA","#F87171",
  "#FB923C","#4ADE80","#38BDF8","#C084FC","#F43F5E","#FACC15",
];

const CHEERS: string[] = ["أحسنت يا بطل! 🏆","رائع جداً! ⭐⭐⭐","ممتاز! 🌟✨","برافو عليك! 🎊🎉","ما شاء الله! 👏👏","أنت نجم! 🌟💫"];

function shuffleArr<T>(arr: T[]): T[] { 
  const a = [...arr]; 
  for(let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  } 
  return a; 
}

function getAudioUrl(s: number, a: number): string { 
  return `https://everyayah.com/data/Husary_Muallim_128kbps/${String(s).padStart(3,"0")}${String(a).padStart(3,"0")}.mp3`; 
}

const randomCheer = (): string => CHEERS[Math.floor(Math.random() * CHEERS.length)];

// ─── SOUND EFFECTS ────────────────────────────────────────
function playSound(type: string): void {
  if (typeof window !== "undefined" && (type === "win" || type === "correct")) {
    window.dispatchEvent(new CustomEvent("mascot:cheer"));
  }
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    if (type === "spin") {
      [220,330,440,550,660,770,880].forEach((f, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        const t = ac.currentTime + i * 0.08;
        o.type = "triangle"; 
        o.frequency.setValueAtTime(f, t); 
        o.frequency.exponentialRampToValueAtTime(f * 2.5, t + 2.5);
        g.gain.setValueAtTime(0.12, t); 
        g.gain.exponentialRampToValueAtTime(0.001, t + 3);
        o.connect(g); 
        g.connect(ac.destination); 
        o.start(t); 
        o.stop(t + 3.5);
      });
    } else if (type === "win") {
      [523.3,659.3,783.9,1046.5,1318.5].forEach((f, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        const t = ac.currentTime + i * 0.13;
        o.type = "sine"; 
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.4, t); 
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.connect(g); 
        g.connect(ac.destination); 
        o.start(t); 
        o.stop(t + 0.55);
      });
    } else if (type === "applause") {
      [261.6,329.6,392,523.3,659.3].forEach((f, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        const t = ac.currentTime + i * 0.1;
        o.type = "sine"; 
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.3, t); 
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        o.connect(g); 
        g.connect(ac.destination); 
        o.start(t); 
        o.stop(t + 0.45);
      });
    } else if (type === "heart") {
      [440,554,659].forEach((f, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        const t = ac.currentTime + i * 0.15;
        o.type = "sine"; 
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.35, t); 
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        o.connect(g); 
        g.connect(ac.destination); 
        o.start(t); 
        o.stop(t + 0.65);
      });
    } else if (type === "star") {
      for(let i = 0; i < 10; i++){
        const o = ac.createOscillator();
        const g = ac.createGain();
        const t = ac.currentTime + i * 0.06;
        o.type = "triangle"; 
        o.frequency.setValueAtTime(500 + Math.random() * 1200, t);
        g.gain.setValueAtTime(0.15, t); 
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.connect(g); 
        g.connect(ac.destination); 
        o.start(t); 
        o.stop(t + 0.3);
      }
    }
    setTimeout(() => ac.close().catch(() => {}), 5000);
  } catch(_) {}
}

// ─── EMOJI RAIN ───────────────────────────────────────────
interface EmojiRainProps {
  rains: RainItem[];
  onClear: (id: number) => void;
}

function EmojiRain({ rains, onClear }: EmojiRainProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {rains.map(r => (
        <motion.div key={r.id} className="absolute text-3xl select-none"
          style={{ left: `${r.x}%`, top: -60, fontSize: r.size }}
          animate={{ y: "110vh", rotate: r.rotate ? 360 : 0 }}
          transition={{ duration: r.dur, delay: r.delay, ease: "easeIn" }}
          onAnimationComplete={() => onClear(r.id)}>
          {r.emoji}
        </motion.div>
      ))}
    </div>
  );
}

function useEmojiRain() {
  const [rains, setRains] = useState<RainItem[]>([]);
  const fire = (emoji: string, count: number = 30): void => {
    const items: RainItem[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji,
      x: Math.random() * 100,
      size: 18 + Math.random() * 20,
      delay: Math.random() * 0.7,
      dur: 1.5 + Math.random() * 2,
      rotate: true,
    }));
    setRains(p => [...p, ...items]);
  };
  const clear = (id: number): void => setRains(p => p.filter(r => r.id !== id));
  return { rains, fire, clear };
}

// ─── ISLAMIC PATTERN ──────────────────────────────────────
let _pid = 0;

interface IslamicPatternProps {
  opacity?: number;
}

function IslamicPattern({ opacity = 0.08 }: IslamicPatternProps) {
  const id = useRef(`ip-${_pid++}`).current;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse"><g stroke="#8B6914" fill="none" strokeWidth="0.7"><polygon points="28,4 32,18 46,22 32,26 28,40 24,26 10,22 24,18"/></g></pattern></defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity}/>
    </svg>
  );
}

// ─── CONFETTI ─────────────────────────────────────────────
interface ConfettiProps {
  message: string;
}

function Confetti({ message }: ConfettiProps) {
  const emojis: string[] = ["🎉","⭐","🌟","✨","🎊","🏆","💛","🎈","🌈","👏"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({length:20},(_,i)=>({emoji:emojis[i%emojis.length],x:Math.random()*100,delay:Math.random()*0.6,dur:Math.random()*1.2+1})).map((item, i) => (
        <motion.div key={i} className="absolute text-3xl" style={{left:`${item.x}%`,top:-60}} animate={{y:"110vh",rotate:360}} transition={{duration:item.dur,delay:item.delay,ease:"easeIn"}}>{item.emoji}</motion.div>
      ))}
      <motion.div className="absolute inset-0 flex items-center justify-center" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:300,damping:20}}>
        <div className="text-2xl font-bold px-8 py-5 rounded-3xl text-white shadow-2xl text-center" style={{background:"linear-gradient(135deg,#6d32a3,#2d7a63)",fontFamily:"Cairo, serif",maxWidth:"80vw"}}>{message}</div>
      </motion.div>
    </div>
  );
}

// ─── SURAH SELECTOR ───────────────────────────────────────
interface SurahSelectorProps {
  selectedId: number;
  onSelect: (id: number) => void;
  label?: string;
}

function SurahSelector({ selectedId, onSelect, label = "اختر السورة" }: SurahSelectorProps) {
  const [open, setOpen] = useState<boolean>(false);
  const surah = ALL_SURAHS.find(s => s.id === selectedId);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 bg-white w-full text-right transition-all hover:border-amber-400"
        style={{ borderColor: open ? "#D4A843" : "#E0D5C5", fontFamily: "Cairo, serif" }}>
        <BookOpen size={16} style={{ color: "#6d32a3", flexShrink: 0 }} />
        <span className="flex-1 text-base" style={{ color: "#6d32a3" }}>{surah ? `سورة ${surah.name}` : label}</span>
        <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} style={{ color: "#7A5C48" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
            className="absolute top-full right-0 left-0 mt-2 bg-white border border-border rounded-2xl shadow-2xl z-30 max-h-64 overflow-y-auto">
            {ALL_SURAHS.map(s => (
              <button key={s.id} onClick={() => { onSelect(s.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-colors hover:bg-amber-50 ${selectedId === s.id ? "bg-emerald-50" : ""}`}>
                <span className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: selectedId === s.id ? "#6d32a3" : "#E8DDD0", color: selectedId === s.id ? "white" : "#7A5C48", fontFamily: "Cairo, sans-serif" }}>
                  {s.id}
                </span>
                <span style={{ fontFamily: "Cairo, serif", color: "#6d32a3" }}>{s.name}</span>
                <span className="mr-auto text-xs" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>{s.ayahs} آية</span>
                {selectedId === s.id && <Check size={14} style={{ color: "#6d32a3" }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LOADING / EMPTY ──────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
      <p style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>...جاري التحميل</p>
    </div>
  );
}

interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = "اختر سورة لتبدأ اللعبة" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="text-5xl">📖</div>
      <p className="text-lg font-semibold" style={{ fontFamily: "Cairo, serif", color: "#6d32a3" }}>{message}</p>
      <p className="text-sm" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>ستُولَّد الأسئلة تلقائياً من الآيات</p>
    </div>
  );
}

// ─── useSurahAyahs ────────────────────────────────────────
function useSurahAyahs(surahId: number) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!surahId) return;
    setLoading(true); 
    setAyahs([]); 
    setError(null);
    fetch(`https://api.alquran.cloud/v1/surah/${surahId}`)
      .then(r => r.json())
      .then(d => { 
        if (d.status === "OK") {
          setAyahs(d.data.ayahs); 
        } else {
          setError("تعذر تحميل السورة"); 
        }
      })
      .catch(() => setError("خطأ في الاتصال بالإنترنت"))
      .finally(() => setLoading(false));
  }, [surahId]);
  
  return { ayahs, loading, error };
}

// ─── GAME WRAPPER ─────────────────────────────────────────
interface GameWrapperProps {
  surahId: number;
  onSurahChange: (id: number) => void;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

function GameWrapper({ surahId, onSurahChange, loading, error, children }: GameWrapperProps) {
  const surah = ALL_SURAHS.find(s => s.id === surahId);
  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-sm font-semibold" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>اختيار المعلم للسورة</span>
        </div>
        <SurahSelector selectedId={surahId} onSelect={onSurahChange} />
        {surah && <p className="text-xs" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>سورة {surah.name} • {surah.ayahs} آية • ستُولَّد الأسئلة تلقائياً</p>}
      </div>
      {loading ? <LoadingSpinner /> : error ? <div className="text-center py-8 text-red-600 text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>{error}</div> : !surahId ? <EmptyState /> : children}
    </div>
  );
}

// ─── SPINNING WHEEL ───────────────────────────────────────
function SpinningWheel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  const [wheelSurahs, setWheelSurahs] = useState<WheelSurah[]>([
    {id:1,name:"الفاتحة"},{id:112,name:"الإخلاص"},{id:113,name:"الفلق"},
    {id:114,name:"الناس"},{id:103,name:"العصر"},{id:108,name:"الكوثر"},
  ]);
  const [selectId, setSelectId] = useState<number>(ALL_SURAHS[0].id);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<WheelSurah | null>(null);
  const [winnerColor, setWinnerColor] = useState<string>("#6B21A8");
  const { rains, fire, clear } = useEmojiRain();

  // Draw wheel
  const drawWheel = useCallback((highlightIdx: number = -1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 300, cx = W / 2, cy = W / 2, r = W / 2 - 4;
    ctx.clearRect(0, 0, W, W);

    if (wheelSurahs.length === 0) {
      ctx.fillStyle = "#F3E8FF";
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#A78BFA";
      ctx.font = "bold 15px Cairo, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("أضف سوراً للعجلة", cx, cy);
      return;
    }

    const n = wheelSurahs.length;
    const slice = (Math.PI * 2) / n;

    wheelSurahs.forEach((s, i) => {
      const startA = angleRef.current + i * slice - Math.PI / 2;
      const endA = startA + slice;
      const baseColor = SECTOR_COLORS[i % SECTOR_COLORS.length];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startA, endA);
      ctx.closePath();
      ctx.fillStyle = i === highlightIdx ? lightenHex(baseColor, 40) : baseColor;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startA + slice / 2);
      ctx.translate(r * (n > 7 ? 0.65 : 0.6), 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "white";
      ctx.font = `bold ${n > 9 ? 10 : 13}px Cairo, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 3;
      ctx.fillText(s.name, 0, 0);
      ctx.restore();
    });

    // Center cap
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = "white"; ctx.fill();
    ctx.strokeStyle = "#E9D5FF"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#7C3AED";
    ctx.font = "bold 12px serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("✦", cx, cy);
  }, [wheelSurahs]);

  function lightenHex(hex: string, amt: number): string {
    const r = Math.min(255, parseInt(hex.slice(1,3),16)+amt);
    const g = Math.min(255, parseInt(hex.slice(3,5),16)+amt);
    const b = Math.min(255, parseInt(hex.slice(5,7),16)+amt);
    return `rgb(${r},${g},${b})`;
  }

  useEffect(() => { drawWheel(); }, [drawWheel]);

  const getWinnerIdx = (): number => {
    const n = wheelSurahs.length;
    const slice = (Math.PI * 2) / n;
    const norm = (((-angleRef.current % (Math.PI*2)) + Math.PI*2) % (Math.PI*2));
    return Math.floor(norm / slice) % n;
  };

  const spin = (): void => {
    if (spinning || wheelSurahs.length === 0) return;
    setSpinning(true);
    setWinner(null);
    playSound("spin");

    const totalRot = (4 + Math.random() * 4) * Math.PI * 2 + Math.random() * Math.PI * 2;
    const duration = 3500 + Math.random() * 1500;
    const startAngle = angleRef.current;
    const startTime = performance.now();
    const easeOut = (t: number): number => 1 - Math.pow(1 - t, 4);

    const frame = (now: number): void => {
      const p = Math.min((now - startTime) / duration, 1);
      angleRef.current = startAngle + totalRot * easeOut(p);
      drawWheel();
      if (p < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        const idx = getWinnerIdx();
        const won = wheelSurahs[idx];
        const color = SECTOR_COLORS[idx % SECTOR_COLORS.length];
        drawWheel(idx);
        setWinner(won);
        setWinnerColor(color);
        setSpinning(false);
        playSound("win");
        fire("👏", 30);
        setTimeout(() => fire("⭐", 20), 400);
      }
    };
    animRef.current = requestAnimationFrame(frame);
  };

  const addSurah = (): void => {
    const s = ALL_SURAHS.find(x => x.id === selectId);
    if (!s || wheelSurahs.find(x => x.id === s.id)) return;
    setWheelSurahs(p => [...p, { id: s.id, name: s.name }]);
  };

  const removeSurah = (id: number): void => setWheelSurahs(p => p.filter(s => s.id !== id));

  const REACTION_BTNS = [
    { emoji: "👏", label: "تصفيق", sound: "applause", count: 35 },
    { emoji: "⭐", label: "نجمة",  sound: "star",     count: 25 },
    { emoji: "❤️", label: "قلب",   sound: "heart",    count: 28 },
    { emoji: "🏆", label: "كأس",   sound: "star",     count: 20 },
    { emoji: "🤩", label: "ممتاز", sound: "applause", count: 22 },
  ];

  return (
    <div dir="rtl" className="space-y-5">
      <EmojiRain rains={rains} onClear={clear} />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: result + controls */}
        <div className="flex flex-col gap-4 lg:w-60 flex-shrink-0">
          {/* Result card */}
          <AnimatePresence mode="wait">
            {winner ? (
              <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="rounded-2xl p-6 text-center space-y-2 bg-white shadow-sm border"
                style={{ borderTop: `5px solid ${winnerColor}`, borderColor: winnerColor }}>
                <p className="text-3xl font-black" style={{ color: winnerColor, fontFamily: "Cairo, serif" }}>{winner.name}</p>
                <p className="text-sm" style={{ fontFamily: "Cairo, sans-serif", color: "#6B21A8" }}>🌟 يلا يا بطل! 🌟</p>
                <p className="text-xs leading-relaxed" style={{ fontFamily: "Cairo, sans-serif", color: "#9333EA" }}> اتلوا علينا سورة <br/>
                  <strong style={{ color: winnerColor }}>{winner.name}</strong>
                </p>
                <button onClick={() => setWinner(null)}
                  className="text-xs mt-2 px-3 py-1.5 rounded-full border flex items-center gap-1 mx-auto hover:bg-pink-50 transition-colors"
                  style={{ borderColor: "#FBCFE8", color: "#EC4899", fontFamily: "Cairo, sans-serif" }}>
                  <Trash2 size={11} /> إزالة النتيجة
                </button>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-6 text-center bg-white border border-border shadow-sm">
                <div className="text-4xl mb-2">🎡</div>
                <p className="text-sm" style={{ fontFamily: "Cairo, sans-serif", color: "#C4B5D0" }}>دوّر العجلة لاختيار سورة</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Surah manager */}
          <div className="bg-white rounded-2xl p-4 border border-border shadow-sm space-y-3">
            <p className="text-sm font-bold" style={{ fontFamily: "Cairo, sans-serif", color: "#7C3AED" }}>السور في العجلة</p>
            <div className="flex gap-2">
              <select value={selectId} onChange={e => setSelectId(+e.target.value)}
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-purple-200 bg-purple-50 text-right"
                style={{ fontFamily: "Cairo, sans-serif", color: "#4C1D95" }} dir="rtl">
                {ALL_SURAHS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={addSurah} className="flex items-center gap-1 px-3 py-2 rounded-xl text-white text-sm font-bold"
                style={{ background: "#7C3AED", fontFamily: "Cairo, sans-serif" }}>
                <Plus size={14} /> أضف
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {wheelSurahs.length === 0 && <p className="text-xs w-full text-center py-2" style={{ fontFamily: "Cairo, sans-serif", color: "#A78BFA" }}>أضف سوراً لتظهر في العجلة</p>}
              {wheelSurahs.map((s, i) => (
                <span key={s.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                  style={{ background: "#EDE9FE", color: "#4C1D95", fontFamily: "Cairo, sans-serif" }}>
                  <span style={{ color: SECTOR_COLORS[i % SECTOR_COLORS.length], fontSize: 10 }}>●</span>
                  {s.name}
                  <button onClick={() => removeSurah(s.id)} className="text-purple-400 hover:text-red-500 transition-colors font-bold text-sm leading-none">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: wheel + buttons */}
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* Canvas + pointer */}
          <div className="relative" style={{ width: 300, height: 300 }}>
            {/* Pointer */}
            <div className="absolute left-1/2 -top-3 z-10" style={{ transform: "translateX(-50%)" }}>
              <div style={{ width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: "22px solid #1F2937", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }} />
            </div>
            <canvas ref={canvasRef} width={300} height={300} className="rounded-full"
              style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.15)" }} />
          </div>

          {/* Spin button */}
          <motion.button onClick={spin} disabled={spinning || wheelSurahs.length === 0}
            whileHover={{ scale: spinning ? 1 : 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-lg disabled:opacity-50 shadow-lg"
            style={{ background: "#EC4899", fontFamily: "Cairo, sans-serif" }}>
            <motion.span animate={spinning ? { rotate: 360 } : {}} transition={spinning ? { repeat: Infinity, duration: 0.6, ease: "linear" } : {}}>↻</motion.span>
            {spinning ? "تدور..." : "دوّر العجلة!"}
          </motion.button>

          {/* Reaction bar */}
          <div className="flex gap-2 flex-wrap justify-center">
            {REACTION_BTNS.map(btn => (
              <motion.button key={btn.emoji} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => { playSound(btn.sound); fire(btn.emoji, btn.count); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: "#E9D5FF", color: "#4C1D95", fontFamily: "Cairo, sans-serif" }}>
                {btn.emoji} {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WORD ORDER GAME ──────────────────────────────────────
interface WordOrderGameProps {
  onWin: () => void;
}

function WordOrderGame({ onWin }: WordOrderGameProps) {
  const [surahId, setSurahId] = useState<number>(1);
  const { ayahs, loading, error } = useSurahAyahs(surahId);
  const [ayahIdx, setAyahIdx] = useState<number>(0);
  const [avail, setAvail] = useState<string[]>([]);
  const [arr, setArr] = useState<string[]>([]);
  const [res, setRes] = useState<boolean | null>(null);

  const currentAyah: Ayah | undefined = ayahs[ayahIdx];
  useEffect(() => { 
    if (!currentAyah) return; 
    setAvail(shuffleArr(currentAyah.text.split(" "))); 
    setArr([]); 
    setRes(null); 
  }, [ayahIdx, currentAyah?.text]);
  useEffect(() => { 
    if (ayahs.length > 0) setAyahIdx(0); 
  }, [surahId, ayahs.length]);

  const words: string[] = currentAyah ? currentAyah.text.split(" ") : [];
  const add = (w: string, i: number): void => { 
    setAvail(p => p.filter((_, j) => j !== i)); 
    setArr(p => [...p, w]); 
    setRes(null); 
  };
  const rem = (w: string, i: number): void => { 
    setArr(p => p.filter((_, j) => j !== i)); 
    setAvail(p => [...p, w]); 
    setRes(null); 
  };
  const check = (): void => { 
    const ok = arr.join(" ") === currentAyah?.text; 
    setRes(ok); 
    if (ok) setTimeout(onWin, 1400); 
  };
  const reset = (): void => { 
    if (!currentAyah) return; 
    setAvail(shuffleArr(currentAyah.text.split(" "))); 
    setArr([]); 
    setRes(null); 
  };
  const nextAyah = (): void => { 
    if (ayahIdx < ayahs.length - 1) setAyahIdx(p => p + 1); 
  };
  const prevAyah = (): void => { 
    if (ayahIdx > 0) setAyahIdx(p => p - 1); 
  };

  return (
    <GameWrapper surahId={surahId} onSurahChange={setSurahId} loading={loading} error={error}>
      {ayahs.length > 0 && currentAyah && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-2.5">
            <button onClick={prevAyah} disabled={ayahIdx === 0} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted disabled:opacity-30" style={{ color: "#6d32a3" }}>‹</button>
            <span className="text-sm font-medium" style={{ fontFamily: "Cairo, sans-serif", color: "#6d32a3" }}>الآية {currentAyah.numberInSurah} من {ayahs.length}</span>
            <button onClick={nextAyah} disabled={ayahIdx === ayahs.length - 1} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted disabled:opacity-30" style={{ color: "#6d32a3" }}>›</button>
          </div>
          <div className={`min-h-20 border-2 border-dashed rounded-2xl p-4 flex flex-wrap gap-2 transition-colors ${res === true ? "border-green-400 bg-green-50" : res === false ? "border-red-400 bg-red-50" : "border-amber-300 bg-amber-50/50"}`}>
            {arr.map((w, i) => <motion.button key={`arr-${w}-${i}`} initial={{ scale: 0.85 }} animate={{ scale: 1 }} onClick={() => rem(w, i)} className="px-3 py-2 rounded-xl text-sm text-white shadow-sm" style={{ background: "#6d32a3", fontFamily: "Noto Naskh Arabic, serif" }}>{w}</motion.button>)}
            {arr.length === 0 && <span className="m-auto text-muted-foreground text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>انقر على الكلمات أدناه لترتيبها</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {avail.map((w, i) => <motion.button key={`avail-${w}-${i}`} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={() => add(w, i)} className="px-3 py-2 rounded-xl text-sm border-2" style={{ fontFamily: "Noto Naskh Arabic, serif", background: "#F5F0E6", borderColor: "#D4A843", color: "#2C1810" }}>{w}</motion.button>)}
          </div>
          <div className="flex gap-3">
            <button onClick={check} disabled={arr.length !== words.length} className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-40" style={{ background: "#6d32a3", fontFamily: "Cairo, sans-serif" }}>✓ تحقق من الإجابة</button>
            <button onClick={reset} className="px-4 py-3 rounded-xl border border-border hover:bg-muted"><RotateCcw size={18} /></button>
          </div>
          <AnimatePresence>
            {res !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`rounded-xl p-4 text-center font-semibold ${res ? "bg-green-100 border border-green-300 text-green-700" : "bg-red-100 border border-red-300 text-red-700"}`}
                style={{ fontFamily: "Cairo, sans-serif" }}>
                {res ? "🎉 أحسنت! الترتيب صحيح" : "❌ حاول مرة أخرى"}
                {res && ayahIdx < ayahs.length - 1 && <button onClick={nextAyah} className="block mx-auto mt-2 text-sm underline text-green-600">الآية التالية →</button>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </GameWrapper>
  );
}

// ─── MISSING WORD GAME ────────────────────────────────────
interface MissingWordGameProps {
  onWin: () => void;
}

function MissingWordGame({ onWin }: MissingWordGameProps) {
  const [surahId, setSurahId] = useState<number>(1);
  const { ayahs, loading, error } = useSurahAyahs(surahId);
  const [question, setQuestion] = useState<Question | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [res, setRes] = useState<boolean | null>(null);
  const [count, setCount] = useState<number>(0);

  const generateQuestion = useCallback((ayahList: Ayah[]) => {
    if (!ayahList || ayahList.length === 0) return;
    const ayah = ayahList[Math.floor(Math.random() * ayahList.length)];
    const words = ayah.text.split(" ").filter(w => w.length > 2);
    if (words.length === 0) return;
    const correctWord = words[Math.floor(Math.random() * words.length)];
    const allWords = ayahList.flatMap(a => a.text.split(" ").filter(w => w.length > 2 && w !== correctWord));
    const wrongOptions = shuffleArr([...new Set(allWords)]).slice(0, 3);
    setQuestion({ ayahText: ayah.text, ayahNum: ayah.numberInSurah, correctWord, options: shuffleArr([correctWord, ...wrongOptions]) });
    setSel(null); 
    setRes(null);
  }, []);

  useEffect(() => { 
    if (ayahs.length > 0) generateQuestion(ayahs); 
  }, [ayahs, surahId, generateQuestion]);

  const choose = (w: string): void => {
    if (sel || !question) return; 
    setSel(w);
    const ok = w === question.correctWord; 
    setRes(ok);
    if (ok) { 
      setCount(c => c + 1); 
      setTimeout(onWin, 1400); 
    }
  };

  return (
    <GameWrapper surahId={surahId} onSurahChange={id => { setSurahId(id); setQuestion(null); }} loading={loading} error={error}>
      {question && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#E8DDD0", color: "#7A5C48", fontFamily: "Cairo, sans-serif" }}>الآية {question.ayahNum} • {count} إجابة صحيحة</span>
            <button onClick={() => generateQuestion(ayahs)} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-muted" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}><Shuffle size={14} /> سؤال جديد</button>
          </div>
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 text-center">
            <p className="text-2xl leading-loose" style={{ fontFamily: "Noto Naskh Arabic, serif", color: "#2C1810" }}>
              {question.ayahText.split(question.correctWord).map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <span className={`inline-block px-3 py-0.5 mx-1 rounded-lg border-2 border-dashed font-bold min-w-16 text-center ${res === true ? "border-green-400 bg-green-100 text-green-700" : res === false ? "border-red-400 bg-red-100 text-red-700" : "border-amber-400 bg-amber-50 text-amber-700"}`}>{sel ?? "؟؟؟"}</span>}</span>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((o, i) => {
              let cls = "border-border bg-white hover:border-amber-400 hover:bg-amber-50";
              if (sel) { if (o === question.correctWord) cls = "border-green-400 bg-green-100 text-green-800"; else if (o === sel) cls = "border-red-400 bg-red-100 text-red-800"; else cls = "border-border bg-white opacity-50"; }
              return <motion.button key={i} whileHover={{ scale: sel ? 1 : 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => !sel && choose(o)} disabled={!!sel} className={`py-4 px-3 rounded-xl border-2 text-lg font-medium transition-all ${cls}`} style={{ fontFamily: "Noto Naskh Arabic, serif" }}>{o}</motion.button>;
            })}
          </div>
          <AnimatePresence>
            {res !== null && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl p-4 text-center font-semibold ${res ? "bg-green-100 border border-green-300 text-green-700" : "bg-red-100 border border-red-300 text-red-700"}`} style={{ fontFamily: "Cairo, sans-serif" }}>{res ? "🎉 ممتاز!" : `الكلمة الصحيحة: ${question.correctWord}`}</motion.div>}
          </AnimatePresence>
          <button onClick={() => generateQuestion(ayahs)} className="w-full py-2.5 rounded-xl border border-border hover:bg-muted text-sm flex items-center justify-center gap-2" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}><Shuffle size={15} /> سؤال جديد من نفس السورة</button>
        </div>
      )}
    </GameWrapper>
  );
}

// ─── MATCHING GAME ────────────────────────────────────────
interface MatchingGameProps {
  onWin: () => void;
}

function MatchingGame({ onWin }: MatchingGameProps) {
  const [surahId, setSurahId] = useState<number>(1);
  const { ayahs, loading, error } = useSurahAyahs(surahId);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);
  const [shuf, setShuf] = useState<number[]>([]);

  const generatePairs = useCallback((ayahList: Ayah[]) => {
    if (!ayahList || ayahList.length < 3) return;
    const chosen = shuffleArr(ayahList).slice(0, Math.min(6, ayahList.length));
    const newPairs: Pair[] = chosen.map(a => {
      const words = a.text.split(" "); 
      const mid = Math.max(1, Math.floor(words.length / 2));
      return { a: words.slice(0, mid).join(" "), b: words.slice(mid).join(" "), ayahNum: a.numberInSurah };
    }).filter(p => p.a && p.b);
    setPairs(newPairs); 
    setShuf(shuffleArr(newPairs.map((_, i) => i))); 
    setSel(null); 
    setMatched(new Set()); 
    setWrong(null);
  }, []);

  useEffect(() => { 
    if (ayahs.length >= 3) generatePairs(ayahs); 
  }, [ayahs, surahId, generatePairs]);

  const clickA = (i: number): void => { 
    if (matched.has(i)) return; 
    setSel(i === sel ? null : i); 
    setWrong(null); 
  };
  const clickB = (ei: number): void => {
    if (sel === null) return; 
    const orig = shuf[ei];
    if (orig === sel) { 
      const nm = new Set(matched); 
      nm.add(sel); 
      setMatched(nm); 
      setSel(null); 
      if (nm.size === pairs.length) setTimeout(onWin, 800); 
    } else { 
      setWrong(ei); 
      setTimeout(() => { 
        setWrong(null); 
        setSel(null); 
      }, 700); 
    }
  };

  return (
    <GameWrapper surahId={surahId} onSurahChange={id => { setSurahId(id); setPairs([]); }} loading={loading} error={error}>
      {pairs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "Cairo, sans-serif" }}>طابق بداية الآية بنهايتها — {matched.size}/{pairs.length}</p>
            <button onClick={() => generatePairs(ayahs)} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-muted" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}><Shuffle size={14} /> تبديل</button>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: "#6d32a3" }} animate={{ width: `${(matched.size / pairs.length) * 100}%` }} transition={{ type: "spring" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-xs text-center text-muted-foreground mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>بداية الآية</p>
              {pairs.map((p, i) => <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={() => clickA(i)} className={`w-full p-3 rounded-xl border-2 text-sm text-right transition-all leading-relaxed ${matched.has(i) ? "border-green-400 bg-green-100 opacity-60 cursor-default" : sel === i ? "border-amber-400 bg-amber-50 shadow-sm" : "border-border bg-white hover:border-emerald-300"}`} style={{ fontFamily: "Noto Naskh Arabic, serif", color: matched.has(i) ? "#166534" : "#2C1810" }}>{p.a}...</motion.button>)}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-center text-muted-foreground mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>تكملة الآية</p>
              {shuf.map((orig, i) => { const isM = matched.has(orig); return <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={() => !isM && clickB(i)} className={`w-full p-3 rounded-xl border-2 text-sm text-right transition-all leading-relaxed ${isM ? "border-green-400 bg-green-100 opacity-60 cursor-default" : wrong === i ? "border-red-400 bg-red-100" : sel !== null ? "border-emerald-300 bg-emerald-50 cursor-pointer" : "border-border bg-white opacity-60"}`} style={{ fontFamily: "Noto Naskh Arabic, serif", color: isM ? "#166534" : "#2C1810" }}>...{pairs[orig].b}</motion.button>; })}
            </div>
          </div>
          {matched.size === pairs.length && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-100 border border-green-300 rounded-xl p-4 text-center text-green-700 font-semibold" style={{ fontFamily: "Cairo, sans-serif" }}>🏆 طابقت جميع الآيات! أحسنت يا بطل</motion.div>}
        </div>
      )}
      {!loading && !error && surahId && ayahs.length > 0 && ayahs.length < 3 && <div className="text-center py-8" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>هذه السورة قصيرة جداً للمطابقة، جرب سورة أخرى</div>}
    </GameWrapper>
  );
}

// ─── MEMORY GAME ──────────────────────────────────────────
interface MemoryGameProps {
  onWin: () => void;
}

function MemoryGame({ onWin }: MemoryGameProps) {
  const [surahId, setSurahId] = useState<number>(1);
  const { ayahs, loading, error } = useSurahAyahs(surahId);
  const [cards, setCards] = useState<Card[]>([]);
  const [sel, setSel] = useState<number[]>([]);
  const [locked, setLocked] = useState<boolean>(false);

  const generateCards = useCallback((ayahList: Ayah[]) => {
    if (!ayahList || ayahList.length === 0) return;
    const chosen = shuffleArr(ayahList).slice(0, Math.min(6, ayahList.length));
    const texts = chosen.map(a => a.text.split(" ").slice(0, 5).join(" "));
    setCards(shuffleArr([...texts, ...texts].map((text, i) => ({ id: i, text, flipped: false, matched: false })))); 
    setSel([]); 
    setLocked(false);
  }, []);

  useEffect(() => { 
    if (ayahs.length > 0) generateCards(ayahs); 
  }, [ayahs, surahId, generateCards]);

  const flip = (id: number): void => {
    if (locked || sel.length >= 2) return;
    const card = cards.find(c => c.id === id); 
    if (!card || card.flipped || card.matched) return;
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c); 
    setCards(newCards);
    const newSel = [...sel, id]; 
    setSel(newSel);
    if (newSel.length === 2) {
      const [a, b] = newSel.map(x => newCards.find(c => c.id === x));
      if (!a || !b) return;
      setLocked(true);
      setTimeout(() => {
        if (a.text === b.text) {
          setCards(prev => { 
            const u = prev.map(c => c.id === a.id || c.id === b.id ? { ...c, matched: true } : c); 
            if (u.every(c => c.matched)) setTimeout(onWin, 500); 
            return u; 
          });
        } else {
          setCards(prev => prev.map(c => c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c));
        }
        setSel([]); 
        setLocked(false);
      }, 900);
    }
  };

  const matchedCount = cards.filter(c => c.matched).length / 2;
  const totalPairs = cards.length / 2;

  return (
    <GameWrapper surahId={surahId} onSurahChange={id => { setSurahId(id); setCards([]); }} loading={loading} error={error}>
      {cards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ fontFamily: "Cairo, sans-serif", color: "#6d32a3" }}>{matchedCount}/{totalPairs} أزواج ✓</p>
            <button onClick={() => generateCards(ayahs)} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-muted" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}><RotateCcw size={14} /> لعبة جديدة</button>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: "#D4A843" }} animate={{ width: `${(matchedCount / totalPairs) * 100}%` }} transition={{ type: "spring" }} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {cards.map(card => (
              <motion.button key={card.id} whileHover={{ scale: card.matched || card.flipped ? 1 : 1.05 }} whileTap={{ scale: 0.92 }} onClick={() => flip(card.id)}
                className={`aspect-square rounded-2xl border-2 flex items-center justify-center p-2 transition-all text-center ${card.matched ? "border-green-400 bg-green-50 cursor-default" : card.flipped ? "border-amber-400 bg-amber-50" : "border-border bg-white hover:border-emerald-300 cursor-pointer"}`}>
                {card.flipped || card.matched ? <span className="leading-tight" style={{ fontFamily: "Noto Naskh Arabic, serif", fontSize: "0.6rem", color: card.matched ? "#166534" : "#2C1810" }}>{card.text}</span>
                  : <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6d32a3,#2d7a63)" }}><Star size={15} className="text-amber-400" /></div>}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </GameWrapper>
  );
}

// ─── LISTENING GAME ───────────────────────────────────────
interface ListeningGameProps {
  onWin: () => void;
}

function ListeningGame({ onWin }: ListeningGameProps) {
  const [surahId, setSurahId] = useState<number>(1);
  const { ayahs, loading, error } = useSurahAyahs(surahId);
  const [question, setQuestion] = useState<ListeningQuestion | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [res, setRes] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateQuestion = useCallback((ayahList: Ayah[]) => {
    if (!ayahList || ayahList.length < 2) return;
    const correct = ayahList[Math.floor(Math.random() * ayahList.length)];
    const wrong = shuffleArr(ayahList.filter(a => a.numberInSurah !== correct.numberInSurah)).slice(0, 3);
    if (wrong.length < 1) return;
    setQuestion({ correct, options: shuffleArr([correct, ...wrong]) });
    setSel(null); 
    setRes(null); 
    setPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  }, []);

  useEffect(() => { 
    if (ayahs.length >= 2) generateQuestion(ayahs); 
  }, [ayahs, surahId, generateQuestion]);

  const play = (): void => {
    if (!audioRef.current || !question) return;
    setPlaying(true);
    audioRef.current.src = getAudioUrl(surahId, question.correct.numberInSurah);
    audioRef.current.play().catch(() => setPlaying(false));
  };

  const choose = (ayah: Ayah): void => {
    if (sel || !question) return; 
    setSel(ayah.numberInSurah);
    const ok = ayah.numberInSurah === question.correct.numberInSurah; 
    setRes(ok);
    if (ok) { 
      setScore(s => s + 1); 
      setTimeout(onWin, 1400); 
    }
  };

  return (
    <GameWrapper surahId={surahId} onSurahChange={id => { setSurahId(id); setQuestion(null); }} loading={loading} error={error}>
      {question && (
        <div className="space-y-4" dir="rtl">
          <audio ref={audioRef} onEnded={() => setPlaying(false)} />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ fontFamily: "Cairo, sans-serif", color: "#6d32a3" }}>⭐ {score} إجابة صحيحة</span>
            <button onClick={() => generateQuestion(ayahs)} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-muted" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}><Shuffle size={14} /> سؤال آخر</button>
          </div>
          <div className="flex flex-col items-center gap-3 py-4">
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={play}
              className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-2xl gap-2 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#6d32a3,#2d7a63)" }}>
              <IslamicPattern opacity={0.1} />
              <motion.div animate={playing ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }}><Volume2 size={36} className="relative z-10" /></motion.div>
              <span className="text-sm relative z-10" style={{ fontFamily: "Cairo, sans-serif" }}>{playing ? "يُشغَّل..." : "استمع"}</span>
            </motion.button>
            <p className="text-sm text-center" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>اضغط واستمع للآية ثم اخترها من الأسفل</p>
          </div>
          <div className="space-y-2">
            {question.options.map((opt, i) => {
              let cls = "border-border bg-white hover:border-amber-300 hover:bg-amber-50";
              if (sel) { 
                if (opt.numberInSurah === question.correct.numberInSurah) cls = "border-green-400 bg-green-50"; 
                else if (opt.numberInSurah === sel) cls = "border-red-400 bg-red-50 opacity-70"; 
                else cls = "border-border bg-white opacity-40"; 
              }
              return (
                <motion.button key={i} whileHover={{ scale: sel ? 1 : 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => !sel && choose(opt)} disabled={!!sel}
                  className={`w-full py-3 px-4 rounded-xl border-2 text-right transition-all flex items-center gap-3 ${cls}`}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#E8DDD0", color: "#7A5C48", fontFamily: "Cairo, sans-serif" }}>{i + 1}</span>
                  <span className="flex-1 leading-relaxed" style={{ fontFamily: "Noto Naskh Arabic, serif", color: "#2C1810", fontSize: "0.95rem" }}>{opt.text}</span>
                  {sel && opt.numberInSurah === question.correct.numberInSurah && <Check size={16} className="text-green-600 flex-shrink-0" />}
                  {sel && opt.numberInSurah === sel && opt.numberInSurah !== question.correct.numberInSurah && <X size={16} className="text-red-500 flex-shrink-0" />}
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {res !== null && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl p-4 text-center font-semibold ${res ? "bg-green-100 border border-green-300 text-green-700" : "bg-red-100 border border-red-300 text-red-700"}`} style={{ fontFamily: "Cairo, sans-serif" }}>{res ? "🎉 أحسنت! الإجابة صحيحة" : `❌ الآية الصحيحة: ${question.correct.text.split(" ").slice(0, 4).join(" ")}...`}</motion.div>}
          </AnimatePresence>
        </div>
      )}
      {!loading && !error && surahId && ayahs.length > 0 && ayahs.length < 2 && <div className="text-center py-8" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>هذه السورة تحتاج آيتين على الأقل للعبة الاستماع</div>}
    </GameWrapper>
  );
}

// ─── GAME LIST ────────────────────────────────────────────
const GAME_LIST: Game[] = [
  { id: "wheel",        title: "عجلة السور",      icon: "🎡", bg: "linear-gradient(135deg,#EDE9FE,#DDD6FE)", badge: "جديد",   desc: "دوّر العجلة لاختيار سورة عشوائية", fg: "#5B21B6" },
  { id: "word-order",   title: "ترتيب الكلمات",  icon: "🔤", bg: "linear-gradient(135deg,#D1FAE5,#A7F3D0)", badge: "مبتدئ",  desc: "رتّب كلمات الآية بالترتيب الصحيح", fg: "#065F46" },
  { id: "missing-word", title: "الكلمة المفقودة", icon: "❓", bg: "linear-gradient(135deg,#FDE68A,#FCD34D)", badge: "متوسط", desc: "أكمل الكلمة الناقصة في الآية", fg: "#92400E" },
  { id: "matching",     title: "مطابقة الآيات",  icon: "🔗", bg: "linear-gradient(135deg,#FBCFE8,#F9A8D4)", badge: "متوسط", desc: "طابق بداية الآية بنهايتها", fg: "#9D174D" },
  { id: "memory",       title: "بطاقات الذاكرة", icon: "🃏", bg: "linear-gradient(135deg,#BFDBFE,#93C5FD)", badge: "متقدم", desc: "اعثر على أزواج الآيات المتشابهة", fg: "#1E40AF" },
  { id: "listening",    title: "الاستماع",        icon: "🎧", bg: "linear-gradient(135deg,#FECACA,#FCA5A5)", badge: "متقدم", desc: "استمع للآية واخترها من القائمة", fg: "#991B1B" },
];

// ─── VIDEO HEADER ──────────────────────────────────────────
interface VideoHeaderProps {
  videoSrc: string;
}

function VideoHeader({ videoSrc }: VideoHeaderProps) {
  return (
    <div className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-2xl mb-8">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
        style={{ filter: "brightness(0.6)" }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay with gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ fontFamily: "Cairo, serif" }}>
            ألعاب التحفيظ
          </h1>
          <p className="text-lg md:text-xl opacity-90" style={{ fontFamily: "Cairo, sans-serif" }}>
            تعلم القرآن الكريم بطريقة ممتعة وتفاعلية
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              📖 6 ألعاب
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              🌟 متعة التعلم
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}

// ─── HUB ─────────────────────────────────────────────────
export default function Games() {
  const [game, setGame] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [cheer, setCheer] = useState<string>("");
  const [totalWins, setTotalWins] = useState<number>(0);

  // Replace with your actual video URL
  const videoSrc = "/src/Assets/video/hero-teacher-kid.mp4";

  const win = (): void => {
    setScore(s => s + 10); 
    setTotalWins(t => t + 1);
    const msg = randomCheer(); 
    setCheer(msg);
    setTimeout(() => setCheer(""), 2800);
  };

  const currentGame = GAME_LIST.find(g => g.id === game);

  return (
    <div className="p-5 lg:p-8 min-h-full" dir="rtl" style={{ background: "#F8F5F0" }}>
      {cheer && <Confetti message={cheer} />}

      {/* Video Header */}
      <VideoHeader videoSrc={videoSrc} />

      <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
        <div>
          {game && <p className="text-sm mt-0.5" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>{currentGame?.title}</p>}
        </div>
        <div className="flex items-center gap-3">
          {totalWins > 0 && <span className="text-xs px-3 py-1 rounded-full" style={{ background: "#DCFCE7", color: "#166534", fontFamily: "Cairo, sans-serif" }}>{totalWins} ✓</span>}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm" style={{ background: "#FEF9C3", borderColor: "#FDE047" }}>
            <Star size={16} className="text-amber-500" />
            <span className="font-bold text-amber-700" style={{ fontFamily: "Cairo, sans-serif" }}>{score}</span>
          </div>
        </div>
      </div>

      {!game ? (
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-center mb-5" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>اختر لعبة — ستختار السورة داخل كل لعبة لتوليد أسئلة مخصصة</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GAME_LIST.map(g => (
              <motion.button 
                key={g.id} 
                whileHover={{ scale: 1.04, y: -5 }} 
                whileTap={{ scale: 0.96 }} 
                onClick={() => setGame(g.id)}
                className="relative overflow-hidden rounded-3xl p-6 flex flex-col gap-2 border-4 border-white cursor-pointer shadow-md text-right"
                style={{ background: g.bg, color: g.fg }}
              >
                <span className="text-3xl">{g.icon}</span>
                <div className="relative z-10">
                  <div className="font-bold text-base mb-0.5" style={{ fontFamily: "Cairo, serif" }}>{g.title}</div>
                  <p className="text-xs opacity-80 leading-snug mb-2" style={{ fontFamily: "Cairo, sans-serif" }}>{g.desc}</p>
                  <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full" style={{ fontFamily: "Cairo, sans-serif" }}>{g.badge}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setGame(null)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white border border-transparent hover:border-border text-sm mb-5 transition-all"
            style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>
            ← العودة لقائمة الألعاب
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: currentGame?.bg?.split(',')[0] || '#6d32a3' }}>{currentGame?.icon}</div>
            <div>
              <h3 className="font-bold" style={{ fontFamily: "Cairo, serif", color: "#6d32a3" }}>{currentGame?.title}</h3>
              <p className="text-xs" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>{currentGame?.desc}</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            {game === "wheel"        && <SpinningWheel />}
            {game === "word-order"   && <WordOrderGame onWin={win} />}
            {game === "missing-word" && <MissingWordGame onWin={win} />}
            {game === "matching"     && <MatchingGame onWin={win} />}
            {game === "memory"       && <MemoryGame onWin={win} />}
            {game === "listening"    && <ListeningGame onWin={win} />}
          </div>
        </div>
      )}
    </div>
  );
}