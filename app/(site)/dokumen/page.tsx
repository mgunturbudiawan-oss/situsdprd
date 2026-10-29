import Link from "next/link";
import { Download, FileText, Search } from "lucide-react";
import { readDB } from "@/lib/db";
import { paginate } from "@/lib/queries";
import { JENIS_DOKUMEN } from "@/lib/resources";
import { PageHeader } from "@/components/site/PageHeader";
import { Empty, Pagination } from "@/components/site/Cards";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Produk Hukum" };

export default async function DokumenPage({ searchParams }: { searchParams: Promise<{ jenis?: string; tahun?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const all = (await readDB()).dokumen;
  const tahunList = [...new Set(all.map((d) => d.tahun).filter(Boolean))].sort().reverse();
  let items = [...all].sort((a, b) => (b.tahun + b.tanggal).localeCompare(a.tahun + a.tanggal));
  if (sp.jenis) items = items.filter((d) => d.jenis === sp.jenis);
  if (sp.tahun) items = items.filter((d) => d.tahun === sp.tahun);
  if (sp.q) items = items.filter((d) => (d.judul + d.nomor).toLowerCase().includes(sp.q!.toLowerCase()));
  const pg = paginate(items, Number(sp.page), 12);
  const href = (p: Record<string, string | undefined>) => {
    const q = new URLSearchParams(Object.entries({ jenis: sp.jenis, tahun: sp.tahun, q: sp.q, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/dokumen${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Produk Hukum & Dokumen" subtitle="Peraturan daerah, keputusan DPRD, dan dokumen publik lainnya." crumbs={[{ label: "Produk Hukum" }]} />
      <div className="container grid gap-6 py-8 md:py-12 lg:grid-cols-12 lg:gap-10">
        <aside className="space-y-4 lg:col-span-3 lg:space-y-6">
          <form className="relative">
            {sp.jenis && <input type="hidden" name="jenis" value={sp.jenis} />}
            {sp.tahun && <input type="hidden" name="tahun" value={sp.tahun} />}
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input name="q" defaultValue={sp.q} placeholder="Cari dokumen..." className="input pl-10" />
          </form>
          <div className="space-y-2 lg:hidden">
            {[
              [undefined, ...JENIS_DOKUMEN].map((j) => ({ key: "jenis", value: j, label: j || "Semua Jenis", active: sp.jenis === j })),
              [undefined, ...tahunList].map((t) => ({ key: "tahun", value: t, label: t || "Semua Tahun", active: sp.tahun === t })),
            ].map((row, ri) => (
              <div key={ri} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                {row.map((c) => (
                  <Link
                    key={c.label}
                    href={href({ [c.key]: c.value, page: undefined })}
                    className={cn("badge shrink-0 whitespace-nowrap border py-1.5", c.active ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600")}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="card hidden p-3 lg:block">
            <p className="px-3 py-2 text-xs font-bold uppercase text-slate-500">Jenis Dokumen</p>
            {[undefined, ...JENIS_DOKUMEN].map((j) => (
              <Link key={j || "all"} href={href({ jenis: j, page: undefined })} className={cn("flex justify-between rounded-lg px-3 py-2 text-sm", sp.jenis === j ? "bg-primary-700 font-semibold text-white" : "text-slate-700 hover:bg-slate-50")}>
                {j || "Semua"}
                <span className="opacity-60">{j ? all.filter((d) => d.jenis === j).length : all.length}</span>
              </Link>
            ))}
          </div>
          {tahunList.length > 0 && (
            <div className="card hidden p-3 lg:block">
              <p className="px-3 py-2 text-xs font-bold uppercase text-slate-500">Tahun</p>
              <div className="flex flex-wrap gap-2 p-2">
                <Link href={href({ tahun: undefined, page: undefined })} className={cn("badge border py-1.5", !sp.tahun ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200")}>Semua</Link>
                {tahunList.map((t) => (
                  <Link key={t} href={href({ tahun: t, page: undefined })} className={cn("badge border py-1.5", sp.tahun === t ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 hover:bg-slate-50")}>
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
        <div className="lg:col-span-9">
          {pg.items.length ? (
            <div className="space-y-4">
              {pg.items.map((d) => (
                <div key={d.id} className="card flex flex-col gap-4 p-5 transition hover:shadow-md sm:flex-row sm:items-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <FileText className="h-7 w-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="badge bg-primary-50 text-primary-700">{d.jenis}</span>
                      {d.nomor && d.nomor !== "-" && <span className="badge bg-slate-100 text-slate-600">Nomor {d.nomor}</span>}
                      <span className="badge bg-slate-100 text-slate-600">Tahun {d.tahun}</span>
                    </div>
                    <h3 className="mt-2 font-semibold leading-snug text-slate-900">{d.judul}</h3>
                    {d.tanggal && <p className="mt-1 text-xs text-slate-500">Ditetapkan {formatDate(d.tanggal)}</p>}
                    {d.deskripsi && <p className="mt-1 text-sm text-slate-600">{d.deskripsi}</p>}
                  </div>
                  {d.file ? (
                    <a href={d.file} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
                      <Download className="h-4 w-4" /> Unduh
                    </a>
                  ) : (
                    <span className="btn-outline shrink-0 cursor-not-allowed opacity-60">Belum tersedia</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty text="Dokumen tidak ditemukan." />
          )}
          <Pagination page={pg.page} totalPages={pg.totalPages} makeHref={(p) => href({ page: String(p) })} />
        </div>
      </div>
    </>
  );
}
