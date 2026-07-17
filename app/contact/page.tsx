import type { Metadata } from "next";
import { BookOpen, Github, Linkedin, Mail, MapPin, MessageSquare } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Contact", description: "Contact Dr. Aarya Mehta about research collaborations, student opportunities, and invited talks.", path: "/contact" });

const profiles = [{ label: "GitHub", href: siteConfig.github, icon: Github }, { label: "LinkedIn", href: siteConfig.linkedin, icon: Linkedin }, { label: "Google Scholar", href: siteConfig.scholar, icon: BookOpen }];

export default function ContactPage() {
  return <PageShell><PageHero eyebrow="Contact" title="Let’s make consequential research together." description="I welcome conversations with prospective students, researchers, public-interest organizations, and responsible technology teams." icon={MessageSquare} /><ContentSection><div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr]"><Card className="bg-primary text-primary-foreground"><CardContent className="p-8 sm:p-12"><Mail className="size-7 opacity-70" /><h2 className="mt-8 font-display text-4xl sm:text-5xl">Start with an email.</h2><p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">For the fastest response, include a short description of the research question, collaboration, student opportunity, or event you have in mind.</p><Button asChild variant="outline" className="mt-9 border-white/30 bg-white text-slate-950 hover:bg-white/90"><a href={`mailto:${siteConfig.email}?subject=Research%20inquiry`}>{siteConfig.email}</a></Button></CardContent></Card><div className="space-y-4"><div className="rounded-3xl border border-border bg-card p-7"><MapPin className="size-5 text-primary" /><h2 className="mt-5 font-display text-2xl">Location</h2><p className="mt-2 text-muted-foreground">{siteConfig.location}</p><p className="mt-1 text-sm text-muted-foreground">Available for remote and international collaboration.</p></div>{profiles.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4" /></span><span className="font-semibold">{label}</span></a>)}</div></div></ContentSection></PageShell>;
}
