// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine, Eraser, Square, Circle, Minus, Type,
  Undo2, Redo2, Trash2, Download, ImagePlus, Video,
  BookMarked, Play, Pause, RotateCcw, Plus, X,
  Play as Youtube, ZoomIn, ZoomOut, Image as ImageIcon, Layers,
  MousePointer, ArrowRight, Star, Maximize2, Minimize2, Hand
} from "lucide-react";
import { SURAHS, WB_COLORS, WB_EMOJIS } from "../../lib/constants";
import type { TextEl, StampEl, VideoOverlay, WBTool, ImageOverlay } from "../../lib/types";
import { playSound } from "../../lib/sounds";
import IslamicPattern from "../components/IslamicPattern";
import { BalloonCelebrationOverlay, StarCelebrationOverlay, AlarmEffect, Curtain } from "../components/WBEffects";

// Character images
import kidClap from "../../Assets/images/kid-clap.png";
import kidCheer from "../../Assets/images/kid-cheer.png";
import kidPoint from "../../Assets/images/kid-point.png";
import kidPaint from "../../Assets/images/kid-paint.png";

/* ─── Local clapping sound (independent of ../../lib/sounds) ─── */
function playClapSound() {
  try {
    // Create an AudioContext
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    
    // Load the MP3 file from the public folder
    // Assuming your file is at: public/clap.mp3
    fetch('../../../public/sounds/clapping.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => ac.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        // Create a source and play it
        const source = ac.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ac.destination);
        source.start(0);
      })
      .catch(error => {
        console.error('Failed to load clap sound:', error);
        // Fallback to generated sound if file fails to load
        generateFallbackClap(ac);
      });
  } catch (error) {
    console.error('Error playing clap sound:', error);
  }
}

// Fallback function in case the file fails to load
function generateFallbackClap(ac) {
  try {
    const total = 12;
    for (let i = 0; i < total; i++) {
      const t = ac.currentTime + i * 0.13 + Math.random() * 0.02;
      const bufferSize = Math.floor(ac.sampleRate * 0.08);
      const noiseBuf = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize);
      const src = ac.createBufferSource(); src.buffer = noiseBuf;
      const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1500 + Math.random() * 800; bp.Q.value = 0.9;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.6, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      src.connect(bp); bp.connect(g); g.connect(ac.destination);
      src.start(t); src.stop(t + 0.1);
    }
    setTimeout(() => ac.close().catch(() => {}), 3000);
  } catch (_) {}
}

/* ─── Fullscreen clapping celebration: character in center + balloons filling the screen ─── */
function ClapCelebrationOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  // Balloons spread across whole viewport (not just bottom)
  const balloons = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    startY: 100 + Math.random() * 40,
    endY: -20 - Math.random() * 30,
    delay: Math.random() * 1.2,
    duration: 3 + Math.random() * 1.8,
    color: ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F97316", "#14B8A6"][i % 8],
    size: 40 + Math.random() * 40,
  }));

  const characters = [kidClap, kidCheer, kidClap];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">

      {/* Balloons filling the entire screen */}
      {balloons.map(b => (
        <motion.div
          key={b.id}
          initial={{ top: `${b.startY}%`, opacity: 0, rotate: -8 }}
          animate={{ top: `${b.endY}%`, opacity: [0, 1, 1, 0.8], rotate: [ -8, 8, -8 ] }}
          transition={{ duration: b.duration, delay: b.delay, ease: "easeOut", rotate: { repeat: Infinity, duration: 2 } }}
          style={{ left: `${b.left}%`, position: "absolute" }}>
          <div style={{
            width: b.size, height: b.size * 1.2,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), ${b.color} 70%)`,
            borderRadius: "50%",
            boxShadow: `0 6px 20px ${b.color}55`,
          }}/>
          <div style={{
            width: 2, height: b.size * 0.9,
            background: "#666", margin: "0 auto",
          }}/>
        </motion.div>
      ))}

      {/* Center clapping character */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 40 }}
        animate={{ scale: [0, 1.15, 1], opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src={kidClap}
          alt="Clapping"
          animate={{ rotate: [-6, 6, -6], scale: [1, 1.08, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "min(340px, 45vw)",
            height: "auto",
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
          }}/>
      </motion.div>

      {/* Side cheering characters */}
      <motion.img
        src={kidCheer}
        alt=""
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, -20, 0] }}
        transition={{ duration: 0.6, y: { repeat: Infinity, duration: 0.7 } }}
        className="absolute bottom-10 left-10"
        style={{ width: "min(200px, 25vw)", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }}/>

      <motion.img
        src={kidCheer}
        alt=""
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, -20, 0] }}
        transition={{ duration: 0.6, delay: 0.15, y: { repeat: Infinity, duration: 0.7, delay: 0.35 } }}
        className="absolute bottom-10 right-10"
        style={{ width: "min(200px, 25vw)", transform: "scaleX(-1)", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }}/>

      {/* "أحسنت!" caption */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-16 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-2xl"
        style={{ fontFamily: "Cairo,sans-serif" }}>
        <span className="text-3xl font-black text-emerald-900">أحسنت</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── YouTube Modal ─── */
function YouTubeModal({ isOpen, onClose, onAdd }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([\w-]+)/,
      /(?:youtu\.be\/)([\w-]+)/,
      /(?:youtube\.com\/embed\/)([\w-]+)/
    ];
    for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
    return null;
  };

  const handleSubmit = () => {
    const id = extractVideoId(url);
    if (!id) { setError("رابط يوتيوب غير صحيح"); return; }
    onAdd(`https://www.youtube.com/embed/${id}`);
    setUrl(""); setError(""); onClose();
  };

  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale:0.9,y:20 }} animate={{ scale:1,y:0 }} exit={{ scale:0.9,y:20 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ fontFamily:"Cairo,sans-serif", color:"#1B4D3E" }}>
            <Youtube className="inline-block text-red-600 ml-2" size={20}/>إضافة فيديو يوتيوب
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
        </div>
        <div className="space-y-3">
          <input type="text" value={url} onChange={e=>{ setUrl(e.target.value); setError(""); }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 text-right"
            style={{ fontFamily:"Cairo,sans-serif" }} dir="ltr"/>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
              style={{ fontFamily:"Cairo,sans-serif" }}>إضافة</button>
            <button onClick={onClose} className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
              style={{ fontFamily:"Cairo,sans-serif" }}>إلغاء</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Resize Handle ─── */
function ResizeHandle({ onResize, isMobile }) {
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef({ x:0, y:0 });

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      onResize(clientX - startPos.current.x, clientY - startPos.current.y);
      startPos.current = { x:clientX, y:clientY };
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isResizing, onResize]);

  const size = isMobile ? 40 : 28;

  return (
    <div
      className="absolute bottom-0 right-0 cursor-se-resize bg-emerald-500 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
      style={{ width: size, height: size, opacity: isMobile ? 0.8 : undefined }}
      onMouseDown={e => { e.stopPropagation(); setIsResizing(true); startPos.current = { x:e.clientX, y:e.clientY }; }}
      onTouchStart={e => { e.stopPropagation(); setIsResizing(true); const t = e.touches[0]; startPos.current = { x:t.clientX, y:t.clientY }; }}>
      <div className="border-r-2 border-b-2 border-white" style={{ width: size*0.4, height: size*0.4 }}/>
    </div>
  );
}

