import { LegalArticle } from "@/components/legal-article";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Disclaimer", "How to read the AGRO PARKS website, including illustrative photography and enquiry limits.", "/disclaimer");

export default function Page() {
  return <LegalArticle slug="disclaimer" />;
}
