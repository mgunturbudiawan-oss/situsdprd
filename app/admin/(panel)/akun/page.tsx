import { requireUser } from "@/lib/auth";
import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceForm } from "@/components/admin/ResourceForm";
import type { Field } from "@/lib/resources";
import { changePassword } from "../../actions";

export const metadata = { title: "Akun Saya" };

const FIELDS: Field[] = [
  { name: "current", label: "Password Saat Ini", type: "password", required: true, full: true, section: "Ubah Password" },
  { name: "next", label: "Password Baru", type: "password", required: true, section: "Ubah Password" },
  { name: "confirm", label: "Ulangi Password Baru", type: "password", required: true, section: "Ubah Password" },
];

export default async function AkunPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title="Akun Saya" desc={`${user.nama} (@${user.username}) · ${user.role}`} />
      <ResourceForm fields={FIELDS} values={{}} action={changePassword} submitLabel="Ubah Password" />
    </div>
  );
}
