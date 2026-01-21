import type { Metadata } from "next";

import { MarginLayout } from "@/components/layout/MarginLayout";
import { FactionGrid } from "@/components/home/FactionGrid";
import UnitSearch from "@/components/unit/UnitSearch";
import { getDictionary, locales, defaultLocale, type Locale } from "@/lib/i18n/dictionaries";

type PageProps = {
  params: Promise<{
    locale?: string;
  }>;
};

const SITE_URL = "https://army-builder.com";

const metaByLocale: Record<Locale, Metadata> = {
  pl: {
    title: "Warhammer Old World - Wyszukiwarka i Kreator Armii",
    description:
      "Wygodny sposób na wyszukanie statystyk jednostek i stworzenie armii do gry w Warhammer Old World",
  },
  en: {
    title: "Warhammer Old World - Unit Search and Army Builder",
    description:
      "An easy way to find unit stats and build an army for Warhammer Old World",
  },
  de: {
    title: "Warhammer Old World - Einheitensuche und Armee-Builder",
    description:
      "Ein bequemer Weg, Einheitenwerte zu finden und eine Armee für Warhammer Old World zu erstellen",
  },
  fr: {
    title: "Warhammer Old World - Recherche d'unités et créateur d'armée",
    description:
      "Un moyen pratique de trouver les statistiques des unités et de créer une armée pour Warhammer Old World",
  },
  es: {
    title: "Warhammer Old World - Buscador de unidades y creador de ejército",
    description:
      "Una forma cómoda de buscar estadísticas de unidades y crear un ejército para Warhammer Old World",
  },
};

const landingAlternates = locales.reduce<Record<Locale, string>>((acc, locale) => {
  acc[locale] = `${SITE_URL}/${locale}/`;
  return acc;
}, {} as Record<Locale, string>);

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale =
    typeof localeParam === "string" && locales.includes(localeParam as Locale)
      ? (localeParam as Locale)
      : defaultLocale;
  return {
    ...metaByLocale[locale],
    alternates: {
      canonical: landingAlternates[locale],
      languages: landingAlternates,
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale =
    typeof localeParam === "string" && locales.includes(localeParam as Locale)
      ? (localeParam as Locale)
      : defaultLocale;
  const dictionary = getDictionary(locale);

  return (
    <main>
      {/* Unit Search Section */}
      <section className="bg-slate-700">
        <MarginLayout>
          <UnitSearch dict={dictionary} className="w-full text-left" />
        </MarginLayout>
      </section>

      {/* Faction Grid Section */}
      <section className="bg-slate-600 py-6 sm:py-8">
        <MarginLayout>
          <h2 className="mb-4 text-center text-lg font-bold uppercase tracking-wider text-amber-200 sm:mb-5 sm:text-xl">
            {locale === "pl"
              ? "Wybierz frakcję"
              : locale === "de"
                ? "Wähle deine Fraktion"
                : locale === "fr"
                  ? "Choisissez votre faction"
                  : locale === "es"
                    ? "Elige tu facción"
                    : "Choose your faction"}
          </h2>
          <FactionGrid locale={locale} editSlug={dictionary.editSlug} />
        </MarginLayout>
      </section>
    </main>
  );
}
