import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LineStyle } from "@/lib/layouts";
import { getLayout } from "@/lib/layouts";

interface LetterState {
  content: string;
  fontId: string;
  fontSize: number;
  lineHeight: number;
  layoutId: string;
  paperId: string;
  customPaperColor?: string;
  inkColor: string;
  lineStyle: LineStyle;
  marginMm: number;
  textureEnabled: boolean;
  zoom: number;
  focusMode: boolean;
  // Envelope
  recipientAddress: string;
  senderAddress: string;
  envelopeSizeId: string;
  includeStamp: boolean;
  setContent: (v: string) => void;
  setFont: (id: string) => void;
  setFontSize: (v: number) => void;
  setLineHeight: (v: number) => void;
  setLayout: (id: string) => void;
  setPaper: (id: string) => void;
  setCustomPaperColor: (v: string) => void;
  setInkColor: (v: string) => void;
  setLineStyle: (v: LineStyle) => void;
  setMargin: (v: number) => void;
  setTexture: (v: boolean) => void;
  setZoom: (v: number) => void;
  setFocusMode: (v: boolean) => void;
  setRecipientAddress: (v: string) => void;
  setSenderAddress: (v: string) => void;
  setEnvelopeSize: (v: string) => void;
  setIncludeStamp: (v: boolean) => void;
  reset: () => void;
}

const initial = {
  content:
    "My dearest friend,\n\nThe evenings have turned soft and golden here, and I found myself thinking of you again — of long walks, of unhurried conversation, of everything we meant to say and never quite did.\n\nWrite back when the mood finds you.\n\nAlways yours,\n",
  fontId: "caveat",
  fontSize: 28,
  lineHeight: 1.7,
  layoutId: "a4-p",
  paperId: "ivory",
  customPaperColor: undefined,
  inkColor: "#1F2A44",
  lineStyle: "ruled" as LineStyle,
  marginMm: 25,
  textureEnabled: true,
  zoom: 1,
  focusMode: false,
  recipientAddress: "Ada Lovelace\n12 Byron Lane\nLondon W1U 6TA\nUnited Kingdom",
  senderAddress: "",
  envelopeSizeId: "us10",
  includeStamp: true,
};

export const useLetterStore = create<LetterState>()(
  persist(
    (set) => ({
      ...initial,
      setContent: (content) => set({ content }),
      setFont: (fontId) => set({ fontId }),
      setFontSize: (fontSize) => set({ fontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setLayout: (layoutId) => set({ layoutId, marginMm: getLayout(layoutId).defaultMarginMm }),
      setPaper: (paperId) => set({ paperId }),
      setCustomPaperColor: (customPaperColor) => set({ customPaperColor, paperId: "custom" }),
      setInkColor: (inkColor) => set({ inkColor }),
      setLineStyle: (lineStyle) => set({ lineStyle }),
      setMargin: (marginMm) => set({ marginMm }),
      setTexture: (textureEnabled) => set({ textureEnabled }),
      setZoom: (zoom) => set({ zoom }),
      setFocusMode: (focusMode) => set({ focusMode }),
      setRecipientAddress: (recipientAddress) => set({ recipientAddress }),
      setSenderAddress: (senderAddress) => set({ senderAddress }),
      setEnvelopeSize: (envelopeSizeId) => set({ envelopeSizeId }),
      setIncludeStamp: (includeStamp) => set({ includeStamp }),
      reset: () => set({ ...initial }),
    }),
    { name: "letterpress-draft" },
  ),
);
