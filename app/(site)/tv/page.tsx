import Link from "next/link";
import { CalendarClock, Radio, Tv } from "lucide-react";
import { findById, getSettings, readDB } from "@/lib/db";
import { getAgendaMendatang, getVideos } from "@/lib/queries";
import { LivePlayer } from "@/components/site/LivePlayer";
import { VideoCard } from "@/components/site/Cards";
import { formatDate, lines, videoThumb } from "@/lib/utils";

export const metadata = { title: "TV DPRD — Siaran Langsung" };

export default async function TvPage({ searchParams }: { searchParams: Promise<{ v?: string; kategori?: string }> }) {
  const sp = await searchParams;
  const s = await getSettings();
  const videos = getVideos(await readDB());
  const selected = sp.v ? await findById("videos", sp.v) : undefined;
  const kategori = [...new Set(videos.map((v) => v.kategori).filter(Boolean))];
  const filtered = sp.kategori ? videos.filter((v) => v.kategori === sp.kategori) : videos;
  const siaranAgenda = getAgendaMendatang(await readDB()).filter((a) => a.disiarkan).slice(0, 4);
  const jadwal = lines(s.tvJadwal).map((l) => l.split("|").map((x) => x.trim()));

  const showLive = !selected && s.tvLiveAktif && s.tvUrl;
  const current = selected
    ? { url: selected.url, title: selected.judul, poster: videoThumb(selected), desc: selected.deskripsi, date: selected.tanggal }
    : showLive
      ? { url: s.tvUrl, title: s.tvJudul, poster: s.tvPoster, desc: s.tvDeskripsi, date: "" }
      : videos[0]
        ? { url: videos[0].url, title: videos[0].judul, poster: videoThumb(videos[0]), desc: videos[0].deskripsi, date: videos[0].tanggal }
        : null;

  return (
    <div className="bg-primary-950 text-white">
      <section className="relative overflow-hidden pb-12 pt-36 md:pt-40">
        <div className="absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-primary-700/30 blur-3xl" />
        <div className="container relative">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
                <Tv className="h-6 w-6" />
              </span>
              <div>
                <h1 className="font-display text-xl font-extrabold sm:text-2xl md:text-3xl">TV DPRD {s.namaDaerah}</h1>
                <p className="text-sm text-white/60">Siaran langsung & arsip video kegiatan dewan</p>
              </div>
            </div>
            {s.tvLiveAktif ? (
              selected ? (
                <Link href="/tv#player" className="btn bg-red-600 text-white hover:bg-red-700">
                  <Radio className="h-4 w-4 animate-pulse" /> Kembali ke Siaran Langsung
                </Link>
              ) : (
                <span className="badge bg-red-600 px-4 py-2 text-sm text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> SEDANG LIVE
                </span>
              )
            ) : (
              <span className="badge bg-white/10 px-4 py-2 text-sm text-white/70">Tidak ada siaran langsung saat ini</span>
            )}
          </div>

          <div id="player" className="grid scroll-mt-36 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {current ? (
                <LivePlayer key={current.url} url={current.url} title={current.title} poster={current.poster} autoPlay={!!selected} />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-2xl bg-white/5 text-white/50">Belum ada tayangan.</div>
              )}
              {current && (
                <div className="mt-5">
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    {showLive ? (
                      <span className="flex items-center gap-1.5 font-bold text-red-400">
                        <Radio className="h-4 w-4" /> LIVE
                      </span>
                    ) : (
                      formatDate(current.date)
                    )}
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold">{current.title}</h2>
                  {current.desc && <p className="mt-2 text-white/70">{current.desc}</p>}
                </div>
              )}
            </div>
            <aside className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
                  <CalendarClock className="h-5 w-5 text-accent-400" /> Jadwal Siaran
                </h3>
                <ul className="divide-y divide-white/10">
                  {jadwal.map(([hari, jam, program], i) => (
                    <li key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span>
                        <span className="block font-semibold">{program || hari}</span>
                        <span className="text-white/50">{program ? hari : ""}</span>
                      </span>
                      <span className="badge shrink-0 bg-accent-500/20 text-accent-300">{jam}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {siaranAgenda.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-4 font-display text-lg font-bold">Rapat yang Akan Disiarkan</h3>
                  <ul className="space-y-4">
                    {siaranAgenda.map((a) => (
                      <li key={a.id}>
                        <Link href={`/agenda/${a.id}`} className="group block">
                          <span className="text-xs text-accent-300">
                            {formatDate(a.tanggal, { weekday: "long", day: "numeric", month: "short" })} · {a.waktuMulai} WIB
                          </span>
                          <span className="block text-sm font-semibold group-hover:text-accent-300">{a.judul}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="container">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="eyebrow text-accent-400">Video on Demand</span>
              <h2 className="font-display text-3xl font-bold">Arsip Tayangan</h2>
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              <Link href="/tv" className={`badge shrink-0 border py-1.5 ${!sp.kategori ? "border-accent-500 bg-accent-500 text-primary-950" : "border-white/20 text-white/70"}`}>
                Semua
              </Link>
              {kategori.map((k) => (
                <Link key={k} href={`/tv?kategori=${encodeURIComponent(k)}`} className={`badge shrink-0 border py-1.5 ${sp.kategori === k ? "border-accent-500 bg-accent-500 text-primary-950" : "border-white/20 text-white/70 hover:bg-white/10"}`}>
                  {k}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((v) => (
              <VideoCard key={v.id} v={v} dark active={v.id === selected?.id} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
