import { notFound } from "next/navigation";
import { CalendarDays, User } from "lucide-react";
import { findBySlug, readDB } from "@/lib/db";
import { getBerita } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Prose } from "@/components/site/Prose";
import { NewsRow } from "@/components/site/Cards";
import { ShareButtons } from "@/components/site/ShareButtons";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const b = await findBySlug("berita", (await params).slug);
  return b ? { title: b.judul, description: b.ringkasan, openGraph: { images: b.gambar ? [b.gambar] : [] } } : { title: "Berita" };
}

export default async function BeritaDetail({ params }: Props) {
  const b = await findBySlug("berita", (await params).slug);
  if (!b || !b.publish) notFound();
  const terkait = getBerita(await readDB(), { limit: 6 }).filter((x) => x.id !== b.id).slice(0, 5);

  return (
    <>
      <PageHeader title={b.judul} image={b.gambar} crumbs={[{ label: "Berita", href: "/berita" }, { label: b.kategori }]} />
      <div className="container grid gap-12 py-12 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="badge bg-primary-50 text-primary-700">{b.kategori}</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(b.tanggal, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            {b.penulis && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {b.penulis}
              </span>
            )}
          </div>
          {b.gambar && <img src={b.gambar} alt={b.judul} className="skeleton mb-8 aspect-video w-full rounded-2xl object-cover shadow-lg" />}
          {b.ringkasan && <p className="mb-6 border-l-4 border-accent-500 pl-5 text-lg font-medium text-slate-700">{b.ringkasan}</p>}
          <Prose content={b.konten} className="md:prose-lg" />
          <div className="mt-10 border-t pt-6">
            <ShareButtons title={b.judul} />
          </div>
        </article>
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <h3 className="mb-5 font-display text-lg font-bold">Berita Lainnya</h3>
            <div className="space-y-5">
              {terkait.map((x) => (
                <NewsRow key={x.id} b={x} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
