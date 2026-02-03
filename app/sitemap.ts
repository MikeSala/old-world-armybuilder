import type { MetadataRoute } from "next";

import { ABOUT_SLUG } from "@/lib/data/about";
import { CHANGELOG_SLUG } from "@/lib/data/changelog";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";
import { buildLocaleUrl, buildLocaleUrlWithPrefix } from "@/lib/i18n/paths";

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
      url: buildLocaleUrl(SITE_URL, locale, "/"),
      lastModified,
    },
    {
      url: buildLocaleUrl(SITE_URL, locale, `/${editSlugByLocale[locale]}/`),
      lastModified,
    },
    {
      url: buildLocaleUrl(SITE_URL, locale, `/${ABOUT_SLUG}/`),
      lastModified,
    },
  ]);

  urls.push({
    url: buildLocaleUrlWithPrefix(SITE_URL, "en" as Locale, `/${CHANGELOG_SLUG}/`),
    lastModified,
  });

  return urls;
}
