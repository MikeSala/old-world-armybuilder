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
  categoryCorePointsSummary: string;
  categoryCapPointsSummary: string;
  categorySpecialLabel: string;
  categoryRareLabel: string;
  categoryMercsLabel: string;
  categoryAlliesLabel: string;
  categoryHelpDefault: string;
  categoryHelpWarning: string;
  categoryToggleCloseLabel: string;
  categorySelectPlaceholder: string;
  categoryConfirmAddLabel: string;
  categoryConfirmSaveLabel: string;
  categoryCancelLabel: string;
  categoryEmptyUnitsMessage: string;
  categoryUnitSectionLocked: string;
  categoryOptionsDefaultLabel: string;
  categoryOptionGroupCommandLabel: string;
  categoryOptionGroupEquipmentLabel: string;
  categoryOptionGroupArmorLabel: string;
  categoryOptionGroupMountsLabel: string;
  categoryLockedNoticeDescription: string;
  categoryConfiguratorPrompt: string;
  categoryOptionsTitle: string;
  categoryEditTitle: string;
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
  rosterClipboardHeading: string;
  rosterClipboardSaveButton: string;
  rosterClipboardEmpty: string;
  rosterClipboardRestoreButton: string;
  rosterClipboardRemoveButton: string;
  headerBrandLabel: string;
  headerSwitchLocaleLabel?: string;
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

