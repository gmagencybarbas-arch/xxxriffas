import type { Raffle, Winner } from "./types";
import { mediaFile } from "./media";

const img = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/** Slug da rifa em destaque (fallback checkout / links). */
export const FEATURED_RAFFLE_SLUG = "tiguan-2024-0km";

const tiguanSlides = [
  mediaFile(
    "tiguan",
    "AQOupkdLa3p3xx4ocp3z0D3o1-qWkfqvdICSCNMBU7fdAPWatzMWuGHQRBCgqKOJRXua2FOcf48XdKSJwsG6H1VD3enpBVfalPAeU04.mp4",
  ),
  mediaFile(
    "tiguan",
    "AQP3ihWdY4wBsFsnovWlC1E_Ev59g2D-A1dAiKQxTcd9D4ZYvQzHHL_mXVcUni3WK9xzyZmbFB-142lsxfbyk_tEXEzrilTBBz2RC9E.mp4",
  ),
];

const safadaoSlides = [
  mediaFile(
    "safadao",
    "AQOyW_IJPITHvYJpxdyQRDqUJqS9lNYqy8i-n7T0em2KVh6uEASiydZSGDTUirbp-0a59YP50p2XyGM9taJCGksti4HZPvhxOIoJ6Eg.mp4",
  ),
  mediaFile(
    "safadao",
    "AQP5DqX-MYbxugOWbQEdvazAgiEGDMsbPkdCI9sE8E89TpLRqojTJi74crGwoS8M0X0RpaaB_ZtcAEH0Xlio9ClE6R9bXjny7t-Xdwo.mp4",
  ),
  mediaFile(
    "safadao",
    "Tem gente entrando no link só pra olhar…👀e tem gente entrando pra sair com um iPhone 17 Pro Max.mp4",
  ),
];

const iphoneSlides = [
  mediaFile("iPhone", "Captura de tela 2026-04-16 220549.png"),
  mediaFile("iPhone", "Captura de tela 2026-04-16 220741.png"),
];

const capaTiguan = "/midia-rifas/tiguan/capa_tiguan.jpg";
const capaSafadao =
  "https://fpp-assets.playservicos.com.br/bpp/FIOETEDESORTE/imagem/BANNER-PREMIO--WS-E-NL-1755976384139.webp";

const capaTv65 = mediaFile("tv 65", "capa.webp");
const ganhadorTv65Media = mediaFile(
  "ganhador",
  "tv 65 polegadas - ganhador.avif",
);

export const winners: Winner[] = [
  { id: "1", name: "Marcos ***92", prize: "iPhone 15 Pro", city: "SP" },
  { id: "2", name: "Ana ***41", prize: "PS5 + 2 jogos", city: "RJ" },
  { id: "3", name: "Pedro ***07", prize: "Moto 0km", city: "MG" },
  { id: "4", name: "Julia ***88", prize: "TV 55\"", city: "PR" },
  { id: "5", name: "Lucas ***33", prize: "Notebook", city: "BA" },
  { id: "6", name: "Fernanda ***19", prize: "AirPods", city: "RS" },
];

