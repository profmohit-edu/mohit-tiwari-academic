import { CircleDashed } from "lucide-react";

export function TeachingEmptyState({ title, description, compact = false }: { title: string; description: string; compact?: boolean }) {
  return <div className={`rounded-2xl border border-dashed border-border bg-muted/20 text-center ${compact ? "p-5" : "p-8"}`}><CircleDashed aria-hidden="true" className="mx-auto size-5 text-muted-foreground" /><p className="mt-3 font-semibold text-foreground">{title}</p><p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p></div>;
}
