import type { Metadata } from "next";
import { Library } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { PublicationExplorer } from "@/components/publication-explorer";
import { publications, syncMetadata } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Publications", description: "ORCID-synchronized publications by Mohit Tiwari across artificial intelligence, cyber security, software engineering, blockchain, cloud computing, and IoT.", path: "/publications" });

export default function PublicationsPage() {
  const structuredData = publications.slice(0, 100).map((paper) => ({
    "@context": "https://schema.org",
    "@type": paper.type === "Book" ? "Book" : paper.type === "Dataset" ? "Dataset" : paper.type === "Software" ? "SoftwareSourceCode" : "ScholarlyArticle",
    headline: paper.title,
    datePublished: paper.publicationDate ?? (paper.year ? String(paper.year) : undefined),
    author: paper.authors.map((name) => ({ "@type": "Person", name })),
    publisher: paper.publisher ? { "@type": "Organization", name: paper.publisher } : undefined,
    url: paper.links.doi ?? paper.links.publisher,
    description: paper.abstract ?? undefined,
    identifier: paper.doi ?? paper.id,
    copyrightHolder: { "@type": "Person", name: siteConfig.name },
  }));
  return <PageShell><JsonLd data={structuredData} /><PageHero eyebrow="ORCID-synchronized scholarship" title="Publications" description="Search an automatically synchronized scholarly record, enriched with Crossref and OpenAlex metadata where DOI records are available." icon={Library} /><ContentSection><div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"><span>ORCID: {siteConfig.orcidId}</span><span>Last synchronized: {syncMetadata.orcid ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(syncMetadata.orcid.synchronizedAt)) : "Not yet synchronized"}</span></div><PublicationExplorer /></ContentSection></PageShell>;
}
