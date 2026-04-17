export type PackageBadgeKind = "discount" | "bonus" | "popular";

export type RafflePackage = {
  id: string;
  label: string;
  tickets: number;
  priceCents: number;
  /** Preço “de” para exibir riscado (opcional). */
  oldPriceCents?: number;
  highlight?: "popular" | "high-roller" | "best-value";
  /** Tipo de selo (ícone Lucide). */
  badgeKind?: PackageBadgeKind;
  /** Texto curto do selo, ex.: "20% OFF", "+10 grátis", "Mais popular". */
  badgeText?: string;
  mostPopular?: boolean;
  /** Bilhetes bônus extras por unidade deste pacote (ex.: High roller +10). */
  extraBonusPerPack?: number;
};

/** Uma cota contemplada além do ganhador principal (definido pelo admin). */
export type RaffleLuckyNumberRow = {
  ticketNumber: string;
  /** Ex.: "R$100", "PS5", "R$1500". */
  prizeLabel: string;
  /** Nome completo — exibido com censura no sobrenome. */
  winnerFullName: string;
  /** UF visível (ex.: SP). */
  state: string;
};

export type RaffleResult = {
  /** Nome completo (exibe com sobrenome censurado). */
  winnerFullName: string;
  ticketNumber: string;
  prizeLabel: string;
  /** Foto ou vídeo servido em /public/midia-rifas. */
  mediaUrl: string;
  /** UF do ganhador principal (ex.: SP). */
  winnerState?: string;
  /** Outras cotas / prêmios secundários. */
  luckyNumbers?: RaffleLuckyNumberRow[];
};

export type Raffle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  /** Texto longo para a seção “Sobre este sorteio”. */
  description: string;
  /** Preço unitário de um bilhete (centavos). */
  priceCents: number;
  /** Mínimo de cotas/bilhetes na barra (definido no painel). */
  minTickets: number;
  imageUrl: string;
  imageBlur?: string;
  endsAt: string;
  /** `finished`: campanha encerrada; omitido ou `live` = ativa. */
  status?: "live" | "finished";
  /** Preenchido quando `status === "finished"` para exibir o card do ganhador. */
  result?: RaffleResult;
  featured?: boolean;
  prizeNumbers: number[];
  surpriseExtra: number;
  packages: RafflePackage[];
  storyThumb: string;
  storySlides: string[];
  recentBuyers: number;
};

export type Winner = {
  id: string;
  name: string;
  prize: string;
  city: string;
};
