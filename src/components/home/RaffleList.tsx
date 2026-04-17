import { RaffleCard } from "./RaffleCard";
import type { Raffle } from "@/lib/types";

type Props = { raffles: Raffle[]; excludeSlug?: string };

export function RaffleList({ raffles, excludeSlug }: Props) {
  const list = excludeSlug
    ? raffles.filter((r) => r.slug !== excludeSlug)
    : raffles;
  return (
    <section aria-labelledby="list-heading" className="pt-1">
      <h2
        id="list-heading"
        className="mb-3 px-1 text-sm font-semibold text-slate-900"
      >
        Todas as rifas
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {list.map((r) => (
          <RaffleCard key={r.id} raffle={r} />
        ))}
      </div>
    </section>
  );
}
