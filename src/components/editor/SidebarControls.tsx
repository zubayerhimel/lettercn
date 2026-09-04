import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FONTS, FONT_CATEGORIES } from "@/lib/fonts";
import { LAYOUTS, LINE_STYLES, type LineStyle } from "@/lib/layouts";
import { INKS, PAPERS } from "@/lib/papers";
import { useLetterStore } from "@/store/useLetterStore";
import { ExportDialog } from "./ExportDialog";

export function SidebarControls({ pagesRef }: { pagesRef: React.RefObject<HTMLDivElement[]> }) {
  const s = useLetterStore();

  return (
    <Tabs defaultValue="font" className="flex h-full flex-col gap-0">
      <TabsList className="m-3 grid grid-cols-4">
        <TabsTrigger value="font">Font</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="paper">Paper</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>

      <TabsContent value="font" className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4">
            {FONT_CATEGORIES.map((cat) => (
              <div key={cat} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {cat}
                </p>
                <div className="grid gap-2">
                  {FONTS.filter((f) => f.category === cat).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => s.setFont(f.id)}
                      aria-pressed={s.fontId === f.id}
                      className={cn(
                        "hover-lift rounded-md border border-border bg-card p-3 text-left",
                        s.fontId === f.id && "border-accent ring-1 ring-accent",
                      )}
                    >
                      <span className="text-xl" style={{ fontFamily: f.family }}>
                        The quiet evening light
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <Label>Font size — {s.fontSize}px</Label>
              <Slider
                min={12}
                max={48}
                step={1}
                value={[s.fontSize]}
                onValueChange={([v]) => s.setFontSize(v)}
              />
            </div>
            <div className="space-y-2">
              <Label>Line height — {s.lineHeight.toFixed(2)}</Label>
              <Slider
                min={1.2}
                max={2.6}
                step={0.05}
                value={[s.lineHeight]}
                onValueChange={([v]) => s.setLineHeight(v)}
              />
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="layout" className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => s.setLayout(l.id)}
                  aria-pressed={s.layoutId === l.id}
                  className={cn(
                    "hover-lift flex flex-col items-center gap-2 rounded-md border border-border bg-card p-3",
                    s.layoutId === l.id && "border-accent ring-1 ring-accent",
                  )}
                >
                  <span
                    className="rounded-[2px] border border-border bg-background"
                    style={{
                      width: (l.widthMm / Math.max(l.widthMm, l.heightMm)) * 44,
                      height: (l.heightMm / Math.max(l.widthMm, l.heightMm)) * 44,
                    }}
                  />
                  <span className="text-xs">{l.name}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Line style</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                value={s.lineStyle}
                onValueChange={(v) => v && s.setLineStyle(v as LineStyle)}
                className="flex-wrap"
              >
                {LINE_STYLES.map((ls) => (
                  <ToggleGroupItem key={ls.id} value={ls.id} className="text-xs">
                    {ls.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label>Margin — {s.marginMm}mm</Label>
              <Slider
                min={8}
                max={40}
                step={1}
                value={[s.marginMm]}
                onValueChange={([v]) => s.setMargin(v)}
              />
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="paper" className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4">
            <div className="space-y-2">
              <Label>Paper</Label>
              <div className="grid grid-cols-3 gap-2">
                {PAPERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => s.setPaper(p.id)}
                    aria-label={p.name}
                    aria-pressed={s.paperId === p.id}
                    className={cn(
                      "hover-lift relative h-14 rounded-md border border-border",
                      s.paperId === p.id && "ring-2 ring-accent",
                    )}
                    style={{ backgroundColor: p.color }}
                  >
                    {s.paperId === p.id && (
                      <Check className="absolute right-1 top-1 size-3 text-accent" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Label htmlFor="custom-color" className="text-xs text-muted-foreground">
                  Custom colour
                </Label>
                <input
                  id="custom-color"
                  type="color"
                  value={s.customPaperColor ?? "#FFFFFF"}
                  onChange={(e) => s.setCustomPaperColor(e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded border border-border bg-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <Label htmlFor="texture">Paper texture</Label>
              <Switch id="texture" checked={s.textureEnabled} onCheckedChange={s.setTexture} />
            </div>
            <div className="space-y-2">
              <Label>Ink</Label>
              <div className="grid grid-cols-4 gap-2">
                {INKS.map((ink) => (
                  <button
                    key={ink.id}
                    onClick={() => s.setInkColor(ink.color)}
                    aria-label={ink.name}
                    aria-pressed={s.inkColor === ink.color}
                    className={cn(
                      "hover-lift h-9 rounded-full border border-border",
                      s.inkColor === ink.color && "ring-2 ring-accent",
                    )}
                    style={{ backgroundColor: ink.color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="export" className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <p className="text-sm text-muted-foreground">
            Download your letter as a print-ready PDF or a retina PNG.
          </p>
          <ExportDialog pagesRef={pagesRef}>
            <Button className="w-full">Open export options</Button>
          </ExportDialog>
          <Button variant="outline" className="w-full" onClick={s.reset}>
            Reset letter
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
