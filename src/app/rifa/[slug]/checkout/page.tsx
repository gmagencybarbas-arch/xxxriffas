import { notFound, redirect } from "next/navigation";
import { CheckoutBackLink } from "@/components/checkout/CheckoutBackLink";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { isRaffleFinished } from "@/lib/raffleStatus";
import { fetchRaffleBySlug } from "@/lib/supabase";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    pkg?: string;
    qty?: string;
    totalCents?: string;
    bonus?: string;
  }>;
};

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const {
    pkg: pkgId,
    qty: qtyRaw,
    totalCents: totalRaw,
    bonus: bonusRaw,
  } = await searchParams;
  const raffle = await fetchRaffleBySlug(slug);
  if (!raffle) notFound();
  if (isRaffleFinished(raffle)) redirect(`/rifa/${slug}`);

  const pkg =
    raffle.packages.find((p) => p.id === (pkgId ?? "p2")) ??
    raffle.packages[1] ??
    raffle.packages[0];

  const parsedQty = qtyRaw != null ? parseInt(String(qtyRaw), 10) : NaN;
  const qty =
    Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : undefined;

  const parsedTotal = totalRaw != null ? parseInt(String(totalRaw), 10) : NaN;
  const totalCents =
    Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : undefined;

  const parsedBonus = bonusRaw != null ? parseInt(String(bonusRaw), 10) : NaN;
  const bonusTickets =
    Number.isFinite(parsedBonus) && parsedBonus >= 0 ? parsedBonus : undefined;

  return (
    <div className="pb-10 pt-5">
      <div className="px-5 pb-2">
        <CheckoutBackLink
          slug={slug}
          className="text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          ← Voltar à rifa
        </CheckoutBackLink>
        <h1 className="font-display mt-3 text-2xl text-slate-900">Checkout</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pague com PIX · confirmação rápida
        </p>
      </div>
      <CheckoutClient
        raffle={raffle}
        pkg={pkg}
        qty={qty}
        totalCents={totalCents}
        bonusTickets={bonusTickets}
      />
    </div>
  );
}
