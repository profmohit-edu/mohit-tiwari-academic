import type { Metadata } from "next";
import { PlaySquare } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { VideoPlayer } from "@/components/video-player";
import { videos } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Media & Talks",
  description: "Research talks, public lectures, and recorded seminars on responsible artificial intelligence.",
  path: "/media",
});

export default function MediaPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Talks & lectures" title="Ideas, in the open." description="Public lectures and research seminars translating technical work for wider audiences." icon={PlaySquare} />
      <ContentSection>
        <div className="mb-12 max-w-2xl"><p className="eyebrow">Public scholarship</p><h2 className="mt-4 font-display text-4xl">Research should travel.</h2><p className="mt-4 leading-[1.75] text-muted-foreground">These talks make the methods, tradeoffs, and public consequences of AI research legible beyond specialist venues.</p></div>
        <div className="grid gap-7 lg:grid-cols-2">{videos.map((video) => <article key={video.id} className="luxury-card overflow-hidden rounded-3xl border"><div className="aspect-video"><VideoPlayer id={video.id} title={video.title} /></div><div className="p-7"><p className="eyebrow">{video.event} · {video.year}</p><h2 className="mt-3 font-display text-3xl">{video.title}</h2><p className="mt-4 leading-[1.75] text-muted-foreground">{video.description}</p></div></article>)}</div>
      </ContentSection>
    </PageShell>
  );
}
