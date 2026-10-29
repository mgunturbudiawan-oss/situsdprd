import Link from "next/link";
import { readDB } from "@/lib/db";
import { Search } from "lucide-react";
import { getBerita, paginate } from "@/lib/queries";
import { KATEGORI_BERITA } from "@/lib/resources";
import { PageHeader } from "@/components/site/PageHeader";
import { Empty, NewsCard, Pagination } from "@/components/site/Cards";
import { cn } from "@/lib/utils";

export const metadata = { title: "Berita" };

export default async function BeritaPage({ searchParams }: { searchParams: Promise<{ kategori?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const { items, page, totalPages } = paginate(getBerita(await readDB(), { kategori: sp.kategori, q: sp.q }), Number(sp.page), 9);
  const href = (p: Record<string, string | undefined>) => {
    const q = new URLSearchParams(Object.entries({ kategori: sp.kategori, q: sp.q, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/berita${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Berita DPRD" subtitle="Kabar terbaru kegiatan, kebijakan, dan informasi dari DPRD." crumbs={[{ label: "Berita" }]} />
      <div className="container py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <Link href={href({ kategori: undefined, page: undefined })} className={cn("badge shrink-0 border py-1.5", !sp.kategori ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600")}>
              Semua
            </Link>
            {KATEGORI_BERITA.map((k) => (
              <Link key={k} href={href({ kategori: k, page: undefined })} className={cn("badge shrink-0 border py-1.5", sp.kategori === k ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                {k}
              </Link>
            ))}
          </div>
          <form className="relative md:w-72">
            {sp.kategori && <input type="hidden" name="kategori" value={sp.kategori} />}
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input name="q" defaultValue={sp.q} placeholder="Cari berita..." className="input pl-10" />
          </form>
        </div>
        {items.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <NewsCard key={b.id} b={b} />
            ))}
          </div>
        ) : (
          <Empty text="Belum ada berita." />
        )}
        <Pagination page={page} totalPages={totalPages} makeHref={(p) => href({ page: String(p) })} />
      </div>
    </>
  );
}
