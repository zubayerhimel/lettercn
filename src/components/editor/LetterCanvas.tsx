import { useEffect, useMemo, useRef, useState } from "react";

import { getFont, type HandFont } from "@/lib/fonts";
import {
	getLayout,
	type Layout,
	lineStyleBackground,
	mmToPx,
} from "@/lib/layouts";
import { paginate } from "@/lib/paginate";
import { getPaper, TEXTURE_DATA_URL } from "@/lib/papers";
import { useLetterStore } from "@/store/useLetterStore";

export function useCanvasStyle() {
	const {
		fontId,
		fontSize,
		lineHeight,
		layoutId,
		paperId,
		customPaperColor,
		inkColor,
		marginMm,
	} = useLetterStore();
	const font: HandFont = getFont(fontId);
	const layout: Layout = getLayout(layoutId);
	const paper: { color: string } =
		paperId === "custom"
			? { color: customPaperColor ?? "#FFFFFF" }
			: getPaper(paperId);
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

export function LetterCanvas({
	pagesRef,
}: {
	pagesRef: React.RefObject<HTMLDivElement[]>;
}) {
	const { content, setContent, zoom, lineStyle, textureEnabled } =
		useLetterStore();
	const s = useCanvasStyle();
	const [pages, setPages] = useState<string[]>([""]);
	// One blank ruled line above the first line of text.
	const extraTopPx = s.lineHeightPx;
	const contentWidth = s.widthPx - s.paddingPx * 2;
	const contentHeight = s.heightPx - s.paddingPx * 2 - extraTopPx;
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

	const ruling = useMemo<React.CSSProperties>(() => {
		const base = lineStyleBackground(lineStyle, s.lineHeightPx, s.inkColor);
		if (lineStyle !== "ruled" && lineStyle !== "vintage") return base;
		// Phase-align rules to padding so the x-height (visual centre of letters) sits mid-band.
		const yShift = s.paddingPx + 1;
		return { ...base, backgroundPosition: `0 ${yShift}px` };
	}, [lineStyle, s.lineHeightPx, s.inkColor, s.paddingPx]);

	const registry = useRef<HTMLDivElement[]>([]);
	// Cheap ref sync; runs after each render so pagesRef always mirrors the mounted page nodes.
	useEffect(() => {
		pagesRef.current = registry.current.filter(Boolean);
	});

	const textStyle: React.CSSProperties = {
		fontFamily: s.font.family,
		fontSize: `${s.fontSize}px`,
		lineHeight: `${s.lineHeightPx}px`,
		color: s.inkColor,
		padding: `${s.paddingPx + extraTopPx}px ${s.paddingPx}px ${s.paddingPx}px`,
	};

	return (
		<div className="flex flex-col items-center gap-10 py-10">
			{pages.map((pageText, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: page order is stable; keying by index keeps the first-page textarea from remounting.
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
						<div
							className="pointer-events-none absolute inset-0"
							style={ruling}
						/>
						{textureEnabled && (
							<div
								className="pointer-events-none absolute inset-0 opacity-25"
								style={{
									backgroundImage: TEXTURE_DATA_URL,
									mixBlendMode: "multiply",
								}}
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
					<span className="text-muted-foreground text-xs tracking-wide">
						Page {i + 1} of {pages.length}
					</span>
				</div>
			))}
		</div>
	);
}
