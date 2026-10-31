"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="font-display text-4xl text-forest">Something went wrong.</h1>
      <p className="mt-3 text-muted">The page could not be completed. You can try again. If this continues, write to support@agroparks.in.</p>
      <button type="button" onClick={() => reset()} className="mt-6 h-12 bg-forest px-6 text-sm text-white">
        Try again
      </button>
    </div>
  );
}
