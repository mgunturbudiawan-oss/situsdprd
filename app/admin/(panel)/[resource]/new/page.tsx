import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getResource } from "@/lib/resources";
import { defaultValues, relationOptions } from "@/lib/admin";
import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { saveResource } from "../../../actions";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: `Tambah ${getResource((await params).resource)?.singular || ""}` };
}

export default async function NewResource({ params }: Props) {
  const res = getResource((await params).resource);
  if (!res) notFound();
  await requireUser(res.adminOnly ? "admin" : undefined);
  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title={`Tambah ${res.singular}`} back={`/admin/${res.key}`} />
      <ResourceForm
        fields={res.fields}
        values={defaultValues(await readDB(), res)}
        options={relationOptions(await readDB(), res.fields)}
        action={saveResource.bind(null, res.key, null)}
        cancelHref={`/admin/${res.key}`}
      />
    </div>
  );
}
