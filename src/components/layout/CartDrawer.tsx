"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useMemo } from "react";
import { useRaffleCart } from "@/contexts/RaffleCartContext";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: Props) {
  const {
    raffle,
    packageQty,
    incPackage,
    decPackage,
    totalTickets,
    totalPriceCents,
    bonusTickets,
    tierBonusTickets,
    packageBonusTickets,
    stepperTickets,
    popularPackageId,
  } = useRaffleCart();

  const checkoutHref = useMemo(() => {
    if (!raffle) return "/";
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
    raffle,
    popularPackageId,
    totalTickets,
    totalPriceCents,
    bonusTickets,
    tierBonusTickets,
    packageBonusTickets,
  ]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        aria-label="Fechar carrinho"
        onClick={onClose}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-[min(92vw,380px)] flex-col border-l border-slate-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="flex items-center gap-2 font-display text-lg text-slate-900">
            <ShoppingBag className="h-5 w-5 text-slate-700" aria-hidden />
            Carrinho
          </span>
          <button
            type="button"
            onClick={onClose}
            className="tap-scale rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!raffle ? (
            <p className="text-sm text-slate-600">
              Nenhum sorteio selecionado. Abra uma rifa para montar seu carrinho.
            </p>
          ) : (
            <div className="space-y-4">
              {raffle.packages.map((p) => {
                const q = packageQty[p.id] ?? 0;
                if (q === 0) return null;
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-gray-200 bg-slate-50/80 p-3"
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {p.label}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-600">
                        {p.tickets * q} bilhetes · {formatMoney(p.priceCents * q)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decPackage(p.id)}
                          className="tap-scale flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white"
                          aria-label="Menos"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">
                          {q}
                        </span>
                        <button
                          type="button"
                          onClick={() => incPackage(p.id)}
                          className="tap-scale flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white"
                          aria-label="Mais"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Números (barra inferior)</p>
                <p className="mt-1 tabular-nums">
                  {stepperTickets} números extras · ajuste com +/− na página da rifa
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/90 p-4">
          <div className="mb-3 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Total de bilhetes</span>
              <span className="font-semibold tabular-nums text-slate-900">
                {totalTickets}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Bônus</span>
              <span className="font-bold text-green-600">+{bonusTickets}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
              <span>Total</span>
              <span className="tabular-nums text-yellow-600">
                {formatMoney(totalPriceCents)}
              </span>
            </div>
          </div>
          <Link
            href={checkoutHref}
            onClick={onClose}
            className="btn-primary tap-scale flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold uppercase tracking-wide"
          >
            Finalizar compra
          </Link>
        </div>
      </aside>
    </div>
  );
}
