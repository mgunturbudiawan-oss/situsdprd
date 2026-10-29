import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageTitle({ title, desc, back, actions }: { title: string; desc?: string; back?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="pl-10 lg:pl-0">
        {back && (
          <Link href={back} className="mb-1 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700">
            <ChevronLeft className="h-4 w-4" /> Kembali
          </Link>
        )}
        <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
        {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Flash({ sp }: { sp: Record<string, string | undefined> }) {
  const msg = sp.saved ? "Data berhasil disimpan." : sp.deleted ? "Data berhasil dihapus." : null;
  if (sp.error) return <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{sp.error}</div>;
  if (sp.forbidden) return <div className="mb-6 rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-800">Anda tidak memiliki akses ke halaman tersebut.</div>;
  if (!msg) return null;
  return <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">{msg}</div>;
}
