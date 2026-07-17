import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Teaching", description: "Courses and teaching resources in trustworthy machine learning, human-centered AI, and research methods.", path: "/teaching" });

export default function TeachingPage() {
  return <PageShell><PageHero eyebrow="Teaching & mentorship" title="Learning through inquiry." description="Courses connect technical depth with the institutional and human context required for responsible computing." icon={GraduationCap} /><ContentSection><section aria-labelledby="teaching-principles" className="mb-16 grid gap-5 rounded-3xl bg-slate-950 p-8 text-white sm:grid-cols-[.7fr_1.3fr] sm:p-10"><div><p className="eyebrow text-indigo-300">Teaching philosophy</p><h2 id="teaching-principles" className="mt-4 font-display text-4xl">Theory meets consequence.</h2></div><p className="leading-[1.8] text-slate-300">Students learn to connect model behavior with the people, institutions, and environments in which systems operate. Every course emphasizes reproducible inquiry, careful evaluation, and clear communication.</p></section><div className="grid gap-6 lg:grid-cols-3">{courses.map((course) => <Card key={course.code} className="h-full"><CardContent className="flex min-h-96 flex-col p-7"><GraduationCap aria-hidden="true" className="size-6 text-primary" /><p className="mt-8 text-sm font-bold text-primary">{course.code} · {course.level}</p><h2 className="mt-3 font-display text-3xl">{course.title}</h2><p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{course.description}</p><div className="mt-6 flex flex-wrap gap-2">{course.topics.map((topic) => <Badge key={topic}>{topic}</Badge>)}</div><p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">{course.term}</p></CardContent></Card>)}</div><section className="mt-20 border-t border-border pt-16" aria-labelledby="mentorship"><p className="eyebrow">Mentorship</p><h2 id="mentorship" className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl">Research is a practice, not a performance.</h2><p className="mt-5 max-w-2xl text-lg leading-[1.75] text-muted-foreground">Mentoring centers on sustainable research habits: asking tractable questions, documenting decisions, welcoming critique, and communicating uncertainty with care.</p></section></ContentSection></PageShell>;
}
