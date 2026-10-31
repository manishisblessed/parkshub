export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16" aria-busy="true" aria-live="polite">
      <div className="h-4 w-32 animate-pulse bg-line" />
      <div className="mt-6 h-12 w-2/3 animate-pulse bg-line" />
      <div className="mt-4 h-24 w-full animate-pulse bg-line" />
    </div>
  );
}
