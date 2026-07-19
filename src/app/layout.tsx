import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Meu Barbeiro App - Painel de Gestão",
  description: "Sistema de gestão para barbearia",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Meu Barbeiro",
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} font-sans h-full antialiased dark`}
    >
      <body className="flex flex-col h-[100dvh] overflow-hidden bg-background overscroll-none">
        <div className="w-full max-w-md mx-auto relative h-full flex flex-col bg-card/10 shadow-2xl border-x border-white/5">
          <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
