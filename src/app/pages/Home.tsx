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
import heroKids from "../../Assets/images/hero-kids.png";
import kidBoy from "../../Assets/images/kid-boy.png";
import kidGirl from "../../Assets/images/kid-girl.png";
import mosque from "../../Assets/images/mosque.png";

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
      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden bg-kid-hero">
        {/* Floating decor */}
        <motion.img
          src={mosque}
          alt=""
          aria-hidden
          className="absolute -bottom-4 left-4 lg:left-16 w-40 lg:w-56 opacity-90 drop-shadow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.95 }}
          transition={{ duration: 0.8 }}
        />
        <Star
          className="absolute top-10 right-24 text-white/70 animate-pulse"
          size={28}
          fill="currentColor"
        />
        <Sun
          className="absolute top-14 left-16 text-white/60"
          size={40}
          strokeWidth={2}
        />
        <Sparkles
          className="absolute bottom-24 right-1/3 text-white/60"
          size={28}
        />

        <div className="relative z-10 px-6 lg:px-16 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 max-w-7xl mx-auto">
            {/* Kids illustration */}
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-[3rem] blur-2xl opacity-60"
                  style={{ background: "white" }}
                />
                <img
                  src={heroKids}
                  alt="أطفال يقرؤون القرآن"
                  className="relative z-10 max-w-md w-full rounded-[2.5rem] shadow-kid border-4 border-white"
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              className="flex-1 text-right"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-5 bg-white font-bold"
                style={{ color: "var(--kid-grape)" }}
              >
                <Star size={14} fill="currentColor" />
                أهلاً بك يا صديقي الصغير
              </div>

              <h1 className="text-4xl lg:text-6xl font-black mb-4 leading-tight text-arabic text-white drop-shadow-md">
                تعلّم القرآن
                <br />
                <span
                  className="inline-block px-4 rounded-2xl mt-2"
                  style={{ background: "white", color: "var(--kid-coral)" }}
                >
                  بطريقة مرحة
                </span>
              </h1>

              <p className="text-lg lg:text-xl mb-8 leading-relaxed text-white/95 font-medium">
                رحلة ملوّنة مع أصدقائك لحفظ القرآن الكريم
                <br />
                من خلال الألعاب والأنشطة والقصص الجميلة
              </p>

              <div className="flex flex-wrap gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/quran")}
                  className="px-7 py-3.5 rounded-2xl font-black text-lg flex items-center gap-2 shadow-kid"
                  style={{ background: "white", color: "var(--kid-teal)" }}
                >
                  <BookOpen size={22} strokeWidth={2.5} />
                  ابدأ التعلّم
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/games")}
                  className="px-7 py-3.5 rounded-2xl font-black text-lg flex items-center gap-2 shadow-kid"
                  style={{ background: "var(--kid-sun)", color: "var(--foreground)" }}
                >
                  <Gamepad2 size={22} strokeWidth={2.5} />
                  العب واحفظ
                </motion.button>
              </div>
            </motion.div>
          </div>
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
              <Sparkles size={16} />
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
