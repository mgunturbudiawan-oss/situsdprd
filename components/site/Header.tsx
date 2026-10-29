"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen, CalendarDays, Camera, ChevronDown, Crown, FileSearch, FileText, Flag, Gavel, History, Home, Landmark, Mail,
  Menu, MessageSquareText, Newspaper, Phone, Scale, Search, Target, Tv, UserRound, Users, X, type LucideIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { cn } from "@/lib/utils";

type MenuItem = { label: string; href: string; desc: string; icon: LucideIcon };
type MenuGroup = { label: string; intro: string; items: MenuItem[] };

const MENU: MenuGroup[] = [
  {
    label: "Profil",
    intro: "Mengenal lebih dekat lembaga perwakilan rakyat daerah.",
    items: [
      { label: "Sambutan Ketua", href: "/profil#sambutan", desc: "Pesan pimpinan dewan", icon: UserRound },
      { label: "Sejarah", href: "/profil#sejarah", desc: "Perjalanan lembaga", icon: History },
      { label: "Visi & Misi", href: "/profil#visi-misi", desc: "Arah dan tujuan DPRD", icon: Target },
      { label: "Tugas & Fungsi", href: "/profil#tugas", desc: "Legislasi, anggaran, pengawasan", icon: Scale },
      { label: "Pimpinan DPRD", href: "/profil/pimpinan", desc: "Ketua dan wakil ketua", icon: Crown },
    ],
  },
  {
    label: "Keanggotaan",
    intro: "Wakil rakyat beserta alat kelengkapan dewan.",
    items: [
      { label: "Anggota Dewan", href: "/anggota", desc: "Profil seluruh anggota", icon: Users },
      { label: "Fraksi", href: "/fraksi", desc: "Pengelompokan politik", icon: Flag },
      { label: "Komisi", href: "/komisi", desc: "Komisi I – IV dan mitra kerja", icon: Landmark },
      { label: "Badan & Pansus", href: "/komisi#badan", desc: "Alat kelengkapan dewan", icon: Gavel },
    ],
  },
  {
    label: "Kegiatan",
    intro: "Ikuti aktivitas dan persidangan dewan.",
    items: [
      { label: "Agenda & Kalender", href: "/agenda", desc: "Jadwal rapat dan kegiatan", icon: CalendarDays },
      { label: "Berita", href: "/berita", desc: "Kabar terbaru DPRD", icon: Newspaper },
      { label: "TV DPRD", href: "/tv", desc: "Siaran langsung & arsip video", icon: Tv },
      { label: "Galeri", href: "/galeri", desc: "Dokumentasi kegiatan", icon: Camera },
    ],
  },
  {
    label: "Dokumen",
    intro: "Akses produk hukum dan dokumen publik.",
    items: [
      { label: "Semua Produk Hukum", href: "/dokumen", desc: "Pencarian dokumen", icon: BookOpen },
      { label: "Peraturan Daerah", href: "/dokumen?jenis=Peraturan+Daerah", desc: "Perda yang telah ditetapkan", icon: Gavel },
      { label: "Rancangan Perda", href: "/dokumen?jenis=Rancangan+Perda", desc: "Raperda dalam pembahasan", icon: FileText },
      { label: "Keputusan DPRD", href: "/dokumen?jenis=Keputusan+DPRD", desc: "Keputusan dan ketetapan", icon: FileSearch },
    ],
  },
  {
    label: "Layanan",
    intro: "Saluran partisipasi dan informasi publik.",
    items: [
      { label: "Aspirasi Rakyat", href: "/aspirasi", desc: "Sampaikan aspirasi Anda", icon: MessageSquareText },
      { label: "Lacak Aspirasi", href: "/aspirasi/lacak", desc: "Cek status tindak lanjut", icon: FileSearch },
      { label: "Kontak", href: "/kontak", desc: "Hubungi sekretariat", icon: Phone },
      { label: "Pencarian", href: "/cari", desc: "Cari seluruh konten", icon: Search },
    ],
  },
];

