// @ts-nocheck
import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, ChevronDown } from "lucide-react";
import { SURAHS } from "../../lib/constants";
import { getAudioUrl } from "../../lib/helpers";

export default function Quran() {
  const [selSurah, setSelSurah] = useState(1);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [curAyah, setCurAyah] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showList, setShowList] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { fetchSurah(1); }, []);

  const fetchSurah = async (id: number) => {
    setLoading(true); setAyahs([]); setCurAyah(0); setPlaying(false);
    if (audioRef.current) audioRef.current.pause();
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
      const d = await res.json();
      if (d.status === "OK") setAyahs(d.data.ayahs);
    } catch (_) {}
    setLoading(false);
  };

  const playAyah = useCallback((idx: number) => {
    if (!audioRef.current || !ayahs[idx]) return;
    setCurAyah(idx); setPlaying(true);
    audioRef.current.src = getAudioUrl(selSurah, ayahs[idx].numberInSurah);
    audioRef.current.play().catch(() => setPlaying(false));
  }, [ayahs, selSurah]);

  const handleEnded = useCallback(() => {
    if (repeat) audioRef.current?.play();
    else if (curAyah < ayahs.length - 1) playAyah(curAyah + 1);
    else setPlaying(false);
  }, [repeat, curAyah, ayahs.length, playAyah]);

  return (
    <div className="flex flex-col h-full" dir="rtl">
      <audio ref={audioRef} onEnded={handleEnded} onError={() => setPlaying(false)} />

      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border bg-card flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold" style={{ fontFamily: "Amiri, serif", color: "#411b4d" }}>
              القرآن الكريم
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48", borderColor: "rgba(139,105,20,0.25)", background: "#F5F0E6" }}
            >
              بصوت الشيخ الحصري المعلم
            </span>
          </div>

          {/* Surah selector */}
          <div className="relative">
            <button
              onClick={() => setShowList(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors"
              style={{ fontFamily: "Amiri, serif", color: "#411b4d" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#E8DDD0", color: "#7A5C48", fontFamily: "Cairo, sans-serif" }}
                >
                  {selSurah}
                </span>
                <span className="text-lg">{SURAHS.find(s => s.id === selSurah)?.name}</span>
              </div>
              <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-200 ${showList ? "rotate-180" : ""}`} />
            </button>

            {showList && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-20 max-h-72 overflow-y-auto">
                {SURAHS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelSurah(s.id); setShowList(false); fetchSurah(s.id); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-right transition-colors ${selSurah === s.id ? "bg-primary/10" : ""}`}
                    style={{ fontFamily: "Amiri, serif", color: selSurah === s.id ? "#411b4d" : "#2C1810" }}
                  >
                    <span className="text-xs w-8 text-center" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>{s.id}</span>
                    <span>{s.name}</span>
                    <span className="text-xs mr-auto" style={{ fontFamily: "Cairo, sans-serif", color: "#7A5C48" }}>{s.ayahs} آية</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ayahs */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {selSurah !== 9 && (
                <div className="text-center py-5 border-b border-border" style={{ fontFamily: "Noto Naskh Arabic, serif", fontSize: "1.3rem", color: "#411b4d" }}>
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </div>
              )}
              {ayahs.map((ayah, idx) => {
                const active = curAyah === idx && playing;
                return (
                  <motion.div
                    key={ayah.number}
                    whileHover={{ scale: 1.005 }}
                    onClick={() => playAyah(idx)}
                    className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all border ${active ? "border-amber-400 bg-amber-50" : "border-border bg-card hover:border-primary/30"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: active ? "#D4A843" : "#411b4d", color: "white", fontFamily: "Cairo, sans-serif" }}
                      >
                        {ayah.numberInSurah}
                      </div>
                      <p
                        className="flex-1 text-right leading-loose"
                        style={{ fontFamily: "Noto Naskh Arabic, serif", color: "#2C1810", fontSize: "1.2rem" }}
                      >
                        {ayah.text} <span style={{ color: "#D4A843" }}>﴿{ayah.numberInSurah}﴾</span>
                      </p>
                    </div>
                    {active && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-0.5 items-end">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-0.5 bg-amber-500 rounded-full animate-bounce"
                            style={{ height: "14px", animationDelay: `${i * 0.18}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-card p-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-5">
          <button
            onClick={() => curAyah > 0 && playAyah(curAyah - 1)}
            disabled={curAyah === 0 || !ayahs.length}
            className="p-2 rounded-full hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <SkipForward size={20} style={{ color: "#411b4d" }} />
          </button>
          <button
            onClick={() => playing ? (audioRef.current?.pause(), setPlaying(false)) : playAyah(curAyah)}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            style={{ background: "#411b4d" }}
          >
            {playing ? <Pause size={22} /> : <Play size={22} className="mr-[-2px]" />}
          </button>
          <button
            onClick={() => curAyah < ayahs.length - 1 && playAyah(curAyah + 1)}
            disabled={curAyah >= ayahs.length - 1 || !ayahs.length}
            className="p-2 rounded-full hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <SkipBack size={20} style={{ color: "#411b4d" }} />
          </button>
          <button
            onClick={() => setRepeat(r => !r)}
            className={`p-2 rounded-full transition-colors ${repeat ? "bg-amber-100 text-amber-600" : "hover:bg-muted text-muted-foreground"}`}
          >
            <RotateCcw size={18} />
          </button>
        </div>
        {ayahs.length > 0 && (
          <p className="text-center mt-2 text-xs text-muted-foreground" style={{ fontFamily: "Cairo, sans-serif" }}>
            الآية {curAyah + 1} من {ayahs.length}
          </p>
        )}
      </div>
    </div>
  );
}
