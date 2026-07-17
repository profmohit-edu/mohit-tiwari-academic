"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PublicationActions({ citation, bibtex }: { citation: string; bibtex: string | null }) {
  const [copied, setCopied] = useState<"citation" | "bibtex" | null>(null);
  const copy = async (value: string, kind: "citation" | "bibtex") => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };
  return (
    <div className="flex flex-wrap gap-2" aria-live="polite">
      <Button type="button" variant="ghost" size="sm" onClick={() => copy(citation, "citation")}>
        {copied === "citation" ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />} Citation
      </Button>
      {bibtex && <Button type="button" variant="ghost" size="sm" onClick={() => copy(bibtex, "bibtex")}>
        {copied === "bibtex" ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />} BibTeX
      </Button>}
    </div>
  );
}
