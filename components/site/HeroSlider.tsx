"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  judul: string;
  subjudul: string;
  gambar: string;
  tombolTeks: string;
  tombolLink: string;
}

export function HeroSlider({
  slides,
  namaDaerah,
  overlay,
}: {
  slides: HeroSlide[];
  namaDaerah: string;
  overlay?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(t);
  }, [count, paused]);

  // Parallax: latar bergerak lebih lambat dari halaman, konten sedikit lebih cepat lalu memudar.
  // Diterapkan langsung ke style (tanpa re-render). Saat halaman dibuka (scroll 0) semuanya pada posisi normal.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = section.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), h);
      section.querySelectorAll<HTMLElement>("[data-parallax-bg]").forEach((el) => {
        el.style.transform = `translate3d(0, ${y * 0.45}px, 0)`;
      });
      section.querySelectorAll<HTMLElement>("[data-parallax-fg]").forEach((el) => {
        el.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
        el.style.opacity = String(Math.max(1 - y / (h * 0.75), 0));
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [index]);

  if (!count) {
    slides = [{ id: "x", judul: `Selamat Datang di Portal DPRD ${namaDaerah}`, subjudul: "", gambar: "", tombolTeks: "Sampaikan Aspirasi", tombolLink: "/aspirasi" }];
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[70svh] max-h-[640px] min-h-[540px] w-full sm:h-[80svh] sm:max-h-none md:h-[100svh] md:min-h-[620px] overflow-hidden bg-primary-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {overlay && (
        // Memakai .container yang sama dengan header agar tepi kanannya segaris dengan tombol LIVE
        <div className="pointer-events-none absolute inset-x-0 top-[8rem] z-20 lg:top-[8.75rem]">
          <div className="container flex justify-end">
            <div className="pointer-events-auto">{overlay}</div>
          </div>
        </div>
      )}
      {slides.map((s, i) => (
        <div key={s.id} className={cn("skeleton-dark absolute inset-0 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")} aria-hidden={i !== index}>
          {/* Lapisan latar dibuat lebih tinggi dari hero agar tidak ada celah saat digeser parallax */}
          <div data-parallax-bg className="absolute inset-x-0 top-0 h-[150%] will-change-transform">
            {s.gambar ? (
              <img src={s.gambar} alt="" className={cn("h-full w-full object-cover", i === index && "animate-kenburns")} />
            ) : (
              <div className="pattern-dots h-full w-full bg-gradient-to-br from-primary-800 to-primary-950" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-950/75 via-primary-950/50 to-primary-950/85" />

        </div>
      ))}

      {/* Kotak pencarian di tengah hero (tetap di tempat saat slide latar berganti) */}
      <h1 className="sr-only">DPRD {namaDaerah}</h1>
      <div className="container relative z-10 flex h-full flex-col items-center justify-center pb-14 pt-[13.5rem] text-center sm:pt-40 md:pb-24 md:pt-28">
        <div data-parallax-fg className="w-full max-w-2xl will-change-transform">
          <form action="/cari" role="search">
            <label htmlFor="hero-search" className="mb-3 block font-display text-xl font-extrabold text-white drop-shadow sm:text-3xl md:text-4xl">
              Apa yang Anda cari?
            </label>
            <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-2xl ring-4 ring-white/15 focus-within:ring-accent-500/60 sm:gap-2 sm:p-2">
              <Search className="ml-2.5 h-5 w-5 shrink-0 text-slate-400 sm:ml-3 sm:h-6 sm:w-6" aria-hidden />
              <input
                id="hero-search"
                name="q"
                type="search"
                required
                placeholder="Berita, agenda, anggota, perda…"
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none sm:py-3 sm:text-lg"
              />
              <button type="submit" className="btn-accent shrink-0 px-4 py-2.5 sm:px-7 sm:py-3.5 sm:text-base">
                <span className="hidden sm:inline">Cari</span>
                <ArrowRight className="h-5 w-5 sm:hidden" aria-label="Cari" />
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              ["Rapat Paripurna", "/cari?q=Rapat+Paripurna"],
              ["Peraturan Daerah", "/dokumen?jenis=Peraturan+Daerah"],
              ["Agenda", "/agenda"],
              ["Anggota Dewan", "/anggota"],
              ["Aspirasi", "/aspirasi"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/20 sm:text-sm">
                {label}
              </Link>
            ))}
          </div>
          {slides[index]?.subjudul && <p className="mx-auto mt-5 hidden max-w-xl text-sm text-white/75 drop-shadow sm:block md:text-base">{slides[index].subjudul}</p>}
        </div>
      </div>

      {count > 1 && (
        <>
          <div className="absolute bottom-5 left-0 right-0 z-10 md:bottom-12">
            <div className="container flex items-center gap-4">
              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={cn("h-1.5 rounded-full transition-all", i === index ? "w-12 bg-accent-400" : "w-6 bg-white/40 hover:bg-white/70")}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-white/60">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="absolute bottom-8 right-4 z-10 hidden gap-2 md:bottom-10 md:right-8 md:flex">
            <button onClick={() => go(index - 1)} aria-label="Sebelumnya" className="rounded-full border border-white/30 p-3 text-white backdrop-blur transition hover:bg-white/15">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(index + 1)} aria-label="Berikutnya" className="rounded-full border border-white/30 p-3 text-white backdrop-blur transition hover:bg-white/15">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