/* ─── Zoom Controls ─── */
function ZoomControls({ onZoomIn, onZoomOut, onReset, zoomLevel, isMobile }) {
  return (
    <div className={`absolute ${isMobile ? 'bottom-20 left-3' : 'bottom-24 left-3'} bg-white/95 backdrop-blur rounded-xl shadow-lg p-1.5 flex flex-col gap-1 z-20 border border-gray-200`}>
      <button onClick={onZoomIn} className={`${isMobile ? 'p-2.5' : 'p-1.5'} rounded-lg hover:bg-gray-100 transition-colors`} title="تكبير"><ZoomIn size={isMobile ? 22 : 18}/></button>
      <button onClick={onReset} className={`${isMobile ? 'px-2 py-1.5' : 'px-1.5 py-1'} rounded-lg hover:bg-gray-100 transition-colors text-xs font-mono text-center font-bold`} title="إعادة تعيين" style={{ color:"#1B4D3E" }}>{Math.round(zoomLevel*100)}%</button>
      <button onClick={onZoomOut} className={`${isMobile ? 'p-2.5' : 'p-1.5'} rounded-lg hover:bg-gray-100 transition-colors`} title="تصغير"><ZoomOut size={isMobile ? 22 : 18}/></button>
    </div>
  );
}

/* ─── BG Picker with image upload ─── */
function BgPicker({ bgColor, bgImage, onChange, onImageBg, onClearImageBg, imgBgRef }) {
  const BG_COLORS = ["#FDFAF4","#FFFFFF","#1B4D3E","#1e293b","#FEF9C3","#DBEAFE","#DCFCE7","#FCE7F3","#F5F0E8","#EEF2FF","#111827","#7f1d1d"];
  return (
    <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-gray-200 rounded-xl shadow-xl z-30 w-56" dir="rtl">
      <p className="text-xs font-bold text-gray-500 mb-2" style={{ fontFamily:"Cairo,sans-serif" }}>لون الخلفية</p>
      <div className="grid grid-cols-6 gap-1 mb-3">
        {BG_COLORS.map(c => (
          <button key={c} onClick={() => onChange(c)}
            className={`w-7 h-7 rounded-lg border-2 hover:scale-110 transition-transform ${bgColor===c && !bgImage ? "border-emerald-600 scale-110" : "border-transparent"}`}
            style={{ background:c, boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.1)" }}/>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-bold text-gray-500 mb-2" style={{ fontFamily:"Cairo,sans-serif" }}>صورة كخلفية</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => imgBgRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white"
            style={{ background:"#1B4D3E", fontFamily:"Cairo,sans-serif" }}>
            <ImageIcon size={14}/> رفع صورة خلفية
          </button>
          {bgImage && (
            <button onClick={onClearImageBg}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-red-300 text-red-600 hover:bg-red-50"
              style={{ fontFamily:"Cairo,sans-serif" }}>
              <X size={12}/> إزالة صورة الخلفية
            </button>
          )}
          {bgImage && <img src={bgImage} className="w-full h-16 object-cover rounded-lg border border-gray-200" alt="خلفية"/>}
        </div>
      </div>
    </div>
  );
}

/* ─── Fullscreen Image Modal for Mobile ─── */
function FullscreenImageModal({ image, onClose, isMobile }) {
  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale:0.8 }}
        animate={{ scale:1 }}
        exit={{ scale:0.8 }}
        className="relative max-w-full max-h-full"
        onClick={e => e.stopPropagation()}>
        <img
          src={image.src}
          alt="Fullscreen"
          className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          style={{ transform: image.flipH ? "scaleX(-1)" : "none" }}/>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
          <X size={24} className="text-gray-800"/>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════ WHITEBOARD ════════════════ */
export default function Whiteboard() {
  const mainRef       = useRef(null);
  const containerRef  = useRef(null);
  const imgInputRef   = useRef(null);
  const videoInputRef = useRef(null);
  const imgBgRef      = useRef(null);

  /* zoom / pan */
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x:0, y:0 });

  /* overlays */
  const [imageEls,       setImageEls]       = useState([]);
  const [selectedImageId,setSelectedImageId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  /* drawing state */
  const [tool,          setTool]          = useState("pen");
  const [color,         setColor]         = useState("#000000");
  const [strokeWidth,   setStrokeWidth]   = useState(4);
  const [opacity,       setOpacity]       = useState(100);
  const [bgColor,       setBgColor]       = useState("#FDFAF4");
  const [bgImage,       setBgImage]       = useState(null);
  const [bgImageOpacity,setBgImageOpacity] = useState(80);
  const [selectedEmoji, setSelectedEmoji] = useState("⭐");
  const [showEmojiPicker,setShowEmojiPicker] = useState(false);
  const [showBgPicker,  setShowBgPicker]  = useState(false);
  const [showYouTubeModal,setShowYouTubeModal] = useState(false);

  const [textEls,       setTextEls]       = useState([]);
  const [stamps,        setStamps]         = useState([]);
  const [videoEl,       setVideoEl]       = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [newTextPos,    setNewTextPos]    = useState(null);
  const [newTextVal,    setNewTextVal]    = useState("");

  const [dragEl, setDragEl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  /* effects */
  const [showBalloons, setShowBalloons] = useState(false);
  const [showClap,     setShowClap]     = useState(false);
  const [showAlarm,    setShowAlarm]    = useState(false);
  const [curtainVisible, setCurtainVisible] = useState(false);

  /* ayah panel */
  const [showAyahPanel, setShowAyahPanel] = useState(false);
  const [panelSurahId,  setPanelSurahId]  = useState(1);
  const [panelAyahs,    setPanelAyahs]    = useState([]);
  const [panelLoading,  setPanelLoading]  = useState(false);

  /* timer */
  const [timerMins,    setTimerMins]    = useState(5);
  const [timeLeft,     setTimeLeft]     = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [editTimer,    setEditTimer]    = useState(false);

  /* canvas internals */
  const drawing  = useRef(false);
  const startPt  = useRef(null);
  const lastPt   = useRef(null);
  const snap     = useRef(null);
  const history  = useRef([]);
  const histIdx  = useRef(-1);

  /* ── mobile detect ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── mobile panels ── */
  const [mobilePanelOpen, setMobilePanelOpen] = useState(null);

  /* ── notebook background drawing ── */
  const drawNotebookBg = (ctx, w, h) => {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#E8E0D8"; ctx.lineWidth = 1;
    for (let y = 32; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(20,y); ctx.lineTo(w-20,y); ctx.stroke(); }
    ctx.strokeStyle = "#FF6B6B"; ctx.lineWidth = 0.8; ctx.setLineDash([4,6]);
    ctx.beginPath(); ctx.moveTo(70,0); ctx.lineTo(70,h); ctx.stroke(); ctx.setLineDash([]);
  };

  const applyCanvasBg = useCallback(() => {
    const c = mainRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    if (bgColor === "#FDFAF4" || bgColor === "#FFFFFF") drawNotebookBg(ctx, c.width, c.height);
    else { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, c.width, c.height); }
  }, [bgColor]);

  /* ── init canvas ── */
  useEffect(() => {
    const c = mainRef.current; if (!c) return;
    c.width = 1400; c.height = 900;
    drawNotebookBg(c.getContext("2d"), 1400, 900);
    saveHist();
  }, []);

  useEffect(() => { applyCanvasBg(); }, [bgColor, applyCanvasBg]);

  /* ── timer ── */
  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { setTimerRunning(false); return 0; } return p-1; }), 1000);
    return () => clearInterval(t);
  }, [timerRunning, timeLeft]);

  /* ── ayah panel ── */
 useEffect(() => {
  if (!showAyahPanel) return;

  const fetchPanelSurah = async () => {
    setPanelLoading(true);
    setPanelAyahs([]);

    try {
      let allVerses: any[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const res = await fetch(
          `https://api.quran.com/api/v4/verses/by_chapter/${panelSurahId}?language=ar&words=false&fields=text_uthmani&per_page=50&page=${page}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        allVerses.push(...(data.verses ?? []));

        totalPages = data.pagination?.total_pages ?? 1;
        page++;
      } while (page <= totalPages);

      const mapped = allVerses.map((verse: any) => ({
        number: verse.id,
        numberInSurah: verse.verse_number,
        text: verse.text_uthmani,
      }));

      setPanelAyahs(mapped);
    } catch (err) {
      console.error("Failed to load panel surah:", err);
      setPanelAyahs([]);
    } finally {
      setPanelLoading(false);
    }
  };

  fetchPanelSurah();
}, [panelSurahId, showAyahPanel]);
  /* ── element dragging ── */
  useEffect(() => {
    if (!dragEl) return;
    const handleMove = (e) => {
      const c = mainRef.current; if (!c) return;
      const r = c.getBoundingClientRect();
      const sx = c.width / r.width, sy = c.height / r.height;
      let cx, cy;
      if ("touches" in e) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; e.preventDefault(); }
      else { cx = e.clientX; cy = e.clientY; }
      const nx = dragEl.ex + (cx - dragEl.mx) * sx / zoomLevel;
      const ny = dragEl.ey + (cy - dragEl.my) * sy / zoomLevel;
      if      (dragEl.type === "text")  setTextEls(p  => p.map(t   => t.id   === dragEl.id ? {...t,   x:nx, y:ny} : t));
      else if (dragEl.type === "stamp") setStamps(p   => p.map(s   => s.id   === dragEl.id ? {...s,   x:nx, y:ny} : s));
      else if (dragEl.type === "video") setVideoEl(p  => p ? {...p, x:nx, y:ny} : null);
      else if (dragEl.type === "image") setImageEls(p => p.map(img => img.id === dragEl.id ? {...img, x:nx, y:ny} : img));
    };
    const handleUp = () => setDragEl(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive:false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragEl, zoomLevel]);

  /* ── history ── */
  const saveHist = () => {
    const c = mainRef.current; if (!c) return;
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height);
    history.current = history.current.slice(0, histIdx.current + 1);
    history.current.push(d);
    if (history.current.length > 30) history.current.shift(); else histIdx.current++;
  };
  const undo = () => { if (histIdx.current <= 0) return; histIdx.current--; mainRef.current.getContext("2d").putImageData(history.current[histIdx.current], 0, 0); };
  const redo = () => { if (histIdx.current >= history.current.length-1) return; histIdx.current++; mainRef.current.getContext("2d").putImageData(history.current[histIdx.current], 0, 0); };

  /* ── coords ── */
  const getPos = (e) => {
    const c = mainRef.current; if (!c) return {x:0,y:0};
    const r = c.getBoundingClientRect();
    const sx = c.width/r.width, sy = c.height/r.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x:(t.clientX-r.left)*sx/zoomLevel, y:(t.clientY-r.top)*sy/zoomLevel };
    }
    return { x:(e.clientX-r.left)*sx/zoomLevel, y:(e.clientY-r.top)*sy/zoomLevel };
  };

  /* ── zoom ── */
  const handleZoomIn    = () => setZoomLevel(p => Math.min(p*1.2, 3));
  const handleZoomOut   = () => setZoomLevel(p => Math.max(p/1.2, 0.3));
  const handleZoomReset = () => { setZoomLevel(1); setPanOffset({x:0,y:0}); };
  const handleWheel = (e) => {
    if (e.ctrlKey||e.metaKey) { e.preventDefault(); setZoomLevel(p => Math.min(Math.max(p*(e.deltaY>0?0.9:1.1),0.3),3)); }
  };

  /* ── drawing ── */
  const applyStyle = (ctx) => {
    ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=strokeWidth;
    ctx.globalAlpha=opacity/100; ctx.lineCap="round"; ctx.lineJoin="round";
  };
  const drawShape = (ctx, from, to) => {
    applyStyle(ctx);
    if (tool==="rect")   { ctx.beginPath(); ctx.strokeRect(from.x,from.y,to.x-from.x,to.y-from.y); }
    if (tool==="circle") { const rx=Math.abs(to.x-from.x)/2, ry=Math.abs(to.y-from.y)/2, cx=from.x+(to.x-from.x)/2, cy=from.y+(to.y-from.y)/2; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.stroke(); }
    if (tool==="line")   { ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y); ctx.stroke(); }
    if (tool==="arrow")  { const dx=to.x-from.x, dy=to.y-from.y, angle=Math.atan2(dy,dx), hl=Math.max(14,strokeWidth*4); ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y); ctx.lineTo(to.x-hl*Math.cos(angle-Math.PI/6),to.y-hl*Math.sin(angle-Math.PI/6)); ctx.moveTo(to.x,to.y); ctx.lineTo(to.x-hl*Math.cos(angle+Math.PI/6),to.y-hl*Math.sin(angle+Math.PI/6)); ctx.stroke(); }
    ctx.globalAlpha=1;
  };

  const mouseDown = (e) => {
    e.preventDefault();
    if (tool==="pointer") return;
    const p = getPos(e);
    if (tool==="text")  { setNewTextPos(p); setNewTextVal(""); return; }
    if (tool==="stamp") { setStamps(prev=>[...prev,{id:Date.now().toString(),x:p.x,y:p.y,emoji:selectedEmoji,size:Math.max(40,strokeWidth*8)}]); return; }
    drawing.current=true; startPt.current=p; lastPt.current=p;
    if (["rect","circle","line","arrow"].includes(tool)) {
      snap.current = mainRef.current.getContext("2d").getImageData(0,0,mainRef.current.width,mainRef.current.height);
    } else {
      const ctx = mainRef.current.getContext("2d"); applyStyle(ctx);
      if (tool==="eraser") { ctx.strokeStyle = (bgColor==="#FDFAF4"||bgColor==="#FFFFFF") ? "#FFFFFF" : bgColor; ctx.lineWidth=strokeWidth*5; }
      ctx.beginPath(); ctx.arc(p.x,p.y,strokeWidth/2,0,Math.PI*2);
      ctx.fillStyle = tool==="eraser" ? ((bgColor==="#FDFAF4"||bgColor==="#FFFFFF") ? "#FFFFFF" : bgColor) : color;
      ctx.globalAlpha=opacity/100; ctx.fill(); ctx.globalAlpha=1;
    }
  };
  const mouseMove = (e) => {
    e.preventDefault(); if (!drawing.current) return;
    const p = getPos(e);
    if (["rect","circle","line","arrow"].includes(tool) && snap.current && startPt.current) {
      const ctx = mainRef.current.getContext("2d"); ctx.putImageData(snap.current,0,0); drawShape(ctx,startPt.current,p);
    } else if (tool==="pen"||tool==="eraser") {
      const ctx = mainRef.current.getContext("2d"); applyStyle(ctx);
      if (tool==="eraser") { ctx.strokeStyle=(bgColor==="#FDFAF4"||bgColor==="#FFFFFF") ? "#FFFFFF" : bgColor; ctx.lineWidth=strokeWidth*5; }
      ctx.beginPath(); ctx.moveTo(lastPt.current.x,lastPt.current.y); ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.globalAlpha=1;
    }
    lastPt.current=p;
  };
  const mouseUp = () => { if (!drawing.current) return; drawing.current=false; snap.current=null; saveHist(); };

  /* ── text ── */
  const commitNewText = () => {
    if (!newTextPos||!newTextVal.trim()) { setNewTextPos(null); return; }
    setTextEls(prev=>[...prev,{id:Date.now().toString(),x:newTextPos.x,y:newTextPos.y,text:newTextVal.trim(),color,fontSize:Math.max(18,strokeWidth*4)}]);
    setNewTextPos(null); setNewTextVal("");
  };
  const commitEditText = (id,val) => {
    if (!val.trim()) setTextEls(p=>p.filter(t=>t.id!==id));
    else setTextEls(p=>p.map(t=>t.id===id?{...t,text:val.trim()}:t));
    setEditingTextId(null);
  };

  /* ── clear ── */
  const clearCanvas = () => {
    const c=mainRef.current; if (!c) return;
    const ctx=c.getContext("2d");
    if (bgColor==="#FDFAF4"||bgColor==="#FFFFFF") drawNotebookBg(ctx,c.width,c.height);
    else { ctx.fillStyle=bgColor; ctx.fillRect(0,0,c.width,c.height); }
    setTextEls([]); setStamps([]); setVideoEl(null); setImageEls([]);
    saveHist();
  };

  /* ── image overlay loading ── */
  const loadImg = (e) => {
    const file=e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const c=mainRef.current; if (!c) return;
        const maxW=c.width*0.4, maxH=c.height*0.4;
        let w=img.width, h=img.height;
        if (w>maxW) { h=(h*maxW)/w; w=maxW; }
        if (h>maxH) { w=(w*maxH)/h; h=maxH; }
        const x=(c.width-w)/2, y=(c.height-h)/2;
        setImageEls(prev=>[...prev,{
          id:Date.now().toString(), x, y, width:w, height:h,
          imageElement:img, src:ev.target?.result,
          aspectRatio: img.width/img.height,
          locked: false, flipH: false,
        }]);
      };
      img.src = ev.target?.result;
    };
    reader.readAsDataURL(file);
    e.target.value="";
  };

  /* ── background image loading ── */
  const loadBgImage = (e) => {
    const file=e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setBgImage(ev.target?.result); };
    reader.readAsDataURL(file);
    e.target.value="";
  };

  /* ── video ── */
  const addYouTubeVideo = (embedUrl) => setVideoEl({ src:embedUrl, x:100, y:80, w:480, h:270, isYouTube:true });
  const loadVideo = (e) => {
    const file=e.target.files?.[0]; if (!file) return;
    setVideoEl({ src:URL.createObjectURL(file), x:100, y:80, w:480, h:270, isYouTube:false });
    e.target.value="";
  };

  const drawDecoratedSurah = (ctx, t) => {
    const boxX = t.x;
    const boxY = t.y;
    const boxW = 740;
    const boxH = Math.max(260, 110 + String(t.text).split("\n").length * (t.fontSize * 1.6) + 90);
    const radius = 24;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(boxX + radius, boxY);
    ctx.lineTo(boxX + boxW - radius, boxY);
    ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + radius);
    ctx.lineTo(boxX + boxW, boxY + boxH - radius);
    ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - radius, boxY + boxH);
    ctx.lineTo(boxX + radius, boxY + boxH);
    ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - radius);
    ctx.lineTo(boxX, boxY + radius);
    ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
    ctx.closePath();

    ctx.fillStyle = t.bgColor || "rgba(252, 247, 235, 0.96)";
    ctx.strokeStyle = t.borderColor || "#C8A96B";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = t.titleColor || "#A67C52";
    ctx.font = `bold ${Math.max(24, t.fontSize)}px "Noto Naskh Arabic","Cairo",sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(t.title || "", boxX + boxW / 2, boxY + 20);

    ctx.strokeStyle = "#D9B56A";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(boxX + 70, boxY + 72);
    ctx.lineTo(boxX + boxW - 70, boxY + 72);
    ctx.stroke();

    ctx.font = `bold ${t.fontSize}px "Noto Naskh Arabic","Cairo",sans-serif`;
    ctx.fillStyle = t.color || "#1B4D3E";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    const lines = String(t.text).split("\n");
    const contentTop = boxY + 110;
    lines.forEach((ln, i) => {
      ctx.fillText(ln, boxX + boxW - 40, contentTop + i * t.fontSize * 1.65);
    });

    ctx.restore();
  };

  /* ── save with text rendering ── */
  const saveImg = () => {
    const c=document.createElement("canvas");
    c.width=mainRef.current.width; c.height=mainRef.current.height;
    const ctx=c.getContext("2d");

    if (bgImage) {
      const bi=new Image();
      bi.src=bgImage;
      if (bi.complete) {
        ctx.globalAlpha=bgImageOpacity/100;
        ctx.drawImage(bi,0,0,c.width,c.height);
        ctx.globalAlpha=1;
        drawRest();
      } else {
        bi.onload = () => {
          ctx.globalAlpha=bgImageOpacity/100;
          ctx.drawImage(bi,0,0,c.width,c.height);
          ctx.globalAlpha=1;
          drawRest();
        };
        return;
      }
    } else {
      drawRest();
    }

    function drawRest() {
      ctx.drawImage(mainRef.current,0,0);

      imageEls.forEach(img => {
        if (img.imageElement) {
          if (img.flipH) {
            ctx.save();
            ctx.translate(img.x + img.width, img.y);
            ctx.scale(-1, 1);
            ctx.drawImage(img.imageElement, 0, 0, img.width, img.height);
            ctx.restore();
          } else {
            ctx.drawImage(img.imageElement, img.x, img.y, img.width, img.height);
          }
        }
      });

      stamps.forEach(s => {
        ctx.font=`${s.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.emoji, s.x, s.y);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
      });

      textEls.forEach(t => {
        if (t.kind === "surahPage") {
          drawDecoratedSurah(ctx, t);
        } else {
          ctx.font=`bold ${t.fontSize}px "Noto Naskh Arabic","Cairo",sans-serif`;
          ctx.fillStyle=t.color;
          ctx.direction="rtl";
          ctx.textAlign="right";
          ctx.textBaseline = "top";
          const lines = String(t.text).split("\n");
          lines.forEach((ln, i) => ctx.fillText(ln, t.x, t.y + i * t.fontSize * 1.6));
          ctx.textAlign = "start";
          ctx.textBaseline = "alphabetic";
        }
      });

      if (videoEl) {
        ctx.fillStyle = "#000";
        ctx.fillRect(videoEl.x, videoEl.y, videoEl.w, videoEl.h);
        ctx.fillStyle = "#fff";
        ctx.font = "20px Cairo, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(videoEl.isYouTube ? "📺 يوتيوب" : "📹 فيديو", videoEl.x + videoEl.w/2, videoEl.y + videoEl.h/2);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";
      }

      const a=document.createElement("a");
      a.download="لوحتي.png";
      a.href=c.toDataURL("image/png");
      a.click();
    }
  };

  /* ── ayah copy ── */
  const copyAyahToBoard = (text) => {
    setTextEls(prev=>[...prev,{id:Date.now().toString(),x:200+Math.random()*300,y:150+Math.random()*200,text,color:"#1B4D3E",fontSize:26}]);
  };

  /* ── whole-sura copy: arrange like a moshap  page ── */
  // Convert an integer to Arabic-Indic digits (١٢٣...)
  const toArabicDigits = (n) => String(n).replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[+d]);

  const copyWholeSurahToBoard = () => {
    if (!panelAyahs || panelAyahs.length === 0) return;
    const surahName = SURAHS.find(s => (s.id || 0) === panelSurahId)?.name || "";
    const header = `سُورَةُ ${surahName}`;
    const body = panelAyahs
      .map(a => `${a.text} ﴿${toArabicDigits(a.numberInSurah)}﴾`)
      .join(" ");

    const maxCharsPerLine = 55;
    const words = body.split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > maxCharsPerLine) {
        if (cur) lines.push(cur.trim());
        cur = w;
      } else {
        cur = (cur + " " + w).trim();
      }
    }
    if (cur) lines.push(cur.trim());

    setTextEls(prev => [...prev, {
      id: Date.now().toString(),
      x: 120,
      y: 90,
      text: lines.join("\n"),
      title: header,
      kind: "surahPage",
      color: "#1B4D3E",
      fontSize: 24,
      bgColor: "rgba(252, 247, 235, 0.96)",
      borderColor: "#C8A96B",
      titleColor: "#A67C52",
    }]);
  };

  /* ── canvas-to-screen coords ── */
  const cx2px = (cx) => {
    const c=mainRef.current; if (!c) return cx;
    const r=c.getBoundingClientRect();
    return cx*(r.width/c.width)*zoomLevel;
  };
  const cy2px = (cy) => {
    const c=mainRef.current; if (!c) return cy;
    const r=c.getBoundingClientRect();
    return cy*(r.height/c.height)*zoomLevel;
  };

  /* ── timer display ── */
  const timerM = Math.floor(timeLeft/60).toString().padStart(2,"0");
  const timerS = (timeLeft%60).toString().padStart(2,"0");

  /* ── timer cycle ── */
  const cycleTimer = () => {
    const opts=[1,3,5,10,15,20,30];
    const idx=opts.indexOf(timerMins);
    const next=opts[(idx+1)%opts.length];
    setTimerMins(next);
    setTimeLeft(next*60);
    setTimerRunning(false);
  };

  const TOOLS = [
    { id:"pointer", icon:<MousePointer size={isMobile?20:17}/>, label:"مؤشر" },
    { id:"pen",    icon:<PenLine size={isMobile?20:17}/>,  label:"قلم" },
    { id:"eraser", icon:<Eraser  size={isMobile?20:17}/>,  label:"ممحاة" },
    { id:"rect",   icon:<Square  size={isMobile?20:17}/>,  label:"مستطيل" },
    { id:"circle", icon:<Circle  size={isMobile?20:17}/>,  label:"دائرة" },
    { id:"line",   icon:<Minus   size={isMobile?20:17}/>,  label:"خط" },
    { id:"arrow",  icon:<ArrowRight size={isMobile?20:17}/>, label:"سهم" },
    { id:"text",   icon:<Type    size={isMobile?20:17}/>,  label:"نص" },
    { id:"stamp",  icon:<Star    size={isMobile?20:17}/>, label:"ملصق" },
  ];

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <div className="flex flex-col h-full bg-background" style={{background:"#F5F5F0"}}>
      {/* Hidden inputs */}
      <input ref={imgInputRef}   type="file" accept="image/*"  className="hidden" onChange={loadImg}/>
      <input ref={videoInputRef} type="file" accept="video/*"  className="hidden" onChange={loadVideo}/>
      <input ref={imgBgRef}      type="file" accept="image/*"  className="hidden" onChange={loadBgImage}/>

      <AnimatePresence>
        {showYouTubeModal && <YouTubeModal isOpen={showYouTubeModal} onClose={()=>setShowYouTubeModal(false)} onAdd={addYouTubeVideo}/>}
        {fullscreenImage && (
          <FullscreenImageModal
            image={fullscreenImage}
            onClose={() => setFullscreenImage(null)}
            isMobile={isMobile}/>
        )}
      </AnimatePresence>

      {/* ── Top Bar ── */}
      <div className="flex items-center gap-1 px-2 sm:px-3 py-1.5 border-b border-border bg-white flex-shrink-0 overflow-x-auto" dir="ltr">
        <button onClick={undo}   title="تراجع" className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0"><Undo2  size={18}/></button>
        <button onClick={redo}   title="إعادة"  className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0"><Redo2  size={18}/></button>
        <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0"/>

        <button onClick={()=>imgInputRef.current?.click()}   title="إضافة صورة"   className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0"><ImagePlus size={18}/></button>
        <button onClick={()=>videoInputRef.current?.click()} title="فيديو محلي"   className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0"><Video     size={18}/></button>
        <button onClick={()=>setShowYouTubeModal(true)}      title="فيديو يوتيوب" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 flex-shrink-0"><Youtube   size={18}/></button>
        <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0"/>

        {/* BG picker */}
        <div className="relative flex-shrink-0">
          <button onClick={()=>setShowBgPicker(v=>!v)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 text-xs" style={{ fontFamily:"Cairo,sans-serif" }}>
            <div className="w-[18px] h-[18px] rounded border border-gray-300 overflow-hidden" style={{ background:bgImage?undefined:bgColor }}>
              {bgImage && <img src={bgImage} className="w-full h-full object-cover"/>}
            </div>
          </button>
          {showBgPicker && (
            <BgPicker bgColor={bgColor} bgImage={bgImage} onChange={c=>{setBgColor(c);setShowBgPicker(false);}}
              onImageBg={()=>{imgBgRef.current?.click();setShowBgPicker(false);}}
              onClearImageBg={()=>{setBgImage(null);}}
              imgBgRef={imgBgRef}/>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0"/>
        <button onClick={()=>{playSound("balloon");setShowBalloons(true);window.dispatchEvent(new CustomEvent("mascot:cheer",{detail:"يا سلام!"}));}} title="بالونات" className="p-1.5 rounded-lg hover:bg-amber-100 flex-shrink-0 text-lg">🎈</button>
        {/* Clapping button (was stars) */}
        <button
          onClick={()=>{ playClapSound(); setShowClap(true); window.dispatchEvent(new CustomEvent("mascot:cheer",{detail:"أحسنت! 👏"})); }}
          title="تصفيق"
          className="p-1.5 rounded-lg hover:bg-yellow-100 flex-shrink-0 text-lg">👏</button>
        <button onClick={()=>{playSound("alarm");setShowAlarm(true);}}   title="تنبيه"    className="p-1.5 rounded-lg hover:bg-red-100 flex-shrink-0 text-lg">🔔</button>
        <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0"/>
        <button onClick={()=>setCurtainVisible(v=>!v)} title="الستارة" className={`p-1.5 rounded-lg flex-shrink-0 text-lg transition-colors ${curtainVisible?"bg-primary/20":""}`}>🎭</button>
        <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0"/>
        <button onClick={()=>setShowAyahPanel(v=>!v)} title="آيات القرآن"
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs flex-shrink-0 transition-colors ${showAyahPanel?"bg-primary text-white":"hover:bg-gray-100"}`}
          style={{ fontFamily:"Cairo,sans-serif" }}>
          <BookMarked size={15}/><span className="hidden sm:inline">آيات</span>
        </button>
        <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0"/>
        <button onClick={clearCanvas} title="مسح الكل"  className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 flex-shrink-0"><Trash2   size={18}/></button>
        <button onClick={saveImg}     title="تحميل"     className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0" style={{ color:"#1B4D3E" }}><Download size={18}/></button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Quran Panel (Left) ── */}
        <div className={`${isMobile ? `fixed top-0 bottom-0 left-0 z-60 w-56 border-r border-border bg-card transition-transform duration-300 ${mobilePanelOpen==='ayah' ? 'translate-x-0' : '-translate-x-full'}` : `${showAyahPanel ? 'w-52' : 'hidden'} border-l border-border bg-card flex-shrink-0`} overflow-y-auto flex flex-col`} dir="rtl"
          style={isMobile ? {} : {}}>
          <div className="p-2 border-b border-border">
            <p className="text-xs font-bold mb-2" style={{ fontFamily:"Cairo,sans-serif", color:"#1B4D3E" }}>📖 القرآن الكريم</p>
            <select value={panelSurahId} onChange={e=>setPanelSurahId(+e.target.value)}
              className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-right mb-2"
              style={{ fontFamily:"Cairo,sans-serif" }} dir="rtl">
              {SURAHS.map((s,i) => <option key={s.id || i+1} value={s.id || i+1}>{s.id || i+1}. {s.name}</option>)}
            </select>
            {/* Add whole sura button */}
            <button
              onClick={copyWholeSurahToBoard}
              disabled={panelLoading || panelAyahs.length === 0}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
              style={{ background:"#1B4D3E", fontFamily:"Cairo,sans-serif" }}
              title="إضافة السورة كاملة إلى اللوحة">
              <BookMarked size={13}/> إضافة السورة كاملة
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {panelLoading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"/></div> : (
              <div className="space-y-1">
                {panelSurahId!==9 && <div className="text-xs text-center py-1" style={{ fontFamily:"Noto Naskh Arabic,serif", color:"#1B4D3E" }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>}
                {panelAyahs.map(a => (
                  <div key={a.number} onClick={()=>copyAyahToBoard(a.text)}
                    className="rounded-lg p-2 bg-muted/40 hover:bg-emerald-50 cursor-pointer transition-colors">
                    <p className="text-right leading-relaxed" style={{ fontFamily:"Noto Naskh Arabic,serif", color:"#2C1810", fontSize:"0.8rem", lineHeight:2 }}>
                      {a.text} <span style={{ color:"#D4A843" }}>﴿{a.numberInSurah}﴾</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Canvas Area ── */}
        <div ref={containerRef} className="flex-1 overflow-hidden relative" onWheel={handleWheel}
          style={{ background: bgColor==="#FDFAF4"||bgColor==="#FFFFFF" ? "#e8e4dc" : bgColor }}>

          {/* Background image layer */}
          {bgImage && (
            <div className="absolute inset-0 z-0" style={{ pointerEvents:"none" }}>
              <img src={bgImage} className="w-full h-full"
                style={{ objectFit:"cover", opacity:bgImageOpacity/100 }}/>
            </div>
          )}

          {/* Drawing canvas */}
          <canvas ref={mainRef}
            className="absolute inset-0 w-full h-full"
            style={{
              cursor: tool==="pointer"?"default":tool==="eraser"?"cell":tool==="text"?"text":tool==="stamp"?"copy":"crosshair",
              touchAction:"none",
              transform:`scale(${zoomLevel})`,
              transformOrigin:"center center",
              background:"transparent",
              zIndex:1,
            }}
            onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} onMouseLeave={mouseUp}
            onTouchStart={mouseDown} onTouchMove={mouseMove} onTouchEnd={mouseUp}/>

          <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleZoomReset} zoomLevel={zoomLevel} isMobile={isMobile}/>

          {/* ── Text overlays ── */}
          {textEls.map(t => {
            const lx=cx2px(t.x), ly=cy2px(t.y);
            const c=mainRef.current, r=c?.getBoundingClientRect();
            const scaleY=r?r.height/c.height:1;
            return (
              <div key={t.id} className="absolute" style={{ left:lx, top:ly-t.fontSize*scaleY*zoomLevel, zIndex:6, pointerEvents:"auto" }}>
                {editingTextId===t.id ? (
                  <div className={`rounded-[24px] border-2 bg-[#fcf7eb]/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)] ${t.kind === "surahPage" ? "min-w-[340px]" : "min-w-[140px]"}`} style={{ borderColor: t.kind === "surahPage" ? (t.borderColor || "#C8A96B") : "#1B4D3E" }}>
                    {t.kind === "surahPage" && (
                      <div className="mb-3 flex items-center justify-center gap-2 text-amber-700">
                        <span>✿</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
                        <span className="text-sm font-black" style={{ fontFamily:"Cairo,sans-serif" }}>{t.title}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
                        <span>✿</span>
                      </div>
                    )}
                    <textarea autoFocus value={t.text}
                      onChange={e=>setTextEls(p=>p.map(tt=>tt.id===t.id?{...tt,text:e.target.value}:tt))}
                      onBlur={e=>commitEditText(t.id,e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Escape") commitEditText(t.id,t.text); }}
                      className="w-full border-0 bg-transparent outline-none text-right resize-none"
                      style={{ fontFamily:"Noto Naskh Arabic,serif", fontSize:t.fontSize*scaleY*zoomLevel, color:t.color, direction:"rtl", minHeight:isMobile?"30px":"40px" }}/>
                  </div>
                ) : (
                  <div className={`relative group cursor-move select-none ${t.kind === "surahPage" ? "rounded-[24px] border-2 bg-[#fcf7eb]/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.14)]" : ""}`}
                    style={t.kind === "surahPage" ? { borderColor:t.borderColor || "#C8A96B", maxWidth:720 } : undefined}
                    onMouseDown={e=>{ e.stopPropagation(); setDragEl({type:"text",id:t.id,mx:e.clientX,my:e.clientY,ex:t.x,ey:t.y}); }}
                    onTouchStart={e=>{ e.stopPropagation(); const touch=e.touches[0]; setDragEl({type:"text",id:t.id,mx:touch.clientX,my:touch.clientY,ex:t.x,ey:t.y}); }}
                    onDoubleClick={e=>{ e.stopPropagation(); setEditingTextId(t.id); }}>
                    {t.kind === "surahPage" && (
                      <div className="mb-3 flex items-center justify-center gap-2 text-amber-700">
                        <span>✿</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
                        <span className="text-sm font-black" style={{ fontFamily:"Cairo,sans-serif" }}>{t.title}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
                        <span>✿</span>
                      </div>
                    )}
                    <span className="font-bold whitespace-pre-line" style={{ fontFamily:"Noto Naskh Arabic,serif", fontSize:t.fontSize*scaleY*zoomLevel, color:t.color, lineHeight:1.8, display:"block", textAlign:"right", direction:"rtl" }}>{t.text}</span>
                    <button onClick={e=>{ e.stopPropagation(); setTextEls(p=>p.filter(tt=>tt.id!==t.id)); }}
                      className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      style={isMobile ? { width:18, height:18, fontSize:10, opacity:0.8 } : { width:20, height:20, fontSize:11 }}>✕</button>
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Stamp overlays ── */}
          {stamps.map(s => {
            const lx=cx2px(s.x-s.size/2), ly=cy2px(s.y-s.size/2);
            const c=mainRef.current, r=c?.getBoundingClientRect();
            const scaleX=r?r.width/c.width:1;
            return (
              <div key={s.id} className="absolute group cursor-move select-none" style={{ left:lx, top:ly, zIndex:4, fontSize:s.size*scaleX*zoomLevel, lineHeight:1, pointerEvents:"auto" }}
                onMouseDown={e=>{ e.stopPropagation(); setDragEl({type:"stamp",id:s.id,mx:e.clientX,my:e.clientY,ex:s.x,ey:s.y}); }}
                onTouchStart={e=>{ e.stopPropagation(); const touch=e.touches[0]; setDragEl({type:"stamp",id:s.id,mx:touch.clientX,my:touch.clientY,ex:s.x,ey:s.y}); }}>
                {s.emoji}
                <button onClick={e=>{ e.stopPropagation(); setStamps(p=>p.filter(ss=>ss.id!==s.id)); }}
                  className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={isMobile ? { width:32, height:32, fontSize:16, opacity:0.8 } : { width:20, height:20, fontSize:11 }}>✕</button>
              </div>
            );
          })}

          {/* ── Image overlays ── */}
          {imageEls.map(img => {
            const c=mainRef.current, r=c?.getBoundingClientRect();
            const scaleX=r?r.width/c.width:1, scaleY=r?r.height/c.height:1;
            const dispW=img.width*scaleX*zoomLevel, dispH=img.height*scaleY*zoomLevel;
            const lx=cx2px(img.x), ly=cy2px(img.y);
            const isSelected=selectedImageId===img.id;

            return (
              <div key={img.id} className="absolute group"
                style={{
                  left:lx, top:ly, zIndex:2,
                  width:dispW, height:dispH,
                  border: isSelected ? "2px solid #1B4D3E" : "2px solid transparent",
                  borderRadius:4,
                  cursor:"move", pointerEvents:"auto",
                  boxShadow: isSelected ? "0 0 0 3px rgba(27,77,62,0.25)" : "0 2px 8px rgba(0,0,0,0.15)",
                  transition:"box-shadow 0.15s",
                  minWidth: isMobile ? 40 : undefined,
                  minHeight: isMobile ? 40 : undefined,
                }}
                onMouseDown={e=>{ e.stopPropagation(); setSelectedImageId(img.id); setDragEl({type:"image",id:img.id,mx:e.clientX,my:e.clientY,ex:img.x,ey:img.y}); }}
                onTouchStart={e=>{ e.stopPropagation(); const touch=e.touches[0]; setSelectedImageId(img.id); setDragEl({type:"image",id:img.id,mx:touch.clientX,my:touch.clientY,ex:img.x,ey:img.y}); }}
                onClick={()=>setSelectedImageId(img.id)}>

                <img src={img.src} alt="Uploaded"
                  className="w-full h-full"
                  style={{
                    objectFit:"contain",
                    display:"block",
                    borderRadius:2,
                    userSelect:"none",
                    pointerEvents:"none",
                    transform: img.flipH ? "scaleX(-1)" : "none",
                  }}
                  draggable={false}/>

                {isMobile && (
                  <button
                    onClick={e => { e.stopPropagation(); setFullscreenImage(img); }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                    title="تكبير الصورة">
                    <Maximize2 size={22} className="text-white"/>
                  </button>
                )}

                <button onClick={e=>{ e.stopPropagation(); setImageEls(p=>p.filter(im=>im.id!==img.id)); setSelectedImageId(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-md"
                  style={isMobile ? { width:32, height:32, fontSize:16, opacity:0.8 } : { width:24, height:24, fontSize:14, lineHeight:1 }}>✕</button>

                <ResizeHandle
                  isMobile={isMobile}
                  onResize={(dx,dy) => {
                    setImageEls(prev=>prev.map(im=>{
                      if (im.id!==img.id) return im;
                      const newW=Math.max(isMobile ? 40 : 40, im.width + dx/scaleX/zoomLevel);
                      const newH = im.locked ? newW/im.aspectRatio : Math.max(isMobile ? 40 : 40, im.height + dy/scaleY/zoomLevel);
                      return {...im, width:newW, height:newH};
                    }));
                  }}/>

                <button onClick={e=>{ e.stopPropagation(); setImageEls(p=>p.map(im=>im.id===img.id?{...im,locked:!im.locked}:im)); }}
                  className="absolute top-0 left-0 w-6 h-6 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs shadow-md"
                  style={{ background: img.locked ? "#1B4D3E" : "rgba(0,0,0,0.5)", color:"white" }}
                  title={img.locked?"فتح النسبة":"قفل النسبة"}>
                  {img.locked ? "🔒" : "🔓"}
                </button>

                <button onClick={e=>{ e.stopPropagation(); setImageEls(p=>p.map(im=>im.id===img.id?{...im,flipH:!im.flipH}:im)); }}
                  className="absolute top-0 left-7 w-6 h-6 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs shadow-md"
                  style={{ background:"rgba(0,0,0,0.5)", color:"white", borderRadius:"0 0 4px 0" }}
                  title="قلب أفقي">⇄</button>
              </div>
            );
          })}

          {/* ── New text input ── */}
          {newTextPos && (() => {
            const c=mainRef.current; if (!c) return null;
            const r=c.getBoundingClientRect(), scaleY=r.height/c.height;
            return (
              <div className="absolute z-10" style={{ left:newTextPos.x*(r.width/c.width)*zoomLevel, top:newTextPos.y*scaleY*zoomLevel-20, pointerEvents:"auto" }}>
                <input autoFocus value={newTextVal} onChange={e=>setNewTextVal(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") commitNewText(); if(e.key==="Escape") setNewTextPos(null); }}
                  onBlur={commitNewText}
                  className="border-2 border-primary rounded-lg px-3 py-1.5 bg-white shadow-xl outline-none text-right"
                  style={{ fontFamily:"Noto Naskh Arabic,serif", fontSize:Math.max(14,strokeWidth*3)*scaleY*zoomLevel, color, minWidth:isMobile?"100px":"120px", direction:"rtl" }}
                  placeholder="اكتب هنا..."/>
              </div>
            );
          })()}

          {/* ── Video overlay ── */}
          {videoEl && (() => {
            const c=mainRef.current; if (!c) return null;
            const r=c.getBoundingClientRect(), sx=r.width/c.width, sy=r.height/c.height;
            return (
              <div className="absolute z-8 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-amber-400 group"
                style={{ left:videoEl.x*sx*zoomLevel, top:videoEl.y*sy*zoomLevel, width:videoEl.w*sx*zoomLevel, height:videoEl.h*sy*zoomLevel, minWidth:isMobile?200:300, minHeight:isMobile?120:170 }}>
                <div className="h-7 bg-gray-800 flex items-center justify-between px-2 cursor-move"
                  onMouseDown={e=>{ e.stopPropagation(); setDragEl({type:"video",id:"video",mx:e.clientX,my:e.clientY,ex:videoEl.x,ey:videoEl.y}); }}
                  onTouchStart={e=>{ e.stopPropagation(); const touch=e.touches[0]; setDragEl({type:"video",id:"video",mx:touch.clientX,my:touch.clientY,ex:videoEl.x,ey:videoEl.y}); }}>
                  <span className="text-white text-xs" style={{ fontFamily:"Cairo,sans-serif" }}>{videoEl.isYouTube?"📺 يوتيوب":"📹 فيديو"}</span>
                  <button onClick={()=>{ if(videoEl.src&&!videoEl.isYouTube) URL.revokeObjectURL(videoEl.src); setVideoEl(null); }} className="text-gray-400 hover:text-white text-xs w-5 h-5 flex items-center justify-center rounded">✕</button>
                </div>
                {videoEl.isYouTube
                  ? <iframe src={videoEl.src} className="w-full" style={{ height:"calc(100% - 28px)" }} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
                  : <video  src={videoEl.src} controls className="w-full" style={{ height:"calc(100% - 28px)" }}/>}
                <ResizeHandle
                  isMobile={isMobile}
                  onResize={(dx,dy)=>setVideoEl(prev=>prev?{...prev,w:Math.max(200,prev.w+dx),h:Math.max(120,prev.h+dy)}:null)}/>
              </div>
            );
          })()}

          {/* ── Effects ── */}
          <AnimatePresence>
            {showBalloons && <BalloonCelebrationOverlay onDone={()=>setShowBalloons(false)}/>}
            {showClap     && <ClapCelebrationOverlay    onDone={()=>setShowClap(false)}/>}
            {showAlarm    && <AlarmEffect               onDone={()=>setShowAlarm(false)}/>}
          </AnimatePresence>

          {/* ── Curtain ── */}
          <Curtain visible={curtainVisible} onReveal={()=>setCurtainVisible(false)}/>

          {/* ── Timer ── */}
          <div className="absolute bottom-3 right-3 bg-gray-800/95 backdrop-blur text-white rounded-2xl shadow-2xl overflow-hidden z-20" style={{ minWidth:isMobile?"90px":"110px", textAlign:"center" }} dir="ltr">
            {editTimer ? (
              <div className="p-2 flex items-center gap-2">
                <input type="number" min={1} max={99} value={timerMins} onChange={e=>setTimerMins(+e.target.value)} className="w-10 bg-gray-700 rounded-lg px-1 py-1 text-center text-sm focus:outline-none"/>
                <span className="text-xs text-gray-300">د</span>
                <button onClick={()=>{ setTimeLeft(timerMins*60); setTimerRunning(false); setEditTimer(false); }} className="px-2 py-1 bg-primary rounded-lg text-xs">✓</button>
              </div>
            ) : (
              <div className="p-2.5">
                <div className={`text-[28px] font-mono font-bold text-center cursor-pointer leading-none mb-1.5 ${timeLeft<=30&&timerRunning?"text-red-400 animate-pulse":"text-white"}`} onClick={cycleTimer}>
                  {timerM}:{timerS}
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <button onClick={()=>setTimerRunning(r=>!r)} className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600">{timerRunning?<Pause size={14}/>:<Play size={14}/>}</button>
                  <button onClick={()=>{ setTimerRunning(false); setTimeLeft(timerMins*60); }} className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600"><RotateCcw size={14}/></button>
                </div>
              </div>
            )}
            {timeLeft===0 && <div className="bg-red-500 text-center text-xs py-1 font-bold animate-pulse">⏰ انتهى!</div>}
          </div>
        </div>

        {/* ── Right Panel (tools) ── */}
        <div className={`${isMobile ? `fixed top-0 bottom-0 right-0 z-60 w-56 border-l border-border bg-card transition-transform duration-300 ${mobilePanelOpen==='tools' ? 'translate-x-0' : 'translate-x-full'}` : 'w-52 border-r border-border bg-card flex-shrink-0'} overflow-y-auto`} dir="rtl" style={isMobile?{}:{background:"#fafafa"}}>
          {/* Tools */}
          <div className="p-2 border-b border-border">
            <p className="text-xs text-gray-500 mb-1.5 px-1 font-semibold" style={{ fontFamily:"Cairo,sans-serif" }}>الأدوات</p>
            <div className="space-y-0.5">
              {TOOLS.map(t => (
                <motion.button key={t.id} whileTap={{ scale:0.93 }}
                  onClick={()=>{ setTool(t.id); if(t.id==="stamp") setShowEmojiPicker(p=>!p); }}
                  title={t.label}
                  className={`flex items-center gap-1.5 w-full px-2.5 py-2 rounded-xl transition-all text-right ${tool===t.id?"bg-primary text-white":"hover:bg-gray-100 text-gray-700"}`}
                  style={{ fontFamily:"Cairo,sans-serif", fontSize:13 }}>
                  <span className="flex-shrink-0">{t.icon}</span>
                  <span className="text-xs">{t.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="p-2 border-b border-border">
            <p className="text-xs text-gray-500 mb-1.5 px-1 font-semibold" style={{ fontFamily:"Cairo,sans-serif" }}>اللون</p>
            <div className="grid grid-cols-4 gap-1">
              {WB_COLORS.map(c => (
                <button key={c} onClick={()=>setColor(c)} className={`w-7 h-7 rounded-lg border-2 hover:scale-110 transition-transform ${color===c?"border-primary scale-110":"border-transparent"}`} style={{ background:c }}/>
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-xs text-gray-500" style={{ fontFamily:"Cairo,sans-serif" }}>مخصص:</span>
              <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0"/>
            </div>
          </div>

          {/* Stroke + opacity */}
          <div className="p-2 border-b border-border space-y-2">
            <div>
              <p className="text-xs text-gray-500 mb-1 font-semibold" style={{ fontFamily:"Cairo,sans-serif" }}>الحجم: <span>{strokeWidth}</span>px</p>
              <input type="range" min={1} max={30} value={strokeWidth} onChange={e=>setStrokeWidth(+e.target.value)} className="w-full h-1" style={{ accentColor:"#1B4D3E" }}/>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 font-semibold" style={{ fontFamily:"Cairo,sans-serif" }}>شفافية: <span>{opacity}</span>%</p>
              <input type="range" min={10} max={100} value={opacity} onChange={e=>setOpacity(+e.target.value)} className="w-full h-1" style={{ accentColor:"#1B4D3E" }}/>
            </div>
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="p-2">
              <p className="text-xs text-gray-500 mb-1.5 font-semibold" style={{ fontFamily:"Cairo,sans-serif" }}>الملصقات</p>
              <div className="grid grid-cols-4 gap-1">
                {WB_EMOJIS.map(em => (
                  <button key={em} onClick={()=>{ setSelectedEmoji(em); setTool("stamp"); }}
                    className={`text-xl py-1 rounded-lg transition-all hover:scale-110 ${selectedEmoji===em&&tool==="stamp"?"bg-primary/20 scale-110":"hover:bg-gray-200"}`}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile overlay */}
        {isMobile && (
          <div className={`fixed inset-0 bg-black/30 z-55 transition-opacity ${mobilePanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={()=>setMobilePanelOpen(null)}/>
        )}

        {/* Mobile toggles */}
        {isMobile && (
          <>
            <button onClick={()=>setMobilePanelOpen(p=>p==='tools'?null:'tools')}
              className="fixed bottom-20 right-2.5 z-50 p-2.5 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center">
              <PenLine size={20}/>
            </button>
            {showAyahPanel && (
              <button onClick={()=>setMobilePanelOpen(p=>p==='ayah'?null:'ayah')}
                className="fixed bottom-20 left-2.5 z-50 p-2.5 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center">
                <BookMarked size={20}/>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
