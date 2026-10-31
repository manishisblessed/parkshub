import Link from "next/link";
import type { ReactNode } from "react";

/* ── Layout ────────────────────────────────────────────────────────── */

export function Container({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <div id={id} className={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>{children}</div>;
}

/* ── Buttons ────────────────────────────────────────────────────────── */

const buttonBase =
  "btn-shimmer inline-flex h-12 items-center justify-center px-6 text-sm tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

const buttonStyles = {
  primary:
    "bg-forest text-white hover:bg-leaf hover:shadow-[0_4px_20px_rgba(18,61,43,0.25)] focus-visible:outline-forest",
  secondary:
    "border border-forest text-forest hover:bg-forest hover:text-white hover:shadow-[0_4px_16px_rgba(18,61,43,0.18)]",
  inverse:
    "border border-white/70 text-white hover:border-white hover:bg-white hover:text-forest",
  gold:
    "btn-gold-shimmer text-ink font-medium shadow-sm focus-visible:outline-gold",
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: keyof typeof buttonStyles;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
}) {
  return (
    <button
      type="submit"
      className={`${buttonBase} ${buttonStyles[variant]} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {children}
    </button>
  );
}

/* ── Form fields ────────────────────────────────────────────────────── */

export function Field({
  label,
  name,
  error,
  as = "input",
  options,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  React.SelectHTMLAttributes<HTMLSelectElement>) {
  const baseClass =
    "field-enhanced w-full border border-line bg-white px-3 text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-leaf";

  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-forest">{label}</span>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          aria-invalid={Boolean(error)}
          className={`${baseClass} min-h-32 py-3`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === "select" ? (
        <select
          id={name}
          name={name}
          aria-invalid={Boolean(error)}
          className={`${baseClass} h-12`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          aria-invalid={Boolean(error)}
          className={`${baseClass} h-12`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <span id={`${name}-error`} className="mt-1 block text-[13px] text-[#8c3a32]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

/* ── Breadcrumbs ────────────────────────────────────────────────────── */

export function Breadcrumbs({
  items,
  light = false,
}: {
  items: { href?: string; label: string }[];
  light?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-white/70" : "text-muted"}`}>
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex gap-2">
            {index > 0 ? <span aria-hidden className="opacity-50">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className={`underline-grow transition-colors ${light ? "text-white/80 hover:text-white" : "hover:text-forest"}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={light ? "text-white font-medium" : "text-ink font-medium"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── Section heading ────────────────────────────────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  lede,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">{eyebrow}</p>
      ) : null}
      <h2
        className={[
          "mt-2 font-display text-4xl leading-tight text-forest md:text-5xl",
          "heading-accent",
        ].join(" ")}
      >
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 text-lg leading-8 text-muted">{lede}</p>
      ) : null}
    </div>
  );
}

/* ── Status pill ────────────────────────────────────────────────────── */

export function StatusPill({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "gold" | "active" }) {
  const variants = {
    default:
      "border border-line bg-white/80 text-forest backdrop-blur-sm",
    gold:
      "border border-gold/40 bg-gold/10 text-[#8c6a2a]",
    active:
      "border border-leaf/30 bg-leaf/10 text-leaf",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

/* ── Scope note ─────────────────────────────────────────────────────── */

export function ScopeNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-[3px] border-gold pl-4 text-sm leading-7 text-muted">
      {children}
    </p>
  );
}

/* ── Empty state ────────────────────────────────────────────────────── */

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-dashed border-line bg-white/50 px-8 py-14 text-center">
      <h2 className="font-display text-2xl text-forest">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-muted">{body}</p>
    </div>
  );
}

/* ── Notice ─────────────────────────────────────────────────────────── */

export function Notice({ code }: { code?: string }) {
  const messages: Record<string, string> = {
    saved: "Saved successfully.",
    deleted: "Removed from the active list.",
    invalid: "Check the required fields and try again.",
    forbidden: "You do not have permission for that action.",
    exists: "An account with that email already exists.",
    "mail-skipped":
      "The record was saved. Email was not sent because SMTP is not configured.",
  };
  if (!code || !messages[code]) return null;
  return (
    <p
      role="status"
      className="border-l-4 border-leaf bg-leaf/8 px-4 py-3 text-sm text-forest"
    >
      {messages[code]}
    </p>
  );
}

/* ── Prose ──────────────────────────────────────────────────────────── */

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-5 text-[1.05rem] leading-8 text-ink">
      {children}
    </div>
  );
}
