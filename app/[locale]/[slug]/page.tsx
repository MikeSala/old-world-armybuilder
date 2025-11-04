import { notFound } from "next/navigation";

import CategoryBuckets from "@/components/builder/CategoryBucket";
import RosterBuilderClient from "@/components/builder/RosterBuilderClient";
import RosterSummary from "@/components/builder/RosterSummary";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import {
  getDictionary,
  locales,
  defaultLocale,
  type Locale,
} from "@/lib/i18n/dictionaries";

const editSlugByLocale = locales.reduce<Record<Locale, string>>(
  (acc, locale) => {
    acc[locale] = getDictionary(locale).editSlug;
    return acc;
  },
  {} as Record<Locale, string>
);

type PageProps = {
  params: Promise<Record<string, unknown>>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    slug: editSlugByLocale[locale],
  }));
}

export default async function RosterEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams?.locale;
  const rawSlug = resolvedParams?.slug;

  const locale: Locale =
    typeof rawLocale === "string" && locales.includes(rawLocale as Locale)
      ? (rawLocale as Locale)
      : defaultLocale;
  const slug =
    typeof rawSlug === "string"
      ? rawSlug
      : Array.isArray(rawSlug)
      ? String(rawSlug[0] ?? "")
      : "";

  if (editSlugByLocale[locale] !== slug) {
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
      <ScrollToTopButton className="self-center" label={dictionary.editMoveToTopLabel} />
    </section>
  );
}
