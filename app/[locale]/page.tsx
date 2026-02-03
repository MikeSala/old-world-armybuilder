import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPageContent } from "@/components/home/LandingPageContent";
import {
  getDictionary,
  locales,
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n/dictionaries";
import { buildLocaleUrl } from "@/lib/i18n/paths";

type PageProps = {
  params: Promise<{
    locale?: string;
  }>;
};

const SITE_URL = "https://army-builder.com";

const landingAlternates = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = buildLocaleUrl(SITE_URL, locale, "/");
    return acc;
  },
  {} as Record<Locale, string>
);

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale =
    typeof localeParam === "string" && isLocale(localeParam)
      ? (localeParam as Locale)
      : null;
  if (!locale || locale === defaultLocale) {
    notFound();
  }
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
    typeof localeParam === "string" && isLocale(localeParam)
      ? (localeParam as Locale)
      : null;
  if (!locale || locale === defaultLocale) {
    notFound();
  }
  const dictionary = getDictionary(locale);

  return <LandingPageContent dict={dictionary} locale={locale} />;
}
