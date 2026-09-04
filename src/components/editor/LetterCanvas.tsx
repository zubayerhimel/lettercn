import { useEffect, useMemo, useRef, useState } from "react";
import { useLetterStore } from "@/store/useLetterStore";
import { getFont } from "@/lib/fonts";
import { getLayout, lineStyleBackground, mmToPx } from "@/lib/layouts";
import { getPaper, TEXTURE_DATA_URL } from "@/lib/papers";
import { paginate } from "@/lib/paginate";

export function useCanvasStyle() {
  const { fontId, fontSize, lineHeight, layoutId, paperId, customPaperColor, inkColor, marginMm } =
    useLetterStore();
  const font = getFont(fontId);
  const layout = getLayout(layoutId);
  const paper = paperId === "custom" ? { color: customPaperColor ?? "#FFFFFF" } : getPaper(paperId);
  return {
    font,
    layout,
    paperColor: paper.color,
    inkColor,
    widthPx: mmToPx(layout.widthMm),
    heightPx: mmToPx(layout.heightMm),
    paddingPx: mmToPx(marginMm),
    fontSize,
    lineHeightPx: fontSize * lineHeight,
  };
}

export function LetterCanvas({ pagesRef }: { pagesRef: React.RefObject<HTMLDivElement[]> }) {
  const { content, setContent, zoom, lineStyle, textureEnabled } = useLetterStore();
  const s = useCanvasStyle();
  const [pages, setPages] = useState<string[]>([""]);
  const contentWidth = s.widthPx - s.paddingPx * 2;
  const contentHeight = s.heightPx - s.paddingPx * 2;
  const linesPerPage = Math.max(1, Math.floor(contentHeight / s.lineHeightPx));
  const fontShorthand = `${s.fontSize}px ${s.font.family}`;

  useEffect(() => {
    let cancelled = false;
    const run = () =>
      setPages(paginate(content, contentWidth, fontShorthand, linesPerPage));
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) run();
      });
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [content, contentWidth, fontShorthand, linesPerPage]);

  const ruling = useMemo(
    () => lineStyleBackground(lineStyle, s.lineHeightPx, s.inkColor),
    [lineStyle, s.lineHeightPx, s.inkColor],
  );

  const registry = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    pagesRef.current = registry.current.filter(Boolean);
  }, [pages.length, pagesRef]);

  const textStyle: React.CSSProperties = {
    fontFamily: s.font.family,
    fontSize: `${s.fontSize}px`,
    lineHeight: `${s.lineHeightPx}px`,
    color: s.inkColor,
    padding: `${s.paddingPx}px`,
  };

  return (
    <div className="flex flex-col items-center gap-10 py-10">
      {pages.map((pageText, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div
            ref={(el) => {
              if (el) registry.current[i] = el;
            }}
            data-page-index={i}
            className="relative overflow-hidden rounded-sm shadow-paper transition-transform duration-200"
            style={{
              width: s.widthPx,
              height: s.heightPx,
              backgroundColor: s.paperColor,
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              marginBottom: `${(zoom - 1) * s.heightPx}px`,
            }}
          >
            <div className="pointer-events-none absolute inset-0" style={ruling} />
            {textureEnabled && (
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{ backgroundImage: TEXTURE_DATA_URL, mixBlendMode: "multiply" }}
              />
            )}
            {i === 0 ? (
              <textarea
                aria-label="Letter text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 h-full w-full resize-none bg-transparent outline-none"
                style={{ ...textStyle, caretColor: s.inkColor }}
              />
            ) : (
              <div
                className="absolute inset-0 whitespace-pre-wrap"
                style={textStyle}
                aria-hidden="true"
              >
                {pageText}
              </div>
            )}
            {i === 0 && pages.length > 1 && (
              <div
                className="pointer-events-none absolute inset-0 whitespace-pre-wrap opacity-0"
                aria-hidden="true"
              />
            )}
          </div>
          <span className="text-xs tracking-wide text-muted-foreground">
            Page {i + 1} of {pages.length}
          </span>
        </div>
      ))}
    </div>
  );
}
