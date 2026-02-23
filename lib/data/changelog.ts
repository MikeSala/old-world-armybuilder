import type { Locale } from "@/lib/i18n/dictionaries";

export const CHANGELOG_SLUG = "changelog";

type Localized<T> = Partial<Record<Locale, T>> & { en: T };

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
    date: "2026-02-23",
    title: { en: "Army builder UX improvements" },
    description: { en: "A set of visual and ergonomic fixes in the army builder and supporting pages." },
    items: {
      en: [
        "Add unit (+) button moved into the category card header — next to the title and point counter.",
        "Unit selection and unit configuration columns now each take 50% of the screen width.",
        "Removed the word \"currently\" from category point summaries; reduced the counter font size.",
        "Cancel button in the configurator replaced with a red circle-slash icon.",
        "\"Add unit\" shortened to \"Add\"; \"Move to top\" shortened to \"Back to top\".",
        "Remove, Show details, and Download roster buttons — unified to the stone grey style.",
        "Report a bug modal — adjusted colours, simplified button layout, cancel changed to an icon.",
        "/about and /changelog pages adapted to light and dark mode.",
      ],
    },
  },
  {
    date: "2026-02-22",
    title: {
      pl: "Odświeżenie interfejsu",
      en: "UI refresh",
    },
    description: {
      pl: "Zestaw usprawnień wizualnych na stronie głównej, w nagłówku i stopce.",
      en: "A set of visual improvements across the landing page, header and footer.",
    },
    items: {
      pl: [
        "Wybór frakcji przebudowany na poziome scrollowalne \"pills\" – dwa rzędy: frakcje oficjalnie wspierane i frakcje legacy.",
        "Przełącznik języka zastąpiony płaskimi flagami krajów z podświetleniem indygo.",
        "Przełącznik dark/light mode przeprojektowany jako suwak; domyślnie włączony tryb jasny.",
        "Buttony w stopce (O mnie, Ostatnie zmiany, Zgłoś błąd) wzbogacone o ikony i wyraźniejsze tło.",
        "Poprawiono wyświetlanie buttonów w trybie jasnym (counter-filter dla flag, togglea i stopki).",
        "Usunięto efekty hover z logo.",
        "Usunięto automatyczne przekierowanie na /pl/.",
      ],
      en: [
        "Faction selector rebuilt as horizontal scrollable pills – two rows: officially supported and legacy factions.",
        "Locale switcher replaced with flat country flags with indigo glow.",
        "Dark/light mode toggle redesigned as a pill slider; light mode is now the default.",
        "Footer buttons (About, Latest changes, Report a bug) enhanced with icons and a distinct background.",
        "Fixed button rendering in light mode (counter-filter for flags, toggle and footer).",
        "Removed hover effects from the logo.",
        "Removed automatic redirect to /pl/.",
      ],
    },
  },
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
