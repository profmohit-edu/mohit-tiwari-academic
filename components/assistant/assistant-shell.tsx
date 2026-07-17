"use client";

import { Eraser, Search, Send, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import profile from "@/data/profile.json";
import { AssistantMessage, type ChatMessage } from "@/components/assistant/assistant-message";
import { AssistantSidebar } from "@/components/assistant/assistant-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { answerFromLocalResearch } from "@/lib/assistant/service";
import type { AssistantDocument, AssistantFilters, AssistantIndex, AssistantSource, AssistantSourceReference, SearchMode } from "@/types/assistant";
import type { PublicationType } from "@/types/research";

const suggestedQuestions = [
  "What are the latest publications in cyber security?",
  "Which publications focus on blockchain and smart contracts?",
  "Summarize the available research software and GitHub projects.",
  "What datasets are available?",
  "Which publication has the highest verifiable citation count?",
  "What verified research metrics are available?",
  "What teaching records are available?",
];
const sourceOptions: Array<AssistantSource | "All"> = ["All", "Publications", "Projects", "Datasets", "Software", "GitHub", "Patents", "Teaching", "Metrics"];
const publicationTypes: Array<PublicationType | "All"> = ["All", "Journal Article", "Conference Paper", "Book", "Book Chapter", "Dataset", "Software", "Patent", "Preprint"];
const years = Array.from({ length: 27 }, (_, index) => new Date().getFullYear() - index);
const selectClass = "h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";
const initialMessage: ChatMessage = { id: "welcome", role: "assistant", content: "Ask about Prof. Mohit Tiwari’s synchronized publications, projects, datasets, software, GitHub repositories, patents, teaching records, or verified metrics. I use only the local research index and will say when information is unavailable.", sources: [], provider: "local" };
let indexPromise: Promise<AssistantIndex> | null = null;
const loadIndex = () => indexPromise ??= import("@/data/synced/assistant-index.json").then((module) => module.default as unknown as AssistantIndex);

const streamText = async (text: string, onDelta: (delta: string) => void) => {
  const chunks = text.match(/.{1,34}(?:\s|$)/g) ?? [text];
  for (const chunk of chunks) { onDelta(chunk); await new Promise((resolve) => window.setTimeout(resolve, 12)); }
};

export function AssistantShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssistantFilters>({ mode: "hybrid", source: "All", researchArea: "All", year: null, publicationType: "All" });
  const transcript = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL?.trim() || null;

  useEffect(() => { try { setRecentQuestions(JSON.parse(localStorage.getItem("research-assistant-recent") ?? "[]")); } catch { setRecentQuestions([]); } }, []);
  useEffect(() => { transcript.current?.scrollTo({ top: transcript.current.scrollHeight, behavior: "smooth" }); }, [messages]);
  const hasConversation = useMemo(() => messages.some((message) => message.role === "user"), [messages]);

  const updateAssistant = (id: string, update: Partial<ChatMessage> | ((message: ChatMessage) => Partial<ChatMessage>)) => setMessages((current) => current.map((message) => message.id === id ? { ...message, ...(typeof update === "function" ? update(message) : update) } : message));
  const rememberQuestion = (question: string) => setRecentQuestions((current) => {
    const next = [question, ...current.filter((item) => item !== question)].slice(0, 8);
    localStorage.setItem("research-assistant-recent", JSON.stringify(next));
    return next;
  });

  const runLocal = async (question: string, assistantId: string, provider: "local" | "fallback" = "local") => {
    const index = await loadIndex();
    const answer = answerFromLocalResearch(question, index.documents as AssistantDocument[], filters);
    await streamText(answer.text, (delta) => updateAssistant(assistantId, (message) => ({ content: message.content + delta })));
    updateAssistant(assistantId, { sources: answer.sources, provider, streaming: false });
  };

  const runRemote = async (question: string, assistantId: string) => {
    if (!apiUrl) throw new Error("No assistant API configured");
    const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, filters, history: messages.slice(-6).map(({ role, content }) => ({ role, content })) }) });
    if (!response.ok || !response.body) throw new Error("Assistant API unavailable");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        const data = event.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
        if (!data) continue;
        const payload = JSON.parse(data) as { type: "meta" | "delta" | "done"; text?: string; provider?: "local" | "openai"; sources?: AssistantSourceReference[] };
        if (payload.type === "meta") updateAssistant(assistantId, { provider: payload.provider ?? "openai", sources: payload.sources ?? [] });
        if (payload.type === "delta" && payload.text) updateAssistant(assistantId, (message) => ({ content: message.content + payload.text }));
        if (payload.type === "done") updateAssistant(assistantId, { streaming: false });
      }
      if (done) break;
    }
    updateAssistant(assistantId, { streaming: false });
  };

  const ask = async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || busy) return;
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: question, sources: [] };
    const assistantId = `assistant-${Date.now() + 1}`;
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "", sources: [], provider: apiUrl ? "openai" : "local", streaming: true }]);
    setInput(""); setBusy(true); rememberQuestion(question);
    try { if (apiUrl) await runRemote(question, assistantId); else await runLocal(question, assistantId); }
    catch { updateAssistant(assistantId, { content: "", sources: [], provider: "fallback", streaming: true }); await runLocal(question, assistantId, "fallback"); }
    finally { setBusy(false); }
  };

  const submit = (event: FormEvent) => { event.preventDefault(); void ask(input); };
  const clearConversation = () => { if (!busy) setMessages([initialMessage]); };
  const clearRecent = () => { localStorage.removeItem("research-assistant-recent"); setRecentQuestions([]); };
  const copyMessage = async (message: ChatMessage) => { await navigator.clipboard.writeText(message.content); setCopiedId(message.id); window.setTimeout(() => setCopiedId(null), 1600); };

  return <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
    <AssistantSidebar recentQuestions={recentQuestions} suggestedQuestions={suggestedQuestions} researchAreas={profile.researchAreas} activeArea={filters.researchArea} onAsk={(question) => void ask(question)} onAreaChange={(researchArea) => setFilters((current) => ({ ...current, researchArea }))} onClearRecent={clearRecent} />
    <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/60 shadow-[0_30px_90px_-50px_rgba(15,23,42,.4)]" aria-labelledby="assistant-chat-title">
      <header className="flex flex-col justify-between gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:px-7"><div><div className="flex items-center gap-2"><ShieldCheck aria-hidden="true" className="size-4 text-primary" /><h2 id="assistant-chat-title" className="font-display text-2xl">Grounded research chat</h2></div><p className="mt-1 text-xs text-muted-foreground">{apiUrl ? "GPT endpoint configured · local evidence only" : "Deterministic local retrieval · no API key required"}</p></div><Button type="button" variant="ghost" size="sm" disabled={busy || !hasConversation} onClick={clearConversation}><Eraser aria-hidden="true" className="size-4" /> Clear conversation</Button></header>
      <div className="grid gap-3 border-b border-border/70 bg-muted/20 p-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Assistant search filters">
        <label className="text-[.65rem] font-bold uppercase tracking-[.12em] text-muted-foreground">Search mode<select value={filters.mode} onChange={(event) => setFilters((current) => ({ ...current, mode: event.target.value as SearchMode }))} className={`${selectClass} mt-1 w-full`}><option value="hybrid">Hybrid</option><option value="semantic">Semantic</option><option value="keyword">Keyword</option></select></label>
        <label className="text-[.65rem] font-bold uppercase tracking-[.12em] text-muted-foreground">Knowledge source<select value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value as AssistantSource | "All" }))} className={`${selectClass} mt-1 w-full`}>{sourceOptions.map((source) => <option key={source}>{source}</option>)}</select></label>
        <label className="text-[.65rem] font-bold uppercase tracking-[.12em] text-muted-foreground">Year<select value={filters.year ?? "All"} onChange={(event) => setFilters((current) => ({ ...current, year: event.target.value === "All" ? null : Number(event.target.value) }))} className={`${selectClass} mt-1 w-full`}><option>All</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label className="text-[.65rem] font-bold uppercase tracking-[.12em] text-muted-foreground">Publication type<select value={filters.publicationType} onChange={(event) => setFilters((current) => ({ ...current, publicationType: event.target.value as PublicationType | "All" }))} className={`${selectClass} mt-1 w-full`}>{publicationTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <div className="flex items-end"><Badge className="h-10 w-full justify-center gap-2"><Search aria-hidden="true" className="size-3.5" /> {filters.researchArea === "All" ? "All research areas" : filters.researchArea}</Badge></div>
      </div>
      <div ref={transcript} className="h-[min(48rem,62svh)] min-h-[28rem] space-y-6 overflow-y-auto p-5 sm:p-7" aria-live="polite" aria-busy={busy}>{messages.map((message) => <AssistantMessage key={message.id} message={message} copied={copiedId === message.id} onCopy={copyMessage} />)}{!hasConversation && <div className="ml-12 flex flex-wrap gap-2">{suggestedQuestions.slice(0, 5).map((question) => <button key={question} type="button" onClick={() => void ask(question)} className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">{question}</button>)}</div>}</div>
      <form onSubmit={submit} className="border-t border-border/70 bg-background/75 p-4 sm:p-5"><label htmlFor="assistant-question" className="sr-only">Ask a research question</label><div className="flex items-end gap-3 rounded-3xl border border-border bg-card p-2 shadow-sm focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10"><textarea id="assistant-question" value={input} onChange={(event) => setInput(event.target.value.slice(0, 1200))} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(input); } }} rows={2} placeholder="Ask about publications, projects, datasets, software, or verified metrics…" className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground" /><Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label={busy ? "Generating response" : "Send question"}><Send aria-hidden="true" className="size-4" /></Button></div><div className="mt-2 flex items-center justify-between gap-4 px-2 text-[.65rem] text-muted-foreground"><span>Enter to send · Shift+Enter for a new line</span><span>{input.length}/1200</span></div></form>
    </section>
  </div>;
}
