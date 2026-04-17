import Image from "next/image";
import Link from "next/link";
import type { Raffle } from "@/lib/types";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type Props = { raffle: Raffle };

export function FeaturedRaffle({ raffle }: Props) {
  return (
    <section aria-labelledby="featured-heading" className="pt-1">
      <h2
        id="featured-heading"
        className="mb-3 px-1 text-sm font-semibold text-slate-900"
      >
        Destaque da casa
      </h2>
      <Link
        href={`/rifa/${raffle.slug}`}
        className="card-glow tap-scale group relative flex overflow-hidden rounded-2xl"
      >
        <div className="relative min-h-[148px] w-[42%] shrink-0 bg-slate-100 sm:w-[38%]">
          <Image
            src={raffle.imageUrl}
            alt={raffle.title}
            fill
            className="object-cover"
            sizes="160px"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_58%,rgb(148_163_184/0.22)_80%,rgb(148_163_184/0.42)_88%,rgb(241_245_249/0.96)_96%,#ffffff_100%)]"
            aria-hidden
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5 p-5">
          <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Em destaque
          </span>
          <h3 className="font-display text-xl font-bold leading-tight text-slate-900">
            {raffle.title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">{raffle.subtitle}</p>
          <p className="pt-1 text-sm font-semibold text-emerald-700">
            A partir de {formatMoney(raffle.priceCents)}
          </p>
        </div>
      </Link>
    </section>
  );
}
