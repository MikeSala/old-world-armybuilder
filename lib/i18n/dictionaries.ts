// 🔹 TS: Strong dictionary typing
type LocaleDictionary = {
  heroTitle: string;
  heroDescription: string;
  rosterButton: string;
  switchLabel: string;
  localeName: string;
  editSlug: string;
  editTitle: string;
  editDescription: string;
  editBackLabel: string;
};

export const locales = ["pl", "en"] as const;
export const defaultLocale = "pl";

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// 🔹 Typed dictionary enforcing keys for each locale
const dictionaries = {
  pl: {
    heroTitle: "Warhammer Army Builder",
    heroDescription:
      "Witaj! Projekt dopiero startuje — w kolejnych krokach dodamy kreator rozpisek i zapis armii. Na razie rozgość się i sprawdź, co planujemy.",
    rosterButton: "Nowa rozpiska",
    switchLabel: "Switch to English version",
    localeName: "PL",
    editSlug: "edycja-rozpiski",
    editTitle: "Edycja rozpiski",
    editDescription:
      "Wkrótce dodamy edytor — na razie to miejsce na Twoją rozpiskę.",
    editBackLabel: "Wróć do strony głównej",
  },
  en: {
    heroTitle: "Warhammer Army Builder",
    heroDescription:
      "Welcome! We're just getting started—soon you'll build and save your army lists. For now, take a look at what's coming.",
    rosterButton: "Create new roster",
    switchLabel: "Przełącz na polską wersję",
    localeName: "EN",
    editSlug: "roster-edit",
    editTitle: "Roster editor",
    editDescription:
      "The builder is coming soon — this is where your army roster will live.",
    editBackLabel: "Back to the landing page",
  },
} satisfies Record<Locale, LocaleDictionary>;

export function getDictionary(locale: string): LocaleDictionary {
  const safe = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safe];
}

export function getAlternateLocale(current: Locale): Locale {
  return current === "pl" ? "en" : "pl";
}
