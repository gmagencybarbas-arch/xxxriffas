import type { Raffle } from "./types";
import { raffles } from "./data";

/** Textos do 1º slide do hero (editáveis no admin no futuro). */
export const heroIntroConfig = {
  headline: "Rifas ao vivo. Prêmios reais. PIX na hora.",
  body: "Sorteios transparentes, pagamento instantâneo e experiência leve no celular.",
  ctaLabel: "Ver rifa em destaque",
} as const;

/** Slugs das rifas exibidas no carrossel após o slide intro (favoritas no painel). */
export const HERO_CAROUSEL_SLUGS = [
  "rifa-do-safadao",
  "iphone-16-pro-max",
] as const;

export function getHeroCarouselRaffles(): Raffle[] {
  return HERO_CAROUSEL_SLUGS.map((slug) => raffles.find((r) => r.slug === slug)).filter(
    (r): r is Raffle => r != null,
  );
}
