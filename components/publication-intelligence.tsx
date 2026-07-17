"use client";

import type { ComponentType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export function PublicationAnalyticsApplication() {
  return <DeferredApplication label="Loading research analytics" loader={() => import("@/components/research-analytics").then((module) => module.ResearchAnalytics)} fallback={<section className="min-h-[48rem] border-y border-border/60 bg-muted/25 py-20 sm:py-28"><div className="container"><div className="h-12 w-72 rounded-2xl bg-muted" /><div className="mt-10 h-96 rounded-[1.75rem] border border-border/70 bg-card/60" /></div></section>} />;
}

export function PublicationExplorerApplication() {
  return <DeferredApplication label="Loading publication explorer" loader={() => import("@/components/publication-explorer").then((module) => module.PublicationExplorer)} fallback={<div className="min-h-[48rem]"><div className="h-12 w-72 rounded-2xl bg-muted" /><div className="mt-10 h-32 rounded-3xl border border-border/70 bg-card/60" /></div>} />;
}

function DeferredApplication({ label, fallback, loader }: { label: string; fallback: ReactNode; loader: () => Promise<ComponentType> }) {
  const [Application, setApplication] = useState<ComponentType | null>(null);
  const marker = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = marker.current;
    if (!node || Application) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        loader().then((LoadedApplication) => setApplication(() => LoadedApplication));
      }
    }, { rootMargin: "150px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [Application, loader]);
  return <div ref={marker} aria-busy={!Application}>{!Application && <span className="sr-only">{label}</span>}{Application ? <Application /> : fallback}</div>;
}
