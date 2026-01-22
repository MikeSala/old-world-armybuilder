/**
 * Dictionary type subsets for different components.
 * Consolidates Pick<LocaleDictionary, ...> definitions to avoid duplication.
 */

import type { LocaleDictionary } from "./dictionaries";

/**
 * Common dictionary keys used across multiple components
 */
export type CommonDict = Pick<
  LocaleDictionary,
  | "localeName"
  | "categoryPointsValue"
  | "categoryOptionsDefaultLabel"
  | "categoryOptionGroupCommandLabel"
  | "categoryOptionGroupEquipmentLabel"
  | "categoryOptionGroupArmorLabel"
  | "categoryOptionGroupMountsLabel"
  | "categoryOptionCostFree"
>;

/**
 * Category labels dictionary subset
 */
export type CategoryLabelsDict = Pick<
  LocaleDictionary,
  | "categoryCharactersLabel"
  | "categoryCoreLabel"
  | "categorySpecialLabel"
  | "categoryRareLabel"
  | "categoryMercsLabel"
  | "categoryAlliesLabel"
>;

/**
 * Stats-related dictionary keys
 */
export type StatsDict = Pick<
  LocaleDictionary,
  | "localeName"
  | "rosterDetailProfileFallback"
  | "rosterDetailStatsModelLabel"
  | "rosterDetailStatNameM"
  | "rosterDetailStatNameWS"
  | "rosterDetailStatNameBS"
  | "rosterDetailStatNameS"
  | "rosterDetailStatNameT"
  | "rosterDetailStatNameW"
  | "rosterDetailStatNameI"
  | "rosterDetailStatNameA"
  | "rosterDetailStatNameLd"
>;

/**
 * Dictionary for category configurator and related components
 */
export type CategoryDict = Pick<
  LocaleDictionary,
  | "localeName"
  | "categoryAddLabel"
  | "categoryPtsAvailable"
  | "categoryPtsMissing"
  | "categoryCoreLabel"
  | "categoryCorePointsSummary"
  | "categoryCapPointsSummary"
  | "categoryTotalPointsSummary"
  | "categoryCharactersLabel"
  | "categorySpecialLabel"
  | "categoryRareLabel"
  | "categoryMercsLabel"
  | "categoryAlliesLabel"
  | "categoryHelpDefault"
  | "categoryHelpWarning"
  | "categoryToggleCloseLabel"
  | "categorySelectPlaceholder"
  | "categoryConfirmAddLabel"
  | "categoryConfirmSaveLabel"
  | "categoryCancelLabel"
  | "categoryEmptyUnitsMessage"
  | "categoryUnitSectionLocked"
  | "categoryLockedNoticeDescription"
  | "categoryConfiguratorPrompt"
  | "categoryOptionsDefaultLabel"
  | "categoryOptionGroupCommandLabel"
  | "categoryOptionGroupEquipmentLabel"
  | "categoryOptionGroupArmorLabel"
  | "categoryOptionGroupMountsLabel"
  | "categoryEditTitle"
  | "categoryUnitSizeLabel"
  | "categoryUnitPointsPerModel"
  | "categoryUnitFlatCost"
  | "categoryUnitIncreaseAria"
  | "categoryUnitDecreaseAria"
  | "categoryUnitMinLabel"
  | "categoryUnitMaxLabel"
  | "categoryUnitTotalPoints"
  | "categoryNoAdditionalOptions"
  | "categoryOptionCostFree"
  | "categoryOptionCostPerModelSuffix"
  | "categoryPointsValue"
  | "categoryEntrySingleModel"
  | "categoryEntryMultipleModels"
  | "categoryEntryPointsPerModel"
>;

/**
 * Dictionary for roster detail sheet
 */
