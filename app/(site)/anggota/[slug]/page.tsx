import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, GraduationCap, Mail, MapPin, User } from "lucide-react";
import { findBySlug, readDB } from "@/lib/db";
import { getLookups } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Avatar, FraksiBadge } from "@/components/site/Avatar";
import { Prose } from "@/components/site/Prose";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = await findBySlug("anggota", (await params).slug);
  return { title: a?.nama || "Anggota" };
}

export default async function AnggotaDetail({ params }: Props) {
  const a = await findBySlug("anggota", (await params).slug);
  if (!a) notFound();
  const { fraksi, komisi } = getLookups(await readDB());
  const f = fraksi.get(a.fraksiId);
  const k = komisi.get(a.komisiId);
  const badan = (await readDB()).komisi.filter((x) => x.id !== a.komisiId && (x.anggotaIds?.includes(a.id) || [x.ketuaId, x.wakilKetuaId, x.sekretarisId].includes(a.id)));

  const info = [
    { icon: Briefcase, label: "Jabatan", value: a.jabatan },
    { icon: MapPin, label: "Daerah Pemilihan", value: a.dapil },
    { icon: User, label: "Tempat, Tanggal Lahir", value: [a.tempatLahir, formatDate(a.tanggalLahir)].filter(Boolean).join(", ") },
    { icon: GraduationCap, label: "Pendidikan", value: a.pendidikan },
    { icon: Mail, label: "Email", value: a.email },
  ].filter((i) => i.value);

  return (
    <>
      <PageHeader title={a.nama} subtitle={`${a.jabatan}${f ? ` · ${f.nama}` : ""}`} crumbs={[{ label: "Anggota", href: "/anggota" }, { label: a.nama }]} />
      <div className="container grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="sticky top-28">
            <Avatar src={a.foto} name={a.nama} rounded="rounded-3xl" className="aspect-[3/4] w-full shadow-xl" textClass="text-7xl" />
            {f && (
              <Link href={`/fraksi/${f.slug}`} className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <FraksiBadge singkatan={f.singkatan} warna={f.warna} logo={f.logo} className="h-12 w-12 text-[10px]" />
                <div>
                  <p className="text-xs text-slate-500">Fraksi</p>
                  <p className="font-semibold text-slate-900">{f.nama}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <Icon className="h-5 w-5 shrink-0 text-primary-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-1 font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {(k || badan.length > 0) && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl font-bold">Alat Kelengkapan Dewan</h2>
              <div className="flex flex-wrap gap-3">
                {[k, ...badan].filter(Boolean).map((x) => (
                  <Link key={x!.id} href={`/komisi/${x!.slug}`} className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-800 hover:bg-primary-100">
                    {x!.nama}
                    {x!.ketuaId === a.id && " (Ketua)"}
                    {x!.wakilKetuaId === a.id && " (Wakil Ketua)"}
                    {x!.sekretarisId === a.id && " (Sekretaris)"}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {a.bio && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl font-bold">Biografi</h2>
              <Prose content={a.bio} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
