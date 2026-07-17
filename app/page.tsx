import { ArrowRight, Network } from "lucide-react";
import Link from "next/link";
import { AcademicHighlights } from "@/components/academic-highlights";
import { AnimatedHero } from "@/components/animated-hero";
import { ProfessionalMemberships } from "@/components/professional-memberships";
import { ProfileOverview } from "@/components/profile-overview";
import { ProjectCard } from "@/components/project-card";
import { PublicationCard } from "@/components/publication-card";
import { ResearchSnapshot } from "@/components/research-snapshot";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { featuredPublications, repositories } from "@/lib/content";

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <AnimatedHero />
      <ResearchSnapshot />
      <ProfileOverview />
      <AcademicHighlights />
      <section className="content-auto relative overflow-hidden border-y border-border/60 bg-muted/30 py-24 sm:py-32"><div aria-hidden="true" className="absolute -right-32 top-0 size-96 rounded-full bg-primary/5 blur-[120px]" /><div className="container relative"><Reveal><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="ORCID-synchronized scholarship" title="Recent publications" /><Button asChild variant="outline"><Link href="/publications">Browse publications <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div></Reveal><div className="space-y-4">{featuredPublications.map((paper, index) => <Reveal key={paper.id} delay={index * .05}><PublicationCard paper={paper} showAbstract={false} /></Reveal>)}</div></div></section>
      <section className="content-auto container py-24 sm:py-32"><Reveal><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="GitHub portfolio" title="Research and teaching repositories." description="Repository metadata, languages, activity, and documentation are synchronized from GitHub." /><Button asChild variant="outline"><Link href="/projects">Explore repositories <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div></Reveal><div className="grid gap-5 lg:grid-cols-3">{repositories.slice(0, 3).map((project, index) => <Reveal key={project.id} delay={index * .05}><ProjectCard project={project} compact /></Reveal>)}</div></section>
      <ProfessionalMemberships />
      <section className="content-auto container py-24 sm:py-32"><Reveal><div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-9 text-white shadow-[0_40px_100px_-45px_rgba(79,70,229,.65)] sm:p-16"><div aria-hidden="true" className="absolute -right-20 -top-32 size-96 rounded-full bg-indigo-500/30 blur-[100px]" /><div aria-hidden="true" className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-10" /><div className="relative"><Network aria-hidden="true" className="size-7 text-indigo-300" /><h2 className="mt-7 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Collaborate on consequential computing research.</h2><p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">Research collaborations, academic partnerships, student projects, and invited technical discussions are welcome.</p><Button asChild variant="outline" className="mt-9 border-white/20 bg-white text-slate-950"><Link href="/contact">Start a conversation <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div></div></Reveal></section>
    </main>
  );
}
