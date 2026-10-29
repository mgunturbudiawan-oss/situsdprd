"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { login, type FormState } from "@/app/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-primary w-full py-3">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Masuk
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<FormState, FormData>(login, null);
  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </div>
      )}
      <div>
        <label className="label">Username</label>
        <input name="username" required autoFocus autoComplete="username" className="input" />
      </div>
      <div>
        <label className="label">Password</label>
        <input name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      <Submit />
    </form>
  );
}
