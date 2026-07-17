import { Check, Copy, ExternalLink, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssistantSourceReference } from "@/types/assistant";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  sources: AssistantSourceReference[];
  provider?: "local" | "openai" | "fallback";
  streaming?: boolean;
}

export function AssistantMessage({ message, copied, onCopy }: { message: ChatMessage; copied: boolean; onCopy: (message: ChatMessage) => void }) {
  const assistant = message.role === "assistant";
  return <article className={`flex gap-3 ${assistant ? "" : "justify-end"}`} aria-label={assistant ? "Assistant response" : "Your question"}>
    {assistant && <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles aria-hidden="true" className="size-4" /></span>}
    <div className={`max-w-[min(48rem,88%)] rounded-3xl border p-5 sm:p-6 ${assistant ? "border-border/70 bg-card/80" : "border-primary/20 bg-primary text-primary-foreground"}`}>
      <p className="whitespace-pre-wrap text-sm leading-[1.75] sm:text-base">{message.content}{message.streaming && <span aria-hidden="true" className="ml-1 inline-block size-1.5 animate-pulse rounded-full bg-current" />}</p>
      {assistant && message.sources.length > 0 && <div className="mt-5 border-t border-border/60 pt-4"><p className="text-[.65rem] font-bold uppercase tracking-[.14em] text-muted-foreground">Grounded sources</p><ul className="mt-3 grid gap-2">{message.sources.map((source) => <li key={`${message.id}-${source.id}`} className="rounded-xl bg-muted/50 px-3 py-2.5 text-xs leading-relaxed"><span className="font-bold text-primary">[{source.label}]</span>{" "}{source.url ? <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary">{source.title}<ExternalLink aria-hidden="true" className="ml-1 inline size-3" /></a> : <span className="font-medium text-foreground">{source.title}</span>}<span className="ml-2 text-muted-foreground">{[source.collections[0], source.year].filter(Boolean).join(" · ")}</span></li>)}</ul></div>}
      {assistant && !message.streaming && <div className="mt-4 flex items-center justify-between gap-3"><span className="text-[.65rem] font-semibold uppercase tracking-[.12em] text-muted-foreground">{message.provider === "openai" ? "GPT · local evidence" : message.provider === "fallback" ? "Local fallback" : "Local deterministic"}</span><Button type="button" variant="ghost" size="sm" onClick={() => onCopy(message)}>{copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}{copied ? "Copied" : "Copy"}</Button></div>}
    </div>
    {!assistant && <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><UserRound aria-hidden="true" className="size-4" /></span>}
  </article>;
}
