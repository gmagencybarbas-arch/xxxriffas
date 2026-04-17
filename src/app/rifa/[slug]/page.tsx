import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CountdownTimer } from "@/components/rifa/CountdownTimer";
import { FinishedCampaignCard } from "@/components/rifa/FinishedCampaignCard";
import { PrizeNumbers } from "@/components/rifa/PrizeNumbers";
import { PurchasePackages } from "@/components/rifa/PurchasePackages";
import { RaffleAbout } from "@/components/rifa/RaffleAbout";
import { RaffleCartSync } from "@/components/rifa/RaffleCartSync";
import { RaffleHeroStories } from "@/components/rifa/RaffleHeroStories";
import { RafflePurchaseBar } from "@/components/rifa/RafflePurchaseBar";
import { SocialProof } from "@/components/rifa/SocialProof";
import { isRaffleFinished } from "@/lib/raffleStatus";
import { fetchRaffleBySlug } from "@/lib/supabase";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const raffle = await fetchRaffleBySlug(slug);
  if (!raffle) return { title: "Rifa" };
  return {
    title: `${raffle.title} · xxxriffas`,
    description: raffle.subtitle,
  };
}

export default async function RifaPage({ params }: Props) {
  const { slug } = await params;
  const raffle = await fetchRaffleBySlug(slug);
  if (!raffle) notFound();

  const finished = isRaffleFinished(raffle);

  return (
    <>
      <RaffleCartSync raffle={raffle} />

      <article className="space-y-7 overflow-x-hidden px-5 pb-[calc(15rem+env(safe-area-inset-bottom))] pt-5 sm:space-y-8 sm:pb-64">
        <Suspense
          fallback={
            <div className="relative aspect-[16/10] w-full animate-pulse rounded-2xl border border-gray-200/90 bg-slate-100" />
          }
        >
          <RaffleHeroStories raffle={raffle} />
        </Suspense>

        <header className="space-y-3">
          {finished ? (
            <span className="inline-block rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              Campanha finalizada
            </span>
          ) : (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700/90">
              Sorteio ao vivo
            </p>
          )}
          <h1 className="font-display text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
            {raffle.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-600">
            {raffle.subtitle}
          </p>
          <div>
            <p className="text-xs font-medium text-slate-500">A partir de</p>
            <p className="font-display text-2xl font-bold tracking-tight text-amber-600/95 sm:text-3xl">
              {formatMoney(raffle.priceCents)}
              <span className="ml-1.5 align-middle text-sm font-normal text-slate-500">
                / bilhete base
              </span>
            </p>
          </div>
        </header>

        {!finished ? (
          <section>
            <h2 className="mb-3 text-base font-semibold text-slate-900">
              Encerra em
            </h2>
            <CountdownTimer endsAt={raffle.endsAt} />
          </section>
        ) : !raffle.result ? (
          <p className="text-sm leading-relaxed text-slate-600">
            Esta campanha foi encerrada e o sorteio já foi realizado.
          </p>
        ) : null}

        {!finished ? <SocialProof count={raffle.recentBuyers} /> : null}

        {finished && raffle.result ? (
          <FinishedCampaignCard raffle={raffle} showSectionHeading={false} />
        ) : !finished ? (
          <PurchasePackages raffle={raffle} />
        ) : null}

        <RaffleAbout raffle={raffle} />

        <PrizeNumbers raffle={raffle} />
      </article>

      {!finished ? <RafflePurchaseBar raffle={raffle} /> : null}
    </>
  );
}
