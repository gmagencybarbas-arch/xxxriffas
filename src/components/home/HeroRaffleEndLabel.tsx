"use client";

import { useEffect, useState } from "react";

type Props = { endsAt: string };

function formatEndDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HeroRaffleEndLabel({ endsAt }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const end = new Date(endsAt).getTime();
  const diff = end - now;

  let text: string;
  if (diff <= 0) {
    text = "Sorteio encerrado";
  } else {
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const datePart = formatEndDate(endsAt);

    if (d >= 14) {
      text = `Data do sorteio: ${datePart}`;
    } else if (d >= 1) {
      text = `Faltam ${d} dia${d > 1 ? "s" : ""} · ${datePart}`;
    } else if (h >= 1) {
      text = `Faltam ${h}h ${m.toString().padStart(2, "0")}min · ${datePart}`;
    } else if (m >= 1) {
      text = `Faltam ${m} min · ${datePart}`;
    } else {
      text = `Encerra em segundos · ${datePart}`;
    }
  }

  return (
    <p className="text-[11px] font-medium leading-snug tracking-wide text-rose-900/55 sm:text-xs">
      {text}
    </p>
  );
}
