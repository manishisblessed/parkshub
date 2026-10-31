import Link from "next/link";
import { RegisterForm } from "@/components/register-form";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Partner registration", "Register as a farmer, buyer, or vendor with AGRO PARKS. Registration does not grant admin access.", "/register");

const roles = {
  farmer: "FARMER",
  buyer: "BUYER",
  vendor: "VENDOR",
} as const;

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const params = await searchParams;
  const role = roles[params.role as keyof typeof roles] ?? "FARMER";
  return (
    <Container className="max-w-3xl py-16">
      <h1 className="font-display text-5xl text-forest">Partner registration</h1>
      <p className="mt-3 max-w-2xl text-muted">Choose the account that matches you. The application stays pending until the company reviews it. This does not create a supply contract.</p>
      <div className="mt-6 flex gap-3 text-sm">
        {(["farmer", "buyer", "vendor"] as const).map((item) => (
          <Link key={item} href={`/register?role=${item}`} className={`border px-3 py-2 ${role === roles[item] ? "border-forest bg-forest text-white" : "border-line"}`}>
            {item[0].toUpperCase() + item.slice(1)}
          </Link>
        ))}
      </div>
      <div className="mt-8 max-w-xl">
        <RegisterForm role={role} />
      </div>
    </Container>
  );
}
