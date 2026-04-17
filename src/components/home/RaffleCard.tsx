import Image from "next/image";
import Link from "next/link";
import type { Raffle } from "@/lib/types";
import { isRaffleFinished } from "@/lib/raffleStatus";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type Props = { raffle: Raffle };

export function RaffleCard({ raffle }: Props) {
  const finished = isRaffleFinished(raffle);
  return (
    <Link
      href={`/rifa/${raffle.slug}`}
      className="card-glow tap-scale group relative flex flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={raffle.imageUrl}
          alt={raffle.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, 200px"
          loading="lazy"
          unoptimized={
            raffle.imageUrl.startsWith("http") &&
            !raffle.imageUrl.includes("unsplash.com")
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />
        <span
          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${
            finished
              ? "bg-red-600 text-white"
              : "bg-white/95 text-emerald-700"
          }`}
        >
          {finished ? "Finalizada" : "Ao vivo"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {raffle.title}
        </h3>
        <p className="line-clamp-1 text-[11px] text-slate-500">{raffle.subtitle}</p>
        <p className="mt-auto pt-2 font-display text-lg font-bold text-slate-900">
          {formatMoney(raffle.priceCents)}
          <span className="text-[10px] font-normal text-slate-500"> / bilhete</span>
        </p>
      </div>
    </Link>
  );
}
