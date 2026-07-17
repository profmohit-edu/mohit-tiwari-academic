type TimelineItem = { year: string; role: string; place: string };

export function InteractiveTimeline({ items }: { items: TimelineItem[] }) {
  return <ol className="relative space-y-4 before:absolute before:bottom-8 before:left-[1.15rem] before:top-8 before:w-px before:bg-border sm:before:left-[8.5rem]">{items.map((item, index) => <li key={`${item.year}-${item.role}`} className="reveal relative grid gap-3 pl-12 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:pl-0" style={{ "--reveal-delay": `${index * .05}s` } as React.CSSProperties}><span aria-hidden="true" className="absolute left-3 top-8 z-10 size-3 rounded-full border-[3px] border-background bg-primary sm:left-[8.15rem]" /><p className="pt-7 text-sm font-semibold text-primary sm:text-right">{item.year}</p><article className="glass rounded-3xl p-7 sm:p-9"><h3 className="font-display text-2xl leading-tight sm:text-3xl">{item.role}</h3><p className="mt-3 text-muted-foreground">{item.place}</p></article></li>)}</ol>;
}
