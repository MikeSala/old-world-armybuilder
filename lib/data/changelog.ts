import type { Locale } from "@/lib/i18n/dictionaries";

export const CHANGELOG_SLUG = "changelog";

type Localized<T> = Partial<Record<Locale, T>> & { en: T; pl: T };

export type ChangelogEntry = {
  date: string;
  title: Localized<string>;
  description?: Localized<string>;
  items?: Localized<string[]>;
};

export type ResolvedChangelogEntry = {
  date: string;
  title: string;
  description?: string;
  items?: string[];
};

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-01-22",
    title: {
      pl: "Nowości w projekcie",
      en: "Project updates",
    },
    description: {
      pl: "Krótki zestaw zmian wdrożonych w ostatniej wersji.",
      en: "A short summary of the latest improvements.",
    },
    items: {
      pl: [
        "Dodano stronę „Ostatnie zmiany”.",
        "Poprawiono wyświetlanie współczynników w wyszukiwarce jednostek.",
        "Dodano szybkie zgłaszanie błędów z poziomu stopki.",
        "Dodano stronę „O mnie” z grafiką i nowym układem tekstu.",
        "Dodano rozbudowany opis na stronie głównej (PL/EN/DE/FR/ES).",
      ],
      en: [
        "Added the “Latest changes” page.",
        "Fixed unit stat display in the unit search feature.",
        "Added a quick bug-report flow in the footer.",
        "Added the “About” page with artwork and refreshed text layout.",
        "Added an extended description block on the landing page (PL/EN/DE/FR/ES).",
      ],
    },
  },
];

const fallbackLocale: Locale = "en";

const resolveLocalized = <T,>(value: Localized<T> | undefined, locale: Locale): T | undefined =>
  value ? (value[locale] ?? value[fallbackLocale]) : undefined;

export const getChangelogEntries = (locale: Locale): ResolvedChangelogEntry[] =>
  CHANGELOG.slice()
    .sort((a, b) => {
      const aTime = new Date(`${a.date}T00:00:00Z`).getTime();
      const bTime = new Date(`${b.date}T00:00:00Z`).getTime();
      return bTime - aTime;
    })
    .map((entry) => ({
      date: entry.date,
      title: resolveLocalized(entry.title, locale) ?? entry.title[fallbackLocale],
      description: resolveLocalized(entry.description, locale),
      items: resolveLocalized(entry.items, locale),
    }));
