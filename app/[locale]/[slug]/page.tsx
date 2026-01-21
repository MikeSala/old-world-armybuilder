import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArmyFromUrlInitializer } from "@/components/builder/ArmyFromUrlInitializer";
import CategoryBuckets from "@/components/builder/CategoryBucket";
import RosterBuilderClient from "@/components/builder/RosterBuilderClient";
import RosterSummary from "@/components/builder/RosterSummary";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import BuyMeCoffeeWidget from "@/components/support/BuyMeCoffeeWidget";
import {
  getDictionary,
  locales,
  defaultLocale,
  type Locale,
} from "@/lib/i18n/dictionaries";

const SITE_URL = "https://army-builder.com";

const editSlugByLocale = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = getDictionary(locale).editSlug;
    return acc;
  },
  {} as Record<Locale, string>
);

type PageProps = {
  params: Promise<{
    locale?: string;
    slug?: string | string[];
  }>;
};

const metaByLocale: Record<Locale, Metadata> = {
  pl: {
    title: "Warhammer Old World - Edycja Armii",
    description:
      "Strona edycji armii Warhammer Old World. Stwórz, zapisz i wydrukuj swoją armię.",
  },
  en: {
    title: "Warhammer Old World - Army Editor",
    description:
      "Warhammer Old World army editor. Create, save, and print your army.",
  },
  de: {
    title: "Warhammer Old World - Armee-Editor",
    description:
      "Armee-Editor für Warhammer Old World. Erstelle, speichere und drucke deine Armee.",
  },
  fr: {
    title: "Warhammer Old World - Éditeur d'armée",
    description:
      "Page d'édition d'armée pour Warhammer Old World. Créez, enregistrez et imprimez votre armée.",
  },
  es: {
    title: "Warhammer Old World - Editor de ejército",
    description:
      "Página de edición de ejército de Warhammer Old World. Crea, guarda e imprime tu ejército.",
  },
};

const editorAlternates = locales.reduce<Record<Locale, string>>((acc, locale) => {
  acc[locale] = `${SITE_URL}/${locale}/${editSlugByLocale[locale]}/`;
  return acc;
}, {} as Record<Locale, string>);

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    slug: editSlugByLocale[locale],
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale =
    typeof rawLocale === "string" && locales.includes(rawLocale as Locale)
      ? (rawLocale as Locale)
      : defaultLocale;
  return {
    ...metaByLocale[locale],
    alternates: {
      canonical: editorAlternates[locale],
      languages: editorAlternates,
    },
  };
}

export default async function RosterEditPage({ params }: PageProps) {
  const { locale: rawLocale, slug: rawSlug } = await params;

  const locale: Locale =
    typeof rawLocale === "string" && locales.includes(rawLocale as Locale)
      ? (rawLocale as Locale)
      : defaultLocale;
  const slug =
    typeof rawSlug === "string"
      ? rawSlug
      : Array.isArray(rawSlug)
      ? String(rawSlug[0] ?? "")
      : "";

  if (editSlugByLocale[locale] !== slug) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <section className="flex min-h-[calc(100vh-48px)] flex-col gap-6">
      <Suspense fallback={null}>
        <ArmyFromUrlInitializer />
      </Suspense>
      <header className="text-amber-100">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.editTitle}</h1>
      </header>
      <RosterBuilderClient dict={dictionary} />
      <CategoryBuckets dict={dictionary} />
      <div id="summary-print-root" className="w-full">
        <RosterSummary dict={dictionary} />
      </div>
      <BuyMeCoffeeWidget />
      <ScrollToTopButton className="self-center" label={dictionary.editMoveToTopLabel} />
    </section>
  );
}
