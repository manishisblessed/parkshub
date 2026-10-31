import Link from "next/link";
import { Container } from "@/components/ui";
import { verifyEmail } from "@/server/actions/public";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const ok = params.token ? await verifyEmail(params.token) : false;
  return (
    <Container className="max-w-xl py-16">
      <h1 className="font-display text-5xl text-forest">{ok ? "Email confirmed" : "Link not valid"}</h1>
      <p className="mt-4 text-muted">
        {ok
          ? "You can sign in. A farmer, buyer, or vendor application remains pending until the company reviews it."
          : "The verification link is missing, expired, or already used."}
      </p>
      <Link href="/login" className="mt-6 inline-flex h-12 items-center bg-forest px-6 text-sm text-white">
        Sign in
      </Link>
    </Container>
  );
}
