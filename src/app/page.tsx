import { FeaturedRaffle } from "@/components/home/FeaturedRaffle";
import { HeroBanner } from "@/components/home/HeroBanner";
import { RaffleList } from "@/components/home/RaffleList";
import { StoriesBar } from "@/components/home/StoriesBar";
import { WinnersTicker } from "@/components/home/WinnersTicker";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { getFeatured, winners } from "@/lib/data";
import { getHeroCarouselRaffles, heroIntroConfig } from "@/lib/hero";
import { isRaffleFinished } from "@/lib/raffleStatus";
import { fetchRaffles } from "@/lib/supabase";

export default async function HomePage() {
  const raffles = await fetchRaffles();
  const featured = getFeatured() ?? raffles[0];
  const heroFavorites = getHeroCarouselRaffles().filter((r) => !isRaffleFinished(r));
  const liveRaffles = raffles.filter((r) => !isRaffleFinished(r));

  return (
    <>
      <main className="flex flex-col gap-8 px-5 py-6 sm:py-7">
        <HeroBanner
          intro={heroIntroConfig}
          featuredRaffle={featured ?? null}
          featuredHref={`/rifa/${featured?.slug ?? "tiguan-2024-0km"}`}
          favoriteRaffles={heroFavorites}
        />
        <div id="ganhadores">
          <p className="mb-2.5 px-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            Ganhadores recentes
          </p>
          <WinnersTicker winners={winners} />
        </div>
        {liveRaffles.length > 0 ? (
          <StoriesBar raffles={liveRaffles} />
        ) : null}
        {featured && <FeaturedRaffle raffle={featured} />}
        <div id="sorteios">
          <RaffleList raffles={raffles} excludeSlug={featured?.slug} />
        </div>
      </main>
      {featured && !isRaffleFinished(featured) ? (
        <FloatingCTA href={`/rifa/${featured.slug}/checkout?pkg=p2`} />
      ) : null}
    </>
  );
}
