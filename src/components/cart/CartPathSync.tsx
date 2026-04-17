"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRaffleCart } from "@/contexts/RaffleCartContext";

/** Limpa o carrinho ao sair de rotas /rifa/* (ex.: home). */
export function CartPathSync() {
  const pathname = usePathname();
  const { clearRaffle } = useRaffleCart();

  useEffect(() => {
    if (!pathname?.startsWith("/rifa")) {
      clearRaffle();
    }
  }, [pathname, clearRaffle]);

  return null;
}
