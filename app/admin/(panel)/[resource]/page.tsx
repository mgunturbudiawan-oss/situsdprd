import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ExternalLink, Pencil, Plus, Search, X } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { getResource } from "@/lib/resources";
import { cellValue, publicUrl } from "@/lib/admin";
import { paginate } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Flash, PageTitle } from "@/components/admin/PageTitle";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteResource } from "../../actions";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props) {
  return { title: getResource((await params).resource)?.label || "CMS" };
}

export default async function ResourceList({ params, searchParams }: Props) {
  const res = getResource((await params).resource);
  if (!res) notFound();
  await requireUser(res.adminOnly ? "admin" : undefined);
  const sp = await searchParams;

  const db = await readDB();
  let items = [...(db[res.key] as unknown as Record<string, unknown>[])];
  if (sp.q) {
    const q = sp.q.toLowerCase();
    const textFields = res.fields.filter((f) => ["text", "textarea", "select", "email"].includes(f.type)).map((f) => f.name);
    items = items.filter((it) => textFields.some((n) => String(it[n] ?? "").toLowerCase().includes(q)));
  }
  const { field, dir } = res.sort;
  items.sort((a, b) => {
    const x = a[field] as string | number;
    const y = b[field] as string | number;
    const cmp = typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""));
    return dir === "asc" ? cmp : -cmp;
  });
  const pg = paginate(items, Number(sp.page), 20);
  const labelOf = (name: string) => res.fields.find((f) => f.name === name)?.label.replace(/\s*\(.*\)$/, "") || name;
  const pageHref = (p: number) => `/admin/${res.key}?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), page: String(p) })}`;

  return (
    <>
      <PageTitle
        title={res.label}
        desc={`${pg.total} data`}
        actions={
          <Link href={`/admin/${res.key}/new`} className="btn-primary">
            <Plus className="h-4 w-4" /> Tambah {res.singular}
          </Link>
        }
      />
      <Flash sp={sp} />
      <div className="card overflow-hidden">
        <form className="border-b p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input name="q" defaultValue={sp.q} placeholder={`Cari ${res.label.toLowerCase()}...`} className="input pl-9" />
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {res.columns.map((c) => (
                  <th key={c} className="whitespace-nowrap px-4 py-3">{labelOf(c)}</th>
                ))}
                <th className="w-32 px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pg.items.map((item) => {
                const id = String(item.id);
                const url = publicUrl(res, item);
                return (
                  <tr key={id} className="hover:bg-slate-50">
                    {res.columns.map((c, i) => {
                      const cell = cellValue(db, res, c, item);
                      return (
                        <td key={c} className={cn("px-4 py-3", i === 0 || c === res.titleField ? "font-medium text-slate-900" : "text-slate-600")}>
                          {cell.kind === "image" ? (
                            cell.value ? <img src={String(cell.value)} alt="" className="skeleton h-12 w-16 rounded-md object-cover" /> : <span className="block h-12 w-16 rounded-md bg-slate-100" />
                          ) : cell.kind === "bool" ? (
                            cell.value ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-slate-300" />
                          ) : c === res.titleField ? (
                            <Link href={`/admin/${res.key}/${id}`} className="line-clamp-2 hover:text-primary-700">{String(cell.value)}</Link>
                          ) : (
                            <span className="line-clamp-2">{String(cell.value)}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {url && (
                          <Link href={url} target="_blank" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Lihat di situs">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link href={`/admin/${res.key}/${id}`} className="rounded-lg p-2 text-primary-700 hover:bg-primary-50" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton compact action={deleteResource.bind(null, res.key, id)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!pg.items.length && (
                <tr>
                  <td colSpan={res.columns.length + 1} className="px-4 py-12 text-center text-slate-500">
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pg.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
            <span className="text-slate-500">
              Halaman {pg.page} dari {pg.totalPages}
            </span>
            <div className="flex gap-2">
              {pg.page > 1 && <Link href={pageHref(pg.page - 1)} className="btn-outline btn-sm">Sebelumnya</Link>}
              {pg.page < pg.totalPages && <Link href={pageHref(pg.page + 1)} className="btn-outline btn-sm">Berikutnya</Link>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
