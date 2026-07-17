export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="mb-12 max-w-3xl"><p className="eyebrow mb-4">{eyebrow}</p><h2 className="font-display text-4xl leading-[1.05] tracking-[-.025em] sm:text-6xl">{title}</h2>{description && <p className="mt-5 max-w-2xl text-lg leading-[1.75] text-muted-foreground">{description}</p>}</div>;
}
