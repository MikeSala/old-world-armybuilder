import type { Metadata } from "next";

import "./globals.css";

import ClientProviders from "@/components/ClientProviders";
import { MarginLayout } from "@/components/layout/MarginLayout";
import { Locale, defaultLocale, locales } from "@/lib/i18n/dictionaries";

import Footer from "./footer";
import Header from "./header-server";

export const metadata: Metadata = {
  title: "Warhammer Army Builder",
  description: "Narzędzie do tworzenia rozpiski armii Warhammer.",
};

type RootLayoutProps = {
  params?: Promise<{
    locale?: string;
  }>;
  children: React.ReactNode;
};

export default async function RootLayout({ params, children }: RootLayoutProps) {
  const resolvedParams = params ? await params : undefined;
  const localeParam = resolvedParams?.locale;
  const locale =
    typeof localeParam === "string" && locales.includes(localeParam as Locale)
      ? (localeParam as Locale)
      : defaultLocale;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-slate-600 text-amber-300">
        <ClientProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-20">
              <MarginLayout>{children}</MarginLayout>
            </main>
            <Footer />
          </div>
        </ClientProviders>
        <div id="print-root" />
      </body>
    </html>
  );
}
