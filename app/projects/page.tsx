import type { Metadata } from "next";
import { Box } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Research Projects",
  description: "Applied research projects in responsible AI, climate intelligence, and participatory governance.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Applied research" title="Projects built to leave the lab." description="Long-horizon collaborations translating research into tools, field studies, and public infrastructure." icon={Box} />
      <ContentSection>
        <div className="mb-10 grid gap-4 rounded-3xl border border-border bg-muted/30 p-6 sm:grid-cols-3 sm:p-8">
          <div><p className="eyebrow">Approach</p><p className="mt-3 font-display text-2xl">Field-led</p></div>
          <div><p className="eyebrow">Commitment</p><p className="mt-3 font-display text-2xl">Open by default</p></div>
          <div><p className="eyebrow">Outcome</p><p className="mt-3 font-display text-2xl">Public value</p></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">{projects.map((project) => <ProjectCard key={project.title} project={project} />)}</div>
      </ContentSection>
    </PageShell>
  );
}
