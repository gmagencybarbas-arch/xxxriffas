"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Raffle } from "@/lib/types";
import { HeroRaffleEndLabel } from "@/components/home/HeroRaffleEndLabel";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export type HeroIntro = {
  headline: string;
  body: string;
  ctaLabel: string;
};

type Props = {
  intro: HeroIntro;
  /** Rifa em destaque (mesma da seção “Destaque da casa”) — capa no 1º slide */
  featuredRaffle: Raffle | null;
  featuredHref: string;
  favoriteRaffles: Raffle[];
};

const AUTO_MS = 8000;
const SWIPE_PX = 48;

export function HeroBanner({
  intro,
  featuredRaffle,
  featuredHref,
  favoriteRaffles,
}: Props) {
  const slides = useMemo(
    () =>
      [
        {
          kind: "intro" as const,
          ...intro,
          href: featuredHref,
          featured: featuredRaffle,
        },
        ...favoriteRaffles.map((r) => ({ kind: "raffle" as const, raffle: r })),
      ],
    [intro, featuredHref, featuredRaffle, favoriteRaffles],
  );

  const [idx, setIdx] = useState(0);
  const count = slides.length;
  const wrap = useCallback(
    (n: number) => ((n % count) + count) % count,
    [count],
  );

  const go = useCallback(
    (dir: -1 | 1) => {
      setIdx((i) => wrap(i + dir));
    },
    [wrap],
  );

  useEffect(() => {
    if (count <= 1) return;
    const t = window.setInterval(() => {
      setIdx((i) => wrap(i + 1));
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [count, wrap]);

  const dragX = useRef(0);
  const startX = useRef<number | null>(null);
  const activeId = useRef<number | null>(null);

  const isInteractiveTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    if (!el?.closest) return false;
    return Boolean(el.closest("a, button, [role='button']"));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (isInteractiveTarget(e.target)) return;
    startX.current = e.clientX;
    activeId.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragX.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId || startX.current === null) return;
    dragX.current = e.clientX - startX.current;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return;
    const dx = dragX.current;
    startX.current = null;
    activeId.current = null;
    dragX.current = 0;
    if (dx > SWIPE_PX) go(-1);
    else if (dx < -SWIPE_PX) go(1);
  };

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm ${count > 1 ? "pb-6" : ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08),_transparent_55%)]" />

      <div
        className="relative touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:duration-0"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={
                slide.kind === "intro" ? "hero-intro" : slide.raffle.slug
              }
              className="w-full min-w-full shrink-0 px-5 py-5 sm:px-7 sm:py-10"
            >
              {slide.kind === "intro" ? (
                <div className="hero-gradient relative overflow-hidden rounded-xl border border-slate-200/60">
                  {slide.featured ? (
                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-auto sm:min-h-[180px] sm:w-[42%] sm:max-w-none sm:min-w-0">
                        <Image
                          src={slide.featured.imageUrl}
                          alt={slide.featured.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 200px"
                          priority
                          unoptimized={
                            slide.featured.imageUrl.startsWith("http") &&
                            !slide.featured.imageUrl.includes("unsplash.com")
                          }
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_58%,rgb(148_163_184/0.22)_80%,rgb(148_163_184/0.42)_88%,rgb(241_245_249/0.96)_96%,#ffffff_100%)]"
                          aria-hidden
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-6 sm:px-7 sm:py-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          xxxriffas
                        </p>
                        <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                          {slide.headline}
                        </h1>
                        <p className="max-w-md text-[15px] leading-relaxed text-slate-600">
                          {slide.body}
                        </p>
                        <Link
                          href={slide.href}
                          className="btn-primary tap-scale relative z-20 mt-4 inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold sm:mt-5 sm:w-auto sm:self-start"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {slide.ctaLabel}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 py-8 sm:px-7 sm:py-9">
                      <div className="relative z-10 max-w-xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          xxxriffas
                        </p>
                        <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                          {slide.headline}
                        </h1>
                        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-slate-600 sm:mt-4">
                          {slide.body}
                        </p>
                        <Link
                          href={slide.href}
                          className="btn-primary tap-scale relative z-20 mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold sm:mt-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {slide.ctaLabel}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hero-gradient relative overflow-hidden rounded-xl border border-slate-200/60">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-0">
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-900/90 sm:aspect-auto sm:h-auto sm:w-[42%] sm:min-h-[200px] sm:max-w-none">
                      <Image
                        src={slide.raffle.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 220px"
                        unoptimized={
                          slide.raffle.imageUrl.startsWith("http") &&
                          !slide.raffle.imageUrl.includes("unsplash.com")
                        }
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.45)_0%,transparent_42%,rgba(15,23,42,0.35)_100%)]"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(15,23,42,0.28)_100%)]"
                        aria-hidden
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-6 sm:px-7 sm:py-8">
                      <HeroRaffleEndLabel endsAt={slide.raffle.endsAt} />
                      <h2 className="font-display text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                        {slide.raffle.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {slide.raffle.subtitle}
                      </p>
                      <div className="mt-2 flex w-full flex-col gap-2.5">
                        <Link
                          href={`/rifa/${slide.raffle.slug}`}
                          className="btn-primary tap-scale relative z-20 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Participe
                        </Link>
                        <p className="text-center text-[15px] leading-snug sm:text-left">
                          <span className="font-medium text-slate-500">
                            Valor do bilhete{" "}
                          </span>
                          <span className="font-display text-lg font-bold tabular-nums text-yellow-600">
                            {formatMoney(slide.raffle.priceCents)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <>
          <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? "w-6 bg-emerald-600" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => go(-1)}
            className="tap-scale absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200/90 bg-white/90 p-2 text-slate-700 shadow-sm backdrop-blur-sm sm:left-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={() => go(1)}
            className="tap-scale absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200/90 bg-white/90 p-2 text-slate-700 shadow-sm backdrop-blur-sm sm:right-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
    </section>
  );
}
