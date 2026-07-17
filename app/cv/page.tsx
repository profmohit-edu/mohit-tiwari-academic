import type { Metadata } from "next";
import { ArrowUpRight, Building2, FileText, Fingerprint } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { configuredProfiles, siteConfig } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Academic Profile", description: "Verified academic appointment, research areas, and researcher identifiers for Mohit Tiwari.", path: "/cv" });

export default function CvPage() {
  return <PageShell><PageHero eyebrow="Academic profile" title="Profile & identifiers" description="A concise, source-backed academic profile. A downloadable curriculum vitae will be linked only when a current verified document is supplied." icon={FileText} /><ContentSection><section className="glass rounded-3xl p-8 sm:p-10" aria-labelledby="appointment"><Building2 aria-hidden="true" className="size-6 text-primary" /><p className="eyebrow mt-7">Current appointment</p><h2 id="appointment" className="mt-4 font-display text-4xl sm:text-5xl">{siteConfig.designation}</h2><p className="mt-5 text-lg text-muted-foreground">{siteConfig.department}<br />{siteConfig.institution}<br />{siteConfig.location}</p></section><section className="mt-20" aria-labelledby="research-profile"><p className="eyebrow">Research profile</p><h2 id="research-profile" className="mt-4 font-display text-4xl sm:text-5xl">Areas of scholarship</h2><div className="mt-8 flex flex-wrap gap-3">{siteConfig.researchAreas.map((area) => <Badge key={area} className="px-4 py-2 text-sm">{area}</Badge>)}</div></section><section className="mt-20" aria-labelledby="identifiers"><Fingerprint aria-hidden="true" className="size-6 text-primary" /><p className="eyebrow mt-7">Persistent identity</p><h2 id="identifiers" className="mt-4 font-display text-4xl sm:text-5xl">Researcher profiles</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{configuredProfiles.map((profile) => <a key={profile.label} href={profile.url} target="_blank" rel="noreferrer" className="luxury-card group rounded-2xl border p-5"><p className="text-sm text-muted-foreground">{profile.label}</p><p className="mt-2 break-words font-mono text-sm font-semibold">{profile.id}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Open profile <ArrowUpRight aria-hidden="true" className="size-4" /></span></a>)}</div></section></ContentSection></PageShell>;
}
