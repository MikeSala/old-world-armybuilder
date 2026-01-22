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

const landingAlternates = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = `${SITE_URL}/${locale}/`;
    return acc;
  },
  {} as Record<Locale, string>
);

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale =
    typeof localeParam === "string" && locales.includes(localeParam as Locale)
      ? (localeParam as Locale)
      : defaultLocale;
  const dictionary = getDictionary(locale);
  return {
    title: dictionary.landingTitle,
    description: dictionary.landingDescription,
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
      {/* Faction Grid Section */}
      <section className="mb-10 py-section-y">
        <MarginLayout>
          <h2 className="mb-4 text-center text-heading-section font-bold uppercase tracking-wider text-amber-200 sm:mb-5">
            {dictionary.landingFactionHeading}
          </h2>
          <FactionGrid locale={locale} editSlug={dictionary.editSlug} />
        </MarginLayout>
      </section>

      {/* Unit Search Section */}
      <section className=" bg-slate-600">
        <MarginLayout>
          <UnitSearch dict={dictionary} className="w-full text-left" />
        </MarginLayout>
      </section>
    </main>
  );
}
