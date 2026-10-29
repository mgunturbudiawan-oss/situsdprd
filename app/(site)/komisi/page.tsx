import Link from "next/link";
import { ArrowRight, Landmark, Scale } from "lucide-react";
import { readDB } from "@/lib/db";
import { getLookups, komisiMembers } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import type { Komisi } from "@/lib/types";

export const metadata = { title: "Komisi & Alat Kelengkapan" };

export default async function KomisiPage() {
  const db = await readDB();
  const { anggota } = getLookups(db);
  const sorted = [...db.komisi].sort((a, b) => a.urutan - b.urutan);
  const komisi = sorted.filter((k) => k.jenis === "Komisi");
  const badan = sorted.filter((k) => k.jenis !== "Komisi");

  const Card = ({ k, dark }: { k: Komisi; dark?: boolean }) => (
    <Link
      href={`/komisi/${k.slug}`}
      className={`group flex flex-col rounded-2xl p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${dark ? "bg-primary-800 text-white" : "border border-slate-200 bg-white"}`}
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${dark ? "bg-accent-500 text-primary-950" : "bg-primary-50 text-primary-700"}`}>
        {dark ? <Landmark className="h-6 w-6" /> : <Scale className="h-6 w-6" />}
      </span>
      <h3 className="mt-5 font-display text-xl font-bold">{k.nama}</h3>
      <p className={`mt-1 text-sm ${dark ? "text-white/70" : "text-slate-500"}`}>{k.bidang}</p>
      <div className={`mt-5 space-y-1 border-t pt-4 text-sm ${dark ? "border-white/10 text-white/80" : "border-slate-100 text-slate-600"}`}>
        <p>Ketua: <b>{anggota.get(k.ketuaId)?.nama || "-"}</b></p>
        <p>{komisiMembers(db, k).length} anggota</p>
      </div>
      <span className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 ${dark ? "text-accent-300" : "text-primary-700"}`}>
        Detail <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );

  return (
    <>
      <PageHeader title="Komisi & Alat Kelengkapan Dewan" subtitle="Komisi dan badan yang menjalankan fungsi DPRD sesuai bidangnya." crumbs={[{ label: "Keanggotaan" }, { label: "Komisi" }]} />
      <div className="container space-y-20 py-16">
        <section>
          <span className="eyebrow">Komisi</span>
          <h2 className="heading mb-8">Komisi DPRD</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {komisi.map((k) => (
              <Card key={k.id} k={k} dark />
            ))}
          </div>
        </section>
        {badan.length > 0 && (
          <section id="badan" className="scroll-mt-36">
            <span className="eyebrow">Badan</span>
            <h2 className="heading mb-8">Badan & Panitia</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {badan.map((k) => (
                <Card key={k.id} k={k} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
