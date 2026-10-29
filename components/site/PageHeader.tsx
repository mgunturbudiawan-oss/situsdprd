import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  crumbs = [],
  image,
}: {
  title: string;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-900 pb-10 pt-36 md:pb-20 md:pt-48">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900/90 to-primary-800/80" />
      <div className="pattern-dots absolute inset-0" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="container relative">
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-white/60 sm:mb-4 sm:text-sm">
          <Link href="/" className="hover:text-white">Beranda</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white/90">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="max-w-4xl font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">{subtitle}</p>}
        <div className="mt-6 h-1 w-20 rounded-full bg-accent-500" />
      </div>
    </section>
  );
}
