import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import { findBySlug, readDB } from "@/lib/db";
import { getLookups, komisiMembers } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { AgendaCard, MemberCard } from "@/components/site/Cards";
import { Prose } from "@/components/site/Prose";
import { lines } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: (await findBySlug("komisi", (await params).slug))?.nama || "Komisi" };
}

export default async function KomisiDetail({ params }: Props) {
  const k = await findBySlug("komisi", (await params).slug);
  if (!k) notFound();
  const db = await readDB();
  const { fraksi } = getLookups(db);
  const members = komisiMembers(db, k);
  const roleOf = (id: string) => (id === k.ketuaId ? "Ketua" : id === k.wakilKetuaId ? "Wakil Ketua" : id === k.sekretarisId ? "Sekretaris" : "Anggota");
  const rank: Record<string, number> = { Ketua: 0, "Wakil Ketua": 1, Sekretaris: 2, Anggota: 3 };
  members.sort((a, b) => rank[roleOf(a.id)] - rank[roleOf(b.id)]);
  const agenda = db.agenda.filter((a) => a.komisiId === k.id).sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 4);
  const mitra = lines(k.mitraKerja);

  return (
    <>
      <PageHeader title={k.nama} subtitle={k.bidang} crumbs={[{ label: "Komisi", href: "/komisi" }, { label: k.nama }]} />
      <div className="container grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose content={k.deskripsi} />
          <h2 className="mb-6 mt-12 font-display text-2xl font-bold">Susunan Keanggotaan</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {members.map((a) => (
              <MemberCard key={a.id} a={a} fraksi={fraksi.get(a.fraksiId)} subtitle={roleOf(a.id)} />
            ))}
          </div>
        </div>
        <aside className="space-y-8 lg:col-span-4">
          {mitra.length > 0 && (
            <div className="card p-6">
              <h3 className="mb-4 font-display text-lg font-bold">Mitra Kerja</h3>
              <ul className="space-y-3">
                {mitra.map((m) => (
                  <li key={m} className="flex gap-3 text-sm text-slate-700">
                    <Building2 className="h-4 w-4 shrink-0 text-primary-600" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {agenda.length > 0 && (
            <div>
              <h3 className="mb-4 font-display text-lg font-bold">Agenda Terkait</h3>
              <div className="space-y-4">
                {agenda.map((a) => (
                  <AgendaCard key={a.id} a={a} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
