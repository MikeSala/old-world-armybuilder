import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ABOUT_SLUG, getAboutContent } from "@/lib/data/about";
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

const aboutAlternates = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = buildLocaleUrl(SITE_URL, locale, `/${ABOUT_SLUG}/`);
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
    title: dictionary.aboutTitle,
    description: dictionary.aboutDescription,
    alternates: {
      canonical: aboutAlternates[locale],
      languages: aboutAlternates,
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale =
    typeof localeParam === "string" && isLocale(localeParam)
      ? (localeParam as Locale)
      : null;
  if (!locale || locale === defaultLocale) {
    notFound();
  }
  const dictionary = getDictionary(locale);
  const paragraphs = getAboutContent(locale);

  return (
    <section className="py-section-y">
      <div className="about-text-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-stone-100">{dictionary.aboutTitle}</h1>
          <figure className="about-inline-image">
            <img
              src="/images/about-hero.webp"
              alt="Warrior overlooking the Old World"
              className="about-inline-image__img"
            />
          </figure>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-700 dark:text-stone-100/85">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
