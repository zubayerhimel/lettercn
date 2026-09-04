import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import type { Layout } from "./layouts";

async function capture(node: HTMLElement, scale: number) {
  if (document.fonts?.ready) await document.fonts.ready;
  return toPng(node, {
    pixelRatio: scale,
    cacheBust: true,
    skipFonts: false,
    backgroundColor: undefined,
  });
}

export async function exportToPNG(node: HTMLElement, filename: string, scale = 3) {
  const dataUrl = await capture(node, scale);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  a.click();
}

export async function exportToPDF(
  pageNodes: HTMLElement[],
  layout: Layout,
  filename: string,
  scale = 3,
) {
  const doc = new jsPDF({
    unit: "mm",
    format: [layout.widthMm, layout.heightMm],
    orientation: layout.widthMm > layout.heightMm ? "landscape" : "portrait",
  });

  for (let i = 0; i < pageNodes.length; i++) {
    const dataUrl = await capture(pageNodes[i], scale);
    if (i > 0) doc.addPage([layout.widthMm, layout.heightMm]);
    doc.addImage(dataUrl, "PNG", 0, 0, layout.widthMm, layout.heightMm);
  }

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
