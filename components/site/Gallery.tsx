"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Item = { id: string; judul: string; gambar: string; keterangan: string; tanggal: string };

export function Gallery({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i! + 1) % items.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i! - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const cur = open !== null ? items[open] : null;

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {items.map((g, i) => (
          <button key={g.id} onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl">
            <img src={g.gambar} alt={g.judul} className="skeleton min-h-40 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
            <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent p-4 text-left text-white opacity-0 transition group-hover:opacity-100">
              <span className="font-semibold">{g.judul}</span>
              <span className="text-xs text-white/70">{formatDate(g.tanggal)}</span>
            </span>
          </button>
        ))}
      </div>
      {cur && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/10" aria-label="Tutup">
            <X className="h-7 w-7" />
          </button>
          <button
            className="absolute left-4 rounded-full p-3 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open! - 1 + items.length) % items.length);
            }}
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={cur.gambar} alt={cur.judul} className="max-h-[80vh] rounded-lg object-contain" />
            <figcaption className="mt-3 text-center text-white">
              <p className="font-semibold">{cur.judul}</p>
              <p className="text-sm text-white/60">{cur.keterangan}</p>
            </figcaption>
          </figure>
          <button
            className="absolute right-4 rounded-full p-3 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open! + 1) % items.length);
            }}
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </>
  );
}
