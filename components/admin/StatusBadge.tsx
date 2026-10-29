import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  Baru: "bg-primary-100 text-primary-700",
  Diproses: "bg-amber-100 text-amber-800",
  Ditindaklanjuti: "bg-violet-100 text-violet-700",
  Selesai: "bg-green-100 text-green-700",
  Ditolak: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("badge shrink-0", COLORS[status] || "bg-slate-100 text-slate-600")}>{status}</span>;
}
