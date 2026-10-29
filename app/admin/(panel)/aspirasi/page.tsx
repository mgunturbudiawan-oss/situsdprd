import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { readDB } from "@/lib/db";
import { getLookups, paginate } from "@/lib/queries";
import { STATUS_ASPIRASI } from "@/lib/resources";
import { cn, formatDateTime } from "@/lib/utils";
import { Flash, PageTitle } from "@/components/admin/PageTitle";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata = { title: "Aspirasi Rakyat" };

export default async function AspirasiAdmin({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const all = (await readDB()).aspirasi;
  const { komisi } = getLookups(await readDB());
  let items = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (sp.status) items = items.filter((a) => a.status === sp.status);
  if (sp.q) {
    const q = sp.q.toLowerCase();
    items = items.filter((a) => [a.kode, a.nama, a.judul, a.isi].join(" ").toLowerCase().includes(q));
  }
  const pg = paginate(items, Number(sp.page), 20);
  const href = (p: Record<string, string | undefined>) => {
    const q = new URLSearchParams(Object.entries({ status: sp.status, q: sp.q, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/admin/aspirasi${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <PageTitle title="Aspirasi Rakyat" desc="Kelola dan tanggapi aspirasi yang masuk dari masyarakat." />
      <Flash sp={sp} />
      <div className="mb-4 flex flex-wrap gap-2">
        {[undefined, ...STATUS_ASPIRASI].map((s) => (
          <Link
            key={s || "all"}
            href={href({ status: s, page: undefined })}
            className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium", sp.status === s ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}
          >
            {s || "Semua"} <span className="opacity-60">({s ? all.filter((a) => a.status === s).length : all.length})</span>
          </Link>
        ))}
      </div>
      <div className="card overflow-hidden">
        <form className="border-b p-4">
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input name="q" defaultValue={sp.q} placeholder="Cari kode, nama, judul..." className="input pl-9" />
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Aspirasi</th>
                <th className="px-4 py-3">Pengirim</th>
                <th className="px-4 py-3">Tujuan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {pg.items.map((a) => (
                <tr key={a.id} className={cn("hover:bg-slate-50", a.status === "Baru" && "bg-primary-50/50")}>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{a.kode}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/aspirasi/${a.id}`} className="font-medium text-slate-900 hover:text-primary-700">{a.judul}</Link>
                    <p className="text-xs text-slate-500">
                      {a.kategori} · {formatDateTime(a.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{a.nama}</td>
                  <td className="px-4 py-3 text-slate-600">{komisi.get(a.komisiId)?.nama || "Pimpinan"}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/aspirasi/${a.id}`} className="inline-flex rounded-lg p-2 text-primary-700 hover:bg-primary-50" title="Detail">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!pg.items.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">Tidak ada aspirasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pg.totalPages > 1 && (
          <div className="flex justify-end gap-2 border-t px-4 py-3">
            {pg.page > 1 && <Link href={href({ page: String(pg.page - 1) })} className="btn-outline btn-sm">Sebelumnya</Link>}
            {pg.page < pg.totalPages && <Link href={href({ page: String(pg.page + 1) })} className="btn-outline btn-sm">Berikutnya</Link>}
          </div>
        )}
      </div>
    </>
  );
}
