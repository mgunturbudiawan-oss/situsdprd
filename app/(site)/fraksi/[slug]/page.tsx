import { notFound } from "next/navigation";
import { findBySlug, readDB } from "@/lib/db";
import { getLookups, sortAnggota } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { FraksiBadge } from "@/components/site/Avatar";
import { MemberCard } from "@/components/site/Cards";
import { Prose } from "@/components/site/Prose";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: (await findBySlug("fraksi", (await params).slug))?.nama || "Fraksi" };
}

export default async function FraksiDetail({ params }: Props) {
  const f = await findBySlug("fraksi", (await params).slug);
  if (!f) notFound();
  const { komisi } = getLookups(await readDB());
  const members = (await readDB()).anggota.filter((a) => a.fraksiId === f.id).sort(sortAnggota);
  const role = (id: string, jabatan: string) => (id === f.ketuaId ? "Ketua Fraksi" : id === f.sekretarisId ? "Sekretaris Fraksi" : jabatan);

  return (
    <>
      <PageHeader title={f.nama} subtitle={`${members.length} anggota`} crumbs={[{ label: "Fraksi", href: "/fraksi" }, { label: f.singkatan }]} />
      <div className="container py-16">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start">
          <FraksiBadge singkatan={f.singkatan} warna={f.warna} logo={f.logo} className="h-28 w-28 shrink-0 text-lg" />
          <Prose content={f.deskripsi} />
        </div>
        <h2 className="mb-6 font-display text-2xl font-bold">Anggota Fraksi</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {members.map((a) => (
            <MemberCard key={a.id} a={a} subtitle={role(a.id, a.jabatan === "Anggota" ? komisi.get(a.komisiId)?.nama || "Anggota" : a.jabatan)} />
          ))}
        </div>
      </div>
    </>
  );
}
