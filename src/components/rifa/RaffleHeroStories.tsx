"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Raffle } from "@/lib/types";
import {
  EVENT_TRIGGER_EXIT_PROMO,
  LS_EXIT_PROMO_ACCEPTED,
  SS_EXIT_PROMO_OFFERED,
} from "@/lib/exitPromo";
import { siteConfig } from "@/lib/siteConfig";
import { StoriesViewer } from "./StoriesViewer";

type Props = { raffle: Raffle };

export function RaffleHeroStories({ raffle }: Props) {
  const [storiesOpen, setStoriesOpen] = useState(false);
  const hasStories = raffle.storySlides.length > 0;
  const searchParams = useSearchParams();
  const router = useRouter();
  const openedFromQuery = useRef(false);

  useEffect(() => {
    if (!hasStories || openedFromQuery.current) return;
    if (searchParams.get("stories") !== "1") return;
    openedFromQuery.current = true;
    setStoriesOpen(true);
    router.replace(`/rifa/${raffle.slug}`, { scroll: false });
  }, [hasStories, searchParams, raffle.slug, router]);

  const onVoltar = () => {
    if (typeof window === "undefined") return;
    if (!siteConfig.exitPromo.enabled) {
      router.push("/");
      return;
    }
    if (
      localStorage.getItem(LS_EXIT_PROMO_ACCEPTED) ||
      sessionStorage.getItem(SS_EXIT_PROMO_OFFERED)
    ) {
      router.push("/");
      return;
    }
    window.dispatchEvent(
      new CustomEvent(EVENT_TRIGGER_EXIT_PROMO, {
        detail: { afterDismiss: "home" },
      }),
    );
  };

  const coverUnoptimized =
    raffle.imageUrl.startsWith("http") &&
    !raffle.imageUrl.includes("unsplash.com");

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={onVoltar}
          className="tap-scale absolute left-3 top-3 z-10 rounded-full border border-white/85 bg-white/95 px-3.5 py-1.5 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-[2px]"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={() => hasStories && setStoriesOpen(true)}
          disabled={!hasStories}
          className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gray-200/90 bg-slate-100 text-left shadow-sm transition-[box-shadow,transform] duration-300 ease-out ${
            hasStories
              ? "cursor-zoom-in hover:shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400/40 active:scale-[0.998]"
              : "cursor-default"
          }`}
          aria-label={hasStories ? "Abrir stories do sorteio" : undefined}
        >
          <Image
            src={raffle.imageUrl}
            alt={raffle.title}
            fill
            className={`object-cover transition-transform duration-500 ease-out ${
              hasStories ? "hover:scale-[1.02]" : ""
            }`}
            sizes="(max-width: 512px) 100vw, 512px"
            priority
            unoptimized={coverUnoptimized}
          />
          {/* Degradê só na base, curto — não cobre a capa toda; leve tom esverdeado */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] max-h-[7.5rem] bg-[linear-gradient(to_top,rgba(245,247,250,0.78)_0%,rgba(236,253,245,0.2)_38%,transparent_100%)] sm:h-[22%]"
            aria-hidden
          />
          {hasStories ? (
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-900/30 px-3 py-1.5 text-[11px] font-medium text-white/95 backdrop-blur-sm">
              Toque para ver stories
            </span>
          ) : null}
        </button>
      </div>

      {storiesOpen && hasStories ? (
        <StoriesViewer
          slides={raffle.storySlides}
          title={raffle.title}
          onClose={() => setStoriesOpen(false)}
        />
      ) : null}
    </>
  );
}
