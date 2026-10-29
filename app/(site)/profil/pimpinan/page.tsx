import Link from "next/link";
import { getSettings, readDB } from "@/lib/db";
import { getLookups, getPimpinan } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Avatar, FraksiBadge } from "@/components/site/Avatar";
import { Empty } from "@/components/site/Cards";

export const metadata = { title: "Pimpinan DPRD" };

export default async function PimpinanPage() {
  const s = await getSettings();
  const { fraksi } = getLookups(await readDB());
  const [ketua, ...wakil] = getPimpinan(await readDB());

  return (
    <>
      <PageHeader title="Pimpinan DPRD" subtitle={`Pimpinan DPRD ${s.namaDaerah} periode ${s.periode}`} crumbs={[{ label: "Profil", href: "/profil" }, { label: "Pimpinan" }]} />
      <div className="container py-16">
        {!ketua ? (
          <Empty text="Data pimpinan belum diisi." />
        ) : (
          <>
            <div className="mx-auto max-w-sm text-center">
              <Link href={`/anggota/${ketua.slug}`} className="group block">
                <div className="relative mx-auto w-64">
                  <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent-400 to-primary-700 opacity-80" />
                  <Avatar src={ketua.foto} name={ketua.nama} rounded="rounded-3xl" className="relative aspect-[3/4] w-full" textClass="text-6xl" />
                </div>
                <h2 className="mt-8 font-display text-2xl font-bold text-slate-900 group-hover:text-primary-700">{ketua.nama}</h2>
                <p className="font-semibold text-primary-700">Ketua DPRD</p>
                <p className="text-sm text-slate-500">{fraksi.get(ketua.fraksiId)?.nama}</p>
              </Link>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {wakil.map((w) => {
                const f = fraksi.get(w.fraksiId);
                return (
                  <Link key={w.id} href={`/anggota/${w.slug}`} className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
                    <Avatar src={w.foto} name={w.nama} className="aspect-[3/4] w-24 shrink-0" textClass="text-2xl" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">{w.nama}</h3>
                      <p className="text-sm font-medium text-primary-700">{w.jabatan}</p>
                      {f && (
                        <span className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <FraksiBadge singkatan={f.singkatan} warna={f.warna} logo={f.logo} className="h-6 w-6 rounded-md text-[7px]" /> {f.nama}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
