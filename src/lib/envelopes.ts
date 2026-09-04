export interface EnvelopeSize {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

export const ENVELOPES: EnvelopeSize[] = [
  { id: "us10", name: "US #10", widthMm: 241.3, heightMm: 104.8, description: "9.5 × 4.125 in" },
  { id: "dl", name: "DL", widthMm: 220, heightMm: 110, description: "Fits folded A4" },
  { id: "c6", name: "C6", widthMm: 162, heightMm: 114, description: "Fits A4 folded twice" },
  { id: "c5", name: "C5", widthMm: 229, heightMm: 162, description: "Fits A4 folded once" },
  { id: "square", name: "Square", widthMm: 165, heightMm: 165, description: "Card / invitation" },
];

export const getEnvelopeSize = (id: string) => ENVELOPES.find((e) => e.id === id) ?? ENVELOPES[0];
