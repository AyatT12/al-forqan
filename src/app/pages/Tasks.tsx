// @ts-nocheck
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

// Character images — save all 6 PNGs into ../../Assets/images/
import kidPoint from "../../Assets/images/kid-point.png";
import kidPaint from "../../Assets/images/kid-paint.png";
import kidBoy from "../../Assets/images/kid-boy.png";
import kidCheer from "../../Assets/images/kid-cheer.png";
import kidClap from "../../Assets/images/kid-clap.png";
import heroKids from "../../Assets/images/hero-kids.png";

const STORAGE_KEY = "halaqa_tasks_v2";

// STRONGER COLORS - more vibrant and saturated
const FIXED_TASKS = [
  { key: "tasmee3", label: "التسميع", color: "#2D8F82" }, // Stronger teal
  { key: "muraja3a", label: "المراجعة", color: "#7A5EBF" }, // Stronger purple
  { key: "tajweed", label: "التجويد", color: "#D4874A" }, // Stronger orange
  { key: "tafseer", label: "التفسير", color: "#4A8FC4" }, // Stronger blue
];

type TemplateId = "colorful" | "playful" | "classic" | "minimal";

const TEMPLATES: { id: TemplateId; name: string; desc: string; bg: string; accent: string }[] = [
  { id: "colorful", name: "الملوّن", desc: "التصميم الأصلي", bg: "linear-gradient(135deg,#E8F5F2,#FDF3E8)", accent: "#2D8F82" },
  { id: "playful", name: "المرح بالشخصيات", desc: "يحتوي على الشخصيات الكرتونية", bg: "linear-gradient(135deg,#FFD6E0,#D4E8FF)", accent: "#E84A6F" },
  { id: "classic", name: "الأنيق الكلاسيكي", desc: "زخارف إسلامية، ذهبي وأخضر زمردي", bg: "linear-gradient(135deg,#F2E8C8,#D4E8D4)", accent: "#0A4A3A" },
  { id: "minimal", name: "العصري البسيط", desc: "نظيف وواسع وحديث", bg: "#F5F5F0", accent: "#1A1A24" },
];

type State = {
  studentName: string;
  halaqaNumber: string;
  adab: string;
  notes: Record<string, string>;
  done: Record<string, boolean>;
  template: TemplateId;
};

const INITIAL: State = {
  studentName: "",
  halaqaNumber: "",
  adab: "",
  notes: { tasmee3: "", muraja3a: "", tajweed: "", tafseer: "" },
  done: { tasmee3: false, muraja3a: false, tajweed: false, tafseer: false },
  template: "colorful",
};

