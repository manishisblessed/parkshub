import { LegalArticle } from "@/components/legal-article";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Privacy Policy", "Draft privacy notice for AGRO PARKS SOLUTION PRIVATE LIMITED.", "/privacy");

export default function Page() {
  return <LegalArticle slug="privacy" />;
}
