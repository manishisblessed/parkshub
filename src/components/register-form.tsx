"use client";

import { useActionState } from "react";
import { register } from "@/server/actions/public";
import type { FormState } from "@/lib/form-state";
import { Field, SubmitButton } from "@/components/ui";

const initial: FormState = { ok: false, message: "" };

export function RegisterForm({ role }: { role: "FARMER" | "BUYER" | "VENDOR" }) {
  const [state, action, pending] = useActionState(register, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="role" value={role} />
      {state.message ? <p className={`text-sm ${state.ok ? "text-forest" : "text-[#8c3a32]"}`}>{state.message}</p> : null}
      {state.devLink ? (
        <p className="border border-gold bg-white p-3 text-sm">
          Development only, because email is not configured:{" "}
          <a className="underline" href={state.devLink}>
            verification link
          </a>
        </p>
      ) : null}
      <Field label="Full name" name="name" required error={state.fields?.name} />
      <Field label={role === "FARMER" ? "Farm or organisation, if any" : "Organisation"} name="organisation" error={state.fields?.organisation} />
      <Field label="Email" name="email" type="email" required error={state.fields?.email} />
      <Field label="Phone" name="phone" type="tel" required error={state.fields?.phone} />
      <Field label="State" name="state" required error={state.fields?.state} />
      <Field label="District" name="district" error={state.fields?.district} />
      {role === "BUYER" ? (
        <Field
          label="Buyer type"
          name="buyerType"
          as="select"
          options={[
            { value: "", label: "Select" },
            { value: "INSTITUTIONAL", label: "Institution" },
            { value: "DISTRIBUTOR", label: "Distributor" },
            { value: "RETAILER", label: "Retailer" },
            { value: "PROCESSOR", label: "Processor" },
            { value: "OTHER", label: "Other" },
          ]}
          error={state.fields?.buyerType}
        />
      ) : null}
      {role === "VENDOR" ? <Field label="GSTIN, if issued" name="gstin" error={state.fields?.gstin} /> : null}
      <Field
        label={role === "FARMER" ? "Crops and what you want to discuss" : role === "BUYER" ? "Purchase requirements" : "What you can supply"}
        name="detail"
        as="textarea"
        required
        error={state.fields?.detail}
      />
      <Field label="Password" name="password" type="password" required error={state.fields?.password} autoComplete="new-password" />
      <p className="text-sm text-muted">At least 10 characters, with a letter and a number. Registration does not grant administrative access.</p>
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <input name="website_url" tabIndex={-1} autoComplete="off" />
      </div>
      <SubmitButton>{pending ? "Submitting…" : "Submit application"}</SubmitButton>
    </form>
  );
}
