"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Raffle, RafflePackage } from "@/lib/types";
import { siteConfig } from "@/lib/siteConfig";

type Step = "form" | "pix" | "status";

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CheckoutUrgencyBar({ active }: { active: boolean }) {
  const start: number = siteConfig.checkout.urgencySeconds;
  const [left, setLeft] = useState<number>(start);

  useEffect(() => {
    if (!active) return;
    setLeft(start);
  }, [active, start]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setLeft((x) => Math.max(0, x - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  if (!active) return null;

  return (
    <div className="sticky top-0 z-20 -mx-5 mb-5 border-b border-red-200/90 bg-gradient-to-b from-red-50 via-red-50/95 to-white px-4 py-3 text-center shadow-[0_4px_14px_rgba(185,28,28,0.08)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700/90">
        Tempo para finalizar
      </p>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-red-700">
        {formatClock(left)}
      </p>
      <p className="mt-1 text-xs font-medium leading-snug text-red-800/85">
        Conclua o pagamento antes que o tempo esgote — seu carrinho pode ser
        liberado.
      </p>
    </div>
  );
}

type Props = {
  raffle: Raffle;
  pkg: RafflePackage;
  /** Quantidade vinda da barra fixa (números). */
  qty?: number;
  /** Total em centavos (carrinho / barra). */
  totalCents?: number;
  /** Bônus total (faixas + pacotes). */
  bonusTickets?: number;
};

export function CheckoutClient({
  raffle,
  pkg,
  qty,
  totalCents,
  bonusTickets,
}: Props) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const unitCents = useMemo(
    () => Math.max(1, raffle.priceCents),
    [raffle.priceCents],
  );

  const amountCents = useMemo(() => {
    if (totalCents != null && totalCents > 0 && Number.isFinite(totalCents)) {
      return Math.round(totalCents);
    }
    if (qty != null && qty > 0 && Number.isFinite(qty)) {
      return qty * unitCents;
    }
    return pkg.priceCents;
  }, [qty, unitCents, pkg.priceCents, totalCents]);

  const brCode = useMemo(() => {
    const valor = (amountCents / 100).toFixed(2);
    return `00020126580014br.gov.bcb.pix0136${raffle.id}${pkg.id}520400005303986540${valor}5802BR5925XXX RIFFAS6009SAO PAULO62070503***6304ABCD`;
  }, [raffle.id, pkg.id, amountCents]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(brCode)}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 8 || cpf.length < 11) return;
    setStep("pix");
  };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(brCode);
    } catch {
      /* noop */
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  const hasQty =
    (qty != null && qty > 0 && Number.isFinite(qty)) ||
    (totalCents != null && totalCents > 0 && Number.isFinite(totalCents));

  const showUrgency = step === "form" || step === "pix";

  return (
    <div className="mx-auto max-w-md px-5 py-6">
      <CheckoutUrgencyBar active={showUrgency} />

      <div className="mb-8 rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-white to-emerald-50/30 p-5 shadow-[0_2px_20px_rgba(5,150,105,0.07)]">
        <p className="text-xs font-medium text-slate-500">{raffle.title}</p>
        <p className="font-display mt-1 text-lg text-slate-900">{pkg.label}</p>
        {hasQty ? (
          <>
            {qty != null && qty > 0 ? (
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{qty}</span>{" "}
                números
              </p>
            ) : null}
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-700/90">
              Total estimado
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-emerald-600 sm:text-4xl">
              {formatMoney(amountCents)}
            </p>
            {bonusTickets != null && bonusTickets > 0 ? (
              <p className="mt-3 text-sm font-bold text-emerald-700">
                +{bonusTickets} bilhetes bônus nesta compra
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-700/90">
              Total
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-emerald-600 sm:text-4xl">
              {formatMoney(pkg.priceCents)}
            </p>
          </>
        )}
      </div>

      {step === "form" && (
        <form onSubmit={submit} className="flex flex-col gap-5">
          <label className="block">
            <span className="text-xs font-medium text-slate-600">
              Nome completo
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">WhatsApp</span>
            <input
              required
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="(11) 99999-9999"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">CPF</span>
            <input
              required
              inputMode="numeric"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className={inputClass}
              placeholder="000.000.000-00"
            />
          </label>
          <button
            type="submit"
            className="btn-primary tap-scale mt-1 rounded-xl py-3.5 text-sm font-semibold"
          >
            Gerar PIX
          </button>
        </form>
      )}

      {step === "pix" && (
        <div className="flex flex-col items-center gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Image
              src={qrUrl}
              alt="QR Code PIX"
              width={220}
              height={220}
              className="h-[220px] w-[220px]"
              unoptimized
            />
          </div>
          <p className="text-center text-xs leading-relaxed text-slate-600">
            Escaneie ou copie o código PIX. O pagamento é confirmado em segundos.
          </p>
          <button
            type="button"
            onClick={copyPix}
            className="btn-primary tap-scale w-full rounded-xl py-3.5 text-sm font-semibold"
          >
            Copiar código PIX
          </button>
          <button
            type="button"
            onClick={() => setStep("status")}
            className="text-xs font-medium text-slate-500 underline underline-offset-2"
          >
            Já paguei
          </button>
        </div>
      )}

      {step === "status" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-display text-lg text-slate-900">
            Pagamento em análise
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Assim que o PIX for confirmado, seus números aparecem no painel e no
            e-mail.
          </p>
          <p className="mt-5 rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2 font-mono text-[10px] text-slate-500">
            status: pending · webhook Supabase (mock)
          </p>
        </div>
      )}
    </div>
  );
}
