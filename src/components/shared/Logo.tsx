import { Link } from "@tanstack/react-router";
import { PenLine } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <PenLine className="size-4" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">Letterpress</span>
    </Link>
  );
}
