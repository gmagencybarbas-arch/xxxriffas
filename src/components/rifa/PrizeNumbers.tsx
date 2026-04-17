import { Gift } from "lucide-react";
import type { Raffle } from "@/lib/types";

type Props = { raffle: Raffle };

export function PrizeNumbers({ raffle }: Props) {
  const visible = raffle.prizeNumbers.slice(0, 5);
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-slate-900/5">
      <h3 className="mb-1 text-base font-semibold text-slate-900">
        Números da sorte
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        Alguns exemplos de números disponíveis neste sorteio.
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {visible.map((n) => (
          <span
            key={n}
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-yellow-400/80 bg-gradient-to-b from-yellow-50 to-amber-50 px-2 py-2.5 text-center font-mono text-base font-semibold text-slate-900 tabular-nums shadow-sm"
          >
            {n}
          </span>
        ))}
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-yellow-200/90 bg-yellow-50/90 px-4 py-3 text-center text-sm font-medium text-slate-800">
        <Gift className="h-4 w-4 shrink-0 text-yellow-600" aria-hidden />
        +{raffle.surpriseExtra} prêmios surpresa
      </p>
    </section>
  );
}