export const locales = ["pl", "en", "de", "fr", "es"] as const;
export const defaultLocale = "pl";

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// 🔹 Typed dictionary enforcing keys for each locale
const dictionaries = {
  pl: {
    heroTitle: "Kreator armii Warhammera",
    heroDescription:
      "Witaj! Projekt dopiero startuje — w kolejnych krokach dodamy kreator rozpisek i zapis armii. Na razie rozgość się i sprawdź, co planujemy.",
    rosterButton: "Nowa rozpiska",
    switchLabel: "Przełącz na wersję angielską",
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
    categoryCorePointsSummary: "aktualnie {current} pkt / min {required} pkt",
    categoryCapPointsSummary: "aktualnie {current} pkt / max {limit} pkt",
    categorySpecialLabel: "Jednostki specjalne",
    categoryRareLabel: "Jednostki rzadkie",
    categoryMercsLabel: "Najemnicy",
    categoryAlliesLabel: "Sojusznicy",
    categoryHelpDefault: "Wygląda dobrze — dodaj, czego potrzebujesz.",
    categoryHelpWarning: "Zwiększ tę kategorię, aby spełnić minimum.",
    categoryToggleCloseLabel: "Zamknij",
    categorySelectPlaceholder: "Wybierz jednostkę",
    categoryConfirmAddLabel: "Dodaj jednostkę",
    categoryConfirmSaveLabel: "Zapisz",
    categoryCancelLabel: "Anuluj",
    categoryEmptyUnitsMessage: "Brak jednostek dostępnych dla tej kompozycji.",
    categoryUnitSectionLocked: "Wybór jednostek zablokowany",
    categoryOptionsDefaultLabel: "Opcje",
    categoryOptionGroupCommandLabel: "Dowództwo",
    categoryOptionGroupEquipmentLabel: "Broń",
    categoryOptionGroupArmorLabel: "Zbroja",
    categoryOptionGroupMountsLabel: "Wierzchowce",
    categoryLockedNoticeDescription:
      "Uzupełnij ustawienia rozpiski (armia, nazwa, punkty) i zapisz zmiany, aby dodać jednostki.",
    categoryConfiguratorPrompt: "Wybierz kategorię, aby zobaczyć dostępne opcje.",
    categoryOptionsTitle: "Opcje dla {category}",
    categoryEditTitle: "Edytuj",
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
    rosterClipboardHeading: "Schowek",
    rosterClipboardSaveButton: "Zapisz do schowka",
    rosterClipboardEmpty: "Schowek jest pusty.",
    rosterClipboardRestoreButton: "Przywróć",
    rosterClipboardRemoveButton: "Usuń",
    headerBrandLabel: "Warhammer Old World Army Builder",
    headerSwitchLocaleLabel: "Zmień język na {locale}",
    rosterDetailHeading: "Karta rozpiski",
    rosterDetailEmptyMessage:
      "Dodaj jednostki do rozpiski, aby zobaczyć ich szczegóły i statystyki.",
    rosterDetailStatsMissing:
      "Statystyki jednostek dla wybranej armii nie są jeszcze kompletne. Jednostki bez danych pokażą wartości zastępcze.",
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
    categoryCorePointsSummary: "current {current} pts / min {required} pts",
    categoryCapPointsSummary: "current {current} pts / max {limit} pts",
    categorySpecialLabel: "Special Units",
    categoryRareLabel: "Rare Units",
    categoryMercsLabel: "Mercenaries",
    categoryAlliesLabel: "Allies",
    categoryHelpDefault: "Looking good – keep adding what you need.",
    categoryHelpWarning: "Increase this category to meet minimum requirements.",
    categoryToggleCloseLabel: "Close",
    categorySelectPlaceholder: "Select unit",
    categoryConfirmAddLabel: "Add unit",
    categoryConfirmSaveLabel: "Save",
    categoryCancelLabel: "Cancel",
    categoryEmptyUnitsMessage: "No units available for this composition.",
    categoryUnitSectionLocked: "Unit selection locked",
    categoryOptionsDefaultLabel: "Options",
    categoryOptionGroupCommandLabel: "Command",
    categoryOptionGroupEquipmentLabel: "Weapons",
    categoryOptionGroupArmorLabel: "Armour",
    categoryOptionGroupMountsLabel: "Mounts",
    categoryLockedNoticeDescription:
      "Complete the roster setup (army, name, points) and save your changes to start adding units.",
    categoryConfiguratorPrompt: "Select a category to see available options.",
    categoryOptionsTitle: "Options for {category}",
    categoryEditTitle: "Edit",
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
    rosterClipboardHeading: "Clipboard",
    rosterClipboardSaveButton: "Save to clipboard",
    rosterClipboardEmpty: "Clipboard is empty.",
    rosterClipboardRestoreButton: "Restore",
    rosterClipboardRemoveButton: "Remove",
    headerBrandLabel: "Warhammer Old World Army Builder",
    headerSwitchLocaleLabel: "Switch language to {locale}",
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
  de: {
    heroTitle: "Warhammer Armee-Builder",
    heroDescription:
      "Willkommen! Wir starten gerade – bald kannst du deine Armeelisten erstellen. Schau dir an, was kommt.",
    rosterButton: "Neue Armeeliste",
    switchLabel: "Zur deutschen Version wechseln",
    localeName: "DE",
    editSlug: "listen-editor",
    editTitle: "Armeeliste bearbeiten",
    editDescription: "Der Builder ist bald da – hier entsteht deine Armeeliste.",
    editMoveToTopLabel: "Zum Anfang",
    selectPlaceholder: "— auswählen —",
    armyLabel: "Armee",
    armyCompositionLabel: "Armee-Komposition",
    armyRuleLabel: "Armeeregel",
    armyPointsLabel: "Punkte",
    armyPointsSuggestionsLabel: "Vorschläge",
    armyPointsPlaceholder: "Punktzahl der Armee eingeben",
    rosterNameLabel: "Name der Liste",
    rosterNamePh: "Eigener Name…",
    rosterDescLabel: "Beschreibung",
    rosterDescPh: "Kurze Beschreibung der Armee…",
    optionalHint: "optional",
    saveButtonLabel: "Speichern und fortfahren",
    validationArmyRequired: "Bitte wähle eine Armee.",
    validationPointsRequired: "Bitte setze ein Punkte-Limit größer als 0.",
    saveSuccess: "Gespeichert.",
    saveError: "Entwurf konnte nicht gespeichert werden.",
    categoryAddLabel: "Hinzufügen",
    categoryPtsAvailable: "Pkt verfügbar",
    categoryPtsMissing: "Pkt fehlen",
    categoryCharactersLabel: "Charaktere",
    categoryCoreLabel: "Kerneinheiten",
    categoryCorePointsSummary: "aktuell {current} Pkt / min {required} Pkt",
    categoryCapPointsSummary: "aktuell {current} Pkt / max {limit} Pkt",
    categorySpecialLabel: "Spezialeinheiten",
    categoryRareLabel: "Seltene Einheiten",
    categoryMercsLabel: "Söldner",
    categoryAlliesLabel: "Verbündete",
    categoryHelpDefault: "Sieht gut aus – füge hinzu, was du brauchst.",
    categoryHelpWarning: "Erhöhe diese Kategorie, um das Minimum zu erreichen.",
    categoryToggleCloseLabel: "Schließen",
    categorySelectPlaceholder: "Einheit auswählen",
    categoryConfirmAddLabel: "Einheit hinzufügen",
    categoryConfirmSaveLabel: "Speichern",
    categoryCancelLabel: "Abbrechen",
    categoryEmptyUnitsMessage: "Keine Einheiten für diese Komposition verfügbar.",
    categoryUnitSectionLocked: "Einheitenwahl gesperrt",
    categoryOptionsDefaultLabel: "Optionen",
    categoryOptionGroupCommandLabel: "Kommando",
    categoryOptionGroupEquipmentLabel: "Waffen",
    categoryOptionGroupArmorLabel: "Rüstung",
    categoryOptionGroupMountsLabel: "Reittiere",
    categoryLockedNoticeDescription:
      "Schließe die Einstellungen (Armee, Name, Punkte) ab und speichere, um Einheiten hinzuzufügen.",
    categoryConfiguratorPrompt: "Wähle eine Kategorie, um verfügbare Optionen zu sehen.",
    categoryOptionsTitle: "Optionen für {category}",
    categoryEditTitle: "Bearbeiten",
    categoryUnitSizeLabel: "Einheitsgröße",
    categoryUnitPointsPerModel: "{value} Pkt pro Modell",
    categoryUnitFlatCost: "Pauschalkosten",
    categoryUnitIncreaseAria: "Einheitsgröße erhöhen",
    categoryUnitDecreaseAria: "Einheitsgröße verringern",
    categoryUnitMinLabel: "Min",
    categoryUnitMaxLabel: "Max",
    categoryUnitTotalPoints: "{value} Pkt gesamt",
    categoryNoAdditionalOptions: "Keine zusätzlichen Optionen für diese Einheit.",
    categoryOptionCostFree: "kostenlos",
    categoryOptionCostPerModelSuffix: " / Modell",
    categoryPointsValue: "{value} Pkt",
    categoryEntrySingleModel: "Einzelnes Modell",
    categoryEntryMultipleModels: "{count} Modelle",
    categoryEntryPointsPerModel: "{value} Pkt pro Modell",
    rosterSummaryHeading: "Zusammenfassung der Liste",
    rosterSummaryDefaultName: "Unbenannte Liste",
    rosterDownloadButton: "Liste herunterladen",
    rosterPrintButton: "Liste drucken",
    rosterPointsLimitLabel: "Punktelimit",
    rosterTotalSpentLabel: "Insgesamt ausgegeben",
    rosterSummaryEmptyMessage:
      "Noch keine Einheiten ausgewählt. Nutze die Kategorien, um Einträge hinzuzufügen.",
    rosterSummaryOwnedLabel: "Ich besitze diese Einheit",
    rosterSummaryShowDetails: "Details anzeigen",
    rosterSummaryHideDetails: "Details ausblenden",
    rosterSummaryRemoveButton: "Entfernen",
    rosterSummaryRemoveAria: "{unit} entfernen",
    rosterSummaryBaseCost: "Grundkosten: {value}",
    rosterSetupHeading: "Listen-Einstellungen",
    rosterSetupEditButton: "Details bearbeiten",
    rosterSetupCollapseButton: "Einklappen",
    rosterSetupSaveButton: "Speichern",
    rosterSetupSavedButton: "Gespeichert",
    rosterClipboardHeading: "Zwischenablage",
    rosterClipboardSaveButton: "In die Zwischenablage speichern",
    rosterClipboardEmpty: "Zwischenablage ist leer.",
    rosterClipboardRestoreButton: "Wiederherstellen",
    rosterClipboardRemoveButton: "Entfernen",
    headerBrandLabel: "Warhammer Old World Army Builder",
    headerSwitchLocaleLabel: "Sprache zu {locale} wechseln",
    rosterDetailHeading: "Listenblatt",
    rosterDetailEmptyMessage:
      "Füge Einheiten zur Liste hinzu, um ihre Details und Statistiken zu sehen.",
    rosterDetailStatsMissing:
      "Einheitenstatistiken für die gewählte Armee sind noch unvollständig. Einheiten ohne Daten zeigen Platzhalter.",
    rosterDetailCloseAria: "Listenblatt schließen",
    rosterDetailUnitCountSingle: "{count} Einheit",
    rosterDetailUnitCountPlural: "{count} Einheiten",
    rosterDetailModelsLine: "{count} Modelle @ {value}",
    rosterDetailOwnedLabel: "Besitz",
    rosterDetailOwnedYes: "Ja",
    rosterDetailOwnedNo: "Nein",
    rosterDetailUnnamedUnit: "Unbenannte Einheit",
    rosterDetailStatsModelLabel: "Modell",
    rosterDetailStatNameM: "Bewegung",
    rosterDetailStatNameWS: "Kampfgeschick",
    rosterDetailStatNameBS: "Ballistische Fertigkeit",
    rosterDetailStatNameS: "Stärke",
    rosterDetailStatNameT: "Widerstand",
    rosterDetailStatNameW: "Lebenspunkte",
    rosterDetailStatNameI: "Initiative",
    rosterDetailStatNameA: "Angriffe",
    rosterDetailStatNameLd: "Führung",
    rosterDetailSpecialRulesLabel: "Sonderregeln",
    rosterDetailProfileFallback: "Profil {index}",
    rosterDetailMountLabel: "Reittier",
    rosterDetailSidebarUnitSize: "Einheitsgröße",
    rosterDetailSidebarBaseSize: "Basegröße",
    rosterDetailSidebarArmourValue: "Rüstungswert",
    rosterDetailSidebarMountUnitSize: "{mount} – Einheitsgröße",
    rosterDetailSidebarMountBaseSize: "{mount} – Basegröße",
    rosterDetailSidebarMountArmourValue: "{mount} – Rüstungswert",
    unitSearchHeading: "Einheitensuche",
    unitSearchInputLabel: "Einheit suchen",
    unitSearchPlaceholder: "Einheitsname eingeben…",
    unitSearchClearButton: "Löschen",
    unitSearchResultsCount: "{count} Einheiten gefunden",
    unitSearchNoResults: "Keine Einheiten entsprechen der Suche.",
    unitSearchArmyLabel: "Armee",
    unitSearchUnitCategoryLabel: "Einheitskategorie",
    unitSearchTroopTypeLabel: "Truppentyp",
    unitSearchEquipmentLabel: "Ausrüstung",
    unitSearchProfilesHeading: "Profile",
    rosterExportTitle: "Listenexport",
    rosterExportDescription:
      "Lade den aktuellen Entwurf in verschiedenen Formaten herunter oder exportiere die Liste der Einheiten, die dir noch fehlen.",
    rosterExportMenuJson: "JSON",
    rosterExportMenuPdf: "PDF",
    rosterExportMenuCsv: "CSV",
    rosterExportArmyLabel: "Armee",
    rosterExportCompositionLabel: "Komposition",
    rosterExportArmyRuleLabel: "Armeeregel",
    rosterExportTotalPointsLabel: "Gesamtpunkte",
    rosterExportUnitsHeading: "Einheiten",
    rosterExportGeneratedLabel: "Erstellt",
    rosterExportOptionNoteLabel: "Hinweis",
    rosterExportPerModelSuffix: "{value} Pkt/Modell",
    rosterExportUnknownArmy: "Unbekannte Armee",
    rosterExportOwnedYes: "ja",
    rosterExportOwnedNo: "nein",
    rosterExportUnnamedUnit: "Unbenannte Einheit",
    rosterExportCsvHeaderCategory: "Kategorie",
    rosterExportCsvHeaderUnit: "Einheit",
    rosterExportCsvHeaderUnitSize: "Einheitsgröße",
    rosterExportCsvHeaderPointsPerModel: "Punkte/Modell",
    rosterExportCsvHeaderBasePoints: "Basiskosten",
    rosterExportCsvHeaderOptions: "Optionen",
    rosterExportCsvHeaderTotalPoints: "Gesamtpunkte",
    rosterExportCsvHeaderOwned: "Besitz",
    rosterExportCsvOptionFreeSuffix: "(kostenlos)",
    rosterExportUnitNotesLabel: "Notizen",
    rosterExportAriaLabel: "Steuerung für Listenexport",
    armyPointsIncreaseAria: "Erhöhen um {value}",
    armyPointsDecreaseAria: "Verringern um {value}",
    footerAriaLabel: "Rechtliche Hinweise und Projektinfos",
    footerLegalNotice:
      "Dies ist eine Fan-Seite und steht in keiner Verbindung zu Games Workshop, wird nicht von ihnen unterstützt oder lizenziert. Alle Marken, Namen und Materialien rund um Warhammer sind Eigentum von Games Workshop Limited. Ziel dieses Projekts ist es, neuen Spielern den Einstieg in die Welt von Warhammer zu erleichtern. Ernsthaft, das Ganze ist wirklich, wirklich kompliziert :)",
    footerCommunityNote: "ein Projekt für die Spielergemeinschaft.",
  },
  fr: {
    heroTitle: "Constructeur d'armée Warhammer",
    heroDescription:
      "Bienvenue ! Nous commençons tout juste — bientôt vous pourrez créer vos listes d'armée. En attendant, découvrez ce qui arrive.",
    rosterButton: "Nouvelle liste d'armée",
    switchLabel: "Passer à la version française",
    localeName: "FR",
    editSlug: "edition-liste",
    editTitle: "Édition de la liste",
    editDescription:
      "Le builder arrive bientôt — c'est ici que votre liste d'armée prendra forme.",
    editMoveToTopLabel: "Revenir en haut",
    selectPlaceholder: "— choisir —",
    armyLabel: "Armée",
    armyCompositionLabel: "Composition d'armée",
    armyRuleLabel: "Règle d'armée",
    armyPointsLabel: "Points",
    armyPointsSuggestionsLabel: "Suggestions",
    armyPointsPlaceholder: "Saisissez la valeur des points de l'armée",
    rosterNameLabel: "Nom de la liste",
    rosterNamePh: "Nom personnalisé…",
    rosterDescLabel: "Description",
    rosterDescPh: "Brève description de l'armée…",
    optionalHint: "optionnel",
    saveButtonLabel: "Enregistrer et continuer",
    validationArmyRequired: "Veuillez sélectionner une armée.",
    validationPointsRequired: "Veuillez définir une limite de points supérieure à 0.",
    saveSuccess: "Enregistré.",
    saveError: "Impossible d'enregistrer le brouillon de la liste.",
    categoryAddLabel: "Ajouter",
    categoryPtsAvailable: "pts disponibles",
    categoryPtsMissing: "pts manquants",
    categoryCharactersLabel: "Personnages",
    categoryCoreLabel: "Unités de base",
    categoryCorePointsSummary: "actuel {current} pts / min {required} pts",
    categoryCapPointsSummary: "actuel {current} pts / max {limit} pts",
    categorySpecialLabel: "Unités spéciales",
    categoryRareLabel: "Unités rares",
    categoryMercsLabel: "Mercenaires",
    categoryAlliesLabel: "Alliés",
    categoryHelpDefault: "Tout va bien – ajoutez ce dont vous avez besoin.",
    categoryHelpWarning: "Augmentez cette catégorie pour atteindre le minimum.",
    categoryToggleCloseLabel: "Fermer",
    categorySelectPlaceholder: "Sélectionner une unité",
    categoryConfirmAddLabel: "Ajouter l'unité",
    categoryConfirmSaveLabel: "Enregistrer",
    categoryCancelLabel: "Annuler",
    categoryEmptyUnitsMessage: "Aucune unité disponible pour cette composition.",
    categoryUnitSectionLocked: "Sélection d'unités verrouillée",
    categoryOptionsDefaultLabel: "Options",
    categoryOptionGroupCommandLabel: "Commandement",
    categoryOptionGroupEquipmentLabel: "Armes",
    categoryOptionGroupArmorLabel: "Armure",
    categoryOptionGroupMountsLabel: "Montures",
    categoryLockedNoticeDescription:
      "Terminez la configuration (armée, nom, points) et enregistrez pour ajouter des unités.",
    categoryConfiguratorPrompt: "Sélectionnez une catégorie pour voir les options disponibles.",
    categoryOptionsTitle: "Options pour {category}",
    categoryEditTitle: "Modifier",
    categoryUnitSizeLabel: "Taille de l'unité",
    categoryUnitPointsPerModel: "{value} pts par figurine",
    categoryUnitFlatCost: "Coût fixe",
    categoryUnitIncreaseAria: "Augmenter la taille de l'unité",
    categoryUnitDecreaseAria: "Réduire la taille de l'unité",
    categoryUnitMinLabel: "Min",
    categoryUnitMaxLabel: "Max",
    categoryUnitTotalPoints: "{value} pts au total",
    categoryNoAdditionalOptions: "Aucune option supplémentaire pour cette unité.",
    categoryOptionCostFree: "gratuit",
    categoryOptionCostPerModelSuffix: " / figurine",
    categoryPointsValue: "{value} pts",
    categoryEntrySingleModel: "Figurine unique",
    categoryEntryMultipleModels: "{count} figurines",
    categoryEntryPointsPerModel: "{value} pts par figurine",
    rosterSummaryHeading: "Résumé de la liste",
    rosterSummaryDefaultName: "Liste sans nom",
    rosterDownloadButton: "Télécharger la liste",
    rosterPrintButton: "Imprimer la liste",
    rosterPointsLimitLabel: "Limite de points",
    rosterTotalSpentLabel: "Total dépensé",
    rosterSummaryEmptyMessage:
      "Aucune unité sélectionnée. Utilisez les catégories pour ajouter des entrées.",
    rosterSummaryOwnedLabel: "Je possède cette unité",
    rosterSummaryShowDetails: "Afficher les détails",
    rosterSummaryHideDetails: "Masquer les détails",
    rosterSummaryRemoveButton: "Retirer",
    rosterSummaryRemoveAria: "Retirer {unit}",
    rosterSummaryBaseCost: "Coût de base : {value}",
    rosterSetupHeading: "Configuration de la liste",
    rosterSetupEditButton: "Modifier les détails",
    rosterSetupCollapseButton: "Replier",
    rosterSetupSaveButton: "Enregistrer",
    rosterSetupSavedButton: "Enregistré",
    rosterClipboardHeading: "Presse-papiers",
    rosterClipboardSaveButton: "Enregistrer dans le presse-papiers",
    rosterClipboardEmpty: "Le presse-papiers est vide.",
    rosterClipboardRestoreButton: "Restaurer",
    rosterClipboardRemoveButton: "Supprimer",
    headerBrandLabel: "Warhammer Old World Army Builder",
    headerSwitchLocaleLabel: "Passer la langue en {locale}",
    rosterDetailHeading: "Fiche de liste",
    rosterDetailEmptyMessage:
      "Ajoutez des unités à la liste pour voir leurs détails et statistiques.",
    rosterDetailStatsMissing:
      "Les statistiques des unités pour l'armée sélectionnée ne sont pas encore complètes. Les unités sans données afficheront des valeurs de remplacement.",
    rosterDetailCloseAria: "Fermer la fiche de liste",
    rosterDetailUnitCountSingle: "{count} unité",
    rosterDetailUnitCountPlural: "{count} unités",
    rosterDetailModelsLine: "{count} figurines @ {value}",
    rosterDetailOwnedLabel: "Possédées",
    rosterDetailOwnedYes: "Oui",
    rosterDetailOwnedNo: "Non",
    rosterDetailUnnamedUnit: "Unité sans nom",
    rosterDetailStatsModelLabel: "Figurine",
    rosterDetailStatNameM: "Mouvement",
    rosterDetailStatNameWS: "Capacité de combat",
    rosterDetailStatNameBS: "Capacité de tir",
    rosterDetailStatNameS: "Force",
    rosterDetailStatNameT: "Endurance",
    rosterDetailStatNameW: "Blessures",
    rosterDetailStatNameI: "Initiative",
    rosterDetailStatNameA: "Attaques",
    rosterDetailStatNameLd: "Commandement",
    rosterDetailSpecialRulesLabel: "Règles spéciales",
    rosterDetailProfileFallback: "Profil {index}",
    rosterDetailMountLabel: "Monture",
    rosterDetailSidebarUnitSize: "Taille de l'unité",
    rosterDetailSidebarBaseSize: "Taille du socle",
    rosterDetailSidebarArmourValue: "Valeur d'armure",
    rosterDetailSidebarMountUnitSize: "{mount} – taille de l'unité",
    rosterDetailSidebarMountBaseSize: "{mount} – taille du socle",
    rosterDetailSidebarMountArmourValue: "{mount} – valeur d'armure",
    unitSearchHeading: "Recherche d'unités",
    unitSearchInputLabel: "Rechercher une unité",
    unitSearchPlaceholder: "Saisissez un nom d'unité…",
    unitSearchClearButton: "Effacer",
    unitSearchResultsCount: "{count} unités trouvées",
    unitSearchNoResults: "Aucune unité ne correspond à la recherche.",
    unitSearchArmyLabel: "Armée",
    unitSearchUnitCategoryLabel: "Catégorie d'unité",
    unitSearchTroopTypeLabel: "Type de troupe",
    unitSearchEquipmentLabel: "Équipement",
    unitSearchProfilesHeading: "Profils",
    rosterExportTitle: "Export de la liste",
    rosterExportDescription:
      "Téléchargez le brouillon actuel en plusieurs formats ou exportez la liste des unités qu'il vous manque.",
    rosterExportMenuJson: "JSON",
    rosterExportMenuPdf: "PDF",
    rosterExportMenuCsv: "CSV",
    rosterExportArmyLabel: "Armée",
    rosterExportCompositionLabel: "Composition",
    rosterExportArmyRuleLabel: "Règle d'armée",
    rosterExportTotalPointsLabel: "Total de points",
    rosterExportUnitsHeading: "Unités",
    rosterExportGeneratedLabel: "Généré",
    rosterExportOptionNoteLabel: "note",
    rosterExportPerModelSuffix: "{value} pts/figurine",
    rosterExportUnknownArmy: "Armée inconnue",
    rosterExportOwnedYes: "oui",
    rosterExportOwnedNo: "non",
    rosterExportUnnamedUnit: "Unité sans nom",
    rosterExportCsvHeaderCategory: "Catégorie",
    rosterExportCsvHeaderUnit: "Unité",
    rosterExportCsvHeaderUnitSize: "Taille",
    rosterExportCsvHeaderPointsPerModel: "Points/figurine",
    rosterExportCsvHeaderBasePoints: "Coût de base",
    rosterExportCsvHeaderOptions: "Options",
    rosterExportCsvHeaderTotalPoints: "Total",
    rosterExportCsvHeaderOwned: "Possédé",
    rosterExportCsvOptionFreeSuffix: "(gratuit)",
    rosterExportUnitNotesLabel: "Notes",
    rosterExportAriaLabel: "Commandes d'export de la liste",
    armyPointsIncreaseAria: "Augmenter de {value}",
    armyPointsDecreaseAria: "Diminuer de {value}",
    footerAriaLabel: "Informations légales et sur le projet",
    footerLegalNotice:
      "Ce site est créé par des fans et n'est en aucun cas affilié, soutenu ou sous licence de Games Workshop. Toutes les marques, noms et contenus liés à Warhammer sont la propriété de Games Workshop Limited. L'objectif du projet est d'aider les nouveaux joueurs à découvrir l'univers de Warhammer. Sérieusement, c'est vraiment très compliqué :)",
    footerCommunityNote: "un projet pour la communauté de joueurs.",
  },
  es: {
    heroTitle: "Constructor de ejércitos Warhammer",
    heroDescription:
      "¡Bienvenido! Estamos empezando—pronto podrás crear y guardar tus listas de ejército. Por ahora, echa un vistazo a lo que viene.",
    rosterButton: "Nueva lista de ejército",
    switchLabel: "Cambiar a la versión en español",
    localeName: "ES",
    editSlug: "edicion-lista",
    editTitle: "Edición de la lista",
    editDescription: "El constructor llegará pronto — aquí irá tu lista de ejército.",
    editMoveToTopLabel: "Volver arriba",
    selectPlaceholder: "— seleccionar —",
    armyLabel: "Ejército",
    armyCompositionLabel: "Composición del ejército",
    armyRuleLabel: "Regla del ejército",
    armyPointsLabel: "Puntos",
    armyPointsSuggestionsLabel: "Sugerencias",
    armyPointsPlaceholder: "Introduce los puntos del ejército",
    rosterNameLabel: "Nombre de la lista",
    rosterNamePh: "Nombre personalizado…",
    rosterDescLabel: "Descripción",
    rosterDescPh: "Breve descripción del ejército…",
    optionalHint: "opcional",
    saveButtonLabel: "Guardar y continuar",
    validationArmyRequired: "Selecciona un ejército.",
    validationPointsRequired: "Establece un límite de puntos mayor que 0.",
    saveSuccess: "Guardado.",
    saveError: "No se pudo guardar el borrador de la lista.",
    categoryAddLabel: "Añadir",
    categoryPtsAvailable: "pts disponibles",
    categoryPtsMissing: "pts faltantes",
    categoryCharactersLabel: "Personajes",
    categoryCoreLabel: "Unidades básicas",
    categoryCorePointsSummary: "actual {current} pts / mín {required} pts",
    categoryCapPointsSummary: "actual {current} pts / máx {limit} pts",
    categorySpecialLabel: "Unidades especiales",
    categoryRareLabel: "Unidades raras",
    categoryMercsLabel: "Mercenarios",
    categoryAlliesLabel: "Aliados",
    categoryHelpDefault: "Todo bien: añade lo que necesites.",
    categoryHelpWarning: "Aumenta esta categoría para cumplir el mínimo.",
    categoryToggleCloseLabel: "Cerrar",
    categorySelectPlaceholder: "Selecciona una unidad",
    categoryConfirmAddLabel: "Añadir unidad",
    categoryConfirmSaveLabel: "Guardar",
    categoryCancelLabel: "Cancelar",
    categoryEmptyUnitsMessage: "No hay unidades disponibles para esta composición.",
    categoryUnitSectionLocked: "Selección de unidades bloqueada",
    categoryOptionsDefaultLabel: "Opciones",
    categoryOptionGroupCommandLabel: "Mando",
    categoryOptionGroupEquipmentLabel: "Armas",
    categoryOptionGroupArmorLabel: "Armadura",
    categoryOptionGroupMountsLabel: "Monturas",
    categoryLockedNoticeDescription:
      "Completa la configuración (ejército, nombre, puntos) y guarda para añadir unidades.",
    categoryConfiguratorPrompt: "Selecciona una categoría para ver las opciones disponibles.",
    categoryOptionsTitle: "Opciones para {category}",
    categoryEditTitle: "Editar",
    categoryUnitSizeLabel: "Tamaño de la unidad",
    categoryUnitPointsPerModel: "{value} pts por miniatura",
    categoryUnitFlatCost: "Coste fijo",
    categoryUnitIncreaseAria: "Aumentar el tamaño de la unidad",
    categoryUnitDecreaseAria: "Disminuir el tamaño de la unidad",
    categoryUnitMinLabel: "Mín",
    categoryUnitMaxLabel: "Máx",
    categoryUnitTotalPoints: "{value} pts en total",
    categoryNoAdditionalOptions: "No hay opciones adicionales para esta unidad.",
    categoryOptionCostFree: "gratis",
    categoryOptionCostPerModelSuffix: " / miniatura",
    categoryPointsValue: "{value} pts",
    categoryEntrySingleModel: "Modelo único",
    categoryEntryMultipleModels: "{count} modelos",
    categoryEntryPointsPerModel: "{value} pts por miniatura",
    rosterSummaryHeading: "Resumen de la lista",
    rosterSummaryDefaultName: "Lista sin nombre",
    rosterDownloadButton: "Descargar la lista",
    rosterPrintButton: "Imprimir la lista",
    rosterPointsLimitLabel: "Límite de puntos",
    rosterTotalSpentLabel: "Total gastado",
    rosterSummaryEmptyMessage:
      "Aún no hay unidades seleccionadas. Usa las categorías para añadir entradas.",
    rosterSummaryOwnedLabel: "Poseo esta unidad",
    rosterSummaryShowDetails: "Mostrar detalles",
    rosterSummaryHideDetails: "Ocultar detalles",
    rosterSummaryRemoveButton: "Eliminar",
    rosterSummaryRemoveAria: "Eliminar {unit}",
    rosterSummaryBaseCost: "Coste base: {value}",
    rosterSetupHeading: "Configuración de la lista",
    rosterSetupEditButton: "Editar detalles",
    rosterSetupCollapseButton: "Colapsar",
    rosterSetupSaveButton: "Guardar",
    rosterSetupSavedButton: "Guardado",
    rosterClipboardHeading: "Portapapeles",
    rosterClipboardSaveButton: "Guardar en el portapapeles",
    rosterClipboardEmpty: "El portapapeles está vacío.",
    rosterClipboardRestoreButton: "Restaurar",
    rosterClipboardRemoveButton: "Eliminar",
    headerBrandLabel: "Warhammer Old World Army Builder",
    headerSwitchLocaleLabel: "Cambiar el idioma a {locale}",
    rosterDetailHeading: "Hoja de lista",
    rosterDetailEmptyMessage:
      "Añade unidades a la lista para ver sus detalles y estadísticas.",
    rosterDetailStatsMissing:
      "Las estadísticas de las unidades para el ejército seleccionado aún no están completas. Las unidades sin datos mostrarán marcadores de posición.",
    rosterDetailCloseAria: "Cerrar la hoja de lista",
    rosterDetailUnitCountSingle: "{count} unidad",
    rosterDetailUnitCountPlural: "{count} unidades",
    rosterDetailModelsLine: "{count} miniaturas @ {value}",
    rosterDetailOwnedLabel: "Poseídas",
    rosterDetailOwnedYes: "Sí",
    rosterDetailOwnedNo: "No",
    rosterDetailUnnamedUnit: "Unidad sin nombre",
    rosterDetailStatsModelLabel: "Miniatura",
    rosterDetailStatNameM: "Movimiento",
    rosterDetailStatNameWS: "Habilidad de combate",
    rosterDetailStatNameBS: "Habilidad de disparo",
    rosterDetailStatNameS: "Fuerza",
    rosterDetailStatNameT: "Resistencia",
    rosterDetailStatNameW: "Heridas",
    rosterDetailStatNameI: "Iniciativa",
    rosterDetailStatNameA: "Ataques",
    rosterDetailStatNameLd: "Liderazgo",
    rosterDetailSpecialRulesLabel: "Reglas especiales",
    rosterDetailProfileFallback: "Perfil {index}",
    rosterDetailMountLabel: "Montura",
    rosterDetailSidebarUnitSize: "Tamaño de la unidad",
    rosterDetailSidebarBaseSize: "Tamaño de peana",
    rosterDetailSidebarArmourValue: "Valor de armadura",
    rosterDetailSidebarMountUnitSize: "{mount} – tamaño de la unidad",
    rosterDetailSidebarMountBaseSize: "{mount} – tamaño de peana",
    rosterDetailSidebarMountArmourValue: "{mount} – valor de armadura",
    unitSearchHeading: "Buscador de unidades",
    unitSearchInputLabel: "Buscar una unidad",
    unitSearchPlaceholder: "Escribe el nombre de una unidad…",
    unitSearchClearButton: "Borrar",
    unitSearchResultsCount: "Encontradas {count} unidades",
    unitSearchNoResults: "Ninguna unidad coincide con la búsqueda.",
    unitSearchArmyLabel: "Ejército",
    unitSearchUnitCategoryLabel: "Categoría de unidad",
    unitSearchTroopTypeLabel: "Tipo de tropa",
    unitSearchEquipmentLabel: "Equipo",
    unitSearchProfilesHeading: "Perfiles",
    rosterExportTitle: "Exportar lista",
    rosterExportDescription:
      "Descarga el borrador actual en varios formatos o exporta la lista de unidades que aún necesitas.",
    rosterExportMenuJson: "JSON",
    rosterExportMenuPdf: "PDF",
    rosterExportMenuCsv: "CSV",
    rosterExportArmyLabel: "Ejército",
    rosterExportCompositionLabel: "Composición",
    rosterExportArmyRuleLabel: "Regla del ejército",
    rosterExportTotalPointsLabel: "Total de puntos",
    rosterExportUnitsHeading: "Unidades",
    rosterExportGeneratedLabel: "Generado",
    rosterExportOptionNoteLabel: "nota",
    rosterExportPerModelSuffix: "{value} pts/miniatura",
    rosterExportUnknownArmy: "Ejército desconocido",
    rosterExportOwnedYes: "sí",
    rosterExportOwnedNo: "no",
    rosterExportUnnamedUnit: "Unidad sin nombre",
    rosterExportCsvHeaderCategory: "Categoría",
    rosterExportCsvHeaderUnit: "Unidad",
    rosterExportCsvHeaderUnitSize: "Tamaño",
    rosterExportCsvHeaderPointsPerModel: "Puntos/miniatura",
    rosterExportCsvHeaderBasePoints: "Coste base",
    rosterExportCsvHeaderOptions: "Opciones",
    rosterExportCsvHeaderTotalPoints: "Total",
    rosterExportCsvHeaderOwned: "Poseído",
    rosterExportCsvOptionFreeSuffix: "(gratis)",
    rosterExportUnitNotesLabel: "Notas",
    rosterExportAriaLabel: "Controles de exportación de la lista",
    armyPointsIncreaseAria: "Aumentar en {value}",
    armyPointsDecreaseAria: "Disminuir en {value}",
    footerAriaLabel: "Información legal y del proyecto",
    footerLegalNotice:
      "Este sitio es un proyecto de fans y no está afiliado, respaldado ni licenciado por Games Workshop. Todas las marcas, nombres y materiales relacionados con Warhammer son propiedad de Games Workshop Limited. El objetivo de este proyecto es ayudar a los nuevos jugadores a comenzar su aventura en el mundo de Warhammer. En serio, todo esto es realmente muy complicado :)",
    footerCommunityNote: "un proyecto para la comunidad de jugadores.",
  },
} satisfies Record<Locale, LocaleDictionary>;

export function getDictionary(locale: string): LocaleDictionary {
  const safe = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[safe];
}

export function getAlternateLocale(current: Locale): Locale {
  const currentIndex = locales.indexOf(current);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % locales.length : 0;
  return locales[nextIndex] ?? defaultLocale;
}
