import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { CategoryDict } from "@/lib/i18n/dictSubsets";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

export type TotalsByCategory = Partial<Record<CategoryKey, number>>;

export type Dict = CategoryDict;

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
