import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export function BreakingTicker({ headline }: { headline?: string | null }) {
  const [open, setOpen] = useState(true);
  if (!open || !headline) return null;
  return (
    <div className="bg-breaking text-white overflow-hidden border-b border-black/40">
      <div className="mx-auto max-w-7xl flex items-center gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-2 shrink-0 font-sans font-bold uppercase tracking-[0.18em] text-xs">
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">Breaking</span>
          <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-white" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track font-serif">{headline}</div>
        </div>
        <button
          aria-label="Dismiss breaking news"
          onClick={() => setOpen(false)}
          className="shrink-0 opacity-80 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
