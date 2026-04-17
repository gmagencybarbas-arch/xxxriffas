import Image from "next/image";
import Link from "next/link";
import type { Raffle } from "@/lib/types";

type Props = { raffles: Raffle[] };

export function StoriesBar({ raffles }: Props) {
  return (
    <section aria-label="Stories das rifas" className="pt-1">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-slate-900">Ao vivo</h2>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">
          Toque para abrir
        </span>
      </div>
      <div className="-mx-1 flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {raffles.map((r) => (
          <Link
            key={r.id}
            href={`/rifa/${r.slug}?stories=1`}
            className="tap-scale group flex shrink-0 flex-col items-center gap-2"
          >
            <span className="rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-500 to-teal-500 p-[3px] shadow-sm">
              <span className="block rounded-full bg-white p-[2px]">
                <Image
                  src={r.storyThumb}
                  alt=""
                  width={64}
                  height={64}
                  className="h-14 w-14 rounded-full object-cover"
                  sizes="56px"
                  loading="lazy"
                />
              </span>
            </span>
            <span className="max-w-[72px] truncate text-center text-[10px] text-slate-600 group-hover:text-slate-900">
              {r.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