function todayStr() {
  return new Date().toLocaleDateString("ar-EG-u-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------- Shared canvas helpers ----------
const AR_FONT = "'Tahoma', 'Segoe UI', Arial, sans-serif";

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const t = current ? `${current} ${w}` : w;
    if (ctx.measureText(t).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else current = t;
  }
  if (current) lines.push(current);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// ============================================================
// TEMPLATE 1 — COLORFUL (original) with STRONGER colors
// ============================================================
async function buildColorful(state: State) {
  const W = 1000, PAD = 40, contentW = W - PAD * 2;
  const date = todayStr();
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.direction = "rtl";
  measure.font = `600 20px ${AR_FONT}`;
  const rowNoteMaxW = contentW - 260;
  const rowsInfo = FIXED_TASKS.map((t) => ({ ...t, noteLines: wrapLines(measure, state.notes[t.key] || "—", rowNoteMaxW) }));
  const rowHeights = rowsInfo.map((r) => Math.max(70, 34 + r.noteLines.length * 26));
  const tableRowsH = rowHeights.reduce((a, b) => a + b, 0);
  measure.font = `500 19px ${AR_FONT}`;
  const adabLines = wrapLines(measure, state.adab || "—", contentW - 80);
  const adabBoxH = 70 + adabLines.length * 27;
  const headerH = 165, metaH = 80, tableHeaderH = 56, gapS = 22, footerH = 70;
  const H = headerH + gapS + metaH + gapS + tableHeaderH + tableRowsH + gapS + adabBoxH + gapS + footerH + PAD * 2;

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = W * scale; canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.direction = "rtl";

  // Stronger gradient background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#E8F5F2"); 
  bg.addColorStop(0.5, "#F8F0E8");
  bg.addColorStop(1, "#FDF3E8");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.shadowColor = "rgba(15,23,42,0.2)"; 
  ctx.shadowBlur = 30; 
  ctx.shadowOffsetY = 10;
  roundRect(ctx, PAD / 2, PAD / 2, W - PAD, H - PAD, 28);
  ctx.fillStyle = "#fff"; ctx.fill();
  ctx.restore();

  let y = PAD;
  // Stronger gradient header
  const hg = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  hg.addColorStop(0, "#2dcaab"); 
  hg.addColorStop(0.5, "#7e59eb");
  hg.addColorStop(1, "#4c2f70");
  roundRect(ctx, PAD, y, contentW, headerH, 22); 
  ctx.fillStyle = hg; 
  ctx.fill();
  ctx.save(); 
  ctx.globalAlpha = 0.2; 
  ctx.fillStyle = "#fff";
  ctx.beginPath(); 
  ctx.arc(PAD + 60, y + headerH - 20, 70, 0, Math.PI * 2); 
  ctx.fill();
  ctx.beginPath(); 
  ctx.arc(W - PAD - 40, y + 30, 50, 0, Math.PI * 2); 
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#1A3A35"; 
  ctx.textAlign = "right"; 
  ctx.textBaseline = "alphabetic";
  ctx.font = `900 40px ${AR_FONT}`; 
  ctx.fillText("تقرير الحلقة", W - PAD - 40, y + 68);
  ctx.font = `600 19px ${AR_FONT}`; 
  ctx.fillStyle = "#3A5A55";
  ctx.fillText("سجل المتابعة اليومي لأداء الطالب", W - PAD - 40, y + 100);
  y += headerH + gapS;

  const pillW = (contentW - 24) / 3;
  const pills = [
    { bg: "#70d6bd", fg: "#1A5A4A", label: "الطالب", value: state.studentName || "—" },
    { bg: "#ba90f8", fg: "#5A3A8A", label: "رقم الحلقة", value: state.halaqaNumber || "—" },
    { bg: "#ffaa6d", fg: "#8A5A30", label: "التاريخ", value: date },
  ];
  pills.forEach((p, i) => {
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

  const colStatusW = 90, colTaskW = 170;
  // Stronger table header gradient
  const tg = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  tg.addColorStop(0, "#A8D5CC"); 
  tg.addColorStop(0.5, "#B8A8E0");
  tg.addColorStop(1, "#D4C4E8");
  roundRect(ctx, PAD, y, contentW, tableHeaderH, 14); 
  ctx.fillStyle = tg; 
  ctx.fill();
  ctx.fillStyle = "#1A3A35"; 
  ctx.font = `800 17px ${AR_FONT}`;
  ctx.textAlign = "center"; 
  ctx.fillText("الحالة", W - PAD - colStatusW / 2, y + tableHeaderH / 2 + 6);
  ctx.textAlign = "right";
  ctx.fillText("المهمة", W - PAD - colStatusW - 12, y + tableHeaderH / 2 + 6);
  ctx.fillText("الملاحظات", W - PAD - colStatusW - colTaskW - 12, y + tableHeaderH / 2 + 6);
  y += tableHeaderH;

  rowsInfo.forEach((row, i) => {
    const rh = rowHeights[i];
    ctx.fillStyle = i % 2 === 0 ? "#F2F0E8" : "#fff";
    ctx.fillRect(PAD, y, contentW, rh);
    const done = state.done[row.key];
    const cx = W - PAD - colStatusW / 2, cy = y + rh / 2;
    ctx.beginPath(); 
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    // Stronger status colors
    ctx.fillStyle = done ? "#2D8F82" : "#D0D5D0"; 
    ctx.fill();
    ctx.fillStyle = done ? "#fff" : "#8A9890"; 
    ctx.font = "900 18px Arial";
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle";
    ctx.fillText(done ? "✓" : "–", cx, cy + 1);
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = row.color; 
    ctx.font = `900 20px ${AR_FONT}`; 
    ctx.textAlign = "right";
    ctx.fillText(row.label, W - PAD - colStatusW - 14, y + 34);
    ctx.fillStyle = "#3A4A45"; 
    ctx.font = `500 17px ${AR_FONT}`;
    row.noteLines.forEach((l, li) => ctx.fillText(l, W - PAD - colStatusW - colTaskW - 12, y + 30 + li * 26));
    ctx.strokeStyle = "#D8DDD8"; 
    ctx.lineWidth = 1;
    ctx.beginPath(); 
    ctx.moveTo(PAD, y + rh); 
    ctx.lineTo(PAD + contentW, y + rh); 
    ctx.stroke();
    y += rh;
  });
  y += gapS;

  // Stronger adab box
  roundRect(ctx, PAD, y, contentW, adabBoxH, 18); 
  ctx.fillStyle = "#F8E8D0"; 
  ctx.fill();
  ctx.save(); 
  ctx.setLineDash([8, 6]); 
  ctx.strokeStyle = "#D4A870"; 
  ctx.lineWidth = 3;
  roundRect(ctx, PAD, y, contentW, adabBoxH, 18); 
  ctx.stroke(); 
  ctx.restore();
  ctx.fillStyle = "#8A5A30"; 
  ctx.font = `900 20px ${AR_FONT}`; 
  ctx.textAlign = "right";
  ctx.fillText("الالتزام بآداب الحلقة", W - PAD - 24, y + 34);
  ctx.fillStyle = "#6A4A2A"; 
  ctx.font = `500 18px ${AR_FONT}`;
  adabLines.forEach((l, li) => ctx.fillText(l, W - PAD - 24, y + 66 + li * 27));
  y += adabBoxH + gapS;

  ctx.fillStyle = "#5A7A72"; 
  ctx.font = `700 14px ${AR_FONT}`; 
  ctx.textAlign = "center";
  ctx.fillText("بارك الله فيك وجعلك من أهل القرآن", W / 2, y + 28);
  ctx.font = `500 12px ${AR_FONT}`; 
  ctx.fillStyle = "#8A9A92";
  ctx.fillText(`تم إنشاء التقرير بتاريخ ${date}`, W / 2, y + 50);
  return canvas;
}

// ============================================================
// TEMPLATE 2 — PLAYFUL KIDS with STRONGER colors
// ============================================================
async function buildPlayful(state: State) {
  const W = 1000, PAD = 40, contentW = W - PAD * 2;
  const date = todayStr();
  const m = document.createElement("canvas").getContext("2d")!;
  m.direction = "rtl"; m.font = `600 20px ${AR_FONT}`;
  const noteMaxW = contentW - 320;
  const rowsInfo = FIXED_TASKS.map((t, i) => ({
    ...t,
    noteLines: wrapLines(m, state.notes[t.key] || "—", noteMaxW),
    char: [kidBoy, kidPaint, kidPoint, kidClap][i],
  }));
  const rowHeights = rowsInfo.map((r) => Math.max(110, 40 + r.noteLines.length * 28));
  const tableRowsH = rowHeights.reduce((a, b) => a + b, 0);
  m.font = `500 19px ${AR_FONT}`;
  const adabLines = wrapLines(m, state.adab || "—", contentW - 180);
  const adabBoxH = 90 + adabLines.length * 28;
  const headerH = 240, metaH = 90, gapS = 24, footerH = 100;
  const H = headerH + gapS + metaH + gapS + tableRowsH + gapS + adabBoxH + gapS + footerH + PAD * 2;

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = W * scale; canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.direction = "rtl";

  // Stronger pastel bg with more vibrant dots
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#FFD6E0"); 
  bg.addColorStop(0.5, "#D4E8FF");
  bg.addColorStop(1, "#FFE8C8");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.4;
  const dotColors = ["#FF8FA3", "#8AB8FF", "#FFD166", "#6FCF97"];
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = dotColors[i % 4];
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, 5 + Math.random() * 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // main card with stronger shadow
  ctx.save();
  ctx.shadowColor = "rgba(232,74,111,0.25)"; 
  ctx.shadowBlur = 35; 
  ctx.shadowOffsetY = 12;
  roundRect(ctx, PAD / 2, PAD / 2, W - PAD, H - PAD, 32);
  ctx.fillStyle = "#fff"; ctx.fill();
  ctx.restore();

  let y = PAD;

  // header with stronger gradient
  const hg = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  hg.addColorStop(0, "#FFB3C8"); 
  hg.addColorStop(0.5, "#B3D4FF");
  hg.addColorStop(1, "#FFD6A8");
  roundRect(ctx, PAD, y, contentW, headerH, 24); 
  ctx.fillStyle = hg; 
  ctx.fill();
  try {
    const hero = await loadImg(heroKids);
    const hh = headerH - 20, hw = (hero.width / hero.height) * hh;
    ctx.drawImage(hero, PAD + 20, y + 10, hw, hh);
  } catch {}
  ctx.fillStyle = "#1A0A20"; 
  ctx.textAlign = "right"; 
  ctx.textBaseline = "alphabetic";
  ctx.font = `900 48px ${AR_FONT}`;
  ctx.fillText("تقرير الحلقة", W - PAD - 40, y + 90);
  ctx.font = `700 22px ${AR_FONT}`; 
  ctx.fillStyle = "#5A2A4A";
  ctx.fillText("رحلتنا اليومية مع القرآن الكريم", W - PAD - 40, y + 130);
  ctx.font = `600 18px ${AR_FONT}`; 
  ctx.fillStyle = "#7A4A6A";
  ctx.fillText(`الطالب: ${state.studentName || "—"}`, W - PAD - 40, y + 170);
  ctx.fillText(`رقم الحلقة: ${state.halaqaNumber || "—"}  •  ${date}`, W - PAD - 40, y + 200);
  y += headerH + gapS;

  // colorful counter strip with stronger colors
  const doneCount = FIXED_TASKS.filter((t) => state.done[t.key]).length;
  roundRect(ctx, PAD, y, contentW, metaH, 22); 
  ctx.fillStyle = "#FFD166"; 
  ctx.fill();
  ctx.fillStyle = "#8A3A00"; 
  ctx.textAlign = "center";
  ctx.font = `900 28px ${AR_FONT}`;
  ctx.fillText(`🌟 أنجزت ${doneCount} من ${FIXED_TASKS.length} مهام 🌟`, W / 2, y + 42);
  ctx.font = `700 18px ${AR_FONT}`;
  ctx.fillStyle = "#6A2A00";
  ctx.fillText("أحسنت! استمر في التميز", W / 2, y + 72);
  ctx.textAlign = "right";
  y += metaH + gapS;

  const cardImgs: HTMLImageElement[] = [];
  for (const r of rowsInfo) {
    try { cardImgs.push(await loadImg(r.char)); } catch { cardImgs.push(null as any); }
  }

  rowsInfo.forEach((row, i) => {
    const rh = rowHeights[i];
    const rx = PAD, ry = y;
    roundRect(ctx, rx, ry, contentW, rh - 8, 20);
    const bgColors = ["#FFD6E0", "#D6FFE0", "#FFE8C8", "#D4E8FF"];
    ctx.fillStyle = bgColors[i]; 
    ctx.fill();
    ctx.save(); 
    ctx.strokeStyle = row.color; 
    ctx.lineWidth = 4;
    roundRect(ctx, rx, ry, contentW, rh - 8, 20); 
    ctx.stroke(); 
    ctx.restore();

    const img = cardImgs[i];
    if (img) {
      const size = rh - 24;
      ctx.drawImage(img, rx + 10, ry + 12, size, size);
    }

    const done = state.done[row.key];
    const cx = W - PAD - 32, cy = ry + 32;
    ctx.beginPath(); 
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = done ? row.color : "#D0D5D0"; 
    ctx.fill();
    ctx.shadowColor = done ? "rgba(0,0,0,0.15)" : "transparent";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#fff"; 
    ctx.font = "900 22px Arial";
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle";
    ctx.fillText(done ? "✓" : "…", cx, cy + 1);
    ctx.shadowBlur = 0;
    ctx.textBaseline = "alphabetic"; 
    ctx.textAlign = "right";

    ctx.fillStyle = row.color; 
    ctx.font = `900 26px ${AR_FONT}`;
    ctx.fillText(row.label, W - PAD - 70, ry + 38);
    ctx.fillStyle = "#2A2A2A"; 
    ctx.font = `500 18px ${AR_FONT}`;
    row.noteLines.forEach((l, li) => ctx.fillText(l, W - PAD - 70, ry + 70 + li * 26));

    y += rh;
  });
  y += gapS - 8;

  // adab with stronger colors
  roundRect(ctx, PAD, y, contentW, adabBoxH, 22); 
  ctx.fillStyle = "#FFE0A8"; 
  ctx.fill();
  ctx.save(); 
  ctx.setLineDash([10, 6]); 
  ctx.strokeStyle = "#E8A040"; 
  ctx.lineWidth = 4;
  roundRect(ctx, PAD, y, contentW, adabBoxH, 22); 
  ctx.stroke(); 
  ctx.restore();
  try {
    const cheer = await loadImg(kidCheer);
    const s = adabBoxH - 20;
    ctx.drawImage(cheer, PAD + 12, y + 10, s, s);
  } catch {}
  ctx.fillStyle = "#7A3A00"; 
  ctx.font = `900 24px ${AR_FONT}`; 
  ctx.textAlign = "right";
  ctx.fillText("💛 الالتزام بآداب الحلقة", W - PAD - 24, y + 42);
  ctx.fillStyle = "#5A2A00"; 
  ctx.font = `600 18px ${AR_FONT}`;
  adabLines.forEach((l, li) => ctx.fillText(l, W - PAD - 24, y + 76 + li * 28));
  y += adabBoxH + gapS;

  // footer
  ctx.fillStyle = "#E84A6F"; 
  ctx.font = `900 20px ${AR_FONT}`; 
  ctx.textAlign = "center";
  ctx.fillText("🌸 بارك الله فيك وجعلك من أهل القرآن 🌸", W / 2, y + 36);
  ctx.fillStyle = "#7A8A9A"; 
  ctx.font = `500 13px ${AR_FONT}`;
  ctx.fillText(`تم إنشاء التقرير بتاريخ ${date}`, W / 2, y + 62);
  return canvas;
}

// ============================================================
// TEMPLATE 3 — ELEGANT CLASSIC with STRONGER colors
// ============================================================
async function buildClassic(state: State) {
  const W = 1000, PAD = 50, contentW = W - PAD * 2;
  const date = todayStr();
  const m = document.createElement("canvas").getContext("2d")!;
  m.direction = "rtl"; m.font = `600 20px ${AR_FONT}`;
  const noteMaxW = contentW - 280;
  const rowsInfo = FIXED_TASKS.map((t) => ({ ...t, noteLines: wrapLines(m, state.notes[t.key] || "—", noteMaxW) }));
  const rowHeights = rowsInfo.map((r) => Math.max(76, 42 + r.noteLines.length * 28));
  const tableRowsH = rowHeights.reduce((a, b) => a + b, 0);
  m.font = `500 19px ${AR_FONT}`;
  const adabLines = wrapLines(m, state.adab || "—", contentW - 100);
  const adabBoxH = 80 + adabLines.length * 28;
  const headerH = 200, metaH = 90, tableHeaderH = 60, gapS = 26, footerH = 90;
  const H = headerH + gapS + metaH + gapS + tableHeaderH + tableRowsH + gapS + adabBoxH + gapS + footerH + PAD * 2;

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = W * scale; canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.direction = "rtl";

  // Stronger cream bg
  ctx.fillStyle = "#F2E8C8"; 
  ctx.fillRect(0, 0, W, H);

  // Stronger geometric pattern
  ctx.save(); 
  ctx.globalAlpha = 0.08; 
  ctx.strokeStyle = "#0A4A3A"; 
  ctx.lineWidth = 1.5;
  const step = 40;
  for (let gx = 0; gx < W; gx += step) {
    for (let gy = 0; gy < H; gy += step) {
      ctx.beginPath();
      ctx.moveTo(gx, gy + step / 2); 
      ctx.lineTo(gx + step / 2, gy);
      ctx.lineTo(gx + step, gy + step / 2); 
      ctx.lineTo(gx + step / 2, gy + step);
      ctx.closePath(); 
      ctx.stroke();
    }
  }
  ctx.restore();

  // Stronger ornate border
  const B = 18;
  ctx.strokeStyle = "#0A4A3A"; 
  ctx.lineWidth = 4;
  ctx.strokeRect(B, B, W - B * 2, H - B * 2);
  ctx.strokeStyle = "#D4A020"; 
  ctx.lineWidth = 2;
  ctx.strokeRect(B + 8, B + 8, W - (B + 8) * 2, H - (B + 8) * 2);

  // inner cream card
  ctx.fillStyle = "#FAF4E0";
  roundRect(ctx, PAD - 10, PAD - 10, contentW + 20, H - PAD * 2 + 20, 10); 
  ctx.fill();

  let y = PAD;

  // header — ornament + title with stronger colors
  ctx.fillStyle = "#0A4A3A"; 
  ctx.textAlign = "center"; 
  ctx.textBaseline = "alphabetic";
  ctx.font = `900 26px ${AR_FONT}`;
  ctx.fillText("﷽", W / 2, y + 44);
  ctx.strokeStyle = "#D4A020"; 
  ctx.lineWidth = 2;
  ctx.beginPath(); 
  ctx.moveTo(W / 2 - 180, y + 60); 
  ctx.lineTo(W / 2 - 30, y + 60); 
  ctx.stroke();
  ctx.beginPath(); 
  ctx.moveTo(W / 2 + 30, y + 60); 
  ctx.lineTo(W / 2 + 180, y + 60); 
  ctx.stroke();
  [[-30, 60], [30, 60]].forEach(([dx, dy]) => {
    ctx.save(); 
    ctx.translate(W / 2 + dx, y + dy); 
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#D4A020"; 
    ctx.fillRect(-5, -5, 10, 10); 
    ctx.restore();
  });
  ctx.fillStyle = "#0A2A20"; 
  ctx.font = `900 44px ${AR_FONT}`;
  ctx.fillText("تقرير الحلقة القرآنية", W / 2, y + 110);
  ctx.fillStyle = "#6A4A1A"; 
  ctx.font = `700 18px ${AR_FONT}`;
  ctx.fillText("سِجل المُتابعة اليومي لأداء الطالب", W / 2, y + 145);
  ctx.textAlign = "right";
  y += headerH + gapS;

  // meta row with stronger colors
  const colW = contentW / 3;
  const metaData = [
    { label: "الطالب", value: state.studentName || "—" },
    { label: "رقم الحلقة", value: state.halaqaNumber || "—" },
    { label: "التاريخ", value: date },
  ];
  ctx.fillStyle = "#FAF0D8";
  roundRect(ctx, PAD, y, contentW, metaH, 8); 
  ctx.fill();
  ctx.strokeStyle = "#D4A020"; 
  ctx.lineWidth = 2;
  roundRect(ctx, PAD, y, contentW, metaH, 8); 
  ctx.stroke();
  metaData.forEach((d, i) => {
    const cx = PAD + colW * i + colW / 2;
    ctx.fillStyle = "#6A4A1A"; 
    ctx.font = `700 15px ${AR_FONT}`;
    ctx.textAlign = "center"; 
    ctx.fillText(d.label, cx, y + 32);
    ctx.fillStyle = "#0A2A20"; 
    ctx.font = `900 22px ${AR_FONT}`;
    ctx.fillText(d.value, cx, y + 64);
    if (i < 2) {
      ctx.strokeStyle = "#D4A020"; 
      ctx.lineWidth = 2;
      ctx.beginPath(); 
      ctx.moveTo(PAD + colW * (i + 1), y + 18); 
      ctx.lineTo(PAD + colW * (i + 1), y + metaH - 18); 
      ctx.stroke();
    }
  });
  ctx.textAlign = "right";
  y += metaH + gapS;

  // table header with stronger colors
  ctx.fillStyle = "#0A4A3A";
  roundRect(ctx, PAD, y, contentW, tableHeaderH, 6); 
  ctx.fill();
  ctx.fillStyle = "#FAF4E0"; 
  ctx.font = `900 18px ${AR_FONT}`;
  const colStatusW = 100, colTaskW = 180;
  ctx.textAlign = "center"; 
  ctx.fillText("الحالة", W - PAD - colStatusW / 2, y + tableHeaderH / 2 + 6);
  ctx.textAlign = "right";
  ctx.fillText("المهمة", W - PAD - colStatusW - 16, y + tableHeaderH / 2 + 6);
  ctx.fillText("الملاحظات", W - PAD - colStatusW - colTaskW - 16, y + tableHeaderH / 2 + 6);
  y += tableHeaderH;

  rowsInfo.forEach((row, i) => {
    const rh = rowHeights[i];
    ctx.fillStyle = i % 2 === 0 ? "#FAF4E0" : "#F2EAD0";
    ctx.fillRect(PAD, y, contentW, rh);
    const done = state.done[row.key];
    const cx = W - PAD - colStatusW / 2, cy = y + rh / 2;
    // Stronger gold ring
    ctx.beginPath(); 
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = done ? "#0A4A3A" : "#FAF0D8"; 
    ctx.fill();
    ctx.strokeStyle = "#D4A020"; 
    ctx.lineWidth = 2.5; 
    ctx.stroke();
    ctx.fillStyle = done ? "#D4A020" : "#A89860"; 
    ctx.font = "900 20px Arial";
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle";
    ctx.fillText(done ? "✓" : "—", cx, cy + 1);
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#0A2A20"; 
    ctx.font = `900 22px ${AR_FONT}`; 
    ctx.textAlign = "right";
    ctx.fillText(row.label, W - PAD - colStatusW - 16, y + 38);
    ctx.fillStyle = "#3A3420"; 
    ctx.font = `500 17px ${AR_FONT}`;
    row.noteLines.forEach((l, li) => ctx.fillText(l, W - PAD - colStatusW - colTaskW - 16, y + 34 + li * 28));
    ctx.strokeStyle = "#D4C89A"; 
    ctx.lineWidth = 0.8;
    ctx.beginPath(); 
    ctx.moveTo(PAD, y + rh); 
    ctx.lineTo(PAD + contentW, y + rh); 
    ctx.stroke();
    y += rh;
  });
  y += gapS;

  // adab with stronger colors
  roundRect(ctx, PAD, y, contentW, adabBoxH, 8); 
  ctx.fillStyle = "#E8DDC0"; 
  ctx.fill();
  ctx.strokeStyle = "#0A4A3A"; 
  ctx.lineWidth = 3;
  roundRect(ctx, PAD, y, contentW, adabBoxH, 8); 
  ctx.stroke();
  ctx.fillStyle = "#0A4A3A"; 
  ctx.font = `900 22px ${AR_FONT}`; 
  ctx.textAlign = "right";
  ctx.fillText("❖  الالتزام بآداب الحلقة", W - PAD - 24, y + 38);
  ctx.fillStyle = "#2A3A2A"; 
  ctx.font = `500 18px ${AR_FONT}`;
  adabLines.forEach((l, li) => ctx.fillText(l, W - PAD - 24, y + 72 + li * 28));
  y += adabBoxH + gapS;

  // footer with stronger colors
  ctx.textAlign = "center"; 
  ctx.fillStyle = "#0A4A3A"; 
  ctx.font = `900 20px ${AR_FONT}`;
  ctx.fillText("﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾", W / 2, y + 36);
  ctx.fillStyle = "#6A4A1A"; 
  ctx.font = `500 13px ${AR_FONT}`;
  ctx.fillText(`تم إنشاء التقرير بتاريخ ${date}`, W / 2, y + 62);
  return canvas;
}

// ============================================================
// TEMPLATE 4 — MINIMAL MODERN with STRONGER accents
// ============================================================
async function buildMinimal(state: State) {
  const W = 1000, PAD = 64, contentW = W - PAD * 2;
  const date = todayStr();
  const m = document.createElement("canvas").getContext("2d")!;
  m.direction = "rtl"; m.font = `500 18px ${AR_FONT}`;
  const noteMaxW = contentW - 200;
  const rowsInfo = FIXED_TASKS.map((t) => ({ ...t, noteLines: wrapLines(m, state.notes[t.key] || "—", noteMaxW) }));
  const rowHeights = rowsInfo.map((r) => Math.max(88, 50 + r.noteLines.length * 26));
  const tableRowsH = rowHeights.reduce((a, b) => a + b, 0);
  m.font = `500 18px ${AR_FONT}`;
  const adabLines = wrapLines(m, state.adab || "—", contentW);
  const adabBoxH = 60 + adabLines.length * 28;
  const headerH = 140, metaH = 80, gapS = 32, footerH = 60;
  const H = headerH + gapS + metaH + gapS + tableRowsH + gapS + adabBoxH + gapS + footerH + PAD * 2;

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = W * scale; canvas.height = H * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.direction = "rtl";

  ctx.fillStyle = "#F5F5F0"; 
  ctx.fillRect(0, 0, W, H);

  let y = PAD;
  // header with stronger contrast
  ctx.fillStyle = "#4A5A6A"; 
  ctx.textAlign = "right"; 
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 13px ${AR_FONT}`;
  ctx.fillText("REPORT · تقرير", W - PAD, y + 20);
  ctx.fillStyle = "#1A1A24"; 
  ctx.font = `800 52px ${AR_FONT}`;
  ctx.fillText("تقرير الحلقة", W - PAD, y + 78);
  ctx.fillStyle = "#4A5A6A"; 
  ctx.font = `500 17px ${AR_FONT}`;
  ctx.fillText(date, W - PAD, y + 108);
  ctx.strokeStyle = "#D0D0C8"; 
  ctx.lineWidth = 2;
  ctx.beginPath(); 
  ctx.moveTo(PAD, y + headerH); 
  ctx.lineTo(W - PAD, y + headerH); 
  ctx.stroke();
  y += headerH + gapS;

  // meta with stronger contrast
  const colW = contentW / 3;
  const meta = [
    { label: "الطالب", value: state.studentName || "—" },
    { label: "رقم الحلقة", value: state.halaqaNumber || "—" },
    { label: "الإنجاز", value: `${FIXED_TASKS.filter((t) => state.done[t.key]).length} / ${FIXED_TASKS.length}` },
  ];
  meta.forEach((d, i) => {
    const px = W - PAD - colW * (i + 1) + 16;
    ctx.fillStyle = "#4A5A6A"; 
    ctx.font = `700 12px ${AR_FONT}`; 
    ctx.textAlign = "right";
    ctx.fillText(d.label.toUpperCase(), px + colW - 32, y + 22);
    ctx.fillStyle = "#1A1A24"; 
    ctx.font = `700 24px ${AR_FONT}`;
    ctx.fillText(d.value, px + colW - 32, y + 58);
  });
  ctx.strokeStyle = "#D0D0C8"; 
  ctx.lineWidth = 2;
  ctx.beginPath(); 
  ctx.moveTo(PAD, y + metaH); 
  ctx.lineTo(W - PAD, y + metaH); 
  ctx.stroke();
  y += metaH + gapS;

  // task rows with stronger accents
  rowsInfo.forEach((row, i) => {
    const rh = rowHeights[i];
    const done = state.done[row.key];
    // Stronger number
    ctx.fillStyle = "#A0A8B0"; 
    ctx.font = `700 14px ${AR_FONT}`; 
    ctx.textAlign = "right";
    ctx.fillText(String(i + 1).padStart(2, "0"), W - PAD, y + 22);
    // label
    ctx.fillStyle = "#1A1A24"; 
    ctx.font = `700 24px ${AR_FONT}`;
    ctx.fillText(row.label, W - PAD - 40, y + 32);
    // notes
    ctx.fillStyle = "#3A4A5A"; 
    ctx.font = `500 16px ${AR_FONT}`;
    row.noteLines.forEach((l, li) => ctx.fillText(l, W - PAD - 40, y + 58 + li * 26));
    // status pill with stronger colors
    const pillW = 90, px = PAD;
    roundRect(ctx, px, y + 18, pillW, 30, 15);
    ctx.fillStyle = done ? "#1A1A24" : "#E8E8E0"; 
    ctx.fill();
    ctx.fillStyle = done ? "#fff" : "#4A5A6A";
    ctx.font = `700 13px ${AR_FONT}`; 
    ctx.textAlign = "center";
    ctx.fillText(done ? "منجز" : "قيد التنفيذ", px + pillW / 2, y + 38);
    ctx.textAlign = "right";
    ctx.strokeStyle = "#D0D0C8"; 
    ctx.lineWidth = 1;
    ctx.beginPath(); 
    ctx.moveTo(PAD, y + rh); 
    ctx.lineTo(W - PAD, y + rh); 
    ctx.stroke();
    y += rh;
  });
  y += gapS;

  // adab with stronger contrast
  ctx.fillStyle = "#4A5A6A"; 
  ctx.font = `700 12px ${AR_FONT}`;
  ctx.fillText("الالتزام بآداب الحلقة", W - PAD, y + 20);
  ctx.fillStyle = "#1A1A24"; 
  ctx.font = `500 18px ${AR_FONT}`;
  adabLines.forEach((l, li) => ctx.fillText(l, W - PAD, y + 52 + li * 28));
  y += adabBoxH + gapS;

  // footer
  ctx.fillStyle = "#4A5A6A"; 
  ctx.font = `500 12px ${AR_FONT}`; 
  ctx.textAlign = "center";
  ctx.fillText(`تم إنشاء التقرير بتاريخ ${date}`, W / 2, y + 30);
  return canvas;
}

// ---------- Router ----------
async function buildReportCanvas(state: State) {
  switch (state.template) {
    case "playful": return buildPlayful(state);
    case "classic": return buildClassic(state);
    case "minimal": return buildMinimal(state);
    default: return buildColorful(state);
  }
}

// ============================================================
// COMPONENT
// ============================================================
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
          window.dispatchEvent(new CustomEvent("mascot:cheer", { detail: "أحسنت! أنجزت المهمة 🌟" }));
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
      a.download = `تقرير-الحلقة-${state.template}-${state.halaqaNumber || "بدون-رقم"}${namePart}.png`;
      document.body.appendChild(a); a.click(); a.remove();
    } finally {
      setExporting(false);
    }
  }

  const doneCount = FIXED_TASKS.filter((t) => state.done[t.key]).length;

  return (
    <div className="min-h-screen p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex gap-6 bg-white p-3 rounded-3xl" style={{flexDirection:"column"}}>
          <div>
             <img src={kidPoint} alt="" className="w-20 h-20" />
          <div>
            <h1 className="text-3xl font-black text-arabic">مهام الحلقة</h1>
            <p className="text-gray-600 text-arabic">
              سجّل ملاحظات كل مهمة و حمّل تقرير الحلقة كصورة ملونة بضغطة زر 
            </p>
          </div>
          </div>
          
             <div className="grid md:grid-cols-3 gap-3 mb-6">
          <div>
            <Label className="text-arabic mb-1 block">اسم الطالب</Label>
            <Input
              value={state.studentName}
              onChange={(e) => setState((p) => ({ ...p, studentName: e.target.value }))}
              placeholder="مثال: محمد أحمد"
              className="h-12 text-base font-bold rounded-2xl"
            />
          </div>
          <div>
            <Label className="text-arabic mb-1 block">رقم الحلقة</Label>
            <Input
              value={state.halaqaNumber}
              onChange={(e) => setState((p) => ({ ...p, halaqaNumber: e.target.value }))}
              placeholder="مثال: 12"
              className="h-12 text-base font-bold rounded-2xl"
            />
          </div>
          <div className="flex flex-col justify-end text-arabic">
            <div className="text-sm text-gray-600">التاريخ: {todayStr()}</div>
            <div className="text-sm text-gray-600">المنجز: {doneCount} / {FIXED_TASKS.length}</div>
          </div>
        </div>
        </div>     

        {/* Tasks table */}
        <div className="rounded-3xl bg-white shadow-kid border-4 border-white overflow-hidden mb-6">
          <table className="w-full text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-arabic w-20">تم</th>
                <th className="p-3 text-arabic">المهمة</th>
                <th className="p-3 text-arabic">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {FIXED_TASKS.map((t) => (
                <tr key={t.key} className="border-t">
                  <td className="p-3">
                    <button
                      onClick={() => toggleDone(t.key)}
                      aria-label="علّم كمنجز"
                      className="w-8 h-8 rounded-lg border-4 flex items-center justify-center transition-all mx-auto"
                      style={{
                        borderColor: state.done[t.key]
                          ? t.color
                          : "color-mix(in oklab, " + t.color + " 40%, white)",
                        background: state.done[t.key] ? t.color : "white",
                      }}
                    >
                      {state.done[t.key] && <span className="text-white font-black">✓</span>}
                    </button>
                  </td>
                  <td className="p-3">
                    <span className="font-black text-arabic" style={{ color: t.color }}>{t.label}</span>
                  </td>
                  <td className="p-3">
                    <Textarea
                      value={state.notes[t.key]}
                      onChange={(e) => setNote(t.key, e.target.value)}
                      placeholder="اكتب ملاحظاتك هنا…"
                      className="min-h-[52px] rounded-xl text-sm"
                      style={{ minWidth: "200px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Adab */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 shadow-kid border-4 border-white mb-6"
          style={{
            background:
              "linear-gradient(120deg, color-mix(in oklab, var(--kid-sun) 50%, white), color-mix(in oklab, var(--kid-coral) 40%, white))",
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

        {/* ============================================ */}
        {/* TEMPLATE PICKER — visual thumbnails          */}
        {/* ============================================ */}
        <div className="rounded-3xl bg-white shadow-kid border-4 border-white p-5 mb-6">
          <Label className="text-lg font-black mb-3 block text-arabic">اختر قالب التقرير</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map((tpl) => {
              const active = state.template === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setState((p) => ({ ...p, template: tpl.id }))}
                  className="text-right rounded-2xl overflow-hidden border-4 transition-all"
                  style={{
                    borderColor: active ? tpl.accent : "#e5e7eb",
                    boxShadow: active ? `0 12px 28px -12px ${tpl.accent}` : "none",
                    transform: active ? "translateY(-2px)" : "none",
                  }}
                >
                  {/* thumbnail */}
                  <div className="h-24 relative" style={{ background: tpl.bg }}>
                    {tpl.id === "playful" && (
                      <>
                        <img src={heroKids} alt="" className="h-full absolute right-1 top-0 object-contain" />
                        <div className="absolute left-2 bottom-2 flex gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        </div>
                      </>
                    )}
                    {tpl.id === "classic" && (
                      <div className="absolute inset-2 border-2 rounded" style={{ borderColor: tpl.accent }}>
                        <div className="absolute inset-1 border rounded" style={{ borderColor: "#D4A020" }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-black" style={{ color: tpl.accent }}>﷽</div>
                      </div>
                    )}
                    {tpl.id === "minimal" && (
                      <div className="p-3">
                        <div className="text-[10px] text-gray-500">REPORT</div>
                        <div className="text-lg font-black text-gray-900">تقرير</div>
                        <div className="h-px bg-gray-300 mt-2" />
                      </div>
                    )}
                    {tpl.id === "colorful" && (
                      <div className="absolute inset-2 rounded-lg" style={{
                        background: "linear-gradient(90deg,#A8D5CC,#C4B8E8)"
                      }}>
                        <div className="p-2 text-xs font-black text-gray-800 text-right">تقرير الحلقة</div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <div className="text-sm font-black text-arabic" style={{ color: tpl.accent }}>{tpl.name}</div>
                    <div className="text-[11px] text-gray-500 text-arabic leading-tight">{tpl.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end items-center">
          <Button
            onClick={downloadReport}
            disabled={exporting}
            className="h-12 px-6 rounded-2xl font-black text-base gap-2"
          >
            <Download size={20} strokeWidth={3} />
            {exporting ? "...جاري التجهيز" : "تحميل تقرير الحلقة"}
          </Button>
        </div>
      </div>
    </div>
  );
}