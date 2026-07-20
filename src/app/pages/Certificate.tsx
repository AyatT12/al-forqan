// @ts-nocheck
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RotateCcw, Palette, Image as ImageIcon, Eye, Upload, X, Sparkles, Crown, Star, Heart, Award } from "lucide-react";
import { SURAHS } from "../../lib/constants";
import { roundRectPath } from "../../lib/helpers";

// ─── TYPES ───────────────────────────────────────────
interface Template {
  id: string;
  name: string;
  hasImage: boolean;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string[];
    border: string;
    highlight: string;
  };
  fonts: {
    title: string;
    body: string;
    arabic: string;
  };
  decorations: {
    corners: boolean;
    borders: boolean;
    watermark: boolean;
    pattern: 'none' | 'dots' | 'lines' | 'stars';
  };
  style: 'classic' | 'modern' | 'elegant' | 'simple' | 'royal' | 'nature';
}

// ─── TEMPLATES ───────────────────────────────────────
const TEMPLATES: Template[] = [
  // 1. كلاسيكي ذهبي
  {
    id: "classic-gold",
    name: "كلاسيكي ذهبي",
    hasImage: true,
    icon: <Crown size={16} />,
    colors: {
      primary: "#6d32a3",
      secondary: "#C17A5C",
      accent: "#D4A843",
      text: "#2C1810",
      background: ["#FDF8F0", "#F5EDE0"],
      border: "#D4A843",
      highlight: "#6d32a3",
    },
    fonts: {
      title: "Cairo, serif",
      body: "Cairo, sans-serif",
      arabic: "Noto Naskh Arabic, serif",
    },
    decorations: {
      corners: true,
      borders: true,
      watermark: true,
      pattern: 'stars',
    },
    style: 'classic',
  },
  // 2. عصري أنيق
  {
    id: "modern-elegant",
    name: "عصري أنيق",
    hasImage: true,
    icon: <Sparkles size={16} />,
    colors: {
      primary: "#2D3436",
      secondary: "#6C5CE7",
      accent: "#A29BFE",
      text: "#2D3436",
      background: ["#FFFFFF", "#F8F9FA"],
      border: "#6C5CE7",
      highlight: "#6C5CE7",
    },
    fonts: {
      title: "Cairo, sans-serif",
      body: "Cairo, sans-serif",
      arabic: "Noto Naskh Arabic, serif",
    },
    decorations: {
      corners: false,
      borders: true,
      watermark: false,
      pattern: 'dots',
    },
    style: 'modern',
  },
 
  // 5. بسيط نظيف (بدون صورة)
  {
    id: "simple-clean",
    name: "بسيط نظيف",
    hasImage: false,
    icon: <Star size={16} />,
    colors: {
      primary: "#374151",
      secondary: "#6B7280",
      accent: "#9CA3AF",
      text: "#1F2937",
      background: ["#FFFFFF", "#F3F4F6"],
      border: "#9CA3AF",
      highlight: "#374151",
    },
    fonts: {
      title: "Cairo, serif",
      body: "Cairo, sans-serif",
      arabic: "Noto Naskh Arabic, serif",
    },
    decorations: {
      corners: false,
      borders: true,
      watermark: false,
      pattern: 'none',
    },
    style: 'simple',
  },
  // 6. ملون مرح (بدون صورة)
  {
    id: "colorful-fun",
    name: "ملون مرح",
    hasImage: false,
    icon: <Palette size={16} />,
    colors: {
      primary: "#6C3483",
      secondary: "#8E44AD",
      accent: "#AF7AC5",
      text: "#2C1A3D",
      background: ["#F4ECF7", "#E8DAEF"],
      border: "#8E44AD",
      highlight: "#6C3483",
    },
    fonts: {
      title: "Cairo, serif",
      body: "Cairo, sans-serif",
      arabic: "Noto Naskh Arabic, serif",
    },
    decorations: {
      corners: true,
      borders: true,
      watermark: true,
      pattern: 'dots',
    },
    style: 'modern',
  },
  // 7. أزرق احترافي (بدون صورة)
  {
    id: "professional-blue",
    name: "أزرق احترافي",
    hasImage: false,
    icon: <Award size={16} />,
    colors: {
      primary: "#1A237E",
      secondary: "#283593",
      accent: "#5C6BC0",
      text: "#1A1A3E",
      background: ["#E8EAF6", "#C5CAE9"],
      border: "#283593",
      highlight: "#1A237E",
    },
    fonts: {
      title: "Cairo, serif",
      body: "Cairo, sans-serif",
      arabic: "Noto Naskh Arabic, serif",
    },
    decorations: {
      corners: false,
      borders: true,
      watermark: false,
      pattern: 'none',
    },
    style: 'classic',
  },
  // 8. وردي ناعم (مع صورة)
  {
    id: "soft-pink",
    name: "وردي ناعم",
    hasImage: true,
    icon: <Heart size={16} />,
    colors: {
      primary: "#880E4F",
      secondary: "#AD1457",
      accent: "#F06292",
      text: "#4A1A2C",
      background: ["#FCE4EC", "#F8BBD0"],
      border: "#AD1457",
      highlight: "#880E4F",
    },
    fonts: {
      title: "Cairo, serif",
      body: "Cairo, sans-serif",
      arabic: "Noto Naskh Arabic, serif",
    },
    decorations: {
      corners: true,
      borders: true,
      watermark: true,
      pattern: 'stars',
    },
    style: 'elegant',
  },
];

