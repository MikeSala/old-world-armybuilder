import type { Metadata } from "next";

import "./globals.css";

import ClientProviders from "@/components/ClientProviders";
import { Header } from "@/components/layout/Header";
import { MarginLayout } from "@/components/layout/MarginLayout";
import { Locale, defaultLocale, locales } from "@/lib/i18n/dictionaries";

import Footer from "./footer";

export const metadata: Metadata = {
  title: "Warhammer Army Builder",
  description: "Narzędzie do tworzenia rozpiski armii Warhammer.",
};

type RootLayoutProps = {
  params: Promise<Record<string, unknown>>;
  children: React.ReactNode;
};

export default async function RootLayout({ params, children }: RootLayoutProps) {
  const resolvedParams = await params;
  const localeParam = resolvedParams?.locale;
  const locale = typeof localeParam === "string" && locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-slate-600 text-amber-300">
        <ClientProviders>
          <Header />
          <main className="pt-20">
            <MarginLayout>{children}</MarginLayout>
            <Footer />
          </main>
        </ClientProviders>
        <div id="print-root" />
      </body>
    </html>
  );
}
