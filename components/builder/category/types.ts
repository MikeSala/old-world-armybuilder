import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

export type TotalsByCategory = Partial<Record<CategoryKey, number>>;

export type Dict = Pick<
  LocaleDictionary,
  | "categoryAddLabel"
  | "categoryPtsAvailable"
  | "categoryPtsMissing"
  | "categoryCoreLabel"
  | "categoryCorePointsSummary"
  | "categoryCapPointsSummary"
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

export type CategorySection = {
  key: CategoryKey;
  title: string;
  value: number;
  suffix: string;
  formattedValue?: string;
  warning?: boolean;
  enforceCap?: boolean;
};

export type EntriesByCategory = Partial<Record<CategoryKey, RosterEntry[]>>;
