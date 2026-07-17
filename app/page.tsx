import { ArrowRight, Award, Braces, Database, FileBadge2 } from "lucide-react";
import Link from "next/link";
import { AnimatedHero } from "@/components/animated-hero";
import { AnimatedStatistics } from "@/components/animated-statistics";
import { ProjectCard } from "@/components/project-card";
import { PublicationCard } from "@/components/publication-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { awards, featuredPublications, projects, researchCounts } from "@/lib/content";

const openWork = [
  { label: "Datasets", href: "/datasets", count: researchCounts.datasets, icon: Database, description: "Versioned collections with clear licenses and limitations." },
  { label: "Software", href: "/software", count: researchCounts.software, icon: Braces, description: "Maintained tools for transparent and reproducible research." },
  { label: "Patents", href: "/patents", count: researchCounts.patents, icon: FileBadge2, description: "Responsible translation from methods to real-world systems." },
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <AnimatedHero />
      <AnimatedStatistics stats={awards.stats} />

      <section className="container py-24 sm:py-32">
        <Reveal><SectionHeading eyebrow="Research agenda" title="Rigorous systems, designed around people." description="My group studies how intelligent systems behave beyond the benchmark—under uncertainty, in institutions, and in the hands of people whose lives they shape." /></Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {awards.interests.map((interest, index) => (
            <Reveal key={interest} delay={index * .05}>
              <Card className="group h-full">
                <CardContent className="flex min-h-52 flex-col justify-between p-7">
                  <span aria-hidden="true" className="font-display text-5xl text-primary/60 transition-colors duration-500 group-hover:text-primary/80">0{index + 1}</span>
                  <div><h2 className="font-display text-2xl leading-tight">{interest}</h2><div aria-hidden="true" className="mt-5 h-px w-10 bg-primary/40 transition-all duration-500 group-hover:w-20" /></div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-auto relative overflow-hidden border-y border-border/60 bg-muted/30 py-24 sm:py-32">
        <div aria-hidden="true" className="absolute -right-32 top-0 size-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="container relative">
          <Reveal><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Selected scholarship" title="Recent publications" /><Button asChild variant="outline"><Link href="/publications">Browse all publications <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div></Reveal>
          <div className="space-y-4">{featuredPublications.map((paper, index) => <Reveal key={paper.title} delay={index * .05}><PublicationCard paper={paper} showAbstract={false} /></Reveal>)}</div>
        </div>
      </section>

      <section className="content-auto container py-24 sm:py-32">
        <Reveal><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Applied research" title="Projects that leave the lab." description="Long-horizon work that connects methods, field evidence, and public value." /><Button asChild variant="outline"><Link href="/projects">Explore every project <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div></Reveal>
        <div className="grid gap-5 lg:grid-cols-3">{projects.map((project, index) => <Reveal key={project.title} delay={index * .05}><ProjectCard project={project} compact /></Reveal>)}</div>
      </section>

      <section className="content-auto border-y border-border/60 bg-muted/25 py-24 sm:py-28">
        <div className="container">
          <Reveal><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow="Research commons" title="Work designed to be reused." description="Code, data, and invention records are treated as first-class scholarly outputs." /><Button asChild variant="outline"><Link href="/resources">View the resource hub <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div></Reveal>
          <div className="grid gap-4 lg:grid-cols-3">{openWork.map(({ label, href, count, icon: Icon, description }, index) => <Reveal key={href} delay={index * .05}><Link href={href} className="luxury-card group flex h-full min-h-56 flex-col rounded-3xl border p-7"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span><span className="font-display text-3xl text-primary">{count}</span></div><h2 className="mt-7 font-display text-3xl transition-colors group-hover:text-primary">{label}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{description}</p></Link></Reveal>)}</div>
        </div>
      </section>

      <section className="content-auto container py-24 sm:py-32">
        <Reveal><div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-9 text-white shadow-[0_40px_100px_-45px_rgba(79,70,229,.65)] sm:p-16"><div aria-hidden="true" className="absolute -right-20 -top-32 size-96 rounded-full bg-indigo-500/30 blur-[100px]" /><div aria-hidden="true" className="absolute inset-0 bg-grid bg-[size:48px_48px] opacity-10" /><div className="relative"><Award aria-hidden="true" className="size-7 text-indigo-300" /><h2 className="mt-7 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Build consequential research with us.</h2><p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">Collaborations are welcome across academia, public-interest organizations, and responsible technology teams.</p><Button asChild variant="outline" className="mt-9 border-white/20 bg-white text-slate-950"><Link href="/contact">Start a conversation <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div></div></Reveal>
      </section>
    </main>
  );
}
