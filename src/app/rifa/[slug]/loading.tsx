import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="px-4 py-4">
      <Skeleton className="mb-5 aspect-[16/10] w-full rounded-2xl" />
      <Skeleton className="mb-2 h-8 w-3/4" />
      <Skeleton className="mb-6 h-4 w-full" />
      <div className="mb-6 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mb-3 h-10 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}
