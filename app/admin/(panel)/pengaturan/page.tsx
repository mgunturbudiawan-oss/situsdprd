import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/db";
import { SETTINGS_FIELDS } from "@/lib/resources";
import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { saveSettings } from "../../actions";

export const metadata = { title: "Pengaturan Situs" };

export default async function PengaturanPage() {
  await requireUser("admin");
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Pengaturan Situs" desc="Nama daerah, logo, warna tema, kontak, media sosial, dan profil lembaga." />
      <ResourceForm fields={SETTINGS_FIELDS} values={s as unknown as Record<string, unknown>} action={saveSettings.bind(null, "umum")} submitLabel="Simpan Pengaturan" />
    </div>
  );
}
