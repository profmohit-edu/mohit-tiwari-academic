"use client";

import Fuse from "fuse.js";
import { RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import publicationData from "@/data/publications.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicationCard } from "@/components/publication-card";
import type { Publication, PublicationType } from "@/types/research";

const publications = publicationData as Publication[];
const types: Array<PublicationType | "All"> = ["All", "Conference", "Journal"];
const years = [...new Set(publications.map((paper) => paper.year))].sort((a, b) => b - a);

export function PublicationExplorer() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PublicationType | "All">("All");
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState<"newest" | "title">("newest");
  const fuse = useMemo(() => new Fuse(publications, { keys: ["title", "authors", "venue", "year", "abstract"], threshold: 0.32, ignoreLocation: true }), []);
  const results = useMemo(() => {
    const matches = query.trim() ? fuse.search(query).map(({ item }) => item) : publications;
    return matches
      .filter((paper) => type === "All" || paper.type === type)
      .filter((paper) => year === "All" || paper.year === Number(year))
      .toSorted((a, b) => sort === "title" ? a.title.localeCompare(b.title) : b.year - a.year);
  }, [fuse, query, sort, type, year]);

  const hasFilters = query.length > 0 || type !== "All" || year !== "All" || sort !== "newest";
  const reset = () => {
    setQuery("");
    setType("All");
    setYear("All");
    setSort("newest");
  };

  return <><div className="glass sticky top-20 z-20 mb-8 rounded-3xl p-4 sm:top-24"><div className="grid gap-3 lg:grid-cols-[minmax(18rem,1fr)_auto_auto_auto]"><label className="relative block"><span className="sr-only">Search publications</span><Search aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="border-transparent bg-background/80 pl-11 shadow-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, author, venue, or topic…" type="search" /></label><fieldset className="flex gap-1 rounded-full border border-border bg-background/70 p-1"><legend className="sr-only">Publication type</legend>{types.map((item) => <button key={item} type="button" aria-pressed={type === item} onClick={() => setType(item)} className="min-h-9 rounded-full px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground">{item}</button>)}</fieldset><label><span className="sr-only">Filter by year</span><select value={year} onChange={(event) => setYear(event.target.value)} className="h-12 w-full rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"><option value="All">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span className="sr-only">Sort publications</span><select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "title")} className="h-12 w-full rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"><option value="newest">Newest first</option><option value="title">Title A–Z</option></select></label></div></div><div className="mb-5 flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground" aria-live="polite">Showing <strong className="text-foreground">{results.length}</strong> of {publications.length} publications</p>{hasFilters && <Button variant="ghost" size="sm" onClick={reset}><RotateCcw aria-hidden="true" className="size-3.5" /> Reset</Button>}</div><div className="space-y-4">{results.map((paper) => <PublicationCard key={paper.title} paper={paper} />)}{results.length === 0 && <div className="rounded-3xl border border-dashed border-border p-12 text-center"><p className="font-display text-2xl">No matching publications</p><p className="mt-2 text-sm text-muted-foreground">Try a broader search term or reset the filters.</p><Button variant="outline" className="mt-6" onClick={reset}>Reset filters</Button></div>}</div></>;
}
