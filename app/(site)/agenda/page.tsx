import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { readDB } from "@/lib/db";
import { getLookups } from "@/lib/queries";
import { JENIS_AGENDA } from "@/lib/resources";
import { PageHeader } from "@/components/site/PageHeader";
import { AgendaCard, Empty } from "@/components/site/Cards";
import { cn, todayISO } from "@/lib/utils";

export const metadata = { title: "Agenda DPRD" };

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ bulan?: string; jenis?: string }> }) {
  const sp = await searchParams;
  const today = todayISO();
  const [y, m] = (/^\d{4}-\d{2}$/.test(sp.bulan || "") ? sp.bulan! : today.slice(0, 7)).split("-").map(Number);
  const monthKey = `${y}-${String(m).padStart(2, "0")}`;
  const { komisi } = getLookups(await readDB());

  let items = (await readDB()).agenda.filter((a) => a.tanggal.startsWith(monthKey));
  if (sp.jenis) items = items.filter((a) => a.jenis === sp.jenis);
  items.sort((a, b) => (a.tanggal + a.waktuMulai).localeCompare(b.tanggal + b.waktuMulai));

  const byDay = new Map<number, typeof items>();
  for (const a of items) {
    const d = Number(a.tanggal.slice(8, 10));
    byDay.set(d, [...(byDay.get(d) || []), a]);
  }

  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => i - offset + 1);

  const shift = (n: number) => {
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  };
  const href = (p: { bulan?: string; jenis?: string }) => {
    const q = new URLSearchParams(Object.entries({ bulan: monthKey, jenis: sp.jenis, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/agenda?${q}`;
  };

  return (
    <>
      <PageHeader title="Agenda DPRD" subtitle="Jadwal rapat, kunjungan kerja, reses, dan kegiatan dewan lainnya." crumbs={[{ label: "Agenda" }]} />
      <div className="container py-12">
        <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href={href({ jenis: "" })} className={cn("badge shrink-0 border py-1.5", !sp.jenis ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600")}>
            Semua Kegiatan
          </Link>
          {JENIS_AGENDA.map((j) => (
            <Link key={j} href={href({ jenis: j })} className={cn("badge shrink-0 border py-1.5", sp.jenis === j ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
              {j}
            </Link>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between bg-primary-800 px-5 py-4 text-white">
                <Link href={href({ bulan: shift(-1) })} className="rounded-lg p-2 hover:bg-white/10" aria-label="Bulan sebelumnya">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <h2 className="font-display text-xl font-bold">
                  {BULAN[m - 1]} {y}
                </h2>
                <Link href={href({ bulan: shift(1) })} className="rounded-lg p-2 hover:bg-white/10" aria-label="Bulan berikutnya">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
              <div className="grid grid-cols-7 border-b bg-slate-50 text-center text-xs font-bold uppercase text-slate-500">
                {HARI.map((h) => (
                  <div key={h} className="py-3">{h}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((d, i) => {
                  const valid = d > 0 && d <= daysInMonth;
                  const iso = `${monthKey}-${String(d).padStart(2, "0")}`;
                  const evs = valid ? byDay.get(d) || [] : [];
                  return (
                    <div key={i} className={cn("min-h-14 border-b border-r p-1 text-sm sm:min-h-24 sm:p-1.5 md:min-h-28", !valid && "bg-slate-50/60", i % 7 === 6 && "border-r-0")}>
                      {valid && (
                        <>
                          <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold", iso === today ? "bg-accent-500 text-primary-950" : i % 7 === 6 ? "text-red-600" : "text-slate-700")}>
                            {d}
                          </span>
                          <div className="mt-1 flex justify-center gap-0.5 sm:hidden">
                            {evs.slice(0, 3).map((a) => (
                              <span key={a.id} className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                            ))}
                          </div>
                          <div className="mt-1 hidden space-y-1 sm:block">
                            {evs.slice(0, 2).map((a) => (
                              <Link key={a.id} href={`/agenda/${a.id}`} title={a.judul} className="block truncate rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-800 hover:bg-primary-200 md:text-[11px]">
                                {a.waktuMulai} {a.judul}
                              </Link>
                            ))}
                            {evs.length > 2 && <span className="block px-1 text-[10px] text-slate-500">+{evs.length - 2} lainnya</span>}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="mb-5 font-display text-xl font-bold">
              Kegiatan {BULAN[m - 1]} {y} <span className="text-slate-400">({items.length})</span>
            </h2>
            {items.length ? (
              <div className="space-y-4">
                {items.map((a) => (
                  <AgendaCard key={a.id} a={a} komisi={komisi.get(a.komisiId)?.nama} />
                ))}
              </div>
            ) : (
              <Empty text="Tidak ada agenda pada bulan ini." />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
