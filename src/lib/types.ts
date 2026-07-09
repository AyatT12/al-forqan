export interface TextEl {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

export interface StampEl {
  id: string;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

export interface VideoOverlay {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ImageOverlay {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  imageElement: HTMLImageElement;
}
export type WBTool = "pen" | "rect" | "circle" | "line" | "arrow" | "text" | "eraser" | "stamp";
export type GameType = "word-order" | "missing-word" | "matching" | "memory" | "listening" | null;
export type FunGame = "animal-memory" | "balloons" | "colors" | "cartoon" | "xo" | "scratch" | null;
