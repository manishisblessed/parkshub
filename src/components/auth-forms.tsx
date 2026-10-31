"use client";

import { useActionState } from "react";
import { forgotPassword, login, resetPassword } from "@/server/actions/public";
import type { FormState } from "@/lib/form-state";
import { Field, SubmitButton } from "@/components/ui";

const initial: FormState = { ok: false, message: "" };

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next || ""} />
      {state.message ? <p className="text-sm text-[#8c3a32]">{state.message}</p> : null}
      <Field label="Email" name="email" type="email" autoComplete="email" required error={state.fields?.email} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required error={state.fields?.password} />
      <SubmitButton>{pending ? "Signing in…" : "Sign in"}</SubmitButton>
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(forgotPassword, initial);
  return (
    <form action={action} className="space-y-4">
      {state.message ? <p className="text-sm text-forest">{state.message}</p> : null}
      {state.devLink ? (
        <p className="border border-gold p-3 text-sm">
          Development only: <a className="underline" href={state.devLink}>reset link</a>
        </p>
      ) : null}
      <Field label="Email" name="email" type="email" required error={state.fields?.email} />
      <SubmitButton>{pending ? "Sending…" : "Send reset link"}</SubmitButton>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {state.message ? <p className={`text-sm ${state.ok ? "text-forest" : "text-[#8c3a32]"}`}>{state.message}</p> : null}
      <Field label="New password" name="password" type="password" autoComplete="new-password" required error={state.fields?.password} />
      <SubmitButton>{pending ? "Saving…" : "Update password"}</SubmitButton>
    </form>
  );
}
