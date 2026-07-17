"use client";

import { Check, ChevronDown, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createRis, formatCitation } from "@/lib/citations";
import type { CitationStyle, Publication } from "@/types/research";

const styles: CitationStyle[] = ["APA", "IEEE", "MLA", "Chicago"];

export function PublicationActions({ publication }: { publication: Publication }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (value: string, kind: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };
  const downloadRis = () => {
    const blob = new Blob([createRis(publication)], { type: "application/x-research-info-systems;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${publication.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "publication"}.ris`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex flex-wrap items-center gap-2" aria-live="polite">
      <Button type="button" variant="ghost" size="sm" onClick={() => copy(publication.citation, "citation")}>
        {copied === "citation" ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />} Citation
      </Button>
      {publication.bibtex && <Button type="button" variant="ghost" size="sm" onClick={() => copy(publication.bibtex ?? "", "bibtex")}>
        {copied === "bibtex" ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />} BibTeX
      </Button>}
      <Button type="button" variant="ghost" size="sm" onClick={downloadRis}><Download aria-hidden="true" className="size-3.5" /> RIS</Button>
      <details className="group relative">
        <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors hover:bg-accent [&::-webkit-details-marker]:hidden">Citation styles <ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-open:rotate-180" /></summary>
        <div className="glass absolute bottom-[calc(100%+.5rem)] left-0 z-30 w-56 rounded-2xl p-2 shadow-soft sm:bottom-auto sm:top-[calc(100%+.5rem)]">
          {styles.map((style) => <button key={style} type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent" onClick={() => copy(formatCitation(publication, style), style)}><span>{style}</span>{copied === style ? <Check aria-hidden="true" className="size-3.5 text-primary" /> : <Copy aria-hidden="true" className="size-3.5 text-muted-foreground" />}</button>)}
        </div>
      </details>
      {copied && <span className="sr-only">{copied} copied to clipboard.</span>}
    </div>
  );
}
