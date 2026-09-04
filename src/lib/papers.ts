export interface Paper {
  id: string;
  name: string;
  color: string;
  dark?: boolean;
}

export const PAPERS: Paper[] = [
  { id: "ivory", name: "Ivory", color: "#FBF6E9" },
  { id: "cream", name: "Cream", color: "#FDF6E3" },
  { id: "parchment", name: "Aged Parchment", color: "#E8D8B7" },
  { id: "white", name: "Pure White", color: "#FFFFFF" },
  { id: "blue", name: "Soft Blue", color: "#EAF2F8" },
  { id: "rose", name: "Rose", color: "#FBEAEA" },
  { id: "sage", name: "Sage", color: "#E8EFE3" },
  { id: "kraft", name: "Kraft Brown", color: "#C9A97E" },
  { id: "midnight", name: "Midnight", color: "#1A1D2E", dark: true },
];

export const getPaper = (id: string) => PAPERS.find((p) => p.id === id) ?? PAPERS[0];

export const INKS: { id: string; name: string; color: string }[] = [
  { id: "black", name: "Black", color: "#191512" },
  { id: "blue-black", name: "Blue Black", color: "#1F2A44" },
  { id: "royal", name: "Royal Blue", color: "#28489C" },
  { id: "sepia", name: "Sepia", color: "#6B4A2B" },
  { id: "burgundy", name: "Burgundy", color: "#7A2233" },
  { id: "forest", name: "Forest", color: "#25503C" },
  { id: "gold", name: "Gold", color: "#C9A227" },
  { id: "ivory-ink", name: "Ivory", color: "#F3EEE3" },
];

/** Subtle inline-SVG fibre grain so exports never depend on network assets. */
export const TEXTURE_DATA_URL =
  "url(\"data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(#n)' opacity='0.5'/></svg>`,
  ) +
  "\")";
