export function getAudioUrl(surah: number, ayah: number) {
  return `https://everyayah.com/data/Husary_Muallim_128kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;
}

export function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randomCheer(cheers: string[]) {
  return cheers[Math.floor(Math.random() * cheers.length)];
}

export function speakArabic(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.82;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
