"use client";

import { Play } from "lucide-react";
import { useState } from "react";

export function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="size-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className="group relative grid size-full place-items-center overflow-hidden bg-slate-950 text-white" aria-label={`Play video: ${title}`}>
      <span aria-hidden="true" className="absolute inset-0 bg-grid bg-[size:44px_44px] opacity-15" />
      <span aria-hidden="true" className="absolute -left-20 -top-20 size-72 rounded-full bg-indigo-500/30 blur-[90px]" />
      <span aria-hidden="true" className="absolute -bottom-32 -right-20 size-80 rounded-full bg-cyan-500/20 blur-[100px]" />
      <span className="relative grid size-16 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition duration-300 group-hover:scale-105 group-hover:bg-white group-hover:text-slate-950">
        <Play aria-hidden="true" className="ml-1 size-6 fill-current" />
      </span>
      <span className="absolute bottom-5 left-5 right-5 text-left text-xs font-semibold uppercase tracking-[.16em] text-slate-300">Click to load video</span>
    </button>
  );
}
