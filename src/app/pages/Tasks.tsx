// @ts-nocheck
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ListChecks, Download, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import kidPoint from "../../Assets/images/kid-point.png";

const STORAGE_KEY = "halaqa_tasks_v2";

const FIXED_TASKS = [
  { key: "tasmee3", label: "التسميع", color: "#4DA69B" },
  { key: "muraja3a", label: "المراجعة", color: "#9080C4" },
  { key: "tajweed", label: "التجويد", color: "#D99A6C" },
  { key: "tafseer", label: "التفسير", color: "#6FA8C9" },
];

type State = {
  studentName: string;
  halaqaNumber: string;
  adab: string;
  notes: Record<string, string>;
  done: Record<string, boolean>;
};

const INITIAL: State = {
  studentName: "",
  halaqaNumber: "",
  adab: "",
  notes: { tasmee3: "", muraja3a: "", tajweed: "", tafseer: "" },
  done: { tasmee3: false, muraja3a: false, tajweed: false, tafseer: false },
};

function todayStr() {
  const d = new Date();
  return d.toLocaleDateString("ar-EG-u-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------- Canvas report drawing helpers ----------

const AR_FONT = "'Tahoma', 'Segoe UI', Arial, sans-serif";

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function buildReportCanvas(state: State) {
  const W = 1000;
  const PAD = 40;
  const contentW = W - PAD * 2;
  const date = todayStr();

  // Measuring pass (offscreen canvas) to know note line counts / total height
  const measure = document.createElement("canvas");
  const mctx = measure.getContext("2d")!;
  mctx.direction = "rtl";
  mctx.font = `600 20px ${AR_FONT}`;

  const rowNoteMaxWidth = contentW - 260; // notes column width
  const rowsInfo = FIXED_TASKS.map((t) => {
    const noteLines = wrapLines(mctx, state.notes[t.key] || "—", rowNoteMaxWidth);
    return { ...t, noteLines };
  });
  const rowHeights = rowsInfo.map((r) => Math.max(70, 34 + r.noteLines.length * 26));
  const tableRowsH = rowHeights.reduce((a, b) => a + b, 0);

  mctx.font = `500 19px ${AR_FONT}`;
  const adabLines = wrapLines(mctx, state.adab || "—", contentW - 80);
  const adabBoxH = 70 + adabLines.length * 27;

  const headerH = 165;
  const metaH = 80;
  const tableHeaderH = 56;
  const gapS = 22;
  const footerH = 70;

  const H =
    headerH +
    gapS +
    metaH +
    gapS +
    tableHeaderH +
    tableRowsH +
    gapS +
    adabBoxH +
    gapS +
    footerH +
    PAD * 2;

  const canvas = document.createElement("canvas");
  const scale = 2; // crisper export
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.direction = "rtl";

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#F4F7F5");
  bgGrad.addColorStop(1, "#FBF6F0");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Outer card
  ctx.save();
  ctx.shadowColor = "rgba(15,23,42,0.15)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, PAD / 2, PAD / 2, W - PAD, H - PAD, 28);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  let y = PAD;

  // ---- Header banner ----
  const headerGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  headerGrad.addColorStop(0, "#BFE3DC");
  headerGrad.addColorStop(1, "#D9D2EE");
  roundRect(ctx, PAD, y, contentW, headerH, 22);
  ctx.fillStyle = headerGrad;
  ctx.fill();

  // decorative circles
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(PAD + 60, y + headerH - 20, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W - PAD - 40, y + 30, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#3F4A47";
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.font = `900 40px ${AR_FONT}`;
  ctx.fillText("تقرير الحلقة", W - PAD - 40, y + 68);
  ctx.font = `600 19px ${AR_FONT}`;
  ctx.fillStyle = "#5B665F";
  ctx.fillText("سجل المتابعة اليومي لأداء الطالب", W - PAD - 40, y + 100);

  y += headerH + gapS;

  // ---- Meta pills (name / halaqa number / date) ----
  const pillW = (contentW - 24) / 3;
  const pillColors = [
    { bg: "#EAF4F1", fg: "#4B7A73", label: "الطالب", value: state.studentName || "—" },
    { bg: "#F0EDF9", fg: "#7A6FA6", label: "رقم الحلقة", value: state.halaqaNumber || "—" },
    { bg: "#FBF1E7", fg: "#B08360", label: "التاريخ", value: date },
  ];
  pillColors.forEach((p, i) => {
    const px = PAD + i * (pillW + 12);
    roundRect(ctx, px, y, pillW, metaH, 18);
    ctx.fillStyle = p.bg;
    ctx.fill();
    ctx.fillStyle = p.fg;
    ctx.textAlign = "center";
    ctx.font = `700 15px ${AR_FONT}`;
    ctx.fillText(p.label, px + pillW / 2, y + 30);
    ctx.font = `900 22px ${AR_FONT}`;
    ctx.fillText(p.value, px + pillW / 2, y + 60);
  });
  ctx.textAlign = "right";

  y += metaH + gapS;

  // ---- Table header ----
  const colStatusW = 90;
  const colTaskW = 170;
  const colNoteW = contentW - colStatusW - colTaskW;
  const tableGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  tableGrad.addColorStop(0, "#C9E4DE");
  tableGrad.addColorStop(1, "#DCD6EE");
  roundRect(ctx, PAD, y, contentW, tableHeaderH, 14);
  ctx.fillStyle = tableGrad;
  ctx.fill();

  ctx.fillStyle = "#3F4A47";
  ctx.font = `800 17px ${AR_FONT}`;
  ctx.textAlign = "center";
  ctx.fillText("الحالة", W - PAD - colStatusW / 2, y + tableHeaderH / 2 + 6);
  ctx.textAlign = "right";
  ctx.fillText("المهمة", W - PAD - colStatusW - colTaskW + colTaskW - 12, y + tableHeaderH / 2 + 6);
  ctx.fillText("الملاحظات", W - PAD - colStatusW - colTaskW - 12, y + tableHeaderH / 2 + 6);

  y += tableHeaderH;

  // ---- Table rows ----
  rowsInfo.forEach((row, i) => {
    const rh = rowHeights[i];
    ctx.fillStyle = i % 2 === 0 ? "#F7F6F3" : "#ffffff";
    ctx.fillRect(PAD, y, contentW, rh);

    // status badge
    const done = state.done[row.key];
    const cx = W - PAD - colStatusW / 2;
    const cy = y + rh / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = done ? "#B7DDC7" : "#EAEDEC";
    ctx.fill();
    ctx.fillStyle = done ? "#4E7C5D" : "#A8B0AD";
    ctx.font = "900 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(done ? "✓" : "–", cx, cy + 1);
    ctx.textBaseline = "alphabetic";

    // task label
    ctx.fillStyle = row.color;
    ctx.font = `900 20px ${AR_FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(row.label, W - PAD - colStatusW - 14, y + 34);

    // small colored dot before label
    ctx.beginPath();
    ctx.arc(W - PAD - colStatusW - 14 - ctx.measureText(row.label).width - 14, y + 29, 5, 0, Math.PI * 2);
    ctx.fillStyle = row.color;
    ctx.fill();

    // notes
    ctx.fillStyle = "#5C6663";
    ctx.font = `500 17px ${AR_FONT}`;
    row.noteLines.forEach((line: string, li: number) => {
      ctx.fillText(line, W - PAD - colStatusW - colTaskW - 12, y + 30 + li * 26);
    });

    // divider
    ctx.strokeStyle = "#EAEDEC";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, y + rh);
    ctx.lineTo(PAD + contentW, y + rh);
    ctx.stroke();

    y += rh;
  });

  y += gapS;

  // ---- Adab box ----
  roundRect(ctx, PAD, y, contentW, adabBoxH, 18);
  ctx.fillStyle = "#FBF1E7";
  ctx.fill();
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = "#E3C9A8";
  ctx.lineWidth = 2.5;
  roundRect(ctx, PAD, y, contentW, adabBoxH, 18);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#A67C52";
  ctx.font = `900 20px ${AR_FONT}`;
  ctx.textAlign = "right";
  ctx.fillText("الالتزام بآداب الحلقة", W - PAD - 24, y + 34);

  ctx.fillStyle = "#8C6A4A";
  ctx.font = `500 18px ${AR_FONT}`;
  adabLines.forEach((line, li) => {
    ctx.fillText(line, W - PAD - 24, y + 66 + li * 27);
  });

  y += adabBoxH + gapS;

  // ---- Footer ----
  ctx.fillStyle = "#94a3b8";
  ctx.font = `600 14px ${AR_FONT}`;
  ctx.textAlign = "center";
  ctx.fillText("بارك الله فيك وجعلك من أهل القرآن", W / 2, y + 28);
  ctx.font = `500 12px ${AR_FONT}`;
  ctx.fillText(`تم إنشاء التقرير بتاريخ ${date}`, W / 2, y + 50);

  return canvas;
}

export default function Tasks() {
  const [state, setState] = useState<State>(INITIAL);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...INITIAL, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  function setNote(k: string, v: string) {
    setState((p) => ({ ...p, notes: { ...p.notes, [k]: v } }));
  }
  function toggleDone(k: string) {
    setState((p) => {
      const next = !p.done[k];
      if (next) {
        try {
          window.dispatchEvent(
            new CustomEvent("mascot:cheer", { detail: "أحسنت! أنجزت المهمة 🌟" }),
          );
        } catch {}
      }
      return { ...p, done: { ...p.done, [k]: next } };
    });
  }

  async function downloadReport() {
    try {
      setExporting(true);
      const canvas = await buildReportCanvas(state);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      const namePart = state.studentName ? `-${state.studentName}` : "";
      a.download = `تقرير-الحلقة-${state.halaqaNumber || "بدون-رقم"}${namePart}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setExporting(false);
    }
  }

  const doneCount = FIXED_TASKS.filter((t) => state.done[t.key]).length;

  return (
    <div className="min-h-full bg-kid-page py-8 px-4 lg:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-6 lg:p-8 shadow-kid overflow-hidden mb-6"
          style={{
            background:
              "linear-gradient(120deg, color-mix(in oklab, var(--kid-sky) 85%, white), color-mix(in oklab, var(--kid-mint) 80%, white))",
          }}
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-kid">
              <ListChecks size={32} strokeWidth={2.5} className="text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-black text-arabic text-foreground">
                مهام الحلقة
              </h1>
              <p className="text-sm lg:text-base text-foreground/70 font-medium mt-1">
                سجّل ملاحظات كل مهمة و حمّل تقرير الحلقة كصورة ملونة بضغطة زر ✨
              </p>
            </div>
            <img
              src={kidPoint}
              alt=""
              className="hidden md:block w-24 h-24 object-contain drop-shadow-lg"
            />
          </div>
        </motion.div>

        {/* Student name + Halaqa number */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-5 shadow-kid border-4 border-white mb-6 grid md:grid-cols-3 gap-4"
        >
          <div>
            <Label className="text-base font-black mb-2 block">اسم الطالب</Label>
            <Input
              value={state.studentName}
              onChange={(e) =>
                setState((p) => ({ ...p, studentName: e.target.value }))
              }
              placeholder="مثال: محمد أحمد"
              className="h-12 text-base font-bold rounded-2xl"
            />
          </div>
          <div>
            <Label className="text-base font-black mb-2 block">رقم الحلقة</Label>
            <Input
              value={state.halaqaNumber}
              onChange={(e) =>
                setState((p) => ({ ...p, halaqaNumber: e.target.value }))
              }
              placeholder="مثال: 12"
              className="h-12 text-base font-bold rounded-2xl"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-muted-foreground font-bold">
              التاريخ: <span className="text-foreground">{todayStr()}</span>
              <div className="mt-1">
                المنجز: <span className="text-foreground">{doneCount} / {FIXED_TASKS.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tasks table */}
        <div className="bg-card rounded-3xl shadow-kid border-4 border-white overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr
                  className="text-white text-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--kid-teal), var(--kid-grape))",
                  }}
                >
                  <th className="p-4 font-black w-20 text-center">تم</th>
                  <th className="p-4 font-black w-40">المهمة</th>
                  <th className="p-4 font-black">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {FIXED_TASKS.map((t, i) => (
                  <tr
                    key={t.key}
                    className={`border-b last:border-0 ${
                      i % 2 === 0 ? "bg-background/40" : ""
                    } ${state.done[t.key] ? "opacity-70" : ""}`}
                  >
                    <td className="p-4 text-center align-middle">
                      <button
                        onClick={() => toggleDone(t.key)}
                        aria-label="علّم كمنجز"
                        className="w-8 h-8 rounded-lg border-4 flex items-center justify-center transition-all mx-auto"
                        style={{
                          borderColor: state.done[t.key]
                            ? "var(--kid-teal)"
                            : "color-mix(in oklab, var(--kid-teal) 40%, white)",
                          background: state.done[t.key] ? "var(--kid-teal)" : "white",
                        }}
                      >
                        {state.done[t.key] && (
                          <span className="text-white font-black text-lg">✓</span>
                        )}
                      </button>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`text-lg font-black text-arabic ${
                          state.done[t.key] ? "line-through" : ""
                        }`}
                        style={{ color: t.color }}
                      >
                        {t.label}
                      </span>
                    </td>
                    <td className="p-3 align-middle">
                      <Textarea
                        value={state.notes[t.key]}
                        onChange={(e) => setNote(t.key, e.target.value)}
                        placeholder="اكتب ملاحظاتك هنا…"
                        className="min-h-[52px] rounded-xl text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adab */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 shadow-kid border-4 border-white mb-6"
          style={{
            background:
              "linear-gradient(120deg, color-mix(in oklab, var(--kid-sun) 40%, white), color-mix(in oklab, var(--kid-coral) 30%, white))",
          }}
        >
          <Label className="text-lg font-black mb-2 block text-arabic">
            الالتزام بآداب الحلقة
          </Label>
          <Textarea
            value={state.adab}
            onChange={(e) => setState((p) => ({ ...p, adab: e.target.value }))}
            placeholder="مثال: الحضور مبكراً، الاحترام، الإنصات، حسن الجلوس…"
            className="min-h-[100px] rounded-2xl bg-white/70 text-base font-medium"
          />
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end items-center">
          
          <Button
            onClick={downloadReport}
            disabled={exporting}
            className="h-12 px-6 rounded-2xl font-black text-base gap-2"
          >
            <Download size={20} strokeWidth={3} />
            {exporting ? "...جاري التجهيز" : "تقرير الحلقة "}
          </Button>
        </div>
      </div>
    </div>
  );
}