/** Menu ringkas yang bisa digeser di bawah header versi mobile. */
const STRIP = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Anggota", href: "/anggota" },
  { label: "Fraksi", href: "/fraksi" },
  { label: "Komisi", href: "/komisi" },
  { label: "Agenda", href: "/agenda" },
  { label: "Berita", href: "/berita" },
  { label: "TV DPRD", href: "/tv" },
  { label: "Produk Hukum", href: "/dokumen" },
  { label: "Aspirasi", href: "/aspirasi" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

interface Props {
  namaDaerah: string;
  logo: string;
  telepon: string;
  email: string;
  today: string;
  social: { facebook: string; instagram: string; youtube: string; twitter: string; tiktok: string };
  live: boolean;
}

export function Header({ namaDaerah, logo, telepon, email, today, social, live }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [stripHidden, setStripHidden] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Di HP, strip menu disembunyikan saat scroll ke bawah dan muncul lagi saat scroll ke atas
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - lastY) > 8) {
        setStripHidden(y > 160 && y > lastY);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(null);
    setDrawer(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer || search ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(null);
        setDrawer(false);
        setSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer, search]);

  const openMega = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMega(null), 150);
  };

  // Geser strip menu agar item aktif berada di tengah
  useEffect(() => {
    const el = stripRef.current;
    const active = el?.querySelector<HTMLElement>("[data-active]");
    if (el && active) el.scrollTo({ left: active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [pathname]);

  const groupActive = (g: MenuGroup) => g.items.some((i) => i.href.split(/[#?]/)[0] !== "/" && pathname.startsWith(i.href.split(/[#?]/)[0]));
  const current = MENU.find((g) => g.label === mega);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-shadow duration-300", scrolled && "shadow-lg")} onMouseLeave={scheduleClose}>
        {/* Bar info (desktop) */}
        <div className={cn("hidden overflow-hidden bg-primary-900 text-xs text-white/75 transition-all duration-300 lg:block", scrolled ? "max-h-0" : "max-h-10")}>
          <div className="container flex h-9 items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <CalendarDays className="h-3.5 w-3.5 text-accent-400" /> {today}
              </span>
              {telepon && (
                <a href={`tel:${telepon.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 hover:text-white">
                  <Phone className="h-3.5 w-3.5" /> {telepon}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white">
                  <Mail className="h-3.5 w-3.5" /> {email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/aspirasi/lacak" className="hover:text-white">Lacak Aspirasi</Link>
              <Link href="/kontak" className="hover:text-white">Kontak</Link>
              <span className="h-3 w-px bg-white/25" />
              <SocialLinks {...social} className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Bar utama */}
        <div className="border-b border-white/10 bg-primary-800 lg:border-b-2 lg:border-accent-500">
          <div className="container flex h-16 items-center gap-4 lg:h-20">
            <Link href="/" aria-label="Beranda" className="min-w-0 shrink">
              <Logo namaDaerah={namaDaerah} logo={logo} light />
            </Link>

            <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Menu utama">
              <Link
                href="/"
                className={cn("rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10", pathname === "/" ? "text-accent-400" : "text-white/90 hover:text-white")}
              >
                Beranda
              </Link>
              {MENU.map((g) => (
                <button
                  key={g.label}
                  onMouseEnter={() => openMega(g.label)}
                  onClick={() => setMega(mega === g.label ? null : g.label)}
                  aria-expanded={mega === g.label}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10",
                    mega === g.label ? "bg-white/10 text-white" : groupActive(g) ? "text-accent-400" : "text-white/90 hover:text-white",
                  )}
                >
                  {g.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition", mega === g.label && "rotate-180")} />
                </button>
              ))}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-2">
              <button onClick={() => setSearch(true)} aria-label="Cari" className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10">
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/tv"
                className={cn(
                  "hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition sm:flex",
                  live ? "bg-red-600 text-white hover:bg-red-700" : "bg-accent-500 text-primary-950 hover:bg-accent-400",
                )}
              >
                {live ? <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> : <Tv className="h-4 w-4" />}
                {live ? "Live" : "TV DPRD"}
              </Link>
              <button onClick={() => setDrawer(true)} aria-label="Buka menu" className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Strip menu geser (mobile & tablet) */}
        <nav
          className={cn(
            "overflow-hidden border-b-2 border-accent-500 bg-primary-900 transition-[max-height] duration-300 lg:hidden",
            stripHidden ? "max-h-0" : "max-h-16",
          )}
          aria-label="Menu geser"
        >
          <div
            ref={stripRef}
            className="no-scrollbar flex gap-1.5 overflow-x-auto scroll-smooth px-4 py-2 [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-28px),transparent)]"
          >
            {STRIP.map(({ label, href }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  data-active={active || undefined}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition",
                    active ? "bg-accent-500 text-primary-950 shadow" : "text-white/85 hover:bg-white/10 active:bg-white/15",
                  )}
                >
                  {label === "TV DPRD" && live && <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 align-middle" />}
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mega menu (desktop) */}
        {current && (
          <div className="absolute inset-x-0 top-full hidden lg:block" onMouseEnter={() => openMega(current.label)}>
            <div className="container pt-2">
              <div className="grid grid-cols-12 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="pattern-kawung col-span-4 flex flex-col bg-gradient-to-br from-primary-800 to-primary-950 p-8 text-white">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">Menu</span>
                  <h3 className="mt-2 font-display text-2xl font-extrabold">{current.label}</h3>
                  <p className="mt-2 text-sm text-white/70">{current.intro}</p>
                  <Link href="/aspirasi" className="btn-accent mt-auto self-start">
                    <MessageSquareText className="h-4 w-4" /> Kirim Aspirasi
                  </Link>
                </div>
                <div className="pattern-kawung-light col-span-8 grid grid-cols-2 content-start gap-2 p-6">
                  {current.items.map(({ label, href, desc, icon: Icon }) => (
                    <Link key={href} href={href} onClick={() => setMega(null)} className="group flex items-center gap-4 rounded-xl p-3 transition hover:bg-primary-50">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition group-hover:bg-primary-700 group-hover:text-accent-400">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span>
                        <span className="block font-bold text-slate-900 group-hover:text-primary-700">{label}</span>
                        <span className="block text-sm text-slate-500">{desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Drawer mobile */}
      <div className={cn("fixed inset-0 z-[60] lg:hidden", drawer ? "visible" : "invisible")} aria-hidden={!drawer}>
        <div className={cn("absolute inset-0 bg-black/60 transition-opacity duration-300", drawer ? "opacity-100" : "opacity-0")} onClick={() => setDrawer(false)} />
        <aside
          className={cn(
            "pattern-kawung absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-primary-950 text-white shadow-2xl transition-transform duration-300",
            drawer ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Logo namaDaerah={namaDaerah} logo={logo} light compact />
            <button onClick={() => setDrawer(false)} aria-label="Tutup menu" className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form action="/cari" className="px-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input name="q" placeholder="Cari di situs..." className="h-12 w-full rounded-xl border border-white/15 bg-white/10 pl-11 pr-4 text-base text-white placeholder:text-white/50 focus:border-accent-400 focus:outline-none" />
            </div>
          </form>

          <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Menu mobile">
            <Link href="/" className={cn("flex h-12 items-center gap-3 rounded-xl px-3 font-semibold", pathname === "/" ? "bg-white/10 text-accent-400" : "hover:bg-white/5")}>
              <Home className="h-5 w-5" /> Beranda
            </Link>
            {MENU.map((g) => (
              <div key={g.label}>
                <button
                  onClick={() => setExpanded(expanded === g.label ? null : g.label)}
                  aria-expanded={expanded === g.label}
                  className={cn("flex h-12 w-full items-center justify-between rounded-xl px-3 text-left font-semibold hover:bg-white/5", groupActive(g) && "text-accent-400")}
                >
                  {g.label}
                  <ChevronDown className={cn("h-5 w-5 transition", expanded === g.label && "rotate-180")} />
                </button>
                <div className={cn("grid transition-all duration-300", expanded === g.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <div className="mb-2 ml-3 space-y-0.5 border-l border-accent-500/40 pl-2">
                      {g.items.map(({ label, href, icon: Icon }) => (
                        <Link key={href} href={href} className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/80 hover:bg-white/5 hover:text-white">
                          <Icon className="h-4 w-4 text-accent-400" /> {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-4 border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Link href="/aspirasi" className="btn-accent w-full py-3 text-base">
              <MessageSquareText className="h-5 w-5" /> Kirim Aspirasi
            </Link>
            <div className="flex items-center justify-between text-white/70">
              {telepon && (
                <a href={`tel:${telepon.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" /> {telepon}
                </a>
              )}
              <div className="flex gap-3">
                <SocialLinks {...social} className="h-5 w-5" />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Pencarian layar penuh */}
      {search && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-primary-950/95 px-4 pt-20 backdrop-blur-md md:pt-32" role="dialog" aria-label="Pencarian">
          <button onClick={() => setSearch(false)} aria-label="Tutup pencarian" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10">
            <X className="h-7 w-7" />
          </button>
          <form action="/cari" className="mx-auto w-full max-w-2xl">
            <label className="mb-4 block text-center text-sm font-bold uppercase tracking-[0.2em] text-accent-400">Cari di Portal DPRD</label>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
              <input name="q" autoFocus placeholder="Berita, agenda, anggota, perda..." className="h-16 w-full rounded-2xl bg-white pl-14 pr-5 text-lg text-slate-900 shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50" />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Rapat Paripurna", "APBD", "Komisi", "Peraturan Daerah", "Reses"].map((q) => (
                <Link key={q} href={`/cari?q=${encodeURIComponent(q)}`} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">
                  {q}
                </Link>
              ))}
            </div>
          </form>
        </div>
      )}

      {/* Navigasi bawah (mobile) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden"
        aria-label="Navigasi cepat"
      >
        <div className="grid h-16 grid-cols-5">
          {[
            { href: "/", label: "Beranda", icon: Home },
            { href: "/agenda", label: "Agenda", icon: CalendarDays },
            { href: "/tv", label: "TV", icon: Tv },
            { href: "/aspirasi", label: "Aspirasi", icon: MessageSquareText },
          ].map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            if (href === "/tv") {
              return (
                <Link key={href} href={href} className="relative flex flex-col items-center justify-end pb-1.5" aria-label="TV DPRD">
                  <span className={cn("absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-lg", live ? "bg-red-600 text-white" : "bg-primary-800 text-accent-400")}>
                    <Tv className="h-6 w-6" />
                    {live && <span className="absolute -right-1 -top-1 rounded-full bg-white px-1.5 text-[9px] font-extrabold text-red-600 shadow">LIVE</span>}
                  </span>
                  <span className={cn("text-[11px] font-semibold", active ? "text-primary-700" : "text-slate-500")}>{label}</span>
                </Link>
              );
            }
            return (
              <Link key={href} href={href} className={cn("relative flex flex-col items-center justify-center gap-1", active ? "text-primary-700" : "text-slate-500")}>
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-semibold">{label}</span>
                {active && <span className="absolute bottom-0.5 h-1 w-6 rounded-full bg-accent-500" />}
              </Link>
            );
          })}
          <button onClick={() => setDrawer(true)} className="flex flex-col items-center justify-center gap-1 text-slate-500">
            <Menu className="h-5 w-5" />
            <span className="text-[11px] font-semibold">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
