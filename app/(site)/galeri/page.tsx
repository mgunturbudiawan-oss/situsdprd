import { readDB } from "@/lib/db";
import { PageHeader } from "@/components/site/PageHeader";
import { Empty } from "@/components/site/Cards";
import { Gallery } from "@/components/site/Gallery";

export const metadata = { title: "Galeri" };

export default async function GaleriPage() {
  const items = [...(await readDB()).galeri].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  return (
    <>
      <PageHeader title="Galeri Kegiatan" subtitle="Dokumentasi foto kegiatan DPRD." crumbs={[{ label: "Galeri" }]} />
      <div className="container py-12">
        {items.length ? <Gallery items={items.map(({ id, judul, gambar, keterangan, tanggal }) => ({ id, judul, gambar, keterangan, tanggal }))} /> : <Empty text="Belum ada foto." />}
      </div>
    </>
  );
}
