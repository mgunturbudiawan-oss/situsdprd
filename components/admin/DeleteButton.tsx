"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({ action, label = "Hapus", confirmText = "Yakin ingin menghapus data ini?", compact }: { action: () => Promise<void>; label?: string; confirmText?: string; compact?: boolean }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className={compact ? "rounded-lg p-2 text-red-600 hover:bg-red-50" : "btn-danger"} title={label} aria-label={label}>
        <Trash2 className="h-4 w-4" />
        {!compact && label}
      </button>
    </form>
  );
}
