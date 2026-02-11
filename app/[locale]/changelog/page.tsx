import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CHANGELOG_SLUG, getChangelogEntries } from "@/lib/data/changelog";
import { getDictionary, locales, isLocale, type Locale } from "@/lib/i18n/dictionaries";
import { buildLocaleUrlWithPrefix } from "@/lib/i18n/paths";

type PageProps = {
  params: Promise<{
    locale?: string;
  }>;
};

const SITE_URL = "https://army-builder.com";

const changelogUrl = buildLocaleUrlWithPrefix(
  SITE_URL,
  "en" as Locale,
  `/${CHANGELOG_SLUG}/`
);

const changelogAlternates = locales.reduce<Record<Locale, string>>((acc, locale) => {
  acc[locale] = changelogUrl;
  return acc;
}, {} as Record<Locale, string>);

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale =
    typeof localeParam === "string" && isLocale(localeParam)
      ? (localeParam as Locale)
      : null;
  if (locale !== "en") {
    notFound();
  }
  const dictionary = getDictionary(locale);
  return {
    title: dictionary.changelogTitle,
    description: dictionary.changelogDescription,
    alternates: {
      canonical: changelogAlternates[locale],
      languages: changelogAlternates,
    },
  };
}

export default async function ChangelogPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale =
    typeof localeParam === "string" && isLocale(localeParam)
      ? (localeParam as Locale)
      : null;
  if (locale !== "en") {
    notFound();
  }
  const dictionary = getDictionary(locale);
  const entries = getChangelogEntries(locale);

  const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(date);
  };

  return (
    <section className="py-section-y text-stone-100">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.changelogTitle}
        </h1>
        <p className="mt-3 text-sm text-stone-200/70">{dictionary.changelogDescription}</p>
      </div>

      {entries.length ? (
        <div className="mt-8 grid gap-4">
          {entries.map((entry) => (
            <article
              key={`${entry.date}-${entry.title}`}
              className="rounded-2xl border border-stone-300/20 bg-stone-800/70 p-5 shadow-lg shadow-stone-950/40"
            >
              <div className="text-xs uppercase tracking-[0.25em] text-stone-300/60">
                {formatDate(entry.date)}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-stone-100">{entry.title}</h2>
              {entry.description ? (
                <p className="mt-2 text-sm text-stone-200/70">{entry.description}</p>
              ) : null}
              {entry.items?.length ? (
                <ul className="mt-3 space-y-2 text-sm text-stone-200/80">
                  {entry.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-stone-400/80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-stone-200/70">{dictionary.changelogEmpty}</p>
      )}
    </section>
  );
}
