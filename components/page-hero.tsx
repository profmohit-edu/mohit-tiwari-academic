import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function PageHero({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: LucideIcon }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border/70 pb-20 pt-32 sm:pb-24 sm:pt-40">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-grid bg-[size:56px_56px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      <div aria-hidden="true" className="absolute -left-20 top-20 -z-10 size-80 rounded-full bg-primary/10 blur-[100px]" />
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-violet-300/15 blur-[120px] dark:bg-violet-600/10" />
      <div className="container enter-sequence">
        <nav aria-label="Breadcrumb" className="enter-item mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-foreground">{title}</span>
        </nav>
        <div className="enter-item glass mb-7 grid size-12 place-items-center rounded-2xl text-primary"><Icon aria-hidden="true" className="size-5" /></div>
        <p className="enter-item eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-5xl font-display text-5xl leading-[.98] tracking-[-.045em] sm:text-7xl lg:text-[5.5rem]">{title}</h1>
        <p className="enter-item mt-7 max-w-2xl text-lg leading-[1.75] text-muted-foreground sm:text-xl">{description}</p>
      </div>
    </header>
  );
}
