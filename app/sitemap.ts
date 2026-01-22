import type { MetadataRoute } from "next";

import { ABOUT_SLUG } from "@/lib/data/about";
import { CHANGELOG_SLUG } from "@/lib/data/changelog";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";

export const dynamic = "force-static";

const SITE_URL = "https://army-builder.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const editSlugByLocale = locales.reduce<Record<Locale, string>>((acc, locale) => {
    acc[locale] = getDictionary(locale).editSlug;
    return acc;
  }, {} as Record<Locale, string>);

  const urls: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}/`,
      lastModified,
    },
    {
      url: `${SITE_URL}/${locale}/${editSlugByLocale[locale]}/`,
      lastModified,
    },
    {
      url: `${SITE_URL}/${locale}/${CHANGELOG_SLUG}/`,
      lastModified,
    },
    {
      url: `${SITE_URL}/${locale}/${ABOUT_SLUG}/`,
      lastModified,
    },
  ]);

  return urls;
}
