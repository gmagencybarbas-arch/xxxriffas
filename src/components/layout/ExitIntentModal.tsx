"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRaffleCart } from "@/contexts/RaffleCartContext";
import { FEATURED_RAFFLE_SLUG, getFeatured } from "@/lib/data";
import { siteConfig } from "@/lib/siteConfig";
import {
  EVENT_OPEN_CART,
  EVENT_TRIGGER_EXIT_PROMO,
  LS_EXIT_PROMO_ACCEPTED,
  SS_EXIT_PROMO_OFFERED,
  type ExitPromoAfterDismiss,
} from "@/lib/exitPromo";

function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ExitCountdown({ initialSeconds }: { initialSeconds: number }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((x) => Math.max(0, x - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [initialSeconds]);

  return (
    <span className="font-mono text-base font-bold text-slate-900">
      {formatCountdown(secondsLeft)}
    </span>
  );
}

function isExitPromoPath(pathname: string | null) {
  if (!pathname) return false;
  return (
    /^\/rifa\/[^/]+$/.test(pathname) ||
    /^\/rifa\/[^/]+\/checkout$/.test(pathname)
  );
}

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const onExitPromoPage = isExitPromoPath(pathname);
  const afterDismissRef = useRef<ExitPromoAfterDismiss>("home");
  const exitEnabled = siteConfig.exitPromo.enabled;
  const bonusExtra = siteConfig.exitPromo.bonusTickets;
  const modalSeconds = siteConfig.exitPromo.modalOfferSeconds;

  const {
    raffle,
    totalTickets,
    totalPriceCents,
    bonusTickets,
    tierBonusTickets,
    packageBonusTickets,
    popularPackageId,
  } = useRaffleCart();

  const checkoutHref = useMemo(() => {
    if (raffle && totalTickets > 0) {
      const pkg = popularPackageId || raffle.packages[0]?.id || "p2";
      const q = Math.max(1, totalTickets);
      const params = new URLSearchParams({
        pkg,
        qty: String(q),
        totalCents: String(totalPriceCents),
        bonus: String(bonusTickets),
        tierBonus: String(tierBonusTickets),
        packBonus: String(packageBonusTickets),
      });
      return `/rifa/${raffle.slug}/checkout?${params.toString()}`;
    }
    const featured = getFeatured();
    const min = featured?.minTickets ?? 10;
    const cents = featured ? min * featured.priceCents : 890;
    const params = new URLSearchParams({
      pkg: "p2",
      qty: String(min),
      totalCents: String(cents),
      bonus: "0",
    });
    return `/rifa/${FEATURED_RAFFLE_SLUG}/checkout?${params.toString()}`;
  }, [
    raffle,
    totalTickets,
    totalPriceCents,
    bonusTickets,
    tierBonusTickets,
    packageBonusTickets,
    popularPackageId,
  ]);

  const openPromo = useCallback((after: ExitPromoAfterDismiss) => {
    if (!exitEnabled) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LS_EXIT_PROMO_ACCEPTED)) return;
    if (sessionStorage.getItem(SS_EXIT_PROMO_OFFERED)) return;
    afterDismissRef.current = after;
    setOpen(true);
    sessionStorage.setItem(SS_EXIT_PROMO_OFFERED, "1");
  }, [exitEnabled]);

  useEffect(() => {
    const onTrigger = (e: Event) => {
      if (!exitEnabled) return;
      if (!isExitPromoPath(window.location.pathname)) return;
      const ce = e as CustomEvent<{ afterDismiss?: ExitPromoAfterDismiss }>;
      const after = ce.detail?.afterDismiss ?? "home";
      openPromo(after);
    };
    window.addEventListener(EVENT_TRIGGER_EXIT_PROMO, onTrigger);
    return () => window.removeEventListener(EVENT_TRIGGER_EXIT_PROMO, onTrigger);
  }, [openPromo, exitEnabled]);

  const accept = useCallback(() => {
    localStorage.setItem(LS_EXIT_PROMO_ACCEPTED, "1");
    setOpen(false);
    router.push(checkoutHref);
  }, [router, checkoutHref]);

  const dismiss = useCallback(() => {
    setOpen(false);
    const next = afterDismissRef.current;
    if (next === "home") {
      router.push("/");
      return;
    }
    if (next === "back-to-raffle") {
      const slug =
        raffle?.slug ??
        pathname?.match(/^\/rifa\/([^/]+)(?:\/checkout)?$/)?.[1];
      if (slug) router.push(`/rifa/${slug}`);
      return;
    }
    if (next === "open-cart") {
      window.dispatchEvent(new CustomEvent(EVENT_OPEN_CART));
    }
  }, [router, raffle, pathname]);

  useEffect(() => {
    if (!onExitPromoPage) setOpen(false);
  }, [onExitPromoPage]);

  if (!exitEnabled) return null;
  if (!open || !onExitPromoPage) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-900/35 p-4 pb-8 backdrop-blur-[3px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-900/10">
        <p
          id="exit-title"
          className="font-display text-xl font-bold text-slate-900"
        >
          Espere! 🎁
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Finalize a compra em até{" "}
          <span className="font-semibold text-slate-800">
            {Math.max(1, Math.round(modalSeconds / 60))} minutos
          </span>{" "}
          para ganhar{" "}
          <span className="font-semibold text-slate-800">
            +{bonusExtra} bilhetes extras
          </span>{" "}
          nesta rifa.
        </p>
        <p className="mt-4 text-center font-display text-2xl font-bold text-green-600 sm:text-3xl">
          +{bonusExtra} bilhetes
        </p>
        <p className="mt-3 text-center text-sm text-slate-500">
          Tempo para aproveitar:{" "}
          <ExitCountdown initialSeconds={modalSeconds} />
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            className="btn-primary tap-scale rounded-xl py-3.5 text-center text-sm font-bold uppercase tracking-wide"
            onClick={accept}
          >
            Quero aproveitar
          </button>
          <button
            type="button"
            className="tap-scale rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700"
            onClick={dismiss}
          >
            Agora não
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">
          Ao aceitar, você segue para o checkout. O bônus de +{bonusExtra}{" "}
          números vale ao concluir o pagamento dentro do prazo exibido.
        </p>
      </div>
    </div>
  );
}
