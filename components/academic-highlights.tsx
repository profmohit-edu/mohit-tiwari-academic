import { ArrowUpRight, BookOpenText, Code2, Database, Github, Radio } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { academicHighlights } from "@/lib/content";

const icons = { publication: BookOpenText, software: Code2, dataset: Database, repository: Github, activity: Radio } as const;
const formatDate = (date: string | null) => date ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date)) : "Record pending";

export function AcademicHighlights() {
  return (
    <section className="content-auto relative overflow-hidden border-y border-border/60 bg-muted/30 py-24 sm:py-32" aria-labelledby="academic-highlights-title">
      <div aria-hidden="true" className="absolute -left-32 top-10 size-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="container relative">
        <Reveal><SectionHeading id="academic-highlights-title" eyebrow="Latest scholarship" title="Academic highlights" description="Automatically selected from synchronized publications, research outputs, and GitHub activity." /></Reveal>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {academicHighlights.map((highlight, index) => {
            const Icon = icons[highlight.key];
            const content = (
              <Card className="group h-full">
                <CardContent className="flex min-h-72 h-full flex-col p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span>
                    <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="eyebrow mt-8">{highlight.eyebrow}</p>
                  <h3 className="mt-4 line-clamp-3 font-display text-2xl leading-tight transition-colors group-hover:text-primary">{highlight.title}</h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{highlight.description}</p>
                  <time dateTime={highlight.date ?? undefined} className="mt-auto pt-7 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{formatDate(highlight.date)}</time>
                </CardContent>
              </Card>
            );
            return (
              <Reveal key={highlight.key} delay={index * .05} className={index < 2 ? "xl:col-span-1" : ""}>
                {highlight.external ? <a href={highlight.href} target="_blank" rel="noreferrer" className="block h-full rounded-[1.75rem]">{content}</a> : <Link href={highlight.href} className="block h-full rounded-[1.75rem]">{content}</Link>}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
