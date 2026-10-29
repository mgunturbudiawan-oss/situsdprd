"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { videoKind, youtubeId } from "@/lib/utils";

export function LivePlayer({ url, title, poster, autoPlay = false }: { url: string; title: string; poster?: string; autoPlay?: boolean }) {
  const kind = videoKind(url);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(autoPlay);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || kind !== "hls" || !started) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }
    let hls: { destroy(): void } | null = null;
    let cancelled = false;
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      const h = new Hls({ lowLatencyMode: true });
      h.loadSource(url);
      h.attachMedia(video);
      hls = h;
    });
    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [url, kind, started]);

  if (!url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-900 text-white/60">
        {poster ? <img src={poster} alt="" className="h-full w-full rounded-2xl object-cover opacity-60" /> : "Siaran belum tersedia"}
      </div>
    );
  }

  if (!started) {
    return (
      <button onClick={() => setStarted(true)} className="skeleton-dark group relative block aspect-video w-full overflow-hidden rounded-2xl" aria-label={`Putar ${title}`}>
        {poster && <img src={poster} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />}
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl ring-8 ring-white/20 transition group-hover:scale-110">
          <Play className="ml-1 h-9 w-9 fill-white" />
        </span>
        <span className="absolute bottom-4 left-5 right-5 text-left font-semibold text-white">{title}</span>
      </button>
    );
  }

  const frame = "aspect-video w-full overflow-hidden rounded-2xl bg-black";

  if (kind === "youtube") {
    return (
      <div className={frame}>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId(url)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (kind === "embed") {
    return (
      <div className={frame}>
        <iframe className="h-full w-full" src={url} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  return (
    <div className={frame}>
      <video ref={videoRef} className="h-full w-full" controls autoPlay playsInline poster={poster} src={kind === "file" ? url : undefined} />
    </div>
  );
}
