"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Calendar, Camera, ExternalLink, File, Film, Flag, Images, Landmark, LayoutDashboard, Menu, MessageSquareText, Newspaper,
  Settings, Shield, Tv, Users, X, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard, images: Images, newspaper: Newspaper, calendar: Calendar, film: Film, camera: Camera, file: File,
  users: Users, flag: Flag, landmark: Landmark, shield: Shield, tv: Tv, aspirasi: MessageSquareText, settings: Settings,
};

export type NavGroup = { title: string; items: { href: string; label: string; icon: string; badge?: number }[] };

export function Sidebar({ groups, namaDaerah, logo }: { groups: NavGroup[]; namaDaerah: string; logo?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {groups.map((g) => (
        <div key={g.title}>
          {g.title && <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">{g.title}</p>}
          <div className="space-y-0.5">
            {g.items.map((it) => {
              const Icon = ICONS[it.icon] || File;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active(it.href) ? "bg-primary-600 text-white shadow" : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{it.label}</span>
                  {!!it.badge && <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-primary-950">{it.badge}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const brand = (
    <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
      {logo ? <img src={logo} alt="" className="h-9 w-9 object-contain" /> : <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-xs font-extrabold text-white">CMS</span>}
      <div className="min-w-0 leading-tight">
        <p className="text-sm font-bold text-white">CMS DPRD</p>
        <p className="truncate text-xs text-slate-400">{namaDaerah}</p>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed left-4 top-3.5 z-40 rounded-lg bg-primary-950 p-2 text-white lg:hidden" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-primary-950 lg:flex">
        {brand}
        {nav}
        <Link href="/" target="_blank" className="flex items-center gap-2 border-t border-white/10 px-6 py-4 text-sm text-slate-400 hover:text-white">
          <ExternalLink className="h-4 w-4" /> Lihat Situs
        </Link>
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-primary-950">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 p-1 text-slate-400" aria-label="Tutup">
              <X className="h-5 w-5" />
            </button>
            {brand}
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
