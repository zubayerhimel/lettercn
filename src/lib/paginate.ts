let ctx: CanvasRenderingContext2D | null = null;

function measure(text: string, font: string) {
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

export interface WrappedLine {
  line: string;
  startOffset: number;
  endOffset: number;
}

/** Wrap plain text into visual lines with their offsets in the original text. */
export function wrapLines(text: string, widthPx: number, font: string): WrappedLine[] {
  const result: WrappedLine[] = [];
  const paragraphs = text.split("\n");
  let paraStart = 0;

  for (const paragraph of paragraphs) {
    const paraEnd = paraStart + paragraph.length;

    if (!paragraph.trim()) {
      result.push({ line: "", startOffset: paraStart, endOffset: paraEnd });
      paraStart = paraEnd + 1;
      continue;
    }

    const words: Array<{ text: string; start: number; end: number }> = [];
    const re = /\S+/g;
    let m = re.exec(paragraph);
    while (m !== null) {
      words.push({
        text: m[0],
        start: paraStart + m.index,
        end: paraStart + m.index + m[0].length,
      });
      m = re.exec(paragraph);
    }

    let current = "";
    let currentStart = words[0]?.start ?? paraStart;
    let currentEnd = words[0]?.end ?? paraStart;

    for (const word of words) {
      const candidate = current ? `${current} ${word.text}` : word.text;
      if (current && measure(candidate, font) > widthPx) {
        result.push({ line: current, startOffset: currentStart, endOffset: currentEnd });
        current = word.text;
        currentStart = word.start;
        currentEnd = word.end;
      } else {
        current = candidate;
        currentEnd = word.end;
      }
    }
    if (current) {
      result.push({ line: current, startOffset: currentStart, endOffset: currentEnd });
    }

    paraStart = paraEnd + 1;
  }

  return result;
}

export interface Page {
  /** Slice of the original content that belongs to this page. */
  text: string;
  /** Start offset in the original content (inclusive). */
  startOffset: number;
  /** End offset in the original content (exclusive). */
  endOffset: number;
}

/** Split text into pages that each fit `linesPerPage` visual lines. */
export function paginate(text: string, widthPx: number, font: string, linesPerPage: number): Page[] {
  if (linesPerPage < 1) {
    return [{ text, startOffset: 0, endOffset: text.length }];
  }
  const wrapped = wrapLines(text, widthPx, font);
  if (wrapped.length === 0) {
    return [{ text: "", startOffset: 0, endOffset: 0 }];
  }

  const pages: Page[] = [];
  for (let i = 0; i < wrapped.length; i += linesPerPage) {
    const chunk = wrapped.slice(i, i + linesPerPage);
    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    if (!first || !last) continue;
    const isLast = i + linesPerPage >= wrapped.length;
    // Include the trailing char (space or newline) between pages so nothing is lost during editing.
    const endOffset = isLast ? text.length : Math.min(text.length, last.endOffset + 1);
    pages.push({
      text: text.slice(first.startOffset, endOffset),
      startOffset: first.startOffset,
      endOffset,
    });
  }
  return pages;
}
