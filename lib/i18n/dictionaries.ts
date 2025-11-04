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
  editMoveToTopLabel: string;
  selectPlaceholder: string;
  armyLabel: string;
  armyCompositionLabel: string;
  armyRuleLabel: string;
  armyPointsLabel: string;
  armyPointsSuggestionsLabel: string;
  armyPointsPlaceholder: string;
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
  categoryUnitSectionLocked: string;
  categoryOptionsDefaultLabel: string;
  categoryLockedNoticeDescription: string;
  categoryConfiguratorPrompt: string;
  categoryOptionsTitle: string;
  categoryUnitSizeLabel: string;
  categoryUnitPointsPerModel: string;
  categoryUnitFlatCost: string;
  categoryUnitIncreaseAria: string;
  categoryUnitDecreaseAria: string;
  categoryUnitMinLabel: string;
  categoryUnitMaxLabel: string;
  categoryUnitTotalPoints: string;
  categoryNoAdditionalOptions: string;
  categoryOptionCostFree: string;
  categoryOptionCostPerModelSuffix: string;
  categoryPointsValue: string;
  categoryEntrySingleModel: string;
  categoryEntryMultipleModels: string;
  categoryEntryPointsPerModel: string;
  rosterSummaryHeading: string;
  rosterSummaryDefaultName: string;
  rosterDownloadButton: string;
  rosterPrintButton: string;
  rosterPointsLimitLabel: string;
  rosterTotalSpentLabel: string;
  rosterSummaryEmptyMessage: string;
  rosterSummaryOwnedLabel: string;
  rosterSummaryShowDetails: string;
  rosterSummaryHideDetails: string;
  rosterSummaryRemoveButton: string;
  rosterSummaryRemoveAria: string;
  rosterSummaryBaseCost: string;
  rosterSetupHeading: string;
  rosterSetupEditButton: string;
  rosterSetupCollapseButton: string;
  rosterSetupSaveButton: string;
  rosterSetupSavedButton: string;
  headerBrandLabel: string;
  rosterDetailHeading: string;
  rosterDetailEmptyMessage: string;
  rosterDetailStatsMissing: string;
  rosterDetailCloseAria: string;
  rosterDetailUnitCountSingle: string;
  rosterDetailUnitCountPlural: string;
  rosterDetailModelsLine: string;
  rosterDetailOwnedLabel: string;
  rosterDetailOwnedYes: string;
  rosterDetailOwnedNo: string;
  rosterDetailUnnamedUnit: string;
  rosterDetailStatsModelLabel: string;
  rosterDetailStatNameM: string;
  rosterDetailStatNameWS: string;
  rosterDetailStatNameBS: string;
  rosterDetailStatNameS: string;
  rosterDetailStatNameT: string;
  rosterDetailStatNameW: string;
  rosterDetailStatNameI: string;
  rosterDetailStatNameA: string;
  rosterDetailStatNameLd: string;
  rosterDetailSpecialRulesLabel: string;
  rosterDetailProfileFallback: string;
  rosterDetailMountLabel: string;
  rosterDetailSidebarUnitSize: string;
  rosterDetailSidebarBaseSize: string;
  rosterDetailSidebarArmourValue: string;
  rosterDetailSidebarMountUnitSize: string;
  rosterDetailSidebarMountBaseSize: string;
  rosterDetailSidebarMountArmourValue: string;
  unitSearchHeading: string;
  unitSearchInputLabel: string;
  unitSearchPlaceholder: string;
  unitSearchClearButton: string;
  unitSearchResultsCount: string;
  unitSearchNoResults: string;
  unitSearchArmyLabel: string;
  unitSearchUnitCategoryLabel: string;
  unitSearchTroopTypeLabel: string;
  unitSearchEquipmentLabel: string;
  unitSearchProfilesHeading: string;
  rosterExportTitle: string;
  rosterExportDescription: string;
  rosterExportMenuPdf: string;
  rosterExportMenuJson: string;
  rosterExportMenuCsv: string;
  rosterExportMenuPrint: string;
  rosterExportArmyLabel: string;
  rosterExportCompositionLabel: string;
  rosterExportArmyRuleLabel: string;
  rosterExportTotalPointsLabel: string;
  rosterExportUnitsHeading: string;
  rosterExportGeneratedLabel: string;
  rosterExportOptionNoteLabel: string;
  rosterExportPerModelSuffix: string;
  rosterExportUnknownArmy: string;
  rosterExportOwnedYes: string;
  rosterExportOwnedNo: string;
  rosterExportUnnamedUnit: string;
  rosterExportCsvHeaderCategory: string;
  rosterExportCsvHeaderUnit: string;
  rosterExportCsvHeaderUnitSize: string;
  rosterExportCsvHeaderPointsPerModel: string;
  rosterExportCsvHeaderBasePoints: string;
  rosterExportCsvHeaderOptions: string;
  rosterExportCsvHeaderTotalPoints: string;
  rosterExportCsvHeaderOwned: string;
  rosterExportCsvOptionFreeSuffix: string;
  rosterExportUnitNotesLabel: string;
  rosterExportAriaLabel: string;
  armyPointsIncreaseAria: string;
  armyPointsDecreaseAria: string;
  footerAriaLabel: string;
  footerLegalNotice: string;
  footerCommunityNote: string;
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
    editMoveToTopLabel: "Powrót na górę",
    selectPlaceholder: "— wybierz —",
    armyLabel: "Armia",
    armyCompositionLabel: "Kompozycja Armii",
    armyRuleLabel: "Zasada Armii",
    armyPointsLabel: "Punkty",
    armyPointsSuggestionsLabel: "Sugestie",
    armyPointsPlaceholder: "Uzupełnij liczbę punktów armii",
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
    categoryUnitSectionLocked: "Wybór jednostek zablokowany",
    categoryOptionsDefaultLabel: "Opcje",
    categoryLockedNoticeDescription:
      "Uzupełnij ustawienia rozpiski (armia, nazwa, punkty) i zapisz zmiany, aby dodać jednostki.",
    categoryConfiguratorPrompt: "Wybierz kategorię, aby zobaczyć dostępne opcje.",
    categoryOptionsTitle: "Opcje dla {category}",
    categoryUnitSizeLabel: "Wielkość jednostki",
    categoryUnitPointsPerModel: "{value} pkt za model",
    categoryUnitFlatCost: "Stały koszt",
    categoryUnitIncreaseAria: "Zwiększ wielkość jednostki",
    categoryUnitDecreaseAria: "Zmniejsz wielkość jednostki",
    categoryUnitMinLabel: "Min",
    categoryUnitMaxLabel: "Maks",
    categoryUnitTotalPoints: "{value} pkt łącznie",
    categoryNoAdditionalOptions: "Brak dodatkowych opcji dla tej jednostki.",
    categoryOptionCostFree: "bez kosztu",
    categoryOptionCostPerModelSuffix: " / model",
    categoryPointsValue: "{value} pkt",
    categoryEntrySingleModel: "Pojedynczy model",
    categoryEntryMultipleModels: "{count} modele",
    categoryEntryPointsPerModel: "{value} pkt za model",
    rosterSummaryHeading: "Podsumowanie rozpiski",
    rosterSummaryDefaultName: "Rozpiska bez nazwy",
    rosterDownloadButton: "Pobierz rozpiskę",
    rosterPrintButton: "Drukuj rozpiskę",
    rosterPointsLimitLabel: "Limit punktów",
    rosterTotalSpentLabel: "Wydano łącznie",
    rosterSummaryEmptyMessage:
      "Nie wybrano jeszcze żadnych jednostek. Użyj paneli kategorii, aby dodać wpisy do rozpiski.",
    rosterSummaryOwnedLabel: "Posiadam tę jednostkę",
    rosterSummaryShowDetails: "Pokaż szczegóły",
    rosterSummaryHideDetails: "Ukryj szczegóły",
    rosterSummaryRemoveButton: "Usuń",
    rosterSummaryRemoveAria: "Usuń {unit}",
    rosterSummaryBaseCost: "Koszt bazowy: {value}",
    rosterSetupHeading: "Ustawienia rozpiski",
    rosterSetupEditButton: "Edytuj szczegóły",
    rosterSetupCollapseButton: "Zwiń",
    rosterSetupSaveButton: "Zapisz",
    rosterSetupSavedButton: "Zapisano",
    headerBrandLabel: "Warhammer Old World Army Builder",
    rosterDetailHeading: "Karta rozpiski",
    rosterDetailEmptyMessage:
      "Dodaj jednostki do rozpiski, aby zobaczyć ich szczegóły i statystyki.",
    rosterDetailStatsMissing:
      "Statystyki jednostek dla wybranej armii nie są jeszcze kompletne. Jednostki bez danych pokażą placeholder.",
    rosterDetailCloseAria: "Zamknij kartę rozpiski",
    rosterDetailUnitCountSingle: "{count} jednostka",
    rosterDetailUnitCountPlural: "{count} jednostki",
    rosterDetailModelsLine: "{count} modeli @ {value}",
    rosterDetailOwnedLabel: "Posiadane",
    rosterDetailOwnedYes: "Tak",
    rosterDetailOwnedNo: "Nie",
    rosterDetailUnnamedUnit: "Jednostka bez nazwy",
    rosterDetailStatsModelLabel: "Model",
    rosterDetailStatNameM: "Ruch",
    rosterDetailStatNameWS: "Umiejętność walki wręcz",
    rosterDetailStatNameBS: "Umiejętność strzelania",
    rosterDetailStatNameS: "Siła",
    rosterDetailStatNameT: "Wytrzymałość",
    rosterDetailStatNameW: "Żywotność",
    rosterDetailStatNameI: "Inicjatywa",
    rosterDetailStatNameA: "Ataki",
    rosterDetailStatNameLd: "Dowodzenie",
    rosterDetailSpecialRulesLabel: "Zasady specjalne",
    rosterDetailProfileFallback: "Profil {index}",
    rosterDetailMountLabel: "Wierzchowiec",
    rosterDetailSidebarUnitSize: "Wielkość jednostki",
    rosterDetailSidebarBaseSize: "Rozmiar podstawki",
    rosterDetailSidebarArmourValue: "Wartość pancerza",
    rosterDetailSidebarMountUnitSize: "{mount} – wielkość jednostki",
    rosterDetailSidebarMountBaseSize: "{mount} – rozmiar podstawki",
    rosterDetailSidebarMountArmourValue: "{mount} – wartość pancerza",
    unitSearchHeading: "Wyszukiwarka jednostek",
    unitSearchInputLabel: "Wyszukaj jednostkę",
    unitSearchPlaceholder: "Wpisz nazwę jednostki…",
    unitSearchClearButton: "Wyczyść",
    unitSearchResultsCount: "Znaleziono {count} jednostek",
    unitSearchNoResults: "Brak jednostek spełniających kryteria.",
    unitSearchArmyLabel: "Armia",
    unitSearchUnitCategoryLabel: "Kategoria",
    unitSearchTroopTypeLabel: "Typ oddziału",
    unitSearchEquipmentLabel: "Wyposażenie",
    unitSearchProfilesHeading: "Statystyki",
    rosterExportTitle: "Eksport rozpiski",
    rosterExportDescription:
      "Pobierz aktualny szkic rozpiski w różnych formatach albo listę jednostek, których jeszcze potrzebujesz.",
    rosterExportMenuJson: "JSON",
    rosterExportMenuPdf: "PDF",
    rosterExportMenuCsv: "CSV",
    rosterExportMenuPrint: "Drukuj",
    rosterExportArmyLabel: "Armia",
    rosterExportCompositionLabel: "Kompozycja",
    rosterExportArmyRuleLabel: "Zasada armii",
    rosterExportTotalPointsLabel: "Łącznie punktów",
    rosterExportUnitsHeading: "Jednostki",
    rosterExportGeneratedLabel: "Wygenerowano",
    rosterExportOptionNoteLabel: "uwaga",
    rosterExportPerModelSuffix: "{value} pkt/model",
    rosterExportUnknownArmy: "Nieznana armia",
    rosterExportOwnedYes: "tak",
    rosterExportOwnedNo: "nie",
    rosterExportUnnamedUnit: "Jednostka bez nazwy",
    rosterExportCsvHeaderCategory: "Kategoria",
    rosterExportCsvHeaderUnit: "Jednostka",
    rosterExportCsvHeaderUnitSize: "Wielkość",
    rosterExportCsvHeaderPointsPerModel: "Punkty/model",
    rosterExportCsvHeaderBasePoints: "Koszt bazowy",
    rosterExportCsvHeaderOptions: "Opcje",
    rosterExportCsvHeaderTotalPoints: "Łącznie",
    rosterExportCsvHeaderOwned: "Posiadane",
    rosterExportCsvOptionFreeSuffix: "(bez kosztu)",
    rosterExportUnitNotesLabel: "Notatki",
    rosterExportAriaLabel: "Sterowanie eksportem rozpiski",
    armyPointsIncreaseAria: "Zwiększ o {value}",
    armyPointsDecreaseAria: "Zmniejsz o {value}",
    footerAriaLabel: "Informacje prawne i o projekcie",
    footerLegalNotice:
      "Ta strona ma charakter fanowski i nie jest w żaden sposób powiązana, wspierana ani licencjonowana przez Games Workshop. Wszystkie znaki towarowe, nazwy i materiały związane z Warhammerem są własnością Games Workshop Limited. Celem serwisu jest pomoc nowym graczom w rozpoczęciu przygody ze światem Warhammera. Serio, to wszystko jest naprawdę baaardzo skomplikowane :)",
    footerCommunityNote: "projekt dla społeczności graczy.",
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
    editMoveToTopLabel: "Move to top",
    selectPlaceholder: "— Select —",
    armyLabel: "Army",
    armyCompositionLabel: "Army Composition",
    armyRuleLabel: "Army Rule",
    armyPointsLabel: "Points",
    armyPointsSuggestionsLabel: "Suggestions",
    armyPointsPlaceholder: "Fill in the army points value",
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
    categoryUnitSectionLocked: "Unit selection locked",
    categoryOptionsDefaultLabel: "Options",
    categoryLockedNoticeDescription:
      "Complete the roster setup (army, name, points) and save your changes to start adding units.",
    categoryConfiguratorPrompt: "Select a category to see available options.",
    categoryOptionsTitle: "Options for {category}",
    categoryUnitSizeLabel: "Unit size",
    categoryUnitPointsPerModel: "{value} pts per model",
    categoryUnitFlatCost: "Flat cost",
    categoryUnitIncreaseAria: "Increase unit size",
    categoryUnitDecreaseAria: "Decrease unit size",
    categoryUnitMinLabel: "Min",
    categoryUnitMaxLabel: "Max",
    categoryUnitTotalPoints: "{value} pts total",
    categoryNoAdditionalOptions: "No additional options for this unit.",
    categoryOptionCostFree: "free",
    categoryOptionCostPerModelSuffix: " / model",
    categoryPointsValue: "{value} pts",
    categoryEntrySingleModel: "Single model",
    categoryEntryMultipleModels: "{count} models",
    categoryEntryPointsPerModel: "{value} pts per model",
    rosterSummaryHeading: "Roster Summary",
    rosterSummaryDefaultName: "Untitled roster",
    rosterDownloadButton: "Download roster",
    rosterPrintButton: "Print roster",
    rosterPointsLimitLabel: "Points limit",
    rosterTotalSpentLabel: "Total spent",
    rosterSummaryEmptyMessage:
      "No units selected yet. Use the category panels to add entries to your roster.",
    rosterSummaryOwnedLabel: "I own this unit",
    rosterSummaryShowDetails: "Show details",
    rosterSummaryHideDetails: "Hide details",
    rosterSummaryRemoveButton: "Remove",
    rosterSummaryRemoveAria: "Remove {unit}",
    rosterSummaryBaseCost: "Base cost: {value}",
    rosterSetupHeading: "Roster Setup",
    rosterSetupEditButton: "Edit details",
    rosterSetupCollapseButton: "Collapse",
    rosterSetupSaveButton: "Save",
    rosterSetupSavedButton: "Saved",
    headerBrandLabel: "Warhammer Old World Army Builder",
    rosterDetailHeading: "Roster Sheet",
    rosterDetailEmptyMessage: "Add units to the roster to view their details and statistics.",
    rosterDetailStatsMissing:
      "Unit statistics for the selected army are not complete yet. Units without data will display placeholders.",
    rosterDetailCloseAria: "Close roster sheet",
    rosterDetailUnitCountSingle: "{count} unit",
    rosterDetailUnitCountPlural: "{count} units",
    rosterDetailModelsLine: "{count} models @ {value}",
    rosterDetailOwnedLabel: "Owned",
    rosterDetailOwnedYes: "Yes",
    rosterDetailOwnedNo: "No",
    rosterDetailUnnamedUnit: "Unnamed unit",
    rosterDetailStatsModelLabel: "Model",
    rosterDetailStatNameM: "Movement",
    rosterDetailStatNameWS: "Weapon Skill",
    rosterDetailStatNameBS: "Ballistic Skill",
    rosterDetailStatNameS: "Strength",
    rosterDetailStatNameT: "Toughness",
    rosterDetailStatNameW: "Wounds",
    rosterDetailStatNameI: "Initiative",
    rosterDetailStatNameA: "Attacks",
    rosterDetailStatNameLd: "Leadership",
    rosterDetailSpecialRulesLabel: "Special Rules",
    rosterDetailProfileFallback: "Profile {index}",
    rosterDetailMountLabel: "Mount",
    rosterDetailSidebarUnitSize: "Unit Size",
    rosterDetailSidebarBaseSize: "Base Size",
    rosterDetailSidebarArmourValue: "Armour Value",
    rosterDetailSidebarMountUnitSize: "{mount} Unit Size",
    rosterDetailSidebarMountBaseSize: "{mount} Base Size",
    rosterDetailSidebarMountArmourValue: "{mount} Armour Value",
    unitSearchHeading: "Unit Finder",
    unitSearchInputLabel: "Search for a unit",
    unitSearchPlaceholder: "Type a unit name…",
    unitSearchClearButton: "Clear",
    unitSearchResultsCount: "Found {count} units",
    unitSearchNoResults: "No units match the current query.",
    unitSearchArmyLabel: "Army",
    unitSearchUnitCategoryLabel: "Unit category",
    unitSearchTroopTypeLabel: "Troop type",
    unitSearchEquipmentLabel: "Equipment",
    unitSearchProfilesHeading: "Statistics",
    rosterExportTitle: "Export roster",
    rosterExportDescription:
      "Download the current roster draft in multiple formats or export the list of units you still need to buy.",
    rosterExportMenuJson: "JSON",
    rosterExportMenuPdf: "PDF",
    rosterExportMenuCsv: "CSV",
    rosterExportMenuPrint: "Print",
    rosterExportArmyLabel: "Army",
    rosterExportCompositionLabel: "Composition",
    rosterExportArmyRuleLabel: "Army Rule",
    rosterExportTotalPointsLabel: "Total Points",
    rosterExportUnitsHeading: "Units",
    rosterExportGeneratedLabel: "Generated",
    rosterExportOptionNoteLabel: "note",
    rosterExportPerModelSuffix: "{value} pts/model",
    rosterExportUnknownArmy: "Unknown army",
    rosterExportOwnedYes: "yes",
    rosterExportOwnedNo: "no",
    rosterExportUnnamedUnit: "Unnamed unit",
    rosterExportCsvHeaderCategory: "Category",
    rosterExportCsvHeaderUnit: "Unit",
    rosterExportCsvHeaderUnitSize: "Unit Size",
    rosterExportCsvHeaderPointsPerModel: "Points per model",
    rosterExportCsvHeaderBasePoints: "Base points",
    rosterExportCsvHeaderOptions: "Options",
    rosterExportCsvHeaderTotalPoints: "Total points",
    rosterExportCsvHeaderOwned: "Owned",
    rosterExportCsvOptionFreeSuffix: "(free)",
    rosterExportUnitNotesLabel: "Notes",
    rosterExportAriaLabel: "Roster export controls",
    armyPointsIncreaseAria: "Increase by {value}",
    armyPointsDecreaseAria: "Decrease by {value}",
    footerAriaLabel: "Legal and project information",
    footerLegalNotice:
      "This is a fan-made site and is in no way affiliated with, endorsed by, or licensed by Games Workshop. All trademarks, names, and materials related to Warhammer are the property of Games Workshop Limited. The goal of this project is to help new players begin their journey into the world of Warhammer. Seriously, the whole thing is really, really complicated :)",
    footerCommunityNote: "a project for the player community.",
  },
} satisfies Record<Locale, LocaleDictionary>;

export function getDictionary(locale: string): LocaleDictionary {
  const safe = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safe];
}

export function getAlternateLocale(current: Locale): Locale {
  return current === "pl" ? "en" : "pl";
}
