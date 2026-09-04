import { FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getFont } from "@/lib/fonts";
import {
	LANGUAGE_LABEL,
	type LetterTemplate,
	TEMPLATE_CATEGORY_LABEL,
	TEMPLATES,
	type TemplateLanguage,
} from "@/lib/templates";
import { useLetterStore } from "@/store/useLetterStore";

export function TemplatesDialog({ children }: { children?: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [language, setLanguage] = useState<TemplateLanguage>("en");
	const [pending, setPending] = useState<LetterTemplate | null>(null);
	const { content, setContent, setFont } = useLetterStore();

	const templates = useMemo(
		() => TEMPLATES.filter((t) => t.language === language),
		[language],
	);

	const applyTemplate = (t: LetterTemplate) => {
		setContent(t.content);
		if (t.suggestedFontId) setFont(t.suggestedFontId);
		setPending(null);
		setOpen(false);
		toast.success("Template applied.");
	};

	const requestApply = (t: LetterTemplate) => {
		if (content.trim().length > 0) {
			setPending(t);
			return;
		}
		applyTemplate(t);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					{children ?? (
						<Button variant="ghost" size="sm">
							<FileText /> <span className="hidden sm:inline">Templates</span>
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Letter templates</DialogTitle>
						<DialogDescription>
							Starter drafts in English and Bangla. Applying one replaces your
							current draft.
						</DialogDescription>
					</DialogHeader>

					<div className="flex items-center justify-between gap-3">
						<ToggleGroup
							type="single"
							value={language}
							onValueChange={(v) => v && setLanguage(v as TemplateLanguage)}
							variant="outline"
						>
							<ToggleGroupItem value="en">{LANGUAGE_LABEL.en}</ToggleGroupItem>
							<ToggleGroupItem value="bn">{LANGUAGE_LABEL.bn}</ToggleGroupItem>
						</ToggleGroup>
						<span className="text-muted-foreground text-xs">
							{templates.length} templates
						</span>
					</div>

					<ScrollArea className="max-h-[60vh] pr-3">
						<ul className="space-y-3">
							{templates.map((t) => {
								const font = t.suggestedFontId
									? getFont(t.suggestedFontId)
									: null;
								return (
									<li
										key={t.id}
										className="rounded-md border border-border bg-card p-4"
									>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0 space-y-1">
												<div className="flex flex-wrap items-center gap-2">
													<h3 className="font-medium text-sm">{t.title}</h3>
													<Badge variant="secondary" className="text-[10px]">
														{TEMPLATE_CATEGORY_LABEL[t.category]}
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													{t.summary}
												</p>
											</div>
											<Button
												size="sm"
												onClick={() => requestApply(t)}
												aria-label={`Use template: ${t.title}`}
											>
												Use
											</Button>
										</div>
										<pre
											className="mt-3 max-h-32 overflow-hidden whitespace-pre-wrap text-[11px] text-muted-foreground leading-relaxed"
											style={font ? { fontFamily: font.family } : undefined}
										>
											{t.content}
										</pre>
									</li>
								);
							})}
						</ul>
					</ScrollArea>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={pending !== null}
				onOpenChange={(next) => {
					if (!next) setPending(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Replace current draft?</AlertDialogTitle>
						<AlertDialogDescription>
							Your existing letter will be overwritten by the{" "}
							<strong>{pending?.title}</strong> template. This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => pending && applyTemplate(pending)}
						>
							Replace
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
