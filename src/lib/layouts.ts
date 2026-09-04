export type LineStyle = "blank" | "ruled" | "dotted" | "grid" | "vintage";

export interface Layout {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  defaultMarginMm: number;
  orientation: "portrait" | "landscape";
}

export const MM_TO_PX = 96 / 25.4; // ≈ 3.7795

export const mmToPx = (mm: number) => mm * MM_TO_PX;

export const LAYOUTS: Layout[] = [
  { id: "a4-p", name: "A4 Portrait", widthMm: 210, heightMm: 297, defaultMarginMm: 25, orientation: "portrait" },
  { id: "a4-l", name: "A4 Landscape", widthMm: 297, heightMm: 210, defaultMarginMm: 25, orientation: "landscape" },
  { id: "letter", name: "US Letter", widthMm: 215.9, heightMm: 279.4, defaultMarginMm: 25, orientation: "portrait" },
  { id: "postcard", name: "Postcard", widthMm: 152.4, heightMm: 101.6, defaultMarginMm: 12, orientation: "landscape" },
  { id: "journal", name: "Journal Page", widthMm: 139.7, heightMm: 215.9, defaultMarginMm: 18, orientation: "portrait" },
  { id: "square", name: "Square Note", widthMm: 127, heightMm: 127, defaultMarginMm: 14, orientation: "portrait" },
  { id: "envelope", name: "Envelope Card", widthMm: 177.8, heightMm: 127, defaultMarginMm: 14, orientation: "landscape" },
];

export const getLayout = (id: string) => LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];

export const LINE_STYLES: { id: LineStyle; name: string }[] = [
  { id: "blank", name: "Blank" },
  { id: "ruled", name: "Ruled" },
  { id: "dotted", name: "Dotted" },
  { id: "grid", name: "Grid" },
  { id: "vintage", name: "Vintage" },
];

/** Background layers that draw the ruling, sized in px so exports stay crisp. */
export function lineStyleBackground(style: LineStyle, lineHeightPx: number, inkColor: string) {
  const soft = "color-mix(in oklab, " + inkColor + " 18%, transparent)";
  const sepia = "rgba(150, 110, 60, 0.35)";
  switch (style) {
    case "ruled":
      return {
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${lineHeightPx - 1}px, ${soft} ${lineHeightPx - 1}px, ${soft} ${lineHeightPx}px)`,
        backgroundSize: `100% ${lineHeightPx}px`,
      };
    case "vintage":
      return {
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${lineHeightPx - 1}px, ${sepia} ${lineHeightPx - 1}px, ${sepia} ${lineHeightPx}px)`,
        backgroundSize: `100% ${lineHeightPx}px`,
      };
    case "dotted": {
      const s = mmToPx(4);
      return {
        backgroundImage: `radial-gradient(${soft} 1px, transparent 1px)`,
        backgroundSize: `${s}px ${s}px`,
      };
    }
    case "grid": {
      const s = mmToPx(5);
      return {
        backgroundImage: `linear-gradient(to right, ${soft} 1px, transparent 1px), linear-gradient(to bottom, ${soft} 1px, transparent 1px)`,
        backgroundSize: `${s}px ${s}px`,
      };
    }
    default:
      return {};
  }
}
