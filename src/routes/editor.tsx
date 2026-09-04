import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LetterCanvas } from "@/components/editor/LetterCanvas";
import { SidebarControls } from "@/components/editor/SidebarControls";
import { Toolbar } from "@/components/editor/Toolbar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLetterStore } from "@/store/useLetterStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Letter Editor — Letterpress" },
      {
        name: "description",
        content:
          "Compose your letter with handwriting fonts, paper textures, page layouts and one-click PDF export.",
      },
      { property: "og:title", content: "Letter Editor — Letterpress" },
      {
        property: "og:description",
        content: "Handwriting fonts, custom paper and print-ready PDF export.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  const pagesRef = useRef<HTMLDivElement[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const focusMode = useLetterStore((s) => s.focusMode);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        toast.success("Draft saved on this device.");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div
        className={cn(
          "transition-opacity duration-500",
          focusMode && "opacity-25 hover:opacity-100",
        )}
      >
        <Toolbar pagesRef={pagesRef} onOpenControls={() => setSheetOpen(true)} />
      </div>
      <div className="flex min-h-0 flex-1">
        <main className="desk-surface min-h-0 flex-1 overflow-auto px-4">
          <LetterCanvas pagesRef={pagesRef} />
        </main>
        <aside
          className={cn(
            "hidden w-[340px] shrink-0 border-l border-border bg-sidebar transition-opacity duration-500 lg:block",
            focusMode && "opacity-25 hover:opacity-100",
          )}
        >
          <SidebarControls pagesRef={pagesRef} />
        </aside>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[92vw] max-w-sm p-0">
          <SheetHeader className="px-4 pt-4">
            <SheetTitle>Style your letter</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-4rem)]">
            <SidebarControls pagesRef={pagesRef} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
