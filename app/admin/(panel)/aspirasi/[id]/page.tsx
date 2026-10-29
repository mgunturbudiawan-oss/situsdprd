import { notFound } from "next/navigation";
import { Mail, MapPin, Paperclip, Phone, User } from "lucide-react";
import { findById, readDB } from "@/lib/db";
import { STATUS_ASPIRASI } from "@/lib/resources";
import { formatDateTime } from "@/lib/utils";
import { PageTitle } from "@/components/admin/PageTitle";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AspirasiResponseForm } from "@/components/admin/AspirasiResponseForm";
import { deleteAspirasi, updateAspirasi } from "../../../actions";

export const metadata = { title: "Detail Aspirasi" };

export default async function AspirasiDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await findById("aspirasi", id);
  if (!a) notFound();
  const komisi = [...(await readDB()).komisi].sort((x, y) => x.urutan - y.urutan).map((k) => ({ value: k.id, label: k.nama }));

  const contact = [
    { icon: User, value: a.nama + (a.anonim ? " (minta disamarkan)" : "") },
    { icon: Mail, value: a.email, href: `mailto:${a.email}` },
    { icon: Phone, value: a.telepon, href: `https://wa.me/${a.telepon.replace(/\D/g, "").replace(/^0/, "62")}` },
    { icon: MapPin, value: a.alamat },
  ].filter((c) => c.value);

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title={a.judul} desc={`${a.kode} · Dikirim ${formatDateTime(a.createdAt)}`} back="/admin/aspirasi" actions={<DeleteButton action={deleteAspirasi.bind(null, a.id)} confirmText="Hapus aspirasi ini secara permanen?" />} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={a.status} />
              <span className="badge bg-slate-100 text-slate-600">{a.kategori}</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-slate-700">{a.isi}</p>
            {a.lampiran && (
              <a href={a.lampiran} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50">
                <Paperclip className="h-4 w-4" /> Lihat Lampiran
              </a>
            )}
          </div>
          <AspirasiResponseForm
            action={updateAspirasi.bind(null, a.id)}
            statuses={STATUS_ASPIRASI}
            komisi={komisi}
            values={{ status: a.status, komisiId: a.komisiId, tanggapan: a.tanggapan, tampilPublik: a.tampilPublik }}
          />
        </div>
        <div className="card h-fit p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Data Pengirim</h2>
          <ul className="space-y-3 text-sm">
            {contact.map(({ icon: Icon, value, href }) => (
              <li key={value} className="flex gap-3 text-slate-700">
                <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="break-all text-primary-700 hover:underline">{value}</a> : <span>{value}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t pt-4 text-xs text-slate-500">Terakhir diperbarui {formatDateTime(a.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
