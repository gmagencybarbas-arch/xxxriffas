import type { Winner } from "@/lib/types";

type Props = { winners: Winner[] };

function Row({ items }: { items: Winner[] }) {
  return (
    <>
      {items.map((w, i) => (
        <div
          key={`${w.id}-${i}`}
          className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-900">{w.name}</span>
          <span className="text-slate-400">·</span>
          <span>{w.prize}</span>
          <span className="text-slate-400">{w.city}</span>
        </div>
      ))}
    </>
  );
}

export function WinnersTicker({ winners }: Props) {
  const doubled = [...winners, ...winners];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100/80 py-2.5">
      <div className="flex w-max ticker-track gap-3 pl-3">
        <Row items={doubled} />
      </div>
    </div>
  );
}
