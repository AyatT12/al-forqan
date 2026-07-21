// @ts-nocheck
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  BookOpen,
  Gamepad2,
  Sparkles,
  Award,
  Pencil,
  Heart,
  Star,
  Sun,
} from "lucide-react";
import logo from "../../Assets/images/Logo.png";
import kidBoy from "../../Assets/images/kid-boy.png";
import kidGirl from "../../Assets/images/kid-girl.png";
import mosque from "../../Assets/images/mosque.png";
import heroVideo from "../../Assets/video/Hero-teacher1.mp4";

const FEATURES = [
  {
    Icon: BookOpen,
    title: "القرآن الكريم",
    desc: "استمع للسور بصوت جميل مع صديقك المعلم",
    path: "/quran",
    color: "var(--kid-teal)",
    soft: "color-mix(in oklab, var(--kid-teal) 22%, white)",
  },
  {
    Icon: Gamepad2,
    title: "ألعاب التحفيظ",
    desc: "احفظ القرآن وأنت تلعب وتلوّن",
    path: "/games",
    color: "var(--kid-coral)",
    soft: "color-mix(in oklab, var(--kid-coral) 22%, white)",
  },
  {
    Icon: Sparkles,
    title: "ألعاب ترفيهية",
    desc: "حيوانات وألوان وشخصيات كرتون",
    path: "/fun",
    color: "var(--kid-sun)",
    soft: "color-mix(in oklab, var(--kid-sun) 30%, white)",
  },
  {
    Icon: Pencil,
    title: "السبورة السحرية",
    desc: "ارسم واكتب مع معلمك وأصدقائك",
    path: "/whiteboard",
    color: "var(--kid-mint)",
    soft: "color-mix(in oklab, var(--kid-mint) 26%, white)",
  },
  {
    Icon: Award,
    title: "شهادات النجوم",
    desc: "احصل على شهادتك بعد كل إنجاز",
    path: "/certificate",
    color: "var(--kid-grape)",
    soft: "color-mix(in oklab, var(--kid-grape) 22%, white)",
  },
];

