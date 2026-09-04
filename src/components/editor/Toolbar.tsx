import { Eye, Minus, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/Logo";
import { useLetterStore } from "@/store/useLetterStore";
import { ExportDialog } from "./ExportDialog";
import { cn } from "@/lib/utils";

export function Toolbar({
  pagesRef,
  onOpenControls,
}: {
  pagesRef: React.RefObject<HTMLDivElement[]>;
  onOpenControls: () => void;
}) {
  const { zoom, setZoom, focusMode, setFocusMode } = useLetterStore();
  const step = (d: number) => setZoom(Math.min(1.5, Math.max(0.5, +(zoom + d).toFixed(2))));

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
      <Logo />
      <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />
      <div className="hidden items-center gap-2 sm:flex">
        <Button variant="ghost" size="icon" aria-label="Zoom out" onClick={() => step(-0.1)}>
          <Minus />
        </Button>
        <Slider
          className="w-32"
          min={0.5}
          max={1.5}
          step={0.05}
          value={[zoom]}
          onValueChange={([v]) => setZoom(v)}
          aria-label="Zoom"
        />
        <Button variant="ghost" size="icon" aria-label="Zoom in" onClick={() => step(0.1)}>
          <Plus />
        </Button>
        <span className="w-10 text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant={focusMode ? "default" : "ghost"}
          size="sm"
          onClick={() => setFocusMode(!focusMode)}
          aria-pressed={focusMode}
        >
          <Eye /> <span className="hidden sm:inline">Focus</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn("lg:hidden")}
          onClick={onOpenControls}
          aria-label="Open styling controls"
        >
          <Sparkles /> Style
        </Button>
        <ExportDialog pagesRef={pagesRef} />
      </div>
    </header>
  );
}
