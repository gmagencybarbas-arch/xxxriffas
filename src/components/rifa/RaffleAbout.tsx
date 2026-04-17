import type { Raffle } from "@/lib/types";

type Props = { raffle: Raffle };

export function RaffleAbout({ raffle }: Props) {
  return (
    <section
      id="sobre"
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-slate-900/5"
    >
      <h2 className="mb-3 text-base font-semibold text-slate-900">
        Sobre este sorteio
      </h2>
      <p className="text-[15px] leading-relaxed text-slate-600">
        {raffle.description}
      </p>
    </section>
  );
}
