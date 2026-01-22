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

      {dictionary.landingSeoTitle ? (
        <section className="py-section-y">
          <MarginLayout>
            <div className="rounded-3xl border border-amber-300/20 bg-slate-900/70 p-6 text-amber-100 shadow-lg shadow-slate-950/40 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight">
                {dictionary.landingSeoTitle}
              </h2>
              <p className="mt-2 text-sm text-amber-200/70">{dictionary.landingSeoLabel}</p>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-amber-100/85">
                <p>{dictionary.landingSeoIntro}</p>
                <p>{dictionary.landingSeoLore}</p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-amber-100/85">
                <h3 className="text-base font-semibold text-amber-100">
                  {dictionary.landingSeoPrimaryFactionsTitle}
                </h3>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {dictionary.landingSeoPrimaryFactions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 text-sm text-amber-100/85">
                <h3 className="text-base font-semibold text-amber-100">
                  {dictionary.landingSeoLegacyFactionsTitle}
                </h3>
                <p>{dictionary.landingSeoLegacyFactions}</p>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-amber-100/85">
                <p>{dictionary.landingSeoSearchNote}</p>
                <p>{dictionary.landingSeoSupportNote}</p>
              </div>
            </div>
          </MarginLayout>
        </section>
      ) : null}
    </main>
  );
}
