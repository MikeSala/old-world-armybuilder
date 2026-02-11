import type { Metadata } from "next";

import { ABOUT_SLUG, getAboutContent } from "@/lib/data/about";
import { getDictionary, locales, defaultLocale, type Locale } from "@/lib/i18n/dictionaries";
import { buildLocaleUrl } from "@/lib/i18n/paths";

const SITE_URL = "https://army-builder.com";

const aboutAlternates = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = buildLocaleUrl(SITE_URL, locale, `/${ABOUT_SLUG}/`);
    return acc;
  },
  {} as Record<Locale, string>
);

export function generateMetadata(): Metadata {
  const dictionary = getDictionary(defaultLocale);
  return {
    title: dictionary.aboutTitle,
    description: dictionary.aboutDescription,
    alternates: {
      canonical: aboutAlternates[defaultLocale],
      languages: aboutAlternates,
    },
  };
}

export default function AboutPage() {
  const dictionary = getDictionary(defaultLocale);
  const paragraphs = getAboutContent(defaultLocale);

  return (
    <section className="py-section-y text-stone-100">
      <div className="about-text-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.aboutTitle}</h1>
          <figure className="about-inline-image">
            <img
              src="/images/about-hero.webp"
              alt="Warrior overlooking the Old World"
              className="about-inline-image__img"
            />
          </figure>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-100/85">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