export const raffles: Raffle[] = [
  {
    id: "1",
    slug: "tiguan-2024-0km",
    title: "Tiguan 2024 0km",
    subtitle: "0km · documentação e entrega assistida",
    description:
      "Sorteio do Volkswagen Tiguan 2024 zero quilômetro. Regras claras, pagamento via PIX e acompanhamento até a retirada do veículo. Os números ficam disponíveis na sua área após a confirmação do pagamento.",
    priceCents: 89,
    minTickets: 10,
    imageUrl: capaTiguan,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    prizeNumbers: [7, 14, 21, 42, 77],
    surpriseExtra: 25,
    storyThumb: capaTiguan,
    storySlides: tiguanSlides,
    recentBuyers: 12,
    packages: [
      {
        id: "p1",
        label: "Entrada",
        tickets: 1,
        priceCents: 89,
        oldPriceCents: 112,
        badgeKind: "discount",
        badgeText: "20% OFF",
      },
      {
        id: "p2",
        label: "Popular",
        tickets: 5,
        priceCents: 355,
        oldPriceCents: 445,
        highlight: "popular",
        mostPopular: true,
        badgeKind: "popular",
        badgeText: "Mais popular",
      },
      {
        id: "p3",
        label: "High roller",
        tickets: 15,
        priceCents: 980,
        oldPriceCents: 1190,
        highlight: "high-roller",
        badgeKind: "bonus",
        badgeText: "+10 grátis",
        extraBonusPerPack: 10,
      },
    ],
  },
  {
    id: "2",
    slug: "rifa-do-safadao",
    title: "Rifa do Safadão",
    subtitle: "Fiote de Sorte · prêmios em dinheiro ou caminhonetes",
    description:
      "Sorteio com prêmios à altura — acompanhe as stories, participe com PIX e fique ligado no sorteio ao vivo. Após a confirmação do pagamento, seus números aparecem na área do cliente.",
    priceCents: 99,
    minTickets: 5,
    imageUrl: capaSafadao,
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    prizeNumbers: [3, 9, 18, 27, 36],
    surpriseExtra: 25,
    storyThumb: capaSafadao,
    storySlides: safadaoSlides,
    recentBuyers: 8,
    packages: [
      {
        id: "p1",
        label: "1 bilhete",
        tickets: 1,
        priceCents: 99,
        oldPriceCents: 119,
        badgeKind: "discount",
        badgeText: "15% OFF",
      },
      {
        id: "p2",
        label: "Pacote ouro",
        tickets: 6,
        priceCents: 549,
        oldPriceCents: 649,
        highlight: "best-value",
        mostPopular: true,
        badgeKind: "popular",
        badgeText: "Mais popular",
      },
      {
        id: "p3",
        label: "High roller",
        tickets: 12,
        priceCents: 1090,
        oldPriceCents: 1290,
        highlight: "high-roller",
        badgeKind: "bonus",
        badgeText: "+10 grátis",
        extraBonusPerPack: 10,
      },
    ],
  },
  {
    id: "3",
    slug: "iphone-16-pro-max",
    title: "iPhone 16 Pro Max",
    subtitle: "Novo · garantia · sorteio ao vivo",
    description:
      "Smartphone Apple lacrado com garantia. Pagamento via PIX, números liberados após confirmação e resultado publicado ao vivo com transparência.",
    priceCents: 499,
    minTickets: 4,
    imageUrl: iphoneSlides[0],
    endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    prizeNumbers: [12, 24, 36, 48, 60],
    surpriseExtra: 25,
    storyThumb: iphoneSlides[0],
    storySlides: iphoneSlides,
    recentBuyers: 15,
    packages: [
      {
        id: "p1",
        label: "Entrada",
        tickets: 1,
        priceCents: 499,
        oldPriceCents: 624,
        badgeKind: "discount",
        badgeText: "20% OFF",
      },
      {
        id: "p2",
        label: "Popular",
        tickets: 5,
        priceCents: 1990,
        oldPriceCents: 2490,
        highlight: "popular",
        mostPopular: true,
        badgeKind: "popular",
        badgeText: "Mais popular",
      },
      {
        id: "p3",
        label: "High roller",
        tickets: 15,
        priceCents: 5490,
        oldPriceCents: 6990,
        highlight: "high-roller",
        badgeKind: "bonus",
        badgeText: "+10 grátis",
        extraBonusPerPack: 10,
      },
    ],
  },
  {
    id: "4",
    slug: "moto-naked-0km",
    title: "Moto 0km",
    subtitle: "Documentação inclusa · IPVA 1 ano",
    description:
      "Prêmio veicular com apoio para documentação e orientação de retirada. O sorteio segue regras claras de participação e comprovação de ganhadores. Bilhetes via PIX; após a confirmação, nossa equipe entra em contato para os próximos passos.",
    priceCents: 799,
    minTickets: 1,
    imageUrl: img("1558981806-9f3518799446"),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    prizeNumbers: [2, 11, 22, 44, 66],
    surpriseExtra: 25,
    storyThumb: img("1558981806-9f3518799446", 200, 200),
    storySlides: [
      img("1558981806-9f3518799446", 1080, 1920),
      img("1568772585407-9361d9bf877a", 1080, 1920),
    ],
    recentBuyers: 24,
    packages: [
      {
        id: "p1",
        label: "1 chance",
        tickets: 1,
        priceCents: 799,
        oldPriceCents: 899,
        badgeKind: "discount",
        badgeText: "10% OFF",
      },
      {
        id: "p2",
        label: "Popular",
        tickets: 4,
        priceCents: 2890,
        oldPriceCents: 3190,
        highlight: "popular",
        mostPopular: true,
        badgeKind: "popular",
        badgeText: "Mais popular",
      },
      {
        id: "p3",
        label: "High roller",
        tickets: 10,
        priceCents: 6990,
        oldPriceCents: 7990,
        highlight: "high-roller",
        badgeKind: "bonus",
        badgeText: "+10 grátis",
        extraBonusPerPack: 10,
      },
    ],
  },
  {
    id: "5",
    slug: "smart-tv-65",
    title: 'Smart TV 65" 4K',
    subtitle: "Dolby Vision · painel 120Hz",
    description:
      "Campanha encerrada. Smart TV nova em caixa, ideal para sala ou home theater. O sorteio foi realizado com transparência; o resultado está publicado nesta página.",
    priceCents: 399,
    minTickets: 1,
    imageUrl: capaTv65,
    status: "finished",
    result: {
      winnerFullName: "Hurben Delabary Severo",
      winnerState: "SP",
      ticketNumber: "08980",
      prizeLabel: "TV de 65 polegadas NOVA na caixa.",
      mediaUrl: ganhadorTv65Media,
      luckyNumbers: [
        {
          ticketNumber: "30219",
          prizeLabel: "R$100",
          winnerFullName: "Mariana Costa Duarte",
          state: "SP",
        },
        {
          ticketNumber: "49141",
          prizeLabel: "R$200",
          winnerFullName: "Rafael Mendes Vieira",
          state: "RJ",
        },
        {
          ticketNumber: "00025",
          prizeLabel: "PS5",
          winnerFullName: "Lucas Ferreira Gomes",
          state: "MG",
        },
        {
          ticketNumber: "20219",
          prizeLabel: "R$1500",
          winnerFullName: "Patrícia Alves Nunes",
          state: "PR",
        },
        {
          ticketNumber: "04920",
          prizeLabel: "R$35",
          winnerFullName: "Diego Santos Rocha",
          state: "BA",
        },
      ],
    },
    endsAt: "2026-04-14T20:00:00.000Z",
    prizeNumbers: [5, 15, 25, 50, 99],
    surpriseExtra: 25,
    storyThumb: capaTv65,
    storySlides: [capaTv65, ganhadorTv65Media],
    recentBuyers: 5,
    packages: [
      {
        id: "p1",
        label: "1 bilhete",
        tickets: 1,
        priceCents: 399,
        oldPriceCents: 459,
        badgeKind: "discount",
        badgeText: "12% OFF",
      },
      {
        id: "p2",
        label: "Combo família",
        tickets: 5,
        priceCents: 1790,
        oldPriceCents: 2090,
        highlight: "popular",
        mostPopular: true,
        badgeKind: "popular",
        badgeText: "Mais popular",
      },
      {
        id: "p3",
        label: "High roller",
        tickets: 20,
        priceCents: 5990,
        oldPriceCents: 6990,
        highlight: "high-roller",
        badgeKind: "bonus",
        badgeText: "+10 grátis",
        extraBonusPerPack: 10,
      },
    ],
  },
];

export function getRaffleBySlug(slug: string): Raffle | undefined {
  return raffles.find((r) => r.slug === slug);
}

export function getFeatured(): Raffle | undefined {
  return raffles.find((r) => r.featured) ?? raffles[0];
}
