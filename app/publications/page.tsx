import type { Metadata } from "next";
import { Library } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { PublicationExplorer } from "@/components/publication-explorer";
import { publications } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Publications",
  description: "Peer-reviewed publications in trustworthy AI, human-centered machine learning, and climate informatics.",
  path: "/publications",
});

export default function PublicationsPage() {
  const structuredData = publications.map((paper) => ({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    datePublished: String(paper.year),
    author: paper.authors.split(", ").map((name) => ({ "@type": "Person", name })),
    publisher: { "@type": "Organization", name: paper.venue },
    url: paper.doi,
    description: paper.abstract,
    mainEntityOfPage: paper.doi,
    copyrightHolder: { "@type": "Person", name: siteConfig.name },
  }));

  return (
    <PageShell>
      <JsonLd data={structuredData} />
      <PageHero eyebrow="Scholarship" title="Publications" description="Search and filter peer-reviewed work on reliable, accountable, and human-centered intelligent systems." icon={Library} />
      <ContentSection><PublicationExplorer /></ContentSection>
    </PageShell>
  );
}