const STATS = [
  { num: "١١٤", label: "سورة كريمة", Icon: BookOpen, color: "var(--kid-teal)"  },
  { num: "١١+", label: "لعبة ممتعة",  Icon: Gamepad2, color: "var(--kid-coral)" },
  { num: "٥٠+", label: "نجمة تجمعها", Icon: Star,    color: "var(--kid-sun)"   },
  { num: "∞",   label: "مرح ورسم",    Icon: Heart,   color: "var(--kid-grape)" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-kid-page" dir="rtl">
      {/* ═══ HERO WITH VIDEO HEADER ═══ */}
      <section className="relative w-full overflow-hidden rounded-b-[3rem] shadow-2xl">
        {/* Video Background */}
  <div className="relative w-full h-[80vh] min-h-[600px] max-h-[900px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover"
            style={{ filter: "brightness(0.7) saturate(1.1)" }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          {/* Decorative floating elements */}
          <motion.img
            src={mosque}
            alt=""
            aria-hidden
            className="absolute bottom-4 left-4 lg:left-16 w-40 lg:w-56 opacity-70 drop-shadow-2xl z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
         
          <motion.div
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute bottom-32 right-1/4 text-white/60 z-10"
          >
          </motion.div>

          {/* Multiple overlay layers for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-emerald-900/10" />
          
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
             

              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight"
                style={{ 
                  fontFamily: "Cairo, serif",
                  textShadow: "0 4px 30px rgba(0,0,0,0.3)"
                }}
              >
                تعلّم القرآن
                <br />
                <span
                  className="inline-block px-6 py-3 rounded-2xl mt-3 shadow-xl"
                  style={{ 
                    background: "rgba(255,255,255,0.95)", 
                    color: "var(--kid-coral)",
                    textShadow: "none"
                  }}
                >
                  بطريقة مرحة
                </span>
              </h1>

              <p 
                className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed font-medium"
                style={{ 
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)"
                }}
              >
                رحلة ملوّنة مع أصدقائك لحفظ القرآن الكريم
                <br />
                من خلال الألعاب والأنشطة والقصص الجميلة
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/quran")}
                  className="px-8 py-3.5 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl"
                  style={{ background: "white", color: "var(--kid-teal)" }}
                >
                  <BookOpen size={22} strokeWidth={2.5} />
                  ابدأ التعلّم
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/games")}
                  className="px-8 py-3.5 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl"
                  style={{ 
                    background: "var(--kid-sun)", 
                    color: "var(--foreground)"
                  }}
                >
                  <Gamepad2 size={22} strokeWidth={2.5} />
                  العب واحفظ
                </motion.button>
              </motion.div>

              {/* Animated scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
              >
                <span className="text-sm opacity-70" style={{ fontFamily: "Cairo, sans-serif" }}>
                  اكتشف المزيد
                </span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
                >
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          
          {/* Corner decorations */}
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-white/10 rounded-tr-2xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-white/10 rounded-bl-2xl" />
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="w-full px-4 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl p-5 bg-card text-center border-4 border-white shadow-kid relative overflow-hidden"
            >
              <div
                className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-20"
                style={{ background: s.color }}
              />
              <div
                className="relative w-12 h-12 mx-auto mb-2 rounded-2xl flex items-center justify-center text-white"
                style={{ background: s.color }}
              >
                <s.Icon size={24} strokeWidth={2.5} />
              </div>
              <div className="relative text-3xl font-black text-arabic text-foreground">
                {s.num}
              </div>
              <div className="relative text-sm font-bold text-muted-foreground mt-0.5">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="w-full px-4 lg:px-10 py-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-3"
              style={{
                background: "color-mix(in oklab, var(--kid-teal) 15%, white)",
                color: "var(--kid-teal)",
              }}
            >
              اختر مغامرتك
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-arabic text-foreground">
              كل ما تحتاجه في مكان واحد
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(f.path)}
                className="group relative text-right rounded-3xl p-6 border-4 border-white shadow-kid overflow-hidden"
                style={{ background: f.soft }}
              >
                <div
                  className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-25 transition-transform group-hover:scale-125"
                  style={{ background: f.color }}
                />
                <div
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
                  style={{ background: f.color }}
                >
                  <f.Icon size={28} strokeWidth={2.5} />
                </div>
                <h3
                  className="relative text-2xl font-black text-arabic mb-1.5"
                  style={{ color: f.color }}
                >
                  {f.title}
                </h3>
                <p className="relative text-sm font-medium text-foreground/75 leading-relaxed">
                  {f.desc}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Bottom mascots strip */}
          <div className="mt-14 relative rounded-3xl overflow-hidden border-4 border-white shadow-kid"
               style={{ background: "linear-gradient(120deg, color-mix(in oklab, var(--kid-sun) 40%, white), color-mix(in oklab, var(--kid-coral) 40%, white))" }}>
            <div className="flex items-center justify-between p-6 lg:p-10 gap-6">
              <img src={kidGirl} alt="" aria-hidden className="w-24 lg:w-40 drop-shadow-lg" />
              <div className="flex-1 text-center">
                <h3 className="text-2xl lg:text-3xl font-black text-arabic text-foreground mb-2">
                  هيا نبدأ رحلتنا معاً
                </h3>
                <p className="text-foreground/80 font-medium mb-4">
                  اجمع النجوم واحصل على شهادتك الخاصة
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/certificate")}
                  className="px-6 py-3 rounded-2xl font-black shadow-kid text-white inline-flex items-center gap-2"
                  style={{ background: "var(--kid-grape)" }}
                >
                  <Award size={20} strokeWidth={2.5} />
                  اطلب شهادتك
                </motion.button>
              </div>
              <img src={kidBoy} alt="" aria-hidden className="w-24 lg:w-40 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}