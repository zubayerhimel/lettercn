let ctx: CanvasRenderingContext2D | null = null;

function measure(text: string, font: string) {
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

/** Wrap plain text into visual lines for a given content width. */
export function wrapLines(text: string, widthPx: number, font: string): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = current ? `${current} ${word}` : word;
      if (measure(candidate, font) > widthPx && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    lines.push(current);
  }
  return lines;
}

/** Split text into page strings that each fit `linesPerPage` visual lines. */
export function paginate(
  text: string,
  widthPx: number,
  font: string,
  linesPerPage: number,
): string[] {
  if (linesPerPage < 1) return [text];
  const lines = wrapLines(text, widthPx, font);
  const pages: string[] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage).join("\n"));
  }
  return pages.length ? pages : [""];
}
