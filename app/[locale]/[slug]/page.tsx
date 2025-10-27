import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAlternateLocale,
  getDictionary,
  locales,
  type Locale,
} from "../../../lib/i18n/dictionaries";

import { ARMIES } from "../../../lib/data/armies/armies";
import RosterEditClient from "../../../components/builder/RosterEditClient";

const editSlugByLocale = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = getDictionary(locale).editSlug;
    return acc;
  },
  {} as Record<Locale, string>
);

type PageProps = {
  params: {
    locale: Locale;
    slug: string;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    slug: editSlugByLocale[locale],
  }));
}

const clientArmies = ARMIES.map((a) => ({
  id: a.id,
  label: a.name,
  children: (a.compositions ?? []).map((c) => ({ id: c.id, label: c.name })),
}));

export default function RosterEditPage({ params }: PageProps) {
  const { locale, slug } = params;

  if (!locales.includes(locale) || editSlugByLocale[locale] !== slug) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const alternateLocale = getAlternateLocale(locale);
  const alternateDictionary = getDictionary(alternateLocale);
  const alternateHref = `/${alternateLocale}/${alternateDictionary.editSlug}`;

  return (
    <section className="flex min-h-[calc(100vh-48px)] flex-col gap-6">
      <header className="space-y-2 text-amber-100">
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.editTitle}
        </h1>
        <p className="text-amber-200/80">{dictionary.editDescription}</p>
      </header>
      <RosterEditClient armies={clientArmies} />
      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
        <span>{dictionary.localeName}</span>
        <span className="h-3 w-px bg-amber-600" />
        <Link
          href={alternateHref}
          className="text-amber-200 transition hover:text-amber-100"
        >
          {alternateDictionary.localeName}
        </Link>
      </div>
      <Link
        href={`/${locale}`}
        className="text-sm text-amber-300 underline decoration-dotted underline-offset-4 transition hover:text-amber-200"
      >
        {dictionary.editBackLabel}
      </Link>
    </section>
  );
}