export type DetailDict = Pick<
  LocaleDictionary,
  | "localeName"
  | "rosterSummaryDefaultName"
  | "rosterDetailHeading"
  | "rosterDetailEmptyMessage"
  | "rosterPrintButton"
  | "rosterDetailCloseAria"
  | "rosterPointsLimitLabel"
  | "rosterTotalSpentLabel"
  | "rosterDetailStatsMissing"
  | "categoryPointsValue"
  | "categoryCharactersLabel"
  | "categoryCoreLabel"
  | "categorySpecialLabel"
  | "categoryRareLabel"
  | "categoryMercsLabel"
  | "categoryAlliesLabel"
  | "rosterDetailUnitCountSingle"
  | "rosterDetailUnitCountPlural"
  | "rosterDetailModelsLine"
  | "rosterSummaryBaseCost"
  | "rosterDetailOwnedLabel"
  | "rosterDetailOwnedYes"
  | "rosterDetailOwnedNo"
  | "rosterDetailUnnamedUnit"
  | "categoryOptionCostFree"
  | "categoryOptionsDefaultLabel"
  | "categoryOptionGroupCommandLabel"
  | "categoryOptionGroupEquipmentLabel"
  | "categoryOptionGroupArmorLabel"
  | "categoryOptionGroupMountsLabel"
  | "rosterDetailStatsModelLabel"
  | "rosterDetailStatNameM"
  | "rosterDetailStatNameWS"
  | "rosterDetailStatNameBS"
  | "rosterDetailStatNameS"
  | "rosterDetailStatNameT"
  | "rosterDetailStatNameW"
  | "rosterDetailStatNameI"
  | "rosterDetailStatNameA"
  | "rosterDetailStatNameLd"
  | "rosterDetailSpecialRulesLabel"
  | "rosterDetailProfileFallback"
  | "rosterDetailMountLabel"
  | "rosterDetailSidebarUnitSize"
  | "rosterDetailSidebarBaseSize"
  | "rosterDetailSidebarArmourValue"
  | "rosterDetailSidebarMountUnitSize"
  | "rosterDetailSidebarMountBaseSize"
  | "rosterDetailSidebarMountArmourValue"
>;

/**
 * Dictionary for export controls
 */
export type ExportDict = Pick<
  LocaleDictionary,
  | "localeName"
  | "rosterSummaryDefaultName"
  | "rosterExportUnknownArmy"
  | "rosterExportTitle"
  | "rosterExportDescription"
  | "rosterExportMenuPdf"
  | "rosterExportMenuJson"
  | "rosterExportMenuCsv"
  | "rosterExportArmyLabel"
  | "rosterExportCompositionLabel"
  | "rosterExportArmyRuleLabel"
  | "rosterPointsLimitLabel"
  | "rosterExportTotalPointsLabel"
  | "rosterExportUnitsHeading"
  | "rosterDetailModelsLine"
  | "rosterSummaryBaseCost"
  | "categoryOptionCostFree"
  | "categoryOptionCostPerModelSuffix"
  | "categoryOptionsDefaultLabel"
  | "categoryOptionGroupCommandLabel"
  | "categoryOptionGroupEquipmentLabel"
  | "categoryOptionGroupArmorLabel"
  | "categoryOptionGroupMountsLabel"
  | "rosterExportPerModelSuffix"
  | "rosterExportOptionNoteLabel"
  | "rosterExportUnitNotesLabel"
  | "rosterExportGeneratedLabel"
  | "categoryPointsValue"
  | "categoryCharactersLabel"
  | "categoryCoreLabel"
  | "categorySpecialLabel"
  | "categoryRareLabel"
  | "categoryMercsLabel"
  | "categoryAlliesLabel"
  | "rosterExportOwnedYes"
  | "rosterExportOwnedNo"
  | "rosterExportUnnamedUnit"
  | "rosterExportCsvHeaderCategory"
  | "rosterExportCsvHeaderUnit"
  | "rosterExportCsvHeaderUnitSize"
  | "rosterExportCsvHeaderPointsPerModel"
  | "rosterExportCsvHeaderBasePoints"
  | "rosterExportCsvHeaderOptions"
  | "rosterExportCsvHeaderTotalPoints"
  | "rosterExportCsvHeaderOwned"
  | "rosterExportCsvOptionFreeSuffix"
  | "rosterExportAriaLabel"
  | "rosterDownloadButton"
>;
