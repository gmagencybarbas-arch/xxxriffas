import Link from "next/link";

type Props = {
  href: string;
  label?: string;
};

export function FloatingCTA({ href, label = "Comprar no PIX" }: Props) {
  return (
    <Link
      href={href}
      className="btn-primary tap-scale fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-7 py-3.5 text-sm font-semibold shadow-md shadow-emerald-600/15"
    >
      {label}
    </Link>
  );
}
