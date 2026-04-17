"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Raffle } from "@/lib/types";
import { isRaffleFinished } from "@/lib/raffleStatus";
import { useRaffleCart } from "@/contexts/RaffleCartContext";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const BOOST_AMOUNTS = [20, 50, 250] as const;

type Props = { raffle: Raffle };

export function RafflePurchaseBar({ raffle }: Props) {
  const {
    totalTickets,
    totalPriceCents,
    bonusTickets,
    tierBonusTickets,
    packageBonusTickets,
    nextTier,
    incStepper,
    decStepper,
    addStepper,
    popularPackageId,
  } = useRaffleCart();

  const href = useMemo(() => {
    const pkg = popularPackageId || raffle.packages[0]?.id;
    const q = Math.max(1, totalTickets);
    const params = new URLSearchParams({
      pkg,
      qty: String(q),
      totalCents: String(totalPriceCents),
      bonus: String(bonusTickets),
      tierBonus: String(tierBonusTickets),
      packBonus: String(packageBonusTickets),
    });
    return `/rifa/${raffle.slug}/checkout?${params.toString()}`;
  }, [
    raffle.slug,
    popularPackageId,
    totalTickets,
    totalPriceCents,
    bonusTickets,
    tierBonusTickets,
    packageBonusTickets,
    raffle.packages,
  ]);

  const progressMsg = useMemo(() => {
    if (!nextTier) return null;
    return `Faltam ${nextTier.remaining} números para ganhar +${nextTier.nextBonus} bônus`;
  }, [nextTier]);

  if (isRaffleFinished(raffle)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/92 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3.5 shadow-[0_-2px_20px_rgba(15,23,42,0.05)] backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto w-full max-w-lg">
        <p className="mb-2 text-center text-[11px] text-slate-500">
          {formatMoney(raffle.priceCents)} por bilhete
        </p>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={decStepper}
            className="tap-scale flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Diminuir quantidade de bilhetes"
          >
            −
          </button>
          <div className="min-w-0 flex-1 text-center transition-all duration-300 ease-out">
            <p className="text-lg font-bold tabular-nums text-slate-900">
              {totalTickets} números
            </p>
          </div>
          <button
            type="button"
            onClick={incStepper}
            className="tap-scale flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Aumentar quantidade de bilhetes"
          >
            +
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          {BOOST_AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => addStepper(n)}
              className="tap-scale min-w-[4.25rem] rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-3 py-2 text-sm font-bold tabular-nums text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-500/30 transition hover:from-emerald-500 hover:to-emerald-700 active:scale-[0.97]"
            >
              +{n}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-base font-semibold text-slate-900 transition-all duration-300">
          Total:{" "}
          <span className="font-bold tabular-nums text-yellow-600">
            {formatMoney(totalPriceCents)}
          </span>
        </p>
        <p className="mt-1 text-center text-sm font-bold text-green-600 transition-all duration-300">
          (+{bonusTickets} bônus)
        </p>
        {progressMsg ? (
          <p className="mt-2 text-center text-[11px] leading-snug text-slate-500">
            {progressMsg}
          </p>
        ) : (
          <p className="mt-2 text-center text-[11px] text-emerald-700">
            Você já está no maior nível de bônus desta campanha.
          </p>
        )}
        <Link
          href={href}
          className="cta-pulse-subtle tap-scale mt-3 flex w-full items-center justify-center rounded-xl bg-green-500 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-600"
        >
          Garantir bilhetes
        </Link>
      </div>
    </div>
  );
}
