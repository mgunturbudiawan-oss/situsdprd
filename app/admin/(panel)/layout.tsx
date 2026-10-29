import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { RESOURCES } from "@/lib/resources";
import { Sidebar, type NavGroup } from "@/components/admin/Sidebar";
import { logout } from "../actions";

export const metadata = { title: { default: "CMS", template: "%s | CMS DPRD" }, robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const db = await readDB();
  const isAdmin = user.role === "admin";
  const res = (group: string) => RESOURCES.filter((r) => r.group === group && (!r.adminOnly || isAdmin)).map((r) => ({ href: `/admin/${r.key}`, label: r.label, icon: r.icon }));

  const groups: NavGroup[] = [
    { title: "", items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }] },
    { title: "Konten", items: [...res("Konten").slice(0, 3), { href: "/admin/tv", label: "Siaran Langsung", icon: "tv" }, ...res("Konten").slice(3)] },
    { title: "Kelembagaan", items: res("Kelembagaan") },
    { title: "Layanan", items: [{ href: "/admin/aspirasi", label: "Aspirasi Rakyat", icon: "aspirasi", badge: db.aspirasi.filter((a) => a.status === "Baru").length }] },
    {
      title: "Sistem",
      items: [...(isAdmin ? [{ href: "/admin/pengaturan", label: "Pengaturan Situs", icon: "settings" }] : []), ...res("Sistem"), { href: "/admin/akun", label: "Akun Saya", icon: "shield" }],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar groups={groups} namaDaerah={db.settings.namaDaerah} logo={db.settings.logo} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-4 border-b bg-white px-4 md:px-8">
          <Link href="/admin/akun" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <UserCircle className="h-5 w-5" />
            <span className="font-medium">{user.nama}</span>
            <span className="badge bg-slate-100 text-slate-600">{user.role}</span>
          </Link>
          <form action={logout}>
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-red-600">
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </form>
        </header>
        <main className="px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
