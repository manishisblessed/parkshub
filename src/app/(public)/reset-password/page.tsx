import { ResetForm } from "@/components/auth-forms";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Reset password", "Choose a new AGRO PARKS password.", "/reset-password");

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  return (
    <Container className="max-w-lg py-16">
      <h1 className="font-display text-5xl text-forest">Choose a new password</h1>
      {params.token ? (
        <div className="mt-8">
          <ResetForm token={params.token} />
        </div>
      ) : (
        <p className="mt-4 text-muted">This page needs the token from your reset email.</p>
      )}
    </Container>
  );
}
