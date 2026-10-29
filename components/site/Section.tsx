import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Judul seksi bergaya kelembagaan: huruf kapital + garis bawah tiga warna + tautan "Lainnya". */
export function SectionTitle({
  title,
  subtitle,
  href,
  linkLabel = "Lainnya",
  light,
  center,
  className,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 sm:flex-row sm:items-end md:mb-8", center ? "items-center text-center sm:justify-center" : "sm:justify-between", className)}>
      <div className={cn(center && "flex flex-col items-center")}>
        <h2 className={cn("font-display text-xl font-extrabold uppercase tracking-wide md:text-2xl", light ? "text-white" : "text-primary-900")}>{title}</h2>
        <div className={cn("mt-2.5 flex gap-1.5", center && "justify-center")} aria-hidden>
          <span className="h-1 w-14 rounded-full bg-accent-500" />
          <span className={cn("h-1 w-5 rounded-full", light ? "bg-white/70" : "bg-primary-600")} />
          <span className={cn("h-1 w-2 rounded-full", light ? "bg-white/40" : "bg-primary-300")} />
        </div>
        {subtitle && <p className={cn("mt-3 max-w-2xl text-sm md:text-base", light ? "text-white/70" : "text-slate-600")}>{subtitle}</p>}
      </div>
      {href && <MoreLink href={href} label={linkLabel} light={light} />}
    </div>
  );
}

export function MoreLink({ href, label = "Lainnya", light }: { href: string; label?: string; light?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition",
        light ? "text-accent-400 hover:text-accent-300" : "text-primary-700 hover:text-accent-600",
      )}
    >
      {label} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </Link>
  );
}

/** Panel sidebar dengan kepala berwarna. */
export function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3 border-b-2 border-accent-500 bg-primary-900 px-5 py-3.5">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-12 flex items-center justify-center gap-3 text-accent-500" aria-hidden>
      <span className="h-px w-16 bg-slate-200" />
      <span className="text-lg tracking-[0.5em]">✦✦✦</span>
      <span className="h-px w-16 bg-slate-200" />
    </div>
  );
}
