import type { Metadata } from "next";

import { LandingPageContent } from "@/components/home/LandingPageContent";
import { getDictionary, locales, defaultLocale, type Locale } from "@/lib/i18n/dictionaries";
import { buildLocaleUrl } from "@/lib/i18n/paths";

const SITE_URL = "https://army-builder.com";

const landingAlternates = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = buildLocaleUrl(SITE_URL, locale, "/");
    return acc;
  },
  {} as Record<Locale, string>
);

export function generateMetadata(): Metadata {
  const dictionary = getDictionary(defaultLocale);
  return {
    title: dictionary.landingTitle,
    description: dictionary.landingDescription,
    alternates: {
      canonical: landingAlternates[defaultLocale],
      languages: landingAlternates,
    },
  };
}

export default function HomePage() {
  const dictionary = getDictionary(defaultLocale);

  return <LandingPageContent dict={dictionary} locale={defaultLocale} />;
}
