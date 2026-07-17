import type { Metadata } from "next";
import { Bot } from "lucide-react";
import { AssistantShell } from "@/components/assistant/assistant-shell";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "AI Research Assistant", description: "Ask grounded questions about Mohit Tiwari's synchronized publications, projects, datasets, software, GitHub repositories, patents, teaching, and verified metrics.", path: "/assistant" });

export default function AssistantPage() {
  return <PageShell><PageHero eyebrow="Local research intelligence" title="AI Research Assistant" description="Search and synthesize the synchronized academic record. Every answer is grounded in local sources, with explicit citations and honest unavailable-data responses." icon={Bot} /><ContentSection className="content-auto"><AssistantShell /></ContentSection></PageShell>;
}
