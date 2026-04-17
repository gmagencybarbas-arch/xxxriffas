/** Bônus por faixa de quantidade total de números (ingressos). */
const TIERS_DESC = [
  { min: 200, bonus: 30 },
  { min: 100, bonus: 15 },
  { min: 50, bonus: 5 },
] as const;

export function getBonusTicketsForQuantity(totalTickets: number): number {
  for (const t of TIERS_DESC) {
    if (totalTickets >= t.min) return t.bonus;
  }
  return 0;
}

export type NextTierInfo = {
  remaining: number;
  nextBonus: number;
  nextThreshold: number;
};

/** Próxima meta de bônus (null se já no tier máximo). */
export function getNextTierProgress(
  totalTickets: number,
): NextTierInfo | null {
  if (totalTickets >= 200) return null;
  if (totalTickets >= 100) {
    return {
      remaining: Math.max(0, 200 - totalTickets),
      nextBonus: 30,
      nextThreshold: 200,
    };
  }
  if (totalTickets >= 50) {
    return {
      remaining: Math.max(0, 100 - totalTickets),
      nextBonus: 15,
      nextThreshold: 100,
    };
  }
  return {
    remaining: Math.max(0, 50 - totalTickets),
    nextBonus: 5,
    nextThreshold: 50,
  };
}
