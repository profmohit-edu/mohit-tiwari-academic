import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageSquare } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";
import { configuredProfiles, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Contact", description: "Contact Mohit Tiwari at Bharati Vidyapeeth's College of Engineering regarding research, teaching, and academic collaboration.", path: "/contact" });

export default function ContactPage() {
  return <PageShell><PageHero eyebrow="Contact" title="Research and academic collaboration." description="Enquiries are welcome from researchers, students, academic institutions, and responsible technology teams." icon={MessageSquare} /><ContentSection><div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr]"><Card className="bg-primary text-primary-foreground"><CardContent className="p-8 sm:p-12"><Mail aria-hidden="true" className="size-7 opacity-70" /><h2 className="mt-8 font-display text-4xl sm:text-5xl">Start with an email.</h2><p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">Include a concise description of the research question, academic collaboration, student project, or event you have in mind.</p><Button asChild variant="outline" className="mt-9 border-white/30 bg-white text-slate-950 hover:bg-white/90"><a href={`mailto:${siteConfig.email}?subject=Academic%20research%20inquiry`}>{siteConfig.email}</a></Button></CardContent></Card><div className="space-y-4"><div className="rounded-3xl border border-border bg-card p-7"><MapPin aria-hidden="true" className="size-5 text-primary" /><h2 className="mt-5 font-display text-2xl">Academic affiliation</h2><p className="mt-2 text-muted-foreground">{siteConfig.department}<br />{siteConfig.institution}<br />{siteConfig.location}</p></div>{configuredProfiles.map((profile) => <a key={profile.label} href={profile.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40"><span><span className="block font-semibold">{profile.label}</span><span className="mt-1 block font-mono text-xs text-muted-foreground">{profile.id}</span></span><ArrowUpRight aria-hidden="true" className="size-4 text-primary" /></a>)}</div></div></ContentSection></PageShell>;
}
