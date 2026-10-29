import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, FileText, Gavel, MapPin, MessageSquareText, Newspaper, Play, Tv, Users } from "lucide-react";
import { readDB } from "@/lib/db";
import { getAgendaMendatang, getBerita, getLookups, getPimpinan, getVideos } from "@/lib/queries";
import { HeroSlider } from "@/components/site/HeroSlider";
import { WeatherWidget } from "@/components/site/WeatherWidget";
import { RegionStats } from "@/components/site/RegionStats";
import { LivePlayer } from "@/components/site/LivePlayer";
import { Avatar, FraksiBadge } from "@/components/site/Avatar";
import { SectionTitle } from "@/components/site/Section";
import { cn, dateParts, formatDate, todayISO, videoThumb, ZONA_WAKTU } from "@/lib/utils";
import type { Berita } from "@/lib/types";

const RAPAT = ["Rapat Paripurna", "Rapat Komisi", "Rapat Badan", "Rapat Kerja", "Rapat Dengar Pendapat"];
/** Baris yang bisa digeser ke samping di HP dan menjadi grid di layar lebar. */
const SWIPE = "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0";

function NewsTile({ b, big }: { b: Berita; big?: boolean }) {
  return (
    <Link
      href={`/berita/${b.slug}`}
      className={cn("skeleton-dark group relative block h-full overflow-hidden rounded-2xl", big ? "min-h-[280px] md:min-h-[360px] lg:min-h-0" : "min-h-[190px]")}
    >
      {b.gambar && <img src={b.gambar} alt={b.judul} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
      <span className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/50 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <span className="badge bg-accent-500 text-primary-950">{b.kategori}</span>
        <span className={cn("mt-2 block font-display font-bold leading-snug text-white group-hover:text-accent-300", big ? "line-clamp-3 text-xl md:text-2xl" : "line-clamp-2 text-sm md:text-base")}>
          {b.judul}
        </span>
        <span className="mt-1.5 flex items-center gap-1.5 text-xs text-white/60">
          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(b.tanggal)}
        </span>
      </span>
    </Link>
  );
}

