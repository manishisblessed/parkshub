"use client";

import type { ReactNode } from "react";

export function ConfirmForm({
  message,
  action,
  children,
}: {
  message: string;
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
}) {
  return (
    <form
      action={action}
      className="space-y-4"
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
