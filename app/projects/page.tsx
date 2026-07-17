import type { Metadata } from "next";
import { Box } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { ProjectCard } from "@/components/project-card";
import { repositories, syncMetadata } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Projects & Repositories", description: "GitHub-synchronized research software, AI, cyber security, teaching, platform, and utility repositories by Mohit Tiwari.", path: "/projects" });

export default function ProjectsPage() {
  const categories = [...new Set(repositories.map((repository) => repository.category))];
  return <PageShell><PageHero eyebrow="GitHub-synchronized portfolio" title="Projects & repositories" description="Public repositories are imported with their topics, languages, activity, license, README summary, stars, and forks." icon={Box} /><ContentSection><div className="mb-10 grid gap-4 rounded-3xl border border-border bg-muted/30 p-6 sm:grid-cols-3 sm:p-8"><div><p className="eyebrow">Repositories</p><p className="mt-3 font-display text-3xl">{repositories.length}</p></div><div><p className="eyebrow">Categories</p><p className="mt-3 font-display text-3xl">{categories.length}</p></div><div><p className="eyebrow">Last synchronized</p><p className="mt-3 text-sm font-semibold">{syncMetadata.github ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(syncMetadata.github.synchronizedAt)) : "Not yet synchronized"}</p></div></div><div className="grid gap-6 lg:grid-cols-2">{repositories.map((project) => <ProjectCard key={project.id} project={project} />)}</div></ContentSection></PageShell>;
}
