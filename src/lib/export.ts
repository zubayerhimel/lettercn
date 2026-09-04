import { toJpeg, toPng } from "html-to-image";
import jsPDF from "jspdf";

export interface PdfPage {
  node: HTMLElement;
  widthMm: number;
  heightMm: number;
}

async function capturePng(node: HTMLElement, scale: number) {
  if (document.fonts?.ready) await document.fonts.ready;
  return toPng(node, {
    pixelRatio: scale,
    cacheBust: true,
    skipFonts: false,
    backgroundColor: undefined,
  });
}

// JPEG for PDF embedding: paper is opaque so no alpha needed, and JPEG's DCT
// compression crushes the noisy paper texture ~10× better than PNG.
async function captureJpeg(node: HTMLElement, scale: number, quality = 0.9) {
  if (document.fonts?.ready) await document.fonts.ready;
  return toJpeg(node, {
    pixelRatio: scale,
    cacheBust: true,
    skipFonts: false,
    quality,
    backgroundColor: "#ffffff",
  });
}

const orientationFor = (w: number, h: number): "portrait" | "landscape" => (w > h ? "landscape" : "portrait");

export async function exportToPNG(node: HTMLElement, filename: string, scale = 2) {
  const dataUrl = await capturePng(node, scale);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  a.click();
}

/** Export one or more pages of arbitrary sizes into a single PDF. */
export async function exportPagesToPDF(pages: PdfPage[], filename: string, scale = 2, quality = 0.9) {
  if (!pages.length) return;
  const first = pages[0];
  const doc = new jsPDF({
    unit: "mm",
    format: [first.widthMm, first.heightMm],
    orientation: orientationFor(first.widthMm, first.heightMm),
    compress: true,
  });
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const dataUrl = await captureJpeg(p.node, scale, quality);
    if (i > 0) {
      doc.addPage([p.widthMm, p.heightMm], orientationFor(p.widthMm, p.heightMm));
    }
    // "FAST" skips jsPDF's costly image-hash lookup; safe since each dataUrl is unique.
    doc.addImage(dataUrl, "JPEG", 0, 0, p.widthMm, p.heightMm, undefined, "FAST");
  }
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
