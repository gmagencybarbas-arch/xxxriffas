import Link from "next/link";

export default function SuportePage() {
  return (
    <main className="px-5 py-10 text-center">
      <h1 className="font-display text-2xl text-slate-900">Suporte</h1>
      <p className="mt-3 text-sm text-slate-600">
        Central de ajuda em construção. Para dúvidas urgentes, use o WhatsApp
        informado no comprovante.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-semibold text-emerald-700 underline"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
