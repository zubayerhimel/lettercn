import { useMemo, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ENVELOPES } from "@/lib/envelopes";
import { exportPagesToPDF, exportToPNG, type PdfPage } from "@/lib/export";
import { getLayout, mmToPx } from "@/lib/layouts";
import { useLetterStore } from "@/store/useLetterStore";
import { EnvelopeCanvas } from "./EnvelopeCanvas";

type Format = "pdf" | "png" | "both";
type Mode = "letter" | "envelope" | "both";

export function ExportDialog({
	pagesRef,
	children,
}: {
	pagesRef: React.RefObject<HTMLDivElement[]>;
	children?: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const [filename, setFilename] = useState("my-letter");
	const [format, setFormat] = useState<Format>("pdf");
	const [mode, setMode] = useState<Mode>("letter");
	const [scale, setScale] = useState(2);
	const [busy, setBusy] = useState(false);
	const envelopeRef = useRef<HTMLDivElement | null>(null);
	const {
		layoutId,
		zoom,
		setZoom,
		textureEnabled,
		setTexture,
		recipientAddress,
		setRecipientAddress,
		senderAddress,
		setSenderAddress,
		envelopeSizeId,
		setEnvelopeSize,
		includeStamp,
		setIncludeStamp,
	} = useLetterStore();

	const envelopeSize = useMemo(
		() => ENVELOPES.find((e) => e.id === envelopeSizeId) ?? ENVELOPES[0],
		[envelopeSizeId],
	);

	// Fit the true-size envelope into the ~440px-wide dialog preview area.
	const previewFit = useMemo(() => {
		const targetPx = 380;
		return Math.min(1, targetPx / mmToPx(envelopeSize.widthMm));
	}, [envelopeSize.widthMm]);

	const wantsLetter = mode === "letter" || mode === "both";
	const wantsEnvelope = mode === "envelope" || mode === "both";
	const disabled = wantsEnvelope && !recipientAddress.trim();

	const handleDownload = async () => {
		const letterNodes = (pagesRef.current ?? []).filter(Boolean);
		if (wantsLetter && !letterNodes.length) return;
		const prevZoom = zoom;
		setBusy(true);
		setZoom(1);
		try {
			// Wait two RAFs so the letter (zoom=1) commits before capture.
			await new Promise((r) =>
				requestAnimationFrame(() => requestAnimationFrame(r)),
			);

			const layout = getLayout(layoutId);
			const pdfPages: PdfPage[] = [];
			if (wantsLetter) {
				for (const node of letterNodes) {
					pdfPages.push({
						node,
						widthMm: layout.widthMm,
						heightMm: layout.heightMm,
					});
				}
			}
			if (wantsEnvelope && envelopeRef.current) {
				pdfPages.push({
					node: envelopeRef.current,
					widthMm: envelopeSize.widthMm,
					heightMm: envelopeSize.heightMm,
				});
			}

			if (format === "pdf" || format === "both") {
				await exportPagesToPDF(pdfPages, filename, scale);
			}
			if (format === "png" || format === "both") {
				const totalPngs =
					(wantsLetter ? letterNodes.length : 0) + (wantsEnvelope ? 1 : 0);
				if (wantsLetter) {
					for (let i = 0; i < letterNodes.length; i++) {
						const suffix =
							totalPngs > 1
								? letterNodes.length > 1
									? `-letter-${i + 1}`
									: "-letter"
								: "";
						await exportToPNG(letterNodes[i], `${filename}${suffix}`, scale);
					}
				}
				if (wantsEnvelope && envelopeRef.current) {
					const suffix = totalPngs > 1 ? "-envelope" : "";
					await exportToPNG(envelopeRef.current, `${filename}${suffix}`, scale);
				}
			}
			toast.success(
				mode === "envelope"
					? "Envelope downloaded."
					: mode === "both"
						? "Letter and envelope downloaded."
						: "Your letter has been downloaded.",
			);
			setOpen(false);
		} catch {
			toast.error("Export failed. Please try again.");
		} finally {
			setZoom(prevZoom);
			setBusy(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
			}}
		>
			<DialogTrigger asChild>
				{children ?? (
					<Button>
						<Download /> Export
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Export</DialogTitle>
					<DialogDescription>
						Print-ready output at true page dimensions — letter, matching
						envelope, or both.
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[62vh] pr-3">
					<div className="space-y-5">
						<div className="space-y-2">
							<Label>What to export</Label>
							<ToggleGroup
								type="single"
								value={mode}
								onValueChange={(v) => v && setMode(v as Mode)}
								variant="outline"
								className="w-full"
							>
								<ToggleGroupItem value="letter" className="flex-1">
									Letter
								</ToggleGroupItem>
								<ToggleGroupItem value="envelope" className="flex-1">
									Envelope
								</ToggleGroupItem>
								<ToggleGroupItem value="both" className="flex-1">
									Both
								</ToggleGroupItem>
							</ToggleGroup>
						</div>

						{wantsEnvelope && (
							<Tabs defaultValue="addresses">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="addresses">Addresses</TabsTrigger>
									<TabsTrigger value="preview">Preview</TabsTrigger>
								</TabsList>

								<TabsContent value="addresses" className="space-y-4 pt-3">
									<div className="space-y-2">
										<Label>Envelope size</Label>
										<div className="grid grid-cols-3 gap-2">
											{ENVELOPES.map((e) => (
												<button
													key={e.id}
													type="button"
													onClick={() => setEnvelopeSize(e.id)}
													aria-pressed={envelopeSizeId === e.id}
													className={`rounded-md border p-2 text-left text-xs transition ${
														envelopeSizeId === e.id
															? "border-accent bg-accent/10 ring-1 ring-accent"
															: "border-border bg-card hover:bg-accent/5"
													}`}
												>
													<div className="font-medium">{e.name}</div>
													<div className="text-[10px] text-muted-foreground">
														{e.description}
													</div>
												</button>
											))}
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="recipient">Recipient address</Label>
										<Textarea
											id="recipient"
											rows={4}
											value={recipientAddress}
											onChange={(e) => setRecipientAddress(e.target.value)}
											placeholder={"Name\nStreet\nCity, Postcode\nCountry"}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="sender">Return address (optional)</Label>
										<Textarea
											id="sender"
											rows={3}
											value={senderAddress}
											onChange={(e) => setSenderAddress(e.target.value)}
											placeholder="Your name and address"
										/>
									</div>

									<div className="flex items-center justify-between rounded-md border border-border p-3">
										<Label htmlFor="stamp">Stamp placeholder</Label>
										<Switch
											id="stamp"
											checked={includeStamp}
											onCheckedChange={setIncludeStamp}
										/>
									</div>
								</TabsContent>

								<TabsContent value="preview" className="pt-3">
									<div className="flex justify-center rounded-md border border-border bg-muted/40 p-4">
										<EnvelopeCanvas previewScale={previewFit} />
									</div>
									<p className="mt-2 text-center text-[11px] text-muted-foreground">
										{envelopeSize.name} · {envelopeSize.widthMm} ×{" "}
										{envelopeSize.heightMm} mm
									</p>
								</TabsContent>
							</Tabs>
						)}

						<div className="space-y-2">
							<Label htmlFor="filename">File name</Label>
							<Input
								id="filename"
								value={filename}
								onChange={(e) => setFilename(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>Format</Label>
							<ToggleGroup
								type="single"
								value={format}
								onValueChange={(v) => v && setFormat(v as Format)}
								variant="outline"
								className="w-full"
							>
								<ToggleGroupItem value="pdf" className="flex-1">
									PDF
								</ToggleGroupItem>
								<ToggleGroupItem value="png" className="flex-1">
									PNG
								</ToggleGroupItem>
								<ToggleGroupItem value="both" className="flex-1">
									Both
								</ToggleGroupItem>
							</ToggleGroup>
						</div>
						<div className="space-y-2">
							<Label>Quality — {scale}×</Label>
							<Slider
								min={1}
								max={3}
								step={1}
								value={[scale]}
								onValueChange={([v]) => setScale(v)}
							/>
							<p className="text-[11px] text-muted-foreground">
								{scale === 1
									? "Draft — smallest file, screen preview."
									: scale === 2
										? "Print — crisp on paper, small file."
										: "Archival — highest detail, largest file."}
							</p>
						</div>
						<div className="flex items-center justify-between rounded-md border border-border p-3">
							<Label htmlFor="tex">Include paper texture</Label>
							<Switch
								id="tex"
								checked={textureEnabled}
								onCheckedChange={setTexture}
							/>
						</div>
					</div>
				</ScrollArea>

				{/*
          When the envelope is exported without opening the preview tab, its DOM
          must still exist for capture. Keep an off-screen copy mounted whenever
          the envelope is part of the export.
        */}
				{wantsEnvelope && (
					<div
						aria-hidden="true"
						style={{
							position: "fixed",
							left: -99999,
							top: 0,
							pointerEvents: "none",
							opacity: 0,
						}}
					>
						<EnvelopeCanvas ref={envelopeRef} previewScale={1} />
					</div>
				)}

				<DialogFooter>
					<Button onClick={handleDownload} disabled={busy || disabled}>
						{busy ? <Loader2 className="animate-spin" /> : <Download />}{" "}
						Download
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
