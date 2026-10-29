import { cn, initials } from "@/lib/utils";

export function Avatar({
  src,
  name,
  className,
  rounded = "rounded-2xl",
  textClass = "text-4xl",
}: {
  src?: string;
  name: string;
  className?: string;
  rounded?: string;
  textClass?: string;
}) {
  if (src) return <img src={src} alt={name} className={cn("skeleton object-cover", rounded, className)} />;
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 to-primary-900 font-display font-bold text-white/90",
        rounded,
        className,
      )}
      role="img"
      aria-label={name}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-x-0 bottom-0 h-3/4 w-full text-white/10" fill="currentColor" aria-hidden>
        <circle cx="50" cy="38" r="20" />
        <path d="M10 100c0-24 18-38 40-38s40 14 40 38z" />
      </svg>
      <span className={cn("relative", textClass)}>{initials(name)}</span>
    </div>
  );
}

export function FraksiBadge({ singkatan, warna, logo, className }: { singkatan: string; warna: string; logo?: string; className?: string }) {
  if (logo) return <img src={logo} alt={singkatan} className={cn("object-contain", className)} />;
  return (
    <span
      className={cn("flex items-center justify-center rounded-xl text-center text-xs font-extrabold leading-none text-white shadow-inner", className)}
      style={{ backgroundColor: warna || "#64748b" }}
    >
      {singkatan}
    </span>
  );
}
