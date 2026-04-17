"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Props = {
  slides: string[];
  title: string;
  onClose: () => void;
};

const SLIDE_MS = 6000;
const SWIPE_PX = 56;

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

function isInstagramUrl(url: string) {
  return /instagram\.com\/(p|reel|tv)\//i.test(url);
}

function toInstagramEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return `https://${u.host}${path}/embed`;
  } catch {
    return url;
  }
}

function usePrefetchNextMedia(slides: string[], idx: number) {
  useEffect(() => {
    const next = slides[idx + 1];
    if (!next) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = next;
    document.head.appendChild(link);
    return () => {
      link.parentNode?.removeChild(link);
    };
  }, [slides, idx]);
}

function StoryImageContain({
  src,
  unoptimized,
}: {
  src: string;
  unoptimized: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={src}
          alt=""
          fill
          className="scale-125 object-cover opacity-70 blur-3xl"
          sizes="100vw"
          priority
          unoptimized={unoptimized}
        />
      </div>
      <div className="relative z-[1] flex h-full w-full items-center justify-center p-1">
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 384px"
            priority
            fetchPriority="high"
            unoptimized={unoptimized}
          />
        </div>
      </div>
    </div>
  );
}

export function StoriesViewer({ slides, title, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const safe = slides.length ? slides : [];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dragStartX = useRef<number | null>(null);
  const activePointerId = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);

  usePrefetchNextMedia(safe, idx);

  const current = safe[idx] ?? "";

  const kind = useMemo(() => {
    if (!current) return "empty" as const;
    if (isInstagramUrl(current)) return "instagram" as const;
    if (isVideoUrl(current)) return "video" as const;
    return "image" as const;
  }, [current]);

  const imgUnoptimized = useMemo(
    () =>
      current.startsWith("http") && !current.includes("unsplash.com"),
    [current],
  );

  const goPrev = useCallback(() => {
    setIdx((i) => (i > 0 ? i - 1 : i));
  }, []);

  const goNextOrClose = useCallback(() => {
    setIdx((i) => {
      if (i >= safe.length - 1) {
        queueMicrotask(() => onClose());
        return i;
      }
      return i + 1;
    });
  }, [safe.length, onClose]);

  const goNextFromVideoEnd = useCallback(() => {
    setIdx((i) => {
      if (i >= safe.length - 1) {
        queueMicrotask(() => onClose());
        return i;
      }
      return i + 1;
    });
  }, [safe.length, onClose]);

  useEffect(() => {
    if (!safe.length) return;
    if (kind === "video" || kind === "instagram") return;
    if (idx >= safe.length - 1) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i >= safe.length - 1 ? i : i + 1));
    }, SLIDE_MS);
    return () => window.clearInterval(t);
  }, [kind, safe.length, idx]);

  useEffect(() => {
    if (kind !== "video" || !videoRef.current) return;
    const el = videoRef.current;
    el.currentTime = 0;
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [kind, idx]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    activePointerId.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragX(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (activePointerId.current !== e.pointerId || dragStartX.current === null)
      return;
    setDragX(e.clientX - dragStartX.current);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (activePointerId.current !== e.pointerId) return;
    const start = dragStartX.current;
    dragStartX.current = null;
    activePointerId.current = null;
    setDragX(0);
    if (start === null) return;
    const dx = e.clientX - start;
    if (dx < -SWIPE_PX) {
      goNextOrClose();
    } else if (dx > SWIPE_PX) {
      goPrev();
    }
  };

  if (!safe.length) return null;

  const slideTransform =
    dragX !== 0 ? `translateX(${dragX * 0.22}px)` : undefined;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/75 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Stories do sorteio"
    >
      <div
        className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="truncate text-sm font-medium text-white/95">{title}</p>
        <button
          type="button"
          onClick={onClose}
          className="tap-scale rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25"
        >
          Fechar
        </button>
      </div>
      <div
        className="flex shrink-0 justify-center gap-1.5 px-3 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        {safe.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-6 max-w-[2rem] rounded-full transition-all duration-300 ${
              i === idx ? "bg-white/90" : "bg-white/25"
            }`}
          />
        ))}
      </div>

      <div
        role="presentation"
        className="relative mt-4 flex min-h-0 flex-1 cursor-default items-center justify-center px-3 pb-10"
        onClick={goNextOrClose}
      >
        <div
          role="presentation"
          className="relative z-10 aspect-[9/16] w-full max-w-sm select-none overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/40 transition-[transform] duration-200 ease-out [touch-action:none]"
          style={{ transform: slideTransform }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            key={idx}
            className="relative h-full w-full story-slide-enter"
          >
            <div className="absolute inset-0 z-[5] flex">
              <button
                type="button"
                className="h-full w-[28%] min-w-0 cursor-w-resize border-0 bg-transparent p-0"
                aria-label="Slide anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              />
              <span
                className="pointer-events-none h-full min-w-0 flex-1"
                aria-hidden
              />
              <button
                type="button"
                className="h-full w-[28%] min-w-0 cursor-e-resize border-0 bg-transparent p-0"
                aria-label="Próximo slide"
                onClick={(e) => {
                  e.stopPropagation();
                  goNextOrClose();
                }}
              />
            </div>

            <div className="relative z-[1] h-full w-full">
              {kind === "instagram" ? (
                <iframe
                  title="Instagram"
                  src={toInstagramEmbedUrl(current)}
                  className="relative z-[1] h-full w-full border-0"
                  allow="encrypted-media; clipboard-write; autoplay"
                />
              ) : kind === "video" ? (
                <div className="relative h-full w-full bg-black">
                  <video
                    ref={videoRef}
                    src={current}
                    className="relative z-[1] h-full w-full object-cover"
                    playsInline
                    controls
                    preload="auto"
                    onEnded={goNextFromVideoEnd}
                  />
                </div>
              ) : (
                <StoryImageContain
                  src={current}
                  unoptimized={imgUnoptimized}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
