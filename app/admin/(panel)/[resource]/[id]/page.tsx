import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { findById, readDB } from "@/lib/db";
import { getResource } from "@/lib/resources";
import { publicUrl, relationOptions } from "@/lib/admin";
import { formatDateTime } from "@/lib/utils";
import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteResource, saveResource } from "../../../actions";

type Props = { params: Promise<{ resource: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: `Edit ${getResource((await params).resource)?.singular || ""}` };
}

export default async function EditResource({ params }: Props) {
  const { resource, id } = await params;
  const res = getResource(resource);
  if (!res) notFound();
  await requireUser(res.adminOnly ? "admin" : undefined);
  const item = await findById(res.key, id) as unknown as Record<string, unknown> | undefined;
  if (!item) notFound();
  const { passwordHash: _omit, ...values } = item;
  const url = publicUrl(res, item);

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle
        title={`Edit ${res.singular}`}
        desc={`Terakhir diperbarui ${formatDateTime(String(item.updatedAt))}`}
        back={`/admin/${res.key}`}
        actions={
          <>
            {url && (
              <Link href={url} target="_blank" className="btn-outline">
                <ExternalLink className="h-4 w-4" /> Lihat
              </Link>
            )}
            <DeleteButton action={deleteResource.bind(null, res.key, id)} />
          </>
        }
      />
      <ResourceForm
        fields={res.fields}
        values={values}
        options={relationOptions(await readDB(), res.fields)}
        action={saveResource.bind(null, res.key, id)}
        cancelHref={`/admin/${res.key}`}
      />
    </div>
  );
}
