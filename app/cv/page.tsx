import type { Metadata } from "next";
import { Award, Download, FileText } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { InteractiveTimeline } from "@/components/interactive-timeline";
import { withBasePath } from "@/lib/site";
import { awards } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Curriculum Vitae", description: "Academic appointments, education, awards, and downloadable curriculum vitae.", path: "/cv" });

export default function CvPage() {
  return <PageShell><PageHero eyebrow="Curriculum vitae" title="Academic record" description="Appointments, training, recognition, and a concise record of scholarly work." icon={FileText} /><ContentSection><div className="glass mb-20 flex flex-col justify-between gap-5 rounded-3xl p-7 sm:flex-row sm:items-center sm:p-9"><div><h2 className="font-display text-3xl">Full curriculum vitae</h2><p className="mt-2 text-muted-foreground">PDF · One-page research profile</p></div><Button asChild><a href={withBasePath("/aarya-mehta-cv.pdf")} download>Download CV <Download className="size-4" /></a></Button></div><section><h2 className="mb-10 font-display text-4xl sm:text-5xl">Appointments & education</h2><InteractiveTimeline items={awards.timeline} /></section><section className="mt-24"><h2 className="mb-10 font-display text-4xl sm:text-5xl">Selected recognition</h2><div className="grid gap-4 lg:grid-cols-3">{awards.awards.map((award) => <div key={award.title} className="luxury-card flex gap-4 rounded-3xl border p-6"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-300"><Award className="size-5" /></span><div><p className="text-sm text-muted-foreground">{award.year} · {award.issuer}</p><h3 className="mt-2 font-display text-xl">{award.title}</h3></div></div>)}</div></section></ContentSection></PageShell>;
}
