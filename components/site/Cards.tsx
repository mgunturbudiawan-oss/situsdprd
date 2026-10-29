import Link from "next/link";
import { Calendar, Clock, MapPin, Play, Radio } from "lucide-react";
import type { Agenda, Anggota, Berita, Fraksi, Video } from "@/lib/types";
import { cn, dateParts, formatDate, videoThumb, ZONA_WAKTU } from "@/lib/utils";
import { Avatar, FraksiBadge } from "./Avatar";

export function NewsCard({ b, large }: { b: Berita; large?: boolean }) {
  return (
    <Link href={`/berita/${b.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={cn("skeleton relative overflow-hidden", large ? "aspect-[16/9]" : "aspect-[16/10]")}>
        {b.gambar && <img src={b.gambar} alt={b.judul} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
        <span className="badge absolute left-4 top-4 bg-primary-700 text-white">{b.kategori}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar className="h-3.5 w-3.5" /> {formatDate(b.tanggal)}
        </span>
        <h3 className={cn("mt-2 font-display font-bold leading-snug text-slate-900 transition group-hover:text-primary-700", large ? "text-2xl" : "line-clamp-2 text-lg")}>
          {b.judul}
        </h3>
        {b.ringkasan && <p className={cn("mt-2 text-sm text-slate-600", large ? "line-clamp-3" : "line-clamp-2")}>{b.ringkasan}</p>}
      </div>
    </Link>
  );
}

export function NewsRow({ b }: { b: Berita }) {
  return (
    <Link href={`/berita/${b.slug}`} className="group flex gap-4">
      <div className="skeleton aspect-square w-24 shrink-0 overflow-hidden rounded-xl">
        {b.gambar && <img src={b.gambar} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />}
      </div>
      <div>
        <span className="text-xs font-semibold text-primary-700">{b.kategori}</span>
        <h4 className="line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-primary-700">{b.judul}</h4>
        <span className="mt-1 block text-xs text-slate-500">{formatDate(b.tanggal)}</span>
      </div>
    </Link>
  );
}

const STATUS_COLOR: Record<string, string> = {
  Terjadwal: "bg-primary-50 text-primary-700",
  Berlangsung: "bg-green-50 text-green-700",
  Selesai: "bg-slate-100 text-slate-600",
  Ditunda: "bg-amber-50 text-amber-700",
  Dibatalkan: "bg-red-50 text-red-700",
};

export function AgendaCard({ a, komisi }: { a: Agenda; komisi?: string }) {
  const d = dateParts(a.tanggal);
  return (
    <Link href={`/agenda/${a.id}`} className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-lg">
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-700 py-3 text-white">
        <span className="font-display text-2xl font-extrabold leading-none">{d.day}</span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">{d.month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge bg-accent-100 text-accent-800">{a.jenis}</span>
          <span className={cn("badge", STATUS_COLOR[a.status] || "bg-slate-100")}>{a.status}</span>
          {a.disiarkan && (
            <span className="badge bg-red-50 text-red-700">
              <Radio className="h-3 w-3" /> Disiarkan
            </span>
          )}
        </div>
        <h3 className="mt-2 font-semibold leading-snug text-slate-900 group-hover:text-primary-700">{a.judul}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {d.weekday}, {a.waktuMulai}
            {a.waktuSelesai && ` – ${a.waktuSelesai}`} {ZONA_WAKTU}
          </span>
          {a.lokasi && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {a.lokasi}
            </span>
          )}
          {komisi && <span className="font-medium text-primary-700">{komisi}</span>}
        </div>
      </div>
    </Link>
  );
}

export function MemberCard({ a, fraksi, subtitle }: { a: Anggota; fraksi?: Fraksi; subtitle?: string }) {
  return (
    <Link href={`/anggota/${a.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="skeleton relative aspect-[3/4] overflow-hidden">
        <Avatar src={a.foto} name={a.nama} rounded="" className="h-full w-full transition duration-500 group-hover:scale-105" />
        {fraksi && <FraksiBadge singkatan={fraksi.singkatan} warna={fraksi.warna} logo={fraksi.logo} className="absolute right-3 top-3 h-11 w-11 bg-white p-1 text-[10px]" />}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold leading-snug text-slate-900 group-hover:text-primary-700">{a.nama}</h3>
        <p className="mt-1 text-xs font-medium text-primary-700">{subtitle || a.jabatan}</p>
        {fraksi && <p className="mt-0.5 text-xs text-slate-500">{fraksi.nama}</p>}
      </div>
    </Link>
  );
}

export function VideoCard({ v, active, dark }: { v: Video; active?: boolean; dark?: boolean }) {
  const thumb = videoThumb(v);
  return (
    <Link href={`/tv?v=${v.id}#player`} className={cn("group block", active && "pointer-events-none")}>
      <div className={cn("skeleton-dark relative aspect-video overflow-hidden rounded-xl", active && "ring-4 ring-accent-500")}>
        {thumb && <img src={thumb} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/40">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary-700 shadow-lg transition group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </span>
        {v.kategori && <span className="badge absolute left-3 top-3 bg-black/60 text-white">{v.kategori}</span>}
      </div>
      <h4 className={cn("mt-3 line-clamp-2 font-semibold leading-snug", dark ? "text-white group-hover:text-accent-300" : "text-slate-900 group-hover:text-primary-700")}>{v.judul}</h4>
      <span className={cn("text-xs", dark ? "text-white/50" : "text-slate-500")}>{formatDate(v.tanggal)}</span>
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, desc, action, light }: { eyebrow: string; title: string; desc?: string; action?: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <span className={cn("eyebrow", light && "text-accent-400")}>{eyebrow}</span>
        <h2 className={cn("heading", light && "text-white")}>{title}</h2>
        {desc && <p className={cn("mt-3", light ? "text-white/70" : "text-slate-600")}>{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Pagination({ page, totalPages, makeHref }: { page: number; totalPages: number; makeHref: (p: number) => string }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-12 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          className={cn(
            "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold",
            p === page ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-500">{text}</div>;
}
