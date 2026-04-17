"use client";

import { CheckCircle2, Flag, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Raffle } from "@/lib/types";
import { formatWinnerDisplayName } from "@/lib/winnerDisplay";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

type Props = {
  raffle: Raffle;
  /** Na home mostra o título com bandeira; na página da rifa costuma ser `false` (status já no topo). */
  showSectionHeading?: boolean;
};

export function FinishedCampaignCard({
  raffle,
  showSectionHeading = true,
}: Props) {
  const result = raffle.result;
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!result) return null;

  const displayName = formatWinnerDisplayName(result.winnerFullName);
  const video = isVideoUrl(result.mediaUrl);
  const extras = result.luckyNumbers ?? [];

  return (
    <section
      aria-labelledby={
        showSectionHeading ? `finished-${raffle.slug}-heading` : undefined
      }
      aria-label={showSectionHeading ? undefined : "Resultado do sorteio"}
      className="pt-1"
    >
      {showSectionHeading ? (
        <div className="mb-3 flex items-center gap-2 px-1">
          <Flag
            className="h-4 w-4 shrink-0 text-slate-800"
            strokeWidth={2}
            aria-hidden
          />
          <h2
            id={`finished-${raffle.slug}-heading`}
            className="text-sm font-semibold text-slate-900"
          >
            Campanha finalizada
          </h2>
        </div>
      ) : null}

      {/* Destaque: encerrada + resultado oficial */}
      <div className="mb-4 overflow-hidden rounded-2xl border border-red-700/25 bg-gradient-to-br from-red-700 via-red-800 to-rose-950 px-4 py-4 text-white shadow-lg shadow-red-900/20 sm:px-5 sm:py-5">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <CheckCircle2 className="h-6 w-6 text-white" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-tight tracking-tight sm:text-xl">
              Campanha encerrada — ganhador já definido
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-red-100/95 sm:text-sm">
              O sorteio foi realizado e o resultado oficial está publicado. Abaixo
              você confere o <strong className="text-white">ganhador principal</strong>{" "}
              e as demais{" "}
              <strong className="text-white">cotas da sorte</strong> contempladas
              nesta campanha.
            </p>
          </div>
        </div>
      </div>

      <h3 className="mb-3 px-0.5 font-display text-base font-bold text-slate-900">
        Ganhador principal
      </h3>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative mx-auto w-full max-w-[min(100%,240px)] shrink-0 overflow-hidden rounded-xl bg-slate-200 outline-none ring-slate-900/10 transition focus-visible:ring-2 sm:mx-0 sm:max-w-[180px] sm:min-w-[160px]"
            aria-label="Expandir mídia do ganhador"
          >
            {/* AVIF e arquivos locais: <img> evita falhas do otimizador do next/image */}
            <div className="relative aspect-[3/4] w-full">
              {video ? (
                <video
                  src={result.mediaUrl}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={result.mediaUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/55 py-2 text-xs font-medium text-white backdrop-blur-[2px]">
                <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                Expandir
              </div>
            </div>
          </button>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 text-left">
            <p className="font-display text-lg font-bold leading-snug text-slate-900">
              {displayName}
              {result.winnerState ? (
                <>
                  <span className="mx-1.5 font-normal text-slate-300">|</span>
                  <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 align-middle text-sm font-bold tabular-nums text-emerald-900">
                    {result.winnerState}
                  </span>
                </>
              ) : null}
            </p>
            <p className="text-[15px] leading-relaxed text-slate-700">
              <span className="font-normal">Cota da sorte: </span>
              <span className="font-bold tabular-nums text-slate-900">
                {result.ticketNumber}
              </span>
            </p>
            <p className="text-[15px] leading-relaxed text-slate-700">
              <span className="font-normal">Prêmio: </span>
              <span className="font-bold text-slate-900">
                {result.prizeLabel}
              </span>
            </p>
            <p className="text-xs text-slate-500">{raffle.title}</p>
          </div>
        </div>
      </div>

      {extras.length > 0 ? (
        <div className="mt-6">
          <h3 className="mb-1.5 px-0.5 text-sm font-semibold text-slate-600">
            Números da sorte
          </h3>
          <p className="mb-3 px-0.5 text-[11px] leading-relaxed text-slate-500">
            Demais cotas contempladas nesta campanha, conforme definido pela
            organização do sorteio.
          </p>
          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/50">
            {extras.map((row) => (
              <li
                key={`${row.ticketNumber}-${row.prizeLabel}`}
                className="px-4 py-3 sm:py-2.5"
              >
                <p className="font-mono text-xl font-bold tabular-nums tracking-tight text-emerald-950 sm:text-lg">
                  {row.ticketNumber}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">
                  <span className="font-medium text-slate-600">
                    {row.prizeLabel}
                  </span>
                  <span className="mx-1.5 text-slate-300" aria-hidden>
                    ·
                  </span>
                  <span>{formatWinnerDisplayName(row.winnerFullName)}</span>
                  <span className="mx-1.5 text-slate-300" aria-hidden>
                    |
                  </span>
                  <span className="font-medium tabular-nums text-slate-600">
                    {row.state}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[min(90dvh,900px)] w-full max-w-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mídia do ganhador"
            onClick={(e) => e.stopPropagation()}
          >
            {video ? (
              <video
                src={result.mediaUrl}
                className="max-h-[min(90dvh,900px)] w-full rounded-lg object-contain"
                controls
                playsInline
                autoPlay
              />
            ) : (
              <img
                src={result.mediaUrl}
                alt="Ganhador"
                className="mx-auto max-h-[min(90dvh,880px)] w-full max-w-3xl object-contain"
              />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
