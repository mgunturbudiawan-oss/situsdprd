import { cn } from "@/lib/utils";

export function Emblem({ src, className }: { src?: string; className?: string }) {
  if (src) return <img src={src} alt="Logo" className={cn("object-contain", className)} />;
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden>
      <path d="M32 2 60 12v22c0 18-12 30-28 36C16 64 4 52 4 34V12L32 2Z" className="fill-primary-700" />
      <path d="M32 7 55 15v19c0 15-10 25-23 31C19 59 9 49 9 34V15L32 7Z" className="fill-accent-500" />
      <path d="M32 11 51 18v16c0 13-8 21-19 27C21 55 13 47 13 34V18l19-7Z" className="fill-primary-700" />
      <path d="m32 20 3.5 7.2 7.9 1.1-5.7 5.6 1.4 7.8L32 38l-7.1 3.7 1.4-7.8-5.7-5.6 7.9-1.1L32 20Z" className="fill-accent-400" />
      <path d="M20 47h24v3H20zM23 43h18v3H23z" className="fill-accent-400" />
    </svg>
  );
}

export function Logo({ namaDaerah, logo, light, compact, tagline = true }: { namaDaerah: string; logo?: string; light?: boolean; compact?: boolean; tagline?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <Emblem src={logo} className={cn("shrink-0", compact ? "h-10 w-10" : "h-10 w-10 lg:h-12 lg:w-12")} />
      <span className="min-w-0 leading-tight">
        <span className={cn("block font-display font-extrabold tracking-wide", compact ? "text-lg" : "text-lg lg:text-xl", light ? "text-white" : "text-primary-800")}>
          DPRD
          {!compact && tagline && <span className={cn("ml-2 hidden text-[10px] font-semibold uppercase tracking-[0.18em] xl:inline", light ? "text-accent-400" : "text-accent-600")}>Dewan Perwakilan Rakyat Daerah</span>}
        </span>
        <span className={cn("block truncate text-[11px] font-semibold uppercase tracking-wider sm:text-xs", light ? "text-white/80" : "text-slate-600")}>{namaDaerah}</span>
      </span>
    </span>
  );
}
