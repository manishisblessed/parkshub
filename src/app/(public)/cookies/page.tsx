import { LegalArticle } from "@/components/legal-article";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Cookie Policy", "Cookies used by the AGRO PARKS website.", "/cookies");

export default function Page() {
  return <LegalArticle slug="cookies" />;
}
