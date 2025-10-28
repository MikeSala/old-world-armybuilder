// 🔹 TS: Strong dictionary typing
export type LocaleDictionary = {
  heroTitle: string;
  heroDescription: string;
  rosterButton: string;
  switchLabel: string;
  localeName: string;
  editSlug: string;
  editTitle: string;
  editDescription: string;
  editBackLabel: string;
  selectPlaceholder: string;
  armyLabel: string;
  armyCompositionLabel: string;
  armyRuleLabel: string;
  armyPointsLabel: string;
  armyPointsSuggestionsLabel: string;
  rosterNameLabel: string;
  rosterNamePh: string;
  rosterDescLabel: string;
  rosterDescPh: string;
  optionalHint: string;
  saveButtonLabel: string;
  validationArmyRequired: string;
  validationPointsRequired: string;
  saveSuccess: string;
  saveError: string;
  categoryAddLabel: string;
  categoryPtsAvailable: string;
  categoryPtsMissing: string;
  categoryCharactersLabel: string;
  categoryCoreLabel: string;
  categorySpecialLabel: string;
  categoryRareLabel: string;
  categoryMercsLabel: string;
  categoryAlliesLabel: string;
  categoryHelpDefault: string;
  categoryHelpWarning: string;
  categoryToggleCloseLabel: string;
  categorySelectPlaceholder: string;
  categoryConfirmAddLabel: string;
  categoryCancelLabel: string;
  categoryEmptyUnitsMessage: string;
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
    editDescription: "Wkrótce dodamy edytor — na razie to miejsce na Twoją rozpiskę.",
    editBackLabel: "Wróć do strony głównej",
    selectPlaceholder: "— wybierz —",
    armyLabel: "Armia",
    armyCompositionLabel: "Kompozycja Armii",
    armyRuleLabel: "Zasada Armii",
    armyPointsLabel: "Punkty",
    armyPointsSuggestionsLabel: "Sugestie",
    rosterNameLabel: "Nazwa rozpiski",
    rosterNamePh: "Podaj nazwę własną…",
    rosterDescLabel: "Opis rozpiski",
    rosterDescPh: "Krótki opis armii…",
    optionalHint: "opcjonalne",
    saveButtonLabel: "Zapisz i kontynuuj",
    validationArmyRequired: "Wybierz armię.",
    validationPointsRequired: "Ustaw limit punktów większy niż 0.",
    saveSuccess: "Zapisano.",
    saveError: "Nie udało się zapisać szkicu.",
    categoryAddLabel: "Dodaj",
    categoryPtsAvailable: "pkt dostępne",
    categoryPtsMissing: "pkt brakujące",
    categoryCharactersLabel: "Bohaterowie",
    categoryCoreLabel: "Jednostki podstawowe",
    categorySpecialLabel: "Jednostki specjalne",
    categoryRareLabel: "Jednostki rzadkie",
    categoryMercsLabel: "Najemnicy",
    categoryAlliesLabel: "Sojusznicy",
    categoryHelpDefault: "Wygląda dobrze — dodaj, czego potrzebujesz.",
    categoryHelpWarning: "Zwiększ tę kategorię, aby spełnić minimum.",
    categoryToggleCloseLabel: "Zamknij",
    categorySelectPlaceholder: "Wybierz jednostkę",
    categoryConfirmAddLabel: "Dodaj jednostkę",
    categoryCancelLabel: "Anuluj",
    categoryEmptyUnitsMessage: "Brak jednostek dostępnych dla tej kompozycji.",
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
    editDescription: "The builder is coming soon — this is where your army roster will live.",
    editBackLabel: "Back to the landing page",
    selectPlaceholder: "— Select —",
    armyLabel: "Army",
    armyCompositionLabel: "Army Composition",
    armyRuleLabel: "Army Rule",
    armyPointsLabel: "Points",
    armyPointsSuggestionsLabel: "Suggestions",
    rosterNameLabel: "Name",
    rosterNamePh: "Custom army name…",
    rosterDescLabel: "Description",
    rosterDescPh: "Short army lore…",
    optionalHint: "optional",
    saveButtonLabel: "Save and continue",
    validationArmyRequired: "Please select an army.",
    validationPointsRequired: "Please set points limit greater than 0.",
    saveSuccess: "Saved.",
    saveError: "Could not save the roster draft.",
    categoryAddLabel: "Add",
    categoryPtsAvailable: "pts available",
    categoryPtsMissing: "pts missing",
    categoryCharactersLabel: "Characters",
    categoryCoreLabel: "Core Units",
    categorySpecialLabel: "Special Units",
    categoryRareLabel: "Rare Units",
    categoryMercsLabel: "Mercenaries",
    categoryAlliesLabel: "Allies",
    categoryHelpDefault: "Looking good – keep adding what you need.",
    categoryHelpWarning: "Increase this category to meet minimum requirements.",
    categoryToggleCloseLabel: "Close",
    categorySelectPlaceholder: "Select unit",
    categoryConfirmAddLabel: "Add unit",
    categoryCancelLabel: "Cancel",
    categoryEmptyUnitsMessage: "No units available for this composition.",
  },
} satisfies Record<Locale, LocaleDictionary>;

export function getDictionary(locale: string): LocaleDictionary {
  const safe = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safe];
}

export function getAlternateLocale(current: Locale): Locale {
  return current === "pl" ? "en" : "pl";
}
