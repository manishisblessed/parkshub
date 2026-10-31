"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/server/actions/public";
import type { FormState } from "@/lib/form-state";
import { ENQUIRY_TYPE_LABELS, ENQUIRY_TYPES, type EnquiryType } from "@/lib/constants";
import { Field, SubmitButton } from "@/components/ui";

const initial: FormState = { ok: false, message: "" };

export function EnquiryForm({
  type = "GENERAL",
  allowed,
  productId,
  sourcePath,
  heading = "Send an enquiry",
}: {
  type?: EnquiryType;
  allowed?: EnquiryType[];
  productId?: string;
  sourcePath?: string;
  heading?: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const types = allowed ?? ENQUIRY_TYPES;
  return (
    <form action={action} className="space-y-4 border border-line bg-white p-6 md:p-8" noValidate>
      <div>
        <h2 className="font-display text-3xl text-forest">{heading}</h2>
        <p className="mt-2 text-sm text-muted">We store the message and reply by email when mail is configured. This form does not create an order.</p>
      </div>
      {state.message ? (
        <p role="status" className={`text-sm ${state.ok ? "text-forest" : "text-[#8c3a32]"}`}>
          {state.message}
        </p>
      ) : null}
      <Field label="Full name" name="name" autoComplete="name" required error={state.fields?.name} />
      <Field label="Company name" name="company" autoComplete="organization" error={state.fields?.company} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={state.fields?.email} />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" required error={state.fields?.phone} />
      <Field
        label="Enquiry type"
        name="type"
        as="select"
        defaultValue={type}
        options={types.map((item) => ({ value: item, label: ENQUIRY_TYPE_LABELS[item] }))}
        error={state.fields?.type}
      />
      <Field label="Subject" name="subject" required error={state.fields?.subject} />
      <Field label="Message" name="message" as="textarea" required error={state.fields?.message} />
      <input type="hidden" name="productId" value={productId || ""} />
      <input type="hidden" name="sourcePath" value={sourcePath || ""} />
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Website
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <SubmitButton>{pending ? "Sending…" : "Send enquiry"}</SubmitButton>
    </form>
  );
}
