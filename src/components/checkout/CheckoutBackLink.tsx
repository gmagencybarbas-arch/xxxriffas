"use client";

import Link from "next/link";
import {
  EVENT_TRIGGER_EXIT_PROMO,
  LS_EXIT_PROMO_ACCEPTED,
  SS_EXIT_PROMO_OFFERED,
} from "@/lib/exitPromo";
import { siteConfig } from "@/lib/siteConfig";

type Props = {
  slug: string;
  className?: string;
  children: React.ReactNode;
};

export function CheckoutBackLink({ slug, className, children }: Props) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!siteConfig.exitPromo.enabled) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(LS_EXIT_PROMO_ACCEPTED)) return;
    if (sessionStorage.getItem(SS_EXIT_PROMO_OFFERED)) return;
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent(EVENT_TRIGGER_EXIT_PROMO, {
        detail: { afterDismiss: "back-to-raffle" },
      }),
    );
  };

  return (
    <Link href={`/rifa/${slug}`} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
