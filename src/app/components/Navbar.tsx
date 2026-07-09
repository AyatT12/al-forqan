// @ts-nocheck
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Menu, X, BookOpen, Gamepad2, Sparkles, Award, Pencil, Home as HomeIcon, ListChecks } from "lucide-react";
import logo from "../../Assets/images/Logo.png";
import kidBoy from "../../Assets/images/kid-boy.png";

const NAV_ITEMS = [
  { path: "/",            label: "الرئيسية",  Icon: HomeIcon,  color: "var(--kid-teal)"  },
  { path: "/quran",       label: "القرآن",    Icon: BookOpen,  color: "var(--kid-grape)" },
  { path: "/games",       label: "التحفيظ",   Icon: Gamepad2,  color: "var(--kid-coral)" },
  { path: "/fun",         label: "ترفيه",     Icon: Sparkles,  color: "var(--kid-sun)"   },
  { path: "/certificate", label: "الشهادات",  Icon: Award,     color: "var(--kid-grape)" },
  { path: "/whiteboard",  label: "السبورة",   Icon: Pencil,    color: "var(--kid-mint)"  },
  { path: "/tasks",       label: "مهام الحلقة", Icon: ListChecks, color: "var(--kid-sky)" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className="relative z-50 flex-shrink-0 border-b-4 border-white"
      style={{
        background:
          "linear-gradient(120deg, color-mix(in oklab, var(--kid-teal) 88%, white) 0%, color-mix(in oklab, var(--kid-grape) 78%, white) 100%)",
      }}
    >
      <div
        className="relative z-10 flex items-center px-4 py-3 lg:px-8 justify-between"
        dir="rtl"
      >
        {/* Logo + mascot */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-95 transition-opacity"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/95 shadow-kid flex items-center justify-center p-1.5">
              <img src={logo} alt="شعار" className="w-full h-full object-contain" />
            </div>
            <img
              src={kidBoy}
              alt=""
              aria-hidden
              className="hidden sm:block absolute -bottom-2 -left-3 w-8 h-8 drop-shadow"
            />
          </div>
          <div className="text-start text-white">
            <div className="font-black text-xl leading-none text-arabic">الفرقان</div>
            <div className="text-[11px] leading-none mt-1 opacity-90 font-medium">
              رحلة مرحة مع القرآن
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1.5 m-auto" dir="rtl">
          {NAV_ITEMS.map(({ path, label, Icon, color }) => (
            <NavLink key={path} to={path} end={path === "/"}>
              {({ isActive }) => (
                <motion.span
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer"
                  style={{
                    background: isActive ? "white" : "rgba(255,255,255,0.15)",
                    color: isActive ? color : "white",
                    boxShadow: isActive
                      ? "0 6px 0 -2px rgba(0,0,0,0.12)"
                      : "none",
                  }}
                >
                  <Icon size={18} strokeWidth={2.5} />
                  {label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors text-white"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 border-t border-white/20 px-4 pb-4"
          dir="rtl"
        >
          <div className="grid grid-cols-3 gap-2 pt-3">
            {NAV_ITEMS.map(({ path, label, Icon, color }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={() => setOpen(false)}
              >
                {({ isActive }) => (
                  <div
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-xs font-bold transition-all"
                    style={{
                      background: isActive ? "white" : "rgba(255,255,255,0.15)",
                      color: isActive ? color : "white",
                    }}
                  >
                    <Icon size={22} strokeWidth={2.5} />
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
