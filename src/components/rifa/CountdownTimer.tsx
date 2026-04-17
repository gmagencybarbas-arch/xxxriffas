"use client";

import { memo, useEffect, useState } from "react";

type Props = { endsAt: string };

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function CountdownTimerInner({ endsAt }: Props) {
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, end - now);
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  const cells = [
    { label: "dias", value: pad(d) },
    { label: "hrs", value: pad(h) },
    { label: "min", value: pad(m) },
    { label: "seg", value: pad(sec) },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center shadow-sm"
        >
          <div className="font-mono text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
            {c.value}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export const CountdownTimer = memo(CountdownTimerInner);
