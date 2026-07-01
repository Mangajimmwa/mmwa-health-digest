import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Item {
  headline: string;
  slug?: string | null;
  link?: string | null;
}

export function BreakingTicker({ item }: { item?: Item | null }) {
  const [open, setOpen] = useState(true);
  if (!open || !item?.headline) return null;

  const inner = (
    <div className="relative flex-1 overflow-hidden">
      <div className="ticker-track font-serif">{item.headline}</div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[60px]"
        style={{ background: "linear-gradient(to right, #990000, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[60px]"
        style={{ background: "linear-gradient(to left, #990000, transparent)" }}
      />
    </div>
  );

  const clickableInner = item.slug ? (
    <Link to="/news/$slug" params={{ slug: item.slug }} className="flex-1 min-w-0 cursor-pointer">
      {inner}
    </Link>
  ) : item.link ? (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 cursor-pointer">
      {inner}
    </a>
  ) : (
    inner
  );

  return (
    <div className="bg-breaking text-white overflow-hidden border-b border-black/40">
      <div className="mx-auto max-w-7xl flex items-center gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-2 shrink-0 font-sans font-bold uppercase tracking-[0.18em] text-xs">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Breaking</span>
          <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-white" />
        </div>
        {clickableInner}
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
