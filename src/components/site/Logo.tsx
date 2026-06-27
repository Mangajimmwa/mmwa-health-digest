import { Link } from "@tanstack/react-router";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { wordmark: "text-base", tag: "text-[10px]" },
    md: { wordmark: "text-xl", tag: "text-[11px]" },
    lg: { wordmark: "text-3xl", tag: "text-sm" },
  } as const;
  const s = sizes[size];
  return (
    <Link to="/" className="block leading-none">
      <div className={`font-display font-bold tracking-tight ${s.wordmark}`}>
        <span className="text-foreground">JOSEPH</span>{" "}
        <span className="text-gold">MMWA</span>
      </div>
      <div className={`mt-1 font-display italic text-white ${s.tag}`}>
        If it's health, it's here.
      </div>
    </Link>
  );
}
