"use client";

import Fuse from "fuse.js";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import patentData from "@/data/manual/patents.json";
import talkData from "@/data/manual/talks.json";
import publicationData from "@/data/synced/publications.json";
import repositoryData from "@/data/synced/github-repositories.json";
import { PublicationCard } from "@/components/publication-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findRelatedResearch } from "@/lib/related-research";
import type { PatentRecord, Publication, PublicationType, Repository, Talk } from "@/types/research";

const publications = publicationData as Publication[];
const repositories = repositoryData as unknown as Repository[];
const patents = patentData as PatentRecord[];
const talks = talkData as Talk[];
const orderedTypes: PublicationType[] = ["Journal Article", "Conference Paper", "Book", "Book Chapter", "Dataset", "Software", "Patent", "Preprint", "Other"];
const types = orderedTypes.filter((type) => publications.some((publication) => publication.type === type));
const years = [...new Set(publications.map((publication) => publication.year).filter((year): year is number => year !== null))].sort((left, right) => right - left);
const venues = [...new Set(publications.map((publication) => publication.venue).filter((venue): venue is string => Boolean(venue)))].sort((left, right) => left.localeCompare(right));
const publishers = [...new Set(publications.map((publication) => publication.publisher).filter((publisher): publisher is string => Boolean(publisher)))].sort((left, right) => left.localeCompare(right));
const researchAreas = [...new Set(publications.flatMap((publication) => publication.researchAreas))].sort((left, right) => left.localeCompare(right));
const selectClass = "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";
const pageSize = 20;

