import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl("/og-image.svg");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title: `${title} · ${siteConfig.name}`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${siteConfig.name} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteConfig.name}`,
      description,
      images: [image],
    },
  };
}
