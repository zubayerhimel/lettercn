import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Feather, LayoutTemplate, Palette } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { FONTS } from "@/lib/fonts";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Letterpress — Handwritten letters, digitally crafted" },
			{
				name: "description",
				content:
					"Write letters in curated handwriting fonts, choose paper, texture and layout, then download a print-ready PDF.",
			},
			{
				property: "og:title",
				content: "Letterpress — Handwritten letters, digitally crafted",
			},
			{
				property: "og:description",
				content:
					"A distraction-free letter writing studio with beautiful paper and one-click PDF export.",
			},
			{ property: "og:type", content: "website" },
			{ name: "twitter:card", content: "summary_large_image" },
		],
	}),
	component: Landing,
});

const FEATURES = [
	{
		icon: Feather,
		title: "15 handwriting fonts",
		body: "Casual, elegant, playful, vintage — every hand curated for legibility.",
	},
	{
		icon: Palette,
		title: "Custom paper & ink",
		body: "Ivory, parchment, midnight and more, with grain texture and ink colours.",
	},
	{
		icon: LayoutTemplate,
		title: "Real page layouts",
		body: "A4, US Letter, postcard, journal and square notes at true dimensions.",
	},
	{
		icon: Download,
		title: "One-click export",
		body: "Retina PNG or print-ready multi-page PDF, exactly as you see it.",
	},
];

function Landing() {
	return (
		<div className="min-h-screen">
			<header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
				<Logo />
				<Button asChild variant="ghost" size="sm">
					<Link to="/editor">Open the studio</Link>
				</Button>
			</header>

			<section className="desk-surface border-border border-y">
				<div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
					<div>
						<p className="font-semibold text-accent text-xs uppercase tracking-[0.25em]">
							The letter writing studio
						</p>
						<h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">
							Handwritten letters,
							<span className="block font-script text-6xl text-accent sm:text-7xl">
								digitally crafted.
							</span>
						</h1>
						<p className="mt-6 max-w-md text-base text-muted-foreground">
							Compose slowly. Pick a hand, a paper, a ruling. Then take it off
							the screen as a print-ready page.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Button asChild size="lg" className="hover-lift">
								<Link to="/editor">Start writing</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<a href="#fonts">See the fonts</a>
							</Button>
						</div>
					</div>

					<div className="relative rounded-sm bg-card p-8 shadow-paper">
						<svg
							viewBox="0 0 400 160"
							className="w-full"
							role="img"
							aria-label="Handwritten greeting"
						>
							<path
								className="animate-draw"
								d="M20 110 C60 20 80 140 110 70 C130 25 150 130 180 80 C200 45 215 120 240 85 C265 50 290 120 320 70 C340 38 360 90 380 70"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								style={{ color: "var(--color-accent)" }}
							/>
						</svg>
						<p className="mt-6 font-script text-3xl text-foreground leading-relaxed">
							Dearest reader, some things are worth writing by hand.
						</p>
						<p className="mt-4 text-muted-foreground text-sm">
							— Caveat, 28px, ivory paper
						</p>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 py-20">
				<h2 className="font-display text-3xl">
					Everything a good letter needs
				</h2>
				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{FEATURES.map((f) => (
						<article
							key={f.title}
							className="hover-lift rounded-md border border-border bg-card p-6"
						>
							<f.icon className="size-5 text-accent" />
							<h3 className="mt-4 font-semibold text-base">{f.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm">{f.body}</p>
						</article>
					))}
				</div>
			</section>

			<section id="fonts" className="border-border border-t bg-secondary/40">
				<div className="mx-auto max-w-6xl px-6 py-20">
					<h2 className="font-display text-3xl">One phrase, fifteen hands</h2>
					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{FONTS.map((f) => (
							<div
								key={f.id}
								className="rounded-md border border-border bg-card p-5"
							>
								<p
									className="text-2xl leading-snug"
									style={{ fontFamily: f.family }}
								>
									The evenings have turned golden.
								</p>
								<p className="mt-3 text-muted-foreground text-xs uppercase tracking-widest">
									{f.name} · {f.category}
								</p>
							</div>
						))}
					</div>
					<div className="mt-12">
						<Button asChild size="lg">
							<Link to="/editor">Write your letter</Link>
						</Button>
					</div>
				</div>
			</section>

			<footer className="border-border border-t py-10 text-center text-muted-foreground text-sm">
				Letterpress — write something worth keeping.
			</footer>
		</div>
	);
}
