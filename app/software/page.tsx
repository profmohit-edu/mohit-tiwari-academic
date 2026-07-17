import type { Metadata } from "next";
import { ArrowUpRight, Code2, Scale, Star } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { software } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Research Software", description: "Open-source software for model auditing, uncertainty communication, and research data documentation.", path: "/software" });

export default function SoftwarePage() {
  return <PageShell><PageHero eyebrow="Open source" title="Software for transparent research." description="Maintained tools that make rigorous evaluation, documentation, and communication easier." icon={Code2} /><ContentSection><div className="grid gap-5 lg:grid-cols-3">{software.map((tool) => <a key={tool.name} href={tool.link} target="_blank" rel="noreferrer" className="group flex min-h-80 flex-col rounded-3xl border border-border bg-slate-950 p-7 text-white shadow-soft transition hover:-translate-y-1 hover:border-indigo-400/50"><div className="flex justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-indigo-400/15 text-indigo-300"><Code2 className="size-5" /></span><ArrowUpRight className="size-5 text-slate-500 transition group-hover:text-indigo-300" /></div><h2 className="mt-8 font-mono text-2xl font-semibold text-indigo-200">{tool.name}</h2><p className="mt-4 flex-1 leading-relaxed text-slate-400">{tool.description}</p><div className="mt-6 flex flex-wrap items-center gap-2"><Badge className="border-white/10 bg-white/10 text-slate-300">{tool.language}</Badge><span className="inline-flex items-center gap-1 text-xs text-slate-400"><Star className="size-3" /> {tool.stars}</span><span className="inline-flex items-center gap-1 text-xs text-slate-400"><Scale className="size-3" /> {tool.license}</span></div></a>)}</div></ContentSection></PageShell>;
}
