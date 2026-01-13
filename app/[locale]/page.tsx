import type { Metadata } from "next";
import { ScrollText, Sword } from "lucide-react";

import { MarginLayout } from "@/components/layout/MarginLayout";
import { Button } from "@/components/ui/Button";
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
      <MarginLayout>
        <form action={`/${locale}/${dictionary.editSlug}`}>
          <Button
            className="mb-20"
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<ScrollText className="h-5 w-5" />}
            rightIcon={<Sword className="h-5 w-5" />}
          >
            {dictionary.rosterButton}
          </Button>
        </form>
        <UnitSearch dict={dictionary} className="w-full max-w-4xl text-left" />
      </MarginLayout>
    </main>
  );
}
