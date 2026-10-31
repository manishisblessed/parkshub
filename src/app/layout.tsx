import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source" });

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.agroparks.in";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "AGRO PARKS SOLUTION PRIVATE LIMITED",
    template: "%s · Agro Parks",
  },
  description:
    "AGRO PARKS SOLUTION PRIVATE LIMITED is a New Delhi agribusiness company for cultivation, nursery, procurement, distribution, post-harvest care, and agricultural support services.",
  applicationName: "AGRO PARKS",
  openGraph: { siteName: "AGRO PARKS SOLUTION PRIVATE LIMITED", locale: "en_IN", type: "website" },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
