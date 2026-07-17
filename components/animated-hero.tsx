import { BookOpen, ChevronRight, MapPin, Network } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function AnimatedHero() {
  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden pt-24">
      <div aria-hidden="true" className="absolute inset-0 -z-30 bg-grid bg-[size:56px_56px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      <div aria-hidden="true" className="absolute left-[55%] top-0 -z-20 size-[38rem] rounded-full bg-primary/10 blur-[130px]" />
      <div aria-hidden="true" className="absolute -left-48 bottom-0 -z-20 size-[30rem] rounded-full bg-amber-200/20 blur-[140px] dark:bg-amber-500/5" />
      <div className="container grid items-center gap-16 py-20 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
        <div className="enter-sequence">
          <div className="enter-item"><Badge className="glass mb-8 gap-2 border-primary/15 bg-primary/5 text-primary"><Network aria-hidden="true" className="size-3" /> Secure, intelligent, connected systems</Badge></div>
          <h1 className="max-w-4xl font-display text-[clamp(3.5rem,9vw,7.4rem)] leading-[.87] tracking-[-.06em]">Research at the intersection of <span className="relative inline-block text-primary italic"><span className="relative z-10">intelligence</span><span aria-hidden="true" className="absolute bottom-1 left-1 right-0 h-[.12em] rounded-full bg-primary/20" /></span> and security.</h1>
          <p className="enter-item mt-9 max-w-2xl text-lg leading-[1.75] text-muted-foreground sm:text-xl">{siteConfig.introduction}</p>
          <div className="enter-item mt-10 flex flex-wrap gap-3"><Button asChild><Link href="/publications" prefetch={false}>Explore publications <ChevronRight aria-hidden="true" className="size-4" /></Link></Button><Button asChild variant="outline"><a href={siteConfig.profiles.orcid.url} target="_blank" rel="noreferrer">ORCID record <BookOpen aria-hidden="true" className="size-4" /></a></Button></div>
          <div className="enter-item mt-11 flex items-center gap-2 text-sm text-muted-foreground"><MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" /> {siteConfig.location} · {siteConfig.institution}</div>
        </div>
        <div className="reveal relative mx-auto w-full max-w-md [--reveal-delay:.16s]">
          <div aria-hidden="true" className="absolute -inset-5 rotate-2 rounded-[2.8rem] border border-primary/20 bg-primary/5" />
          <div className="glass relative overflow-hidden rounded-[2.6rem] p-3"><div className="relative aspect-[4/5] overflow-hidden rounded-[2.1rem] bg-gradient-to-br from-slate-200 via-white to-indigo-100 p-7 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 sm:p-8"><div aria-hidden="true" className="absolute inset-0 bg-grid bg-[size:36px_36px] opacity-30" /><div className="relative flex h-full flex-col justify-between"><div className="flex justify-between text-[.65rem] font-semibold uppercase tracking-[.22em] text-muted-foreground"><span>Academic profile</span><span>ORCID verified</span></div><div className="glass mx-auto grid size-44 place-items-center rounded-full sm:size-52"><span className="font-display text-7xl italic text-primary">{siteConfig.shortName}</span></div><div><p className="font-display text-3xl leading-tight">Mohit Tiwari</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{siteConfig.designation}<br />{siteConfig.department}<br />BVCOE, New Delhi</p></div></div></div></div>
        </div>
      </div>
    </section>
  );
}
