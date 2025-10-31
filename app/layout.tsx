import type { Metadata } from "next";

import "./globals.css";
import { MarginLayout } from "../components/layout/MarginLayout";
import ClientProviders from "@/components/ClientProviders";
import { Header } from "@/components/layout/Header";
import { Locale } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Warhammer Army Builder",
  description: "Narzędzie do tworzenia rozpiski armii Warhammer.",
};

export default async function RootLayout({
  params,
  children,
}: {
  params: { locale: Locale; slug?: string[] };
  children: React.ReactNode;
}) {
  const restSegments: string[] = params.slug ?? [];
  return (
    <html lang={params.locale}>
      <body className="bg-slate-600 text-amber-300">
        <ClientProviders>
          <Header locale={params.locale} restSegments={restSegments} />
          <main className="pt-20">
            <MarginLayout>{children}</MarginLayout>
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
