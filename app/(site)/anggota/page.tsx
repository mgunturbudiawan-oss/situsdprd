import Link from "next/link";
import { Search } from "lucide-react";
import { readDB } from "@/lib/db";
import { getLookups, sortAnggota } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Empty, MemberCard } from "@/components/site/Cards";
import { cn } from "@/lib/utils";

export const metadata = { title: "Anggota Dewan" };

export default async function AnggotaPage({ searchParams }: { searchParams: Promise<{ fraksi?: string; komisi?: string; q?: string }> }) {
  const sp = await searchParams;
  const db = await readDB();
  const { fraksi, komisi } = getLookups(db);
  let items = [...db.anggota].sort(sortAnggota);
  if (sp.fraksi) items = items.filter((a) => a.fraksiId === sp.fraksi);
  if (sp.komisi) items = items.filter((a) => a.komisiId === sp.komisi);
  if (sp.q) items = items.filter((a) => a.nama.toLowerCase().includes(sp.q!.toLowerCase()));

  const fraksiList = [...db.fraksi].sort((a, b) => a.urutan - b.urutan);
  const komisiList = db.komisi.filter((k) => k.jenis === "Komisi").sort((a, b) => a.urutan - b.urutan);
  const href = (p: Record<string, string | undefined>) => {
    const q = new URLSearchParams(Object.entries({ ...sp, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/anggota${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Anggota Dewan" subtitle={`${db.anggota.length} wakil rakyat periode ${db.settings.periode}`} crumbs={[{ label: "Keanggotaan" }, { label: "Anggota" }]} />
      <div className="container py-12">
        <div className="card mb-10 space-y-4 p-5">
          <form className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            {sp.fraksi && <input type="hidden" name="fraksi" value={sp.fraksi} />}
            {sp.komisi && <input type="hidden" name="komisi" value={sp.komisi} />}
            <input name="q" defaultValue={sp.q} placeholder="Cari nama anggota..." className="input pl-10" />
          </form>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            <span className="mr-2 shrink-0 self-center text-xs font-bold uppercase text-slate-500">Fraksi:</span>
            <Link href={href({ fraksi: undefined })} className={cn("badge shrink-0 border py-1.5", !sp.fraksi ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600")}>Semua</Link>
            {fraksiList.map((f) => (
              <Link key={f.id} href={href({ fraksi: f.id })} className={cn("badge shrink-0 border py-1.5", sp.fraksi === f.id ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                {f.singkatan}
              </Link>
            ))}
          </div>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            <span className="mr-2 shrink-0 self-center text-xs font-bold uppercase text-slate-500">Komisi:</span>
            <Link href={href({ komisi: undefined })} className={cn("badge shrink-0 border py-1.5", !sp.komisi ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600")}>Semua</Link>
            {komisiList.map((k) => (
              <Link key={k.id} href={href({ komisi: k.id })} className={cn("badge shrink-0 border py-1.5", sp.komisi === k.id ? "border-primary-700 bg-primary-700 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                {k.nama}
              </Link>
            ))}
          </div>
        </div>

        {items.length ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {items.map((a) => (
              <MemberCard key={a.id} a={a} fraksi={fraksi.get(a.fraksiId)} subtitle={a.jabatan === "Anggota" ? komisi.get(a.komisiId)?.nama || "Anggota" : a.jabatan} />
            ))}
          </div>
        ) : (
          <Empty text="Tidak ada anggota yang sesuai filter." />
        )}
      </div>
    </>
  );
}
