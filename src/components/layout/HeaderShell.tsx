"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { MenuDrawer } from "@/components/layout/MenuDrawer";
import { useRaffleCart } from "@/contexts/RaffleCartContext";
import {
  EVENT_OPEN_CART,
  EVENT_TRIGGER_EXIT_PROMO,
  LS_EXIT_PROMO_ACCEPTED,
  SS_EXIT_PROMO_OFFERED,
} from "@/lib/exitPromo";
import { siteConfig } from "@/lib/siteConfig";

function isRaffleDetailPath(pathname: string | null) {
  if (!pathname) return false;
  return /^\/rifa\/[^/]+$/.test(pathname);
}

function isCheckoutPath(pathname: string | null) {
  if (!pathname) return false;
  return /^\/rifa\/[^/]+\/checkout$/.test(pathname);
}

export function HeaderShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalTickets } = useRaffleCart();
  const pathname = usePathname();
  const onRaffleDetail = isRaffleDetailPath(pathname);
  const onCheckout = isCheckoutPath(pathname);
  const exitPromoOn =
    siteConfig.exitPromo.enabled && (onRaffleDetail || onCheckout);

  useEffect(() => {
    const onOpenCart = () => setCartOpen(true);
    window.addEventListener(EVENT_OPEN_CART, onOpenCart);
    return () => window.removeEventListener(EVENT_OPEN_CART, onOpenCart);
  }, []);

  const onCartClick = () => {
    if (typeof window === "undefined") return;
    const accepted = localStorage.getItem(LS_EXIT_PROMO_ACCEPTED);
    const offered = sessionStorage.getItem(SS_EXIT_PROMO_OFFERED);
    if (
      exitPromoOn &&
      !accepted &&
      !offered
    ) {
      window.dispatchEvent(
        new CustomEvent(EVENT_TRIGGER_EXIT_PROMO, {
          detail: { afterDismiss: "open-cart" },
        }),
      );
      return;
    }
    setCartOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="tap-scale rounded-xl p-2.5 text-slate-800 hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link
            href="/"
            className="font-display text-xl tracking-wide text-slate-900"
          >
            xxx<span className="text-emerald-600">riffas</span>
          </Link>
          <button
            type="button"
            onClick={onCartClick}
            className="tap-scale relative rounded-xl p-2.5 text-slate-800 hover:bg-slate-100"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalTickets > 0 ? (
              <span className="absolute right-1 top-1 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {totalTickets > 99 ? "99+" : totalTickets}
              </span>
            ) : null}
          </button>
        </div>
      </header>
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
