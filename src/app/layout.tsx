import type { Metadata, Viewport } from "next";
import { DM_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { CartPathSync } from "@/components/cart/CartPathSync";
import { ExitIntentModal } from "@/components/layout/ExitIntentModal";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { RaffleCartProvider } from "@/contexts/RaffleCartContext";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "xxxriffas — Rifas ao vivo",
  description: "Rifas com PIX seguro, sorteios claros e experiência pensada para mobile.",
};

export const viewport: Viewport = {
  themeColor: "#F5F7FA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body
        className="min-h-full font-sans text-slate-800"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <RaffleCartProvider>
          <CartPathSync />
          <HeaderShell />
          <div className="mx-auto min-h-[calc(100vh-52px)] max-w-lg pb-28">
            {children}
          </div>
          <ExitIntentModal />
        </RaffleCartProvider>
      </body>
    </html>
  );
}