// ─── COMPONENTS ──────────────────────────────────────

// نافذة رفع الصورة
function ImageUploadModal({ 
  isOpen, 
  onClose, 
  onImageUpload 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onImageUpload: (imageData: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من حجم الصورة (حد أقصى 5 ميجابايت)
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت");
      return;
    }

    // التحقق من نوع الصورة
    if (!file.type.startsWith('image/')) {
      setError("الرجاء اختيار ملف صورة صحيح");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setError(null);
    };
    reader.onerror = () => {
      setError("حدث خطأ أثناء قراءة الملف");
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (preview) {
      onImageUpload(preview);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ fontFamily: "Cairo, sans-serif", color: "#6d32a3" }}>
            <Upload className="inline-block ml-2" size={20} />
            رفع صورة للشهادة
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              preview ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="معاينة" className="max-h-48 mx-auto rounded-lg" />
                <p className="text-sm text-emerald-600" style={{ fontFamily: "Cairo, sans-serif" }}>
                  ✓ تم اختيار الصورة
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                  style={{ fontFamily: "Cairo, sans-serif" }}
                >
                  إزالة الصورة
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">🖼️</div>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cairo, sans-serif" }}>
                  اضغط لاختيار صورة
                </p>
                <p className="text-xs text-gray-400" style={{ fontFamily: "Cairo, sans-serif" }}>
                  PNG, JPG, JPEG (حجم أقصى 5 ميجابايت)
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600" style={{ fontFamily: "Cairo, sans-serif" }}>
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={!preview}
              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              تأكيد
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              إلغاء
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// معاينة الشهادة
function CertPreview({ 
  studentName, 
  surahName, 
  teacherName, 
  level, 
  date,
  template,
  customImage
}: {
  studentName: string; 
  surahName: string; 
  teacherName: string; 
  level: string; 
  date: string;
  template: Template;
  customImage?: string | null;
}) {
  const { colors, fonts, decorations, style } = template;
  
  // رسم النقوش
  const renderPattern = () => {
    if (decorations.pattern === 'dots') {
      return (
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>
      );
    }
    if (decorations.pattern === 'lines') {
      return (
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 20px)'
          }} />
        </div>
      );
    }
    if (decorations.pattern === 'stars') {
      return (
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-1/4 left-1/4 text-5xl">✦</div>
          <div className="absolute bottom-1/4 right-1/4 text-4xl">✦</div>
          <div className="absolute top-1/3 right-1/3 text-5xl">✦</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.background[0]}, ${colors.background[1]})`,
        fontFamily: fonts.title,
        aspectRatio: "1.414",
        minHeight: "260px" 
      }}
      dir="rtl"
    >
      {/* النقوش */}
      {renderPattern()}

      {/* الصورة المرفوعة */}
      {customImage && (
        <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-2 overflow-hidden shadow-lg" style={{ borderColor: colors.accent }}>
          <img src={customImage} alt="صورة الطالب" className="w-full h-full object-cover" />
        </div>
      )}

      {/* أيقونة افتراضية إذا لم تكن هناك صورة مرفوعة */}
      {!customImage && template.hasImage && (
        <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-2 overflow-hidden flex items-center justify-center text-4xl" style={{ borderColor: colors.accent, background: colors.accent + '20' }}>
          📖
        </div>
      )}

      {/* الإطارات */}
      {decorations.borders && (
        <>
          <div className="absolute inset-2 border-4" style={{ borderColor: colors.border }} />
          <div className="absolute inset-4 border" style={{ borderColor: colors.secondary }} />
        </>
      )}

      {/* الزوايا */}
      {decorations.corners && (
        <>
          {([["top-2 right-2","0"],["top-2 left-2","90deg"],["bottom-2 left-2","180deg"],["bottom-2 right-2","270deg"]] as const).map(([cls, r]) => (
            <div key={r} className={`absolute ${cls} w-14 h-14`} style={{ transform: `rotate(${r})` }}>
              <svg viewBox="0 0 56 56" fill="none">
                <path d="M0 0 L56 0 L0 56 Z" fill={colors.accent} opacity="0.15"/>
                <circle cx="8" cy="8" r="4" fill={colors.accent}/>
                <circle cx="8" cy="8" r="2" fill="white" opacity="0.5"/>
              </svg>
            </div>
          ))}
        </>
      )}

      {/* واترمارك */}
      {decorations.watermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <div className="text-8xl" style={{ color: colors.accent }}>✦</div>
        </div>
      )}

      {/* المحتوى */}
      <div className={`absolute inset-8 flex flex-col items-center justify-center text-center gap-1.5 ${
        style === 'modern' ? 'p-4' : ''
      }`}>
        {template.hasImage && (
          <div style={{ color: colors.secondary, fontFamily: fonts.arabic, fontSize: "clamp(0.6rem,1.6vw,0.85rem)" }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </div>
        )}
        
        <div className="font-bold" style={{ color: colors.primary, fontSize: "clamp(0.85rem,2.2vw,1.3rem)" }}>
          شهادة تقدير 
        </div>
        
        <div className="flex items-center gap-2 w-36">
          <div className="flex-1 h-px" style={{ background: colors.accent }}/>
          <div className={`w-1.5 h-1.5 rounded-full ${style === 'modern' ? 'w-2 h-2' : ''}`} style={{ background: colors.accent }}/>
          <div className="flex-1 h-px" style={{ background: colors.accent }}/>
        </div>
        
        <div style={{ color: colors.text, fontFamily: fonts.body, fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          يُشهد بأن الطالب / الطالبة
        </div>
        
        <div 
          className="font-bold px-4 py-1 rounded-lg"
          style={{ 
            color: colors.primary, 
            background: colors.primary + '10', 
            border: `1px solid ${colors.primary}30`,
            fontSize: "clamp(0.75rem,1.8vw,1.1rem)" 
          }}
        >
          {studentName || "اسم الطالب"}
        </div>
        
        <div style={{ color: colors.text, fontFamily: fonts.body, fontSize: "clamp(0.5rem,1.2vw,0.75rem)" }}>
          قد أتمّ حفظ سورة
        </div>
        
        <div className="font-bold" style={{ color: colors.secondary, fontFamily: fonts.arabic, fontSize: "clamp(0.7rem,1.6vw,1rem)" }}>
          {surahName}
        </div>
        
        <div 
          className={`font-bold px-3 py-0.5 rounded-full ${style === 'modern' ? 'shadow-md' : ''}`}
          style={{ 
            background: colors.accent, 
            color: style === 'royal' ? '#FFF' : '#2C1810',
            fontSize: "clamp(0.6rem,1.4vw,0.85rem)" 
          }}
        >
          {level}
        </div>
        
        <div className="flex items-center justify-between w-full mt-1" style={{ color: colors.text, fontFamily: fonts.body, fontSize: "clamp(0.45rem,1vw,0.65rem)" }}>
          <div className="text-center">
            <div>المعلم</div>
            <div className="font-bold" style={{ color: colors.primary, fontFamily: fonts.title, fontSize: "clamp(0.6rem,1.4vw,0.85rem)" }}>
              {teacherName || "اسم المعلم"}
            </div>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-center">
            <div>التاريخ</div>
            <div className="font-bold" style={{ color: colors.primary, fontSize: "clamp(0.5rem,1.1vw,0.7rem)" }}>
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// اختيار القالب
function TemplateSelector({ 
  templates, 
  selectedId, 
  onSelect 
}: { 
  templates: Template[]; 
  selectedId: string; 
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium block" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>
        اختر قالب الشهادة
      </label>
      
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={`p-2 rounded-xl border-2 transition-all text-center ${
              selectedId === template.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs">
              <span className="text-base">{template.icon}</span>
              <span style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810", fontSize: '0.7rem' }}>
                {template.name}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[template.colors.primary, template.colors.secondary, template.colors.accent].map((color, i) => (
                <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ background: color }} />
              ))}
            </div>
            <div className="text-[0.5rem] text-gray-400 mt-0.5" style={{ fontFamily: "Cairo, sans-serif" }}>
              {template.hasImage ? '📷 مع صورة' : '📝 بدون صورة'}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────

