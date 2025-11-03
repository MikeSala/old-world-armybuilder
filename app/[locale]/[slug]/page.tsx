import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, locales, type Locale } from "../../../lib/i18n/dictionaries";

import RosterBuilderClient from "@/components/builder/RosterBuilderClient";
import CategoryBuckets from "@/components/builder/CategoryBucket";
import RosterSummary from "@/components/builder/RosterSummary";

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

export default function RosterEditPage({ params }: PageProps) {
  const { locale, slug } = params;

  if (!locales.includes(locale) || editSlugByLocale[locale] !== slug) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <section className="flex min-h-[calc(100vh-48px)] flex-col gap-6">
      <header className="space-y-2 text-amber-100">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.editTitle}</h1>
        <p className="text-amber-200/80">{dictionary.editDescription}</p>
      </header>
      <RosterBuilderClient dict={dictionary} />
      <CategoryBuckets dict={dictionary} />
      <RosterSummary dict={dictionary} />
      <Link
        href={`/${locale}`}
        className="text-sm text-amber-300 underline decoration-dotted underline-offset-4 transition hover:text-amber-200"
      >
        {dictionary.editBackLabel}
      </Link>
    </section>
  );
}
