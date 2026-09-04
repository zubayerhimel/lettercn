import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { exportToPDF, exportToPNG } from "@/lib/export";
import { getLayout } from "@/lib/layouts";
import { useLetterStore } from "@/store/useLetterStore";

type Format = "pdf" | "png" | "both";

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
  const [scale, setScale] = useState(3);
  const [busy, setBusy] = useState(false);
  const { layoutId, zoom, setZoom, textureEnabled, setTexture } = useLetterStore();

  const handleDownload = async () => {
    const nodes = (pagesRef.current ?? []).filter(Boolean);
    if (!nodes.length) return;
    const prevZoom = zoom;
    setBusy(true);
    setZoom(1);
    try {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (format === "pdf" || format === "both") {
        await exportToPDF(nodes, getLayout(layoutId), filename, scale);
      }
      if (format === "png" || format === "both") {
        for (let i = 0; i < nodes.length; i++) {
          await exportToPNG(nodes[i], nodes.length > 1 ? `${filename}-${i + 1}` : filename, scale);
        }
      }
      toast.success("Your letter has been downloaded.");
      setOpen(false);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setZoom(prevZoom);
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Download /> Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export your letter</DialogTitle>
          <DialogDescription>Print-ready output at true page dimensions.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="filename">File name</Label>
            <Input id="filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
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
            <Slider min={1} max={3} step={1} value={[scale]} onValueChange={([v]) => setScale(v)} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <Label htmlFor="tex">Include paper texture</Label>
            <Switch id="tex" checked={textureEnabled} onCheckedChange={setTexture} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Download />} Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