export default async function HomePage() {
  const db = await readDB();
  const s = db.settings;
  const today = todayISO();
  const { komisi, fraksi } = getLookups(db);

  const slides = db.slides.filter((x) => x.aktif).sort((a, b) => a.urutan - b.urutan);
  const berita = getBerita(db, { limit: 12 });
  const [utama, ...lain] = berita;
  const videos = getVideos(db, 4);
  const pimpinan = getPimpinan(db).slice(0, 4);
  const fraksiList = [...db.fraksi].sort((a, b) => a.urutan - b.urutan);

  const agendaHariIni = db.agenda.filter((a) => a.tanggal === today).sort((a, b) => a.waktuMulai.localeCompare(b.waktuMulai));
  const agendaBerikut = getAgendaMendatang(db, 8).filter((a) => a.tanggal !== today);
  const dokumen = [...db.dokumen].sort((a, b) => (b.tanggal || "").localeCompare(a.tanggal || "")).slice(0, 4);
  const rapat = db.agenda
    .filter((a) => RAPAT.includes(a.jenis))
    .sort((a, b) => Math.abs(Date.parse(a.tanggal) - Date.parse(today)) - Math.abs(Date.parse(b.tanggal) - Date.parse(today)))
    .slice(0, 4)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const layanan = [
    { href: "/berita", icon: Newspaper, title: "Berita", desc: "Kabar terkini kegiatan, kebijakan, dan keputusan dewan." },
    { href: "/aspirasi", icon: MessageSquareText, title: "Aspirasi Masyarakat", desc: "Sampaikan usulan, keluhan, dan pengaduan kepada wakil rakyat." },
    { href: "/dokumen", icon: Gavel, title: "Produk Hukum", desc: "Perda, raperda, dan keputusan DPRD yang dapat diunduh publik." },
    { href: "/anggota", icon: Users, title: "Anggota Dewan", desc: `Profil ${db.anggota.length} anggota DPRD beserta fraksi dan komisinya.` },
    { href: "/agenda", icon: CalendarDays, title: "Agenda & Persidangan", desc: "Jadwal rapat paripurna, rapat komisi, reses, dan kunjungan kerja." },
    { href: "/tv", icon: Tv, title: "TV DPRD", desc: "Siaran langsung persidangan dan arsip video kegiatan dewan." },
  ];

  const tv = s.tvLiveAktif && s.tvUrl ? { url: s.tvUrl, title: s.tvJudul, poster: s.tvPoster } : videos[0] ? { url: videos[0].url, title: videos[0].judul, poster: videoThumb(videos[0]) } : null;

  return (
    <>
      <HeroSlider slides={slides} namaDaerah={s.namaDaerah} overlay={s.cuacaAktif ? <WeatherWidget /> : null} />

      {/* ===== LAYANAN CEPAT ===== */}
      <section className="pattern-kawung-light py-10 md:py-14">
        <div className="container">
          <SectionTitle center title="Layanan Cepat" subtitle={`Temukan lebih cepat layanan informasi publik DPRD ${s.namaDaerah}.`} />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {layanan.map(({ href, icon: Icon, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="pattern-kawung group relative flex min-h-[140px] flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 to-primary-950 p-4 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-h-[180px] sm:p-6"
              >
                <Icon className="absolute -bottom-6 -right-6 h-32 w-32 text-white/[0.06] transition duration-500 group-hover:scale-110 group-hover:text-white/10 sm:h-36 sm:w-36" />
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-primary-950 shadow-md sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <h3 className="mt-4 text-sm font-extrabold uppercase leading-snug tracking-wide sm:mt-5 sm:text-lg">{title}</h3>
                <p className="mt-1 hidden max-w-xs text-sm text-white/70 sm:block">{desc}</p>
                <span className="mt-auto hidden items-center gap-1.5 pt-4 text-xs font-bold uppercase tracking-widest text-accent-400 sm:inline-flex">
                  Selengkapnya <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent-500 transition duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BERITA DEWAN + AGENDA ===== */}
      {/* Desktop: [foto utama | daftar berita] [agenda] setinggi 440px dengan scroll di dalam kotak.
          HP: tanpa scroll di dalam kotak (supaya jari tidak "terjebak"), cukup 4 item + tombol lihat semua. */}
      <section className="border-t border-slate-100 bg-white py-10 md:py-14">
        <div className="container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionTitle title="Berita Dewan" href="/berita" />
            {utama ? (
              <div className="grid gap-4 md:grid-cols-2 lg:h-[440px]">
                <NewsTile b={utama} big />
                <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <p className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-700">Berita Lainnya</p>
                  <ul className="thin-scroll flex-1 divide-y divide-slate-100 lg:overflow-y-auto">
                    {lain.map((b, i) => (
                      <li key={b.id} className={i >= 4 ? "hidden lg:block" : undefined}>
                        <Link href={`/berita/${b.slug}`} className="group flex gap-3 p-3 transition hover:bg-primary-50/60">
                          <span className="skeleton h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                            {b.gambar && <img src={b.gambar} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />}
                          </span>
                          <span className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-accent-600">{b.kategori}</span>
                            <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-primary-700">{b.judul}</span>
                            <span className="mt-0.5 block text-[11px] text-slate-500">{formatDate(b.tanggal)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                    {!lain.length && <li className="p-6 text-center text-sm text-slate-500">Belum ada berita lain.</li>}
                  </ul>
                  <Link href="/berita" className="flex items-center justify-center gap-1.5 border-t border-slate-100 py-3 text-sm font-semibold text-primary-700 active:bg-primary-50 lg:hidden">
                    Lihat semua berita <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border-2 border-dashed p-8 text-center text-slate-500">Belum ada berita.</p>
            )}
          </div>

          <aside className="lg:col-span-4">
            <SectionTitle title="Agenda Dewan" href="/agenda" linkLabel="Kalender" />
            <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white lg:h-[440px]">
              <p className="border-b-2 border-accent-500 bg-primary-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
                Hari Ini · {formatDate(today, { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <div className="thin-scroll flex-1 p-4 lg:overflow-y-auto">
                {agendaHariIni.length ? (
                  <ul className="space-y-3">
                    {agendaHariIni.map((a) => (
                      <li key={a.id} className="border-l-4 border-accent-500 pl-3">
                        <Link href={`/agenda/${a.id}`} className="block text-sm font-semibold leading-snug text-slate-900 hover:text-primary-700">{a.judul}</Link>
                        <span className="text-xs text-slate-500">{a.waktuMulai} {ZONA_WAKTU} · {a.lokasi}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl bg-slate-50 p-3 text-center text-sm text-slate-500">Tidak ada agenda hari ini.</p>
                )}
                {agendaBerikut.length > 0 && (
                  <>
                    <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-wider text-primary-700">Agenda Mendatang</p>
                    <ul className="space-y-3">
                      {agendaBerikut.map((a, i) => {
                        const d = dateParts(a.tanggal);
                        return (
                          <li key={a.id} className={i >= 3 ? "hidden lg:block" : undefined}>
                            <Link href={`/agenda/${a.id}`} className="group flex gap-3">
                              <span className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-primary-50 py-1.5 text-primary-800">
                                <span className="font-display text-lg font-extrabold leading-none">{d.day}</span>
                                <span className="text-[10px] font-bold uppercase">{d.month}</span>
                              </span>
                              <span className="min-w-0">
                                <span className="line-clamp-2 text-sm font-medium leading-snug text-slate-800 group-hover:text-primary-700">{a.judul}</span>
                                <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                  <Clock className="h-3 w-3" /> {a.waktuMulai} {ZONA_WAKTU} · {a.jenis}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
              <Link href="/agenda" className="flex items-center justify-center gap-1.5 border-t border-slate-100 py-3 text-sm font-semibold text-primary-700 active:bg-primary-50 lg:hidden">
                Lihat kalender agenda <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ===== DATA WILAYAH ===== */}
      {s.statAktif && <RegionStats s={s} />}

      {/* ===== TV DPRD ===== */}
      <section className="pattern-kawung bg-primary-950 py-10 md:py-14">
        <div className="container">
          <SectionTitle light title="TV DPRD" subtitle={s.tvJudul} href="/tv" linkLabel="Tonton Sekarang" />
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="relative lg:col-span-8">
              {s.tvLiveAktif && (
                <span className="badge absolute left-3 top-3 z-10 bg-red-600 px-3 py-1 text-white shadow-lg">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
                </span>
              )}
              {tv && <LivePlayer url={tv.url} title={tv.title} poster={tv.poster} />}
            </div>
            <div className={cn(SWIPE, "md:grid-cols-3 lg:col-span-4 lg:flex lg:flex-col lg:gap-4")}>
              {videos.slice(0, 3).map((v) => (
                <Link key={v.id} href={`/tv?v=${v.id}#player`} className="group flex w-[70%] shrink-0 snap-start flex-col gap-2 md:w-auto lg:flex-row lg:gap-3">
                  <span className="skeleton-dark relative aspect-video w-full shrink-0 overflow-hidden rounded-lg lg:w-36">
                    {videoThumb(v) && <img src={videoThumb(v)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />}
                    <Play className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 fill-white text-white drop-shadow" />
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-accent-300">{v.judul}</span>
                    <span className="text-xs text-white/50">{formatDate(v.tanggal)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DOKUMEN & RAPAT ===== */}
      <section className="py-10 md:py-14">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle title="Dokumen Terbaru" href="/dokumen" />
            <ul className="divide-y rounded-2xl border border-slate-200">
              {dokumen.map((d) => (
                <li key={d.id}>
                  <Link href={d.file || `/dokumen?q=${encodeURIComponent(d.judul)}`} target={d.file ? "_blank" : undefined} className="group flex items-start gap-3 p-3.5 transition hover:bg-slate-50">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <FileText className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-accent-600">
                        {d.jenis} · {d.tahun}
                      </span>
                      <span className="line-clamp-2 block text-sm font-semibold leading-snug text-slate-900 group-hover:text-primary-700">{d.judul}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle title="Rapat Persidangan" href="/agenda" linkLabel="Semua Agenda" />
            <ul className="divide-y rounded-2xl border border-slate-200">
              {rapat.map((a) => {
                const d = dateParts(a.tanggal);
                return (
                  <li key={a.id}>
                    <Link href={`/agenda/${a.id}`} className="group flex items-start gap-3 p-3.5 transition hover:bg-slate-50">
                      <span className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-primary-800 py-1.5 text-white">
                        <span className="font-display text-lg font-extrabold leading-none">{d.day}</span>
                        <span className="text-[10px] font-bold uppercase text-accent-400">{d.month}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-primary-700">{a.judul}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                          <span>{komisi.get(a.komisiId)?.nama || a.jenis}</span>
                          <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{a.lokasi}</span>
                        </span>
                      </span>
                      <span className={cn("badge shrink-0", a.status === "Selesai" ? "bg-slate-100 text-slate-600" : "bg-primary-50 text-primary-700")}>{a.status}</span>
                    </Link>
                  </li>
                );
              })}
              {!rapat.length && <li className="p-6 text-center text-sm text-slate-500">Tidak ada data.</li>}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== PIMPINAN & FRAKSI ===== */}
      <section className="pattern-kawung bg-primary-900 py-10 md:py-14">
        <div className="container">
          <SectionTitle light title="Pimpinan DPRD" subtitle={`Periode ${s.periode}`} href="/anggota" linkLabel="Semua Anggota" />
          <div className={cn(SWIPE, "md:grid-cols-4")}>
            {pimpinan.map((a) => (
              <Link
                key={a.id}
                href={`/anggota/${a.slug}`}
                className="group flex w-[72%] shrink-0 snap-start items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur transition hover:bg-white/10 md:w-auto"
              >
                <Avatar src={a.foto} name={a.nama} rounded="rounded-xl" className="aspect-[3/4] w-16 shrink-0" textClass="text-lg" />
                <span className="min-w-0">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-accent-300">{a.nama}</span>
                  <span className="mt-0.5 block text-xs font-medium text-accent-400">{a.jabatan}</span>
                  <span className="block truncate text-[11px] text-white/50">{fraksi.get(a.fraksiId)?.nama}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/60">Fraksi DPRD</p>
            <div className="flex flex-wrap items-start justify-center gap-4 md:gap-8">
              {fraksiList.map((f) => (
                <Link key={f.id} href={`/fraksi/${f.slug}`} className="group flex w-16 flex-col items-center gap-1.5 text-center" title={f.nama}>
                  <FraksiBadge singkatan={f.singkatan} warna={f.warna} logo={f.logo} className="h-12 w-12 bg-white p-1 text-[10px] ring-2 ring-white/10 transition group-hover:scale-110 group-hover:ring-accent-500 md:h-14 md:w-14" />
                  <span className="text-[11px] font-semibold text-white/70">{db.anggota.filter((a) => a.fraksiId === f.id).length} Kursi</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/aspirasi" className="btn-accent">
              <MessageSquareText className="h-4 w-4" /> Sampaikan Aspirasi Anda <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
