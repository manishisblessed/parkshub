import { LegalArticle } from "@/components/legal-article";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Terms and conditions", "Draft terms for using the AGRO PARKS website and partner accounts.", "/terms");

export default function Page() {
  return <LegalArticle slug="terms" />;
}