export default function Certificate() {
  const [studentName, setStudentName] = useState("");
  const [surahName, setSurahName] = useState("الفاتحة");
  const [teacherName, setTeacherName] = useState("");
  const [level, setLevel] = useState("ممتاز");
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  const downloadCertificate = async () => {
    setDownloading(true);
    await document.fonts.ready;
    const W = 1414, H = 1000;
    const cvs = document.createElement("canvas");
    cvs.width = W; cvs.height = H;
    const ctx = cvs.getContext("2d")!;
    const { colors, fonts, decorations, style } = selectedTemplate;

    // خلفية مع نقش
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, colors.background[0]);
    grad.addColorStop(1, colors.background[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // نقش الخلفية
    if (decorations.pattern === 'dots') {
      ctx.fillStyle = colors.accent;
      ctx.globalAlpha = 0.05;
      for (let x = 0; x < W; x += 20) {
        for (let y = 0; y < H; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    // إطارات
    if (decorations.borders) {
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = style === 'modern' ? 6 : 10;
      ctx.strokeRect(16, 16, W-32, H-32);
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = style === 'modern' ? 2 : 3;
      ctx.strokeRect(34, 34, W-68, H-68);
    }

    // زوايا
    if (decorations.corners) {
      const cornerSize = style === 'royal' ? 20 : 10;
      [[cornerSize, cornerSize],[W-cornerSize, cornerSize],[cornerSize, H-cornerSize],[W-cornerSize, H-cornerSize]].forEach(([x,y]) => {
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(x, y, cornerSize, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, cornerSize/2, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // الصورة المرفوعة
    if (customImage) {
      try {
        const img = new Image();
        img.src = customImage;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        const imgSize = 150;
        const imgX = 60, imgY = 60;
        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
        ctx.restore();
        // إطار الصورة
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.stroke();
      } catch(e) {
        // إذا فشل تحميل الصورة
      }
    } else if (selectedTemplate.hasImage) {
      // أيقونة افتراضية
      const imgSize = 100;
      const imgX = 80, imgY = 80;
      ctx.fillStyle = colors.accent + '20';
      ctx.beginPath();
      ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = colors.accent;
      ctx.font = "60px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("📖", imgX + imgSize/2, imgY + imgSize/2 + 5);
    }

    // النصوص
    ctx.direction = "rtl";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    let yOffset = 0;
    if (selectedTemplate.hasImage || customImage) {
      ctx.fillStyle = colors.secondary;
      ctx.font = `38px "${fonts.arabic}"`;
      ctx.fillText("بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", W/2, 130);
      yOffset = 20;
    }

    ctx.fillStyle = colors.primary;
    ctx.font = `bold ${style === 'royal' ? '78px' : '68px'} "${fonts.title}"`;
    ctx.fillText("شهادة تقدير ", W/2, 190 + yOffset);

    // خط فاصل
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = style === 'modern' ? 1 : 2;
    ctx.beginPath();
    ctx.moveTo(W/2-220, 230 + yOffset);
    ctx.lineTo(W/2+220, 230 + yOffset);
    ctx.stroke();
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(W/2, 230 + yOffset, style === 'modern' ? 4 : 6, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = colors.text;
    ctx.font = `36px "${fonts.body}"`;
    ctx.fillText("يُشهد بأن الطالب / الطالبة", W/2, 300 + yOffset);

    // اسم الطالب
    roundRectPath(ctx, W/2-260, 320 + yOffset, 520, 72, 14);
    ctx.fillStyle = colors.primary + '10';
    ctx.fill();
    ctx.strokeStyle = colors.primary + '30';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = colors.primary;
    ctx.font = `bold 56px "${fonts.title}"`;
    ctx.fillText(studentName || "اسم الطالب", W/2, 377 + yOffset);

    ctx.fillStyle = colors.text;
    ctx.font = `36px "${fonts.body}"`;
    ctx.fillText("قد أتمّ حفظ سورة", W/2, 470 + yOffset);

    ctx.fillStyle = colors.secondary;
    ctx.font = `bold 58px "${fonts.arabic}"`;
    ctx.fillText(surahName, W/2, 550 + yOffset);

    ctx.fillStyle = colors.text;
    ctx.font = `34px "${fonts.body}"`;
    ctx.fillText("وأجاد في التلاوة بتقدير", W/2, 620 + yOffset);

    // مستوى التقدير
    roundRectPath(ctx, W/2-110, 638 + yOffset, 220, 58, 29);
    ctx.fillStyle = colors.accent;
    ctx.fill();
    ctx.fillStyle = style === 'royal' ? '#FFF' : '#2C1810';
    ctx.font = `bold 38px "${fonts.body}"`;
    ctx.fillText(level, W/2, 678 + yOffset);

    // خط فاصل سفلي
    ctx.strokeStyle = colors.accent + '40';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W/2, 780 + yOffset);
    ctx.lineTo(W/2, 890 + yOffset);
    ctx.stroke();

    // المعلم والتاريخ
    ctx.fillStyle = colors.text;
    ctx.font = `28px "${fonts.body}"`;
    ctx.fillText("المعلم / المعلمة", W/2-220, 810 + yOffset);
    ctx.fillStyle = colors.primary;
    ctx.font = `bold 38px "${fonts.title}"`;
    ctx.fillText(teacherName || "اسم المعلم", W/2-220, 860 + yOffset);

    ctx.fillStyle = colors.text;
    ctx.font = `28px "${fonts.body}"`;
    ctx.fillText("التاريخ", W/2+220, 810 + yOffset);
    ctx.fillStyle = colors.primary;
    ctx.font = `bold 32px "${fonts.body}"`;
    ctx.fillText(today, W/2+220, 858 + yOffset);

    // تصدير
    cvs.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `شهادة-${studentName || "الطالب"}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      setDownloading(false);
    }, "image/png");
  };

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto" dir="rtl">
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Cairo, serif", color: "#6d32a3" }}>
        شهادات التقدير - قوالب متعددة
      </h2>
      
      {/* نافذة رفع الصورة */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageUpload={(imageData) => setCustomImage(imageData)}
      />

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* النموذج */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          {/* اختيار القالب */}
          <TemplateSelector
            templates={TEMPLATES}
            selectedId={selectedTemplateId}
            onSelect={setSelectedTemplateId}
          />

          <div className="border-t border-border pt-4 space-y-4">
            {/* رفع الصورة */}
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>
                صورة الطالب (اختياري)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                  style={{ fontFamily: "Cairo, sans-serif" }}
                >
                  <Upload size={16} />
                  {customImage ? 'تغيير الصورة' : 'رفع صورة'}
                </button>
                {customImage && (
                  <button
                    onClick={() => setCustomImage(null)}
                    className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                    style={{ fontFamily: "Cairo, sans-serif" }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {customImage && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-200">
                    <img src={customImage} alt="صورة" className="w-full h-full object-cover" />
                  </div>
                  <span style={{ fontFamily: "Cairo, sans-serif" }}>✓ تم رفع الصورة</span>
                </div>
              )}
            </div>

            {([
              ["اسم الطالب / الطالبة", studentName, setStudentName, "أدخل الاسم الكامل"],
              ["اسم المعلم / المعلمة", teacherName, setTeacherName, "أدخل اسم المعلم"],
            ] as const).map(([label, val, set, ph]) => (
              <div key={label}>
                <label className="text-sm font-medium block mb-1.5" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>
                  {label}
                </label>
                <input
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:border-primary transition-colors text-right"
                  style={{ fontFamily: "Cairo, sans-serif" }}
                  dir="rtl"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>
                السورة المحفوظة
              </label>
              <select
                value={surahName}
                onChange={e => setSurahName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:border-primary text-right"
                style={{ fontFamily: "Cairo, serif", color: "#2C1810" }}
                dir="rtl"
              >
                {SURAHS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ fontFamily: "Cairo, sans-serif", color: "#2C1810" }}>
                التقدير
              </label>
              <div className="flex gap-2">
                {["ممتاز", "جيد جداً", "جيد"].map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      background: level === l ? selectedTemplate.colors.accent : "transparent",
                      color: level === l ? "#2C1810" : "#7A5C48",
                      borderColor: level === l ? selectedTemplate.colors.accent : "rgba(139,105,20,0.2)",
                      fontFamily: "Cairo, sans-serif"
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={downloadCertificate}
            disabled={!studentName || !teacherName || downloading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white disabled:opacity-50 transition-colors"
            style={{ 
              background: downloading ? "#7A5C48" : selectedTemplate.colors.primary,
              fontFamily: "Cairo, sans-serif" 
            }}
          >
            {downloading ? (
              <><RotateCcw size={18} className="animate-spin" />... جاري التحميل</>
            ) : (
              <><Download size={18} /> تحميل الشهادة PNG</>
            )}
          </motion.button>
        </div>

        {/* المعاينة */}
        <div>
          <p className="font-bold text-base mb-3" style={{ fontFamily: "Cairo, serif", color: "#2C1810" }}>
            معاينة الشهادة
          </p>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm transition-all">
            <CertPreview
              studentName={studentName}
              surahName={surahName}
              teacherName={teacherName}
              level={level}
              date={today}
              template={selectedTemplate}
              customImage={customImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}