export function PublicationExplorer() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [type, setType] = useState<PublicationType | "All">("All");
  const [year, setYear] = useState("All");
  const [venue, setVenue] = useState("All");
  const [publisher, setPublisher] = useState("All");
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);
  const [area, setArea] = useState("All");
  const [doi, setDoi] = useState<"All" | "Available" | "Unavailable">("All");
  const [openAccess, setOpenAccess] = useState<"All" | "open" | "unknown">("All");
  const [sort, setSort] = useState<"newest" | "title" | "citations">("newest");
  const [advanced, setAdvanced] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const fuse = useMemo(() => new Fuse(publications, {
    keys: ["title", "authors", "venue", "publisher", "year", "doi", "abstract", "keywords", "researchAreas", "sources"],
    threshold: 0.28,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), []);
  const results = useMemo(() => {
    const matches = deferredQuery.trim() ? fuse.search(deferredQuery.trim()).map(({ item }) => item) : publications;
    const normalizedKeyword = deferredKeyword.trim().toLowerCase();
    return matches
      .filter((paper) => type === "All" || paper.type === type)
      .filter((paper) => year === "All" || paper.year === Number(year))
      .filter((paper) => venue === "All" || paper.venue === venue)
      .filter((paper) => publisher === "All" || paper.publisher === publisher)
      .filter((paper) => !normalizedKeyword || paper.keywords.some((item) => item.toLowerCase().includes(normalizedKeyword)))
      .filter((paper) => area === "All" || paper.researchAreas.includes(area))
      .filter((paper) => doi === "All" || (doi === "Available" ? Boolean(paper.doi) : !paper.doi))
      .filter((paper) => openAccess === "All" || paper.openAccess === openAccess)
      .toSorted((left, right) => sort === "title"
        ? left.title.localeCompare(right.title)
        : sort === "citations"
          ? (right.citationCount ?? -1) - (left.citationCount ?? -1)
          : (right.publicationDate ? new Date(right.publicationDate).getTime() : (right.year ?? 0) * 31_536_000_000) - (left.publicationDate ? new Date(left.publicationDate).getTime() : (left.year ?? 0) * 31_536_000_000) || left.title.localeCompare(right.title));
  }, [area, deferredKeyword, deferredQuery, doi, fuse, openAccess, publisher, sort, type, venue, year]);

  useEffect(() => setVisibleCount(pageSize), [area, deferredKeyword, deferredQuery, doi, openAccess, publisher, sort, type, venue, year]);

  const activeFilterCount = [query, type !== "All", year !== "All", venue !== "All", publisher !== "All", keyword, area !== "All", doi !== "All", openAccess !== "All"].filter(Boolean).length;
  const hasFilters = activeFilterCount > 0 || sort !== "newest";
  const visibleResults = results.slice(0, visibleCount);
  const reset = () => {
    setQuery(""); setType("All"); setYear("All"); setVenue("All"); setPublisher("All"); setKeyword(""); setArea("All"); setDoi("All"); setOpenAccess("All"); setSort("newest"); setVisibleCount(pageSize);
  };

  return (
    <section aria-labelledby="publication-explorer-title">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Scholarly record</p><h2 id="publication-explorer-title" className="mt-3 font-display text-4xl sm:text-5xl">Publication explorer</h2></div><p className="max-w-md text-sm leading-relaxed text-muted-foreground">Fuzzy full-text search with precise metadata filters. Results are rendered incrementally for consistent performance.</p></div>
      <div className="glass sticky top-20 z-20 mb-8 rounded-3xl p-4 sm:top-24">
        <div className="grid gap-3 lg:grid-cols-[minmax(18rem,1fr)_auto_auto_auto]">
          <label className="relative block"><span className="sr-only">Search publications</span><Search aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="border-transparent bg-background/80 pl-11 shadow-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, author, DOI, venue, abstract…" type="search" /></label>
          <label><span className="sr-only">Filter by publication type</span><select value={type} onChange={(event) => setType(event.target.value as PublicationType | "All")} className="h-12 w-full rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"><option value="All">All output types</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Filter by year</span><select value={year} onChange={(event) => setYear(event.target.value)} className="h-12 w-full rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"><option value="All">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <Button type="button" variant={advanced ? "default" : "outline"} className="h-12" aria-expanded={advanced} aria-controls="advanced-publication-filters" onClick={() => setAdvanced((current) => !current)}><SlidersHorizontal aria-hidden="true" className="size-4" /> Filters{activeFilterCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-background/20 text-[.65rem]">{activeFilterCount}</span>}</Button>
        </div>
        {advanced && <div id="advanced-publication-filters" className="mt-4 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-muted-foreground">Venue<select value={venue} onChange={(event) => setVenue(event.target.value)} className={`${selectClass} mt-1.5`}><option value="All">All venues</option>{venues.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-xs font-semibold text-muted-foreground">Publisher<select value={publisher} onChange={(event) => setPublisher(event.target.value)} className={`${selectClass} mt-1.5`}><option value="All">All publishers</option>{publishers.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-xs font-semibold text-muted-foreground">Keyword<Input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="mt-1.5 h-11 rounded-xl bg-background" placeholder="e.g. zero trust" /></label>
          <label className="text-xs font-semibold text-muted-foreground">Research area<select value={area} onChange={(event) => setArea(event.target.value)} className={`${selectClass} mt-1.5`}><option value="All">All research areas</option>{researchAreas.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="text-xs font-semibold text-muted-foreground">DOI availability<select value={doi} onChange={(event) => setDoi(event.target.value as typeof doi)} className={`${selectClass} mt-1.5`}><option value="All">Any DOI status</option><option value="Available">DOI available</option><option value="Unavailable">No DOI recorded</option></select></label>
          <label className="text-xs font-semibold text-muted-foreground">Open access<select value={openAccess} onChange={(event) => setOpenAccess(event.target.value as typeof openAccess)} className={`${selectClass} mt-1.5`}><option value="All">Any access status</option><option value="open">Verified open access</option><option value="unknown">Status unknown</option></select></label>
          <label className="text-xs font-semibold text-muted-foreground">Sort results<select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className={`${selectClass} mt-1.5`}><option value="newest">Newest first</option><option value="title">Title A–Z</option><option value="citations">Most cited</option></select></label>
          <div className="flex items-end">{hasFilters && <Button variant="ghost" className="h-11 w-full" onClick={reset}><RotateCcw aria-hidden="true" className="size-3.5" /> Reset all filters</Button>}</div>
        </div>}
        {!advanced && <div className="mt-3 flex items-center justify-between gap-3"><label><span className="sr-only">Sort publications</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="h-10 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"><option value="newest">Newest first</option><option value="title">Title A–Z</option><option value="citations">Most cited</option></select></label>{hasFilters && <Button variant="ghost" size="sm" onClick={reset}><RotateCcw aria-hidden="true" className="size-3.5" /> Reset</Button>}</div>}
      </div>
      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">Showing <strong className="text-foreground">{Math.min(visibleResults.length, results.length)}</strong> of <strong className="text-foreground">{results.length}</strong> matching records · {publications.length} synchronized</p>
      <div className="space-y-4">{visibleResults.map((paper) => <PublicationCard key={paper.id} paper={paper} related={findRelatedResearch(paper, publications, repositories, patents, talks)} />)}{results.length === 0 && <div className="rounded-3xl border border-dashed border-border p-12 text-center"><p className="font-display text-2xl">No matching publications</p><p className="mt-2 text-sm text-muted-foreground">Try a broader search term or reset the filters.</p><Button variant="outline" className="mt-6" onClick={reset}>Reset filters</Button></div>}</div>
      {visibleCount < results.length && <div className="mt-10 flex justify-center"><Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + pageSize)}>Show {Math.min(pageSize, results.length - visibleCount)} more publications</Button></div>}
    </section>
  );
}
