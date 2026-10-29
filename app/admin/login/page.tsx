import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/db";
import { Emblem } from "@/components/site/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Login Admin" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  const s = await getSettings();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary-900 lg:block">
        <div className="pattern-dots absolute inset-0" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <Emblem src={s.logo} className="h-12 w-12" />
            <div>
              <p className="font-display text-xl font-extrabold">DPRD</p>
              <p className="text-sm text-white/70">{s.namaDaerah}</p>
            </div>
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-tight">Sistem Manajemen Konten</h1>
            <p className="mt-4 max-w-md text-white/70">Kelola berita, agenda, TV streaming, data anggota dewan, dan aspirasi masyarakat dari satu tempat.</p>
          </div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Sekretariat DPRD {s.namaDaerah}</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Emblem src={s.logo} className="h-14 w-14" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Masuk ke CMS</h2>
          <p className="mb-8 mt-1 text-sm text-slate-500">Silakan login menggunakan akun administrator.</p>
          <LoginForm />
          <Link href="/" className="mt-8 block text-center text-sm text-slate-500 hover:text-primary-700">
            ← Kembali ke situs
          </Link>
        </div>
      </div>
    </div>
  );
}
