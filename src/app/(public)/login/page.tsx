import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { safeNextPath } from "@/lib/validation";

export const metadata = pageMeta("Sign in", "Sign in to an AGRO PARKS account.", "/login");

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "");
  return (
    <Container className="max-w-lg py-16">
      <h1 className="font-display text-5xl text-forest">Sign in</h1>
      <p className="mt-3 text-muted">Farmers, buyers, vendors, and company staff use the same page. Staff are taken to the dashboard.</p>
      <div className="mt-8">
        <LoginForm next={next || undefined} />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/forgot-password" className="text-forest underline">
          Forgot password
        </Link>
        <span className="mx-2 text-muted">·</span>
        <Link href="/register" className="text-forest underline">
          Create a partner account
        </Link>
      </p>
    </Container>
  );
}
