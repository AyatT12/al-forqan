export function playSound(type: "balloon" | "star" | "alarm") {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();

    if (type === "balloon") {
      [261.6, 329.6, 392, 523.3, 659.3, 783.9].forEach((freq, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.11;
        o.type = "sine"; o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.45);
      });
    } else if (type === "star") {
      for (let i = 0; i < 12; i++) {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.065;
        o.type = "triangle"; o.frequency.setValueAtTime(500 + Math.random() * 1500, t);
        g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.28);
      }
    } else if (type === "alarm") {
      [0, 0.32, 0.64, 0.96, 1.28].forEach(delay => {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay;
        o.type = "square"; o.frequency.setValueAtTime(880, t);
        g.gain.setValueAtTime(0.5, t); g.gain.setValueAtTime(0, t + 0.18);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.2);
      });
    }

    setTimeout(() => ac.close().catch(() => {}), 4000);
  } catch (_) {}
}
