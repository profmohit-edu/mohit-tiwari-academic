import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, configuredProfiles, siteConfig, withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.title}`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: [...siteConfig.researchAreas, "Mohit Tiwari", "BVCOE", "academic research"],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: absoluteUrl() },
  openGraph: { type: "website", locale: "en_US", url: absoluteUrl(), siteName: siteConfig.name, title: `${siteConfig.name} — ${siteConfig.title}`, description: siteConfig.description, images: [{ url: absoluteUrl("/og-image.svg"), width: 1200, height: 630, alt: `${siteConfig.name} research portfolio` }] },
  twitter: { card: "summary_large_image", title: `${siteConfig.name} — ${siteConfig.title}`, description: siteConfig.description, images: [absoluteUrl("/og-image.svg")] },
  icons: { icon: withBasePath("/favicon.svg") },
  manifest: withBasePath("/site.webmanifest"),
  category: "education"
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#faf9f6" }, { media: "(prefers-color-scheme: dark)", color: "#0f1118" }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteConfig.name,
      url: absoluteUrl(),
      jobTitle: siteConfig.designation,
      email: `mailto:${siteConfig.email}`,
      worksFor: { "@type": "CollegeOrUniversity", name: siteConfig.institution },
      affiliation: { "@type": "Organization", name: siteConfig.department },
      address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "India" },
      sameAs: configuredProfiles.map((profile) => profile.url),
      knowsAbout: siteConfig.researchAreas,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${siteConfig.name} Research Portfolio`,
      url: absoluteUrl(),
      description: siteConfig.description,
      author: { "@type": "Person", name: siteConfig.name },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <JsonLd data={structuredData} />
        <ThemeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
