type Props = { count: number };

export function SocialProof({ count }: Props) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-900">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>
        <strong className="font-semibold text-emerald-950">{count} pessoas</strong>{" "}
        compraram recentemente
      </span>
    </div>
  );
}
