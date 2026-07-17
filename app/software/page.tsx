import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { PublicationCard } from "@/components/publication-card";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { researchSoftware, softwareOutputs } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Research Software", description: "GitHub and ORCID-synchronized research software developed or published by Mohit Tiwari.", path: "/software" });

export default function SoftwarePage() {
  return <PageShell><PageHero eyebrow="Open research infrastructure" title="Research software" description="Maintained repositories are synchronized from GitHub; citable software outputs are synchronized from ORCID." icon={Code2} /><ContentSection><section aria-labelledby="github-software"><p className="eyebrow">GitHub</p><h2 id="github-software" className="mt-4 font-display text-4xl sm:text-5xl">Research repositories</h2><div className="mt-10 grid gap-6 lg:grid-cols-2">{researchSoftware.map((repository) => <ProjectCard key={repository.id} project={repository} />)}</div></section>{softwareOutputs.length > 0 && <section className="mt-24" aria-labelledby="citable-software"><p className="eyebrow">ORCID</p><h2 id="citable-software" className="mt-4 font-display text-4xl sm:text-5xl">Citable software outputs</h2><div className="mt-10 space-y-4">{softwareOutputs.map((output) => <PublicationCard key={output.id} paper={output} />)}</div></section>}</ContentSection></PageShell>;
}
