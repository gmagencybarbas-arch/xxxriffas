"use client";

import { Gift, Star, Tag } from "lucide-react";
import type { Raffle, RafflePackage } from "@/lib/types";
import { useRaffleCart } from "@/contexts/RaffleCartContext";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function BadgeIcon({ pkg }: { pkg: RafflePackage }) {
  const kind =
    pkg.badgeKind ?? (pkg.mostPopular ? "popular" : undefined);
  const text =
    pkg.badgeText ?? (pkg.mostPopular ? "Mais popular" : "");
  if (!kind && !text) return null;

  const base =
    "absolute right-2 top-2 z-[2] flex max-w-[62%] items-center gap-1 rounded-lg border-2 px-2.5 py-1 text-[11px] font-black uppercase leading-tight tracking-wide shadow-lg sm:right-3 sm:top-3 sm:max-w-none sm:text-xs";

  if (kind === "discount") {
    return (
      <span
        className={`${base} border-orange-400/80 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 shadow-amber-500/30`}
      >
        <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {text}
      </span>
    );
  }
  if (kind === "bonus") {
    return (
      <span
        className={`${base} border-fuchsia-400/70 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-fuchsia-500/35`}
      >
        <Gift className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {text}
      </span>
    );
  }
  return (
    <span
      className={`${base} border-emerald-400/90 bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-emerald-600/35`}
    >
      <Star className="h-3.5 w-3.5 shrink-0 fill-amber-200 text-amber-100" aria-hidden />
      {text}
    </span>
  );
}

type Props = { raffle: Raffle };

export function PurchasePackages({ raffle }: Props) {
  const { packageQty, incPackage, decPackage } = useRaffleCart();

  return (
    <section id="pacotes" className="scroll-mt-24">
      <h3 className="mb-1 text-base font-semibold text-slate-900">Pacotes</h3>
      <p className="mb-4 text-sm text-slate-500">
        Toque em + para adicionar ao carrinho. O total sincroniza com a barra
        inferior.
      </p>
      <div className="flex flex-col gap-4">
        {raffle.packages.map((p) => {
          const isPopular = Boolean(p.mostPopular);
          const qty = packageQty[p.id] ?? 0;
          return (
            <div
              key={p.id}
              className={`relative rounded-xl border border-gray-200 bg-white p-4 transition-shadow duration-300 ${
                isPopular
                  ? "z-[1] shadow-sm ring-1 ring-emerald-100/70"
                  : "shadow-sm shadow-slate-900/[0.04]"
              }`}
            >
              <BadgeIcon pkg={p} />
              <div className="pr-2 pt-1 min-h-[4.5rem] sm:pr-[40%]">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {p.label}
                </p>
                <p className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                  {p.tickets} {p.tickets === 1 ? "BILHETE" : "BILHETES"}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-3">
                <div>
                  {p.oldPriceCents != null && p.oldPriceCents > p.priceCents ? (
                    <p className="text-sm text-gray-400 line-through">
                      {formatMoney(p.oldPriceCents)}
                    </p>
                  ) : null}
                  <p className="text-xl font-bold tabular-nums text-black sm:text-2xl">
                    {formatMoney(p.priceCents)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">via PIX</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decPackage(p.id)}
                    className="tap-scale flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    aria-label="Remover um pacote"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums text-slate-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => incPackage(p.id)}
                    className="tap-scale flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    aria-label="Adicionar um pacote"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
