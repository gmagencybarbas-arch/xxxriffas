"use client";

import { X } from "lucide-react";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/#sorteios", label: "Sorteios" },
  { href: "/#ganhadores", label: "Ganhadores" },
  { href: "/meus-numeros", label: "Meus números" },
  { href: "/suporte", label: "Suporte" },
] as const;

export function MenuDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        aria-label="Fechar menu"
        onClick={onClose}
      />
      <aside
        className="absolute left-0 top-0 flex h-full w-[min(88vw,320px)] flex-col border-r border-slate-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="font-display text-lg text-slate-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="tap-scale rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="tap-scale rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
