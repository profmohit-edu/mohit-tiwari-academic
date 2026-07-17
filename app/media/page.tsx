import type { Metadata } from "next";
import { ArrowUpRight, PlaySquare } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { talks } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Talks & Media", description: "Verified invited talks, lectures, and public academic media featuring Mohit Tiwari.", path: "/media" });

export default function MediaPage() {
  return <PageShell><PageHero eyebrow="Public scholarship" title="Talks & media" description="Verified lectures, conference presentations, and public technical discussions." icon={PlaySquare} /><ContentSection>{talks.length > 0 ? <div className="grid gap-7 lg:grid-cols-2">{talks.map((talk) => <article key={`${talk.year}-${talk.title}`} className="luxury-card rounded-3xl border p-7"><p className="eyebrow">{talk.event} · {talk.year}</p><h2 className="mt-4 font-display text-3xl">{talk.title}</h2><p className="mt-4 leading-[1.75] text-muted-foreground">{talk.description}</p><a href={talk.videoUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">Watch recording <ArrowUpRight aria-hidden="true" className="size-4" /></a></article>)}</div> : <div className="rounded-3xl border border-dashed border-border p-10 text-center"><h2 className="font-display text-3xl">No verified media records are currently published.</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">Recordings will appear here only after their event and public URL have been confirmed.</p></div>}</ContentSection></PageShell>;
}
