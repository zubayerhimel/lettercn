import { forwardRef } from "react";
import { getFont } from "@/lib/fonts";
import { mmToPx } from "@/lib/layouts";
import { getEnvelopeSize } from "@/lib/envelopes";
import { getPaper, TEXTURE_DATA_URL } from "@/lib/papers";
import { useLetterStore } from "@/store/useLetterStore";

interface Props {
	/** Visual scale for on-screen preview. The captured node is always full size. */
	previewScale?: number;
}

/**
 * True-page-size envelope render (matches the letter's paper, ink and font).
 * The ref points at the actual full-size envelope node so it can be captured
 * by html-to-image / jsPDF at print resolution regardless of previewScale.
 */
export const EnvelopeCanvas = forwardRef<HTMLDivElement, Props>(
	function EnvelopeCanvas({ previewScale = 1 }, ref) {
		const {
			fontId,
			inkColor,
			paperId,
			customPaperColor,
			textureEnabled,
			envelopeSizeId,
			recipientAddress,
			senderAddress,
			includeStamp,
		} = useLetterStore();

		const font = getFont(fontId);
		const size = getEnvelopeSize(envelopeSizeId);
		const paper =
			paperId === "custom"
				? { color: customPaperColor ?? "#FFFFFF" }
				: getPaper(paperId);
		const widthPx = mmToPx(size.widthMm);
		const heightPx = mmToPx(size.heightMm);
		const padPx = mmToPx(10);
		const stampWidthPx = mmToPx(22);
		const stampHeightPx = mmToPx(27);

		return (
			<div
				style={{
					width: widthPx * previewScale,
					height: heightPx * previewScale,
					overflow: "hidden",
				}}
			>
				<div
					ref={ref}
					data-envelope
					className="relative overflow-hidden rounded-sm shadow-paper"
					style={{
						width: widthPx,
						height: heightPx,
						backgroundColor: paper.color,
						color: inkColor,
						fontFamily: font.family,
						transform: `scale(${previewScale})`,
						transformOrigin: "top left",
					}}
				>
					{textureEnabled && (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 opacity-25"
							style={{
								backgroundImage: TEXTURE_DATA_URL,
								mixBlendMode: "multiply",
							}}
						/>
					)}

					{senderAddress.trim() && (
						<div
							className="absolute whitespace-pre-wrap leading-tight"
							style={{
								top: padPx,
								left: padPx,
								fontSize: 14,
								lineHeight: 1.35,
								maxWidth: widthPx * 0.4,
							}}
						>
							{senderAddress}
						</div>
					)}

					{includeStamp && (
						<div
							role="img"
							aria-label="Stamp placeholder"
							className="absolute flex items-center justify-center"
							style={{
								top: padPx,
								right: padPx,
								width: stampWidthPx,
								height: stampHeightPx,
								border: `1.5px dashed ${inkColor}`,
								opacity: 0.5,
								borderRadius: 2,
								fontFamily:
									"ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
								fontSize: 9,
								letterSpacing: "0.2em",
								textTransform: "uppercase",
							}}
						>
							Stamp
						</div>
					)}

					<div
						className="absolute whitespace-pre-wrap leading-snug"
						style={{
							left: "50%",
							top: "58%",
							transform: "translate(-50%, -50%)",
							fontSize: 22,
							lineHeight: 1.4,
							textAlign: "left",
							maxWidth: widthPx * 0.7,
						}}
					>
						{recipientAddress || "Recipient address"}
					</div>
				</div>
			</div>
		);
	},
);
