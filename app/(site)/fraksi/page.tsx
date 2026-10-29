import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readDB } from "@/lib/db";
import { getLookups } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { FraksiBadge } from "@/components/site/Avatar";

export const metadata = { title: "Fraksi" };

export default async function FraksiPage() {
  const db = await readDB();
  const { anggota } = getLookups(db);
  const total = db.anggota.length || 1;
  const list = [...db.fraksi].sort((a, b) => a.urutan - b.urutan).map((f) => ({ f, seats: db.anggota.filter((a) => a.fraksiId === f.id).length }));

  return (
    <>
      <PageHeader title="Fraksi DPRD" subtitle="Pengelompokan anggota DPRD berdasarkan konfigurasi partai politik." crumbs={[{ label: "Keanggotaan" }, { label: "Fraksi" }]} />
      <div className="container py-16">
        <div className="card mb-12 p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Komposisi Kursi</h2>
          <div className="flex h-8 overflow-hidden rounded-full">
            {list.map(({ f, seats }) => (
              <div key={f.id} style={{ width: `${(seats / total) * 100}%`, backgroundColor: f.warna }} title={`${f.singkatan}: ${seats} kursi`} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {list.map(({ f, seats }) => (
              <span key={f.id} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: f.warna }} /> {f.singkatan} <b>{seats}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map(({ f, seats }) => (
            <Link key={f.id} href={`/fraksi/${f.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-2" style={{ backgroundColor: f.warna }} />
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <FraksiBadge singkatan={f.singkatan} warna={f.warna} logo={f.logo} className="h-16 w-16 text-xs" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-primary-700">{f.nama}</h3>
                    <p className="text-sm text-slate-500">{seats} Kursi</p>
                  </div>
                </div>
                <dl className="mt-5 space-y-1 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Ketua</dt>
                    <dd className="text-right font-medium">{anggota.get(f.ketuaId)?.nama || "-"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Sekretaris</dt>
                    <dd className="text-right font-medium">{anggota.get(f.sekretarisId)?.nama || "-"}</dd>
                  </div>
                </dl>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2">
                  Lihat anggota <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
