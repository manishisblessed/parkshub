import { ForgotForm } from "@/components/auth-forms";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Forgot password", "Request a password reset for an AGRO PARKS account.", "/forgot-password");

export default function ForgotPage() {
  return (
    <Container className="max-w-lg py-16">
      <h1 className="font-display text-5xl text-forest">Forgot password</h1>
      <p className="mt-3 text-muted">If email delivery is configured, the reset link is sent to the account. The response does not reveal whether the email is registered.</p>
      <div className="mt-8">
        <ForgotForm />
      </div>
    </Container>
  );
}
