"use client";

import { useEffect } from "react";
import type { Raffle } from "@/lib/types";
import { useRaffleCart } from "@/contexts/RaffleCartContext";

type Props = { raffle: Raffle };

export function RaffleCartSync({ raffle }: Props) {
  const { setRaffle } = useRaffleCart();

  useEffect(() => {
    setRaffle(raffle);
  }, [raffle, setRaffle]);

  return null;
}
