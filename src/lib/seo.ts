import type { Metadata } from "next";

export function pageMeta(title: string, description: string, path: string, image = "/images/hero-landscape.jpg"): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [{ url: image, alt: "Illustrative agricultural photograph, not an AGRO PARKS asset" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
