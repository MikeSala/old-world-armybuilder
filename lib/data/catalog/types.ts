import type { CategoryKey } from "@/lib/data/domain/types/categories";

export type ArmyCompositionRule = {
  category?: CategoryKey | string;
  notes?: Record<string, unknown>;
};

export type ArmyCompositionMap = Record<string, ArmyCompositionRule | undefined>;

export type ArmyUnitOption = {
  id?: string;
  name_en?: string;
  name_de?: string;
  name_fr?: string;
  name_es?: string;
  name_pl?: string;
  name?: string;
  points?: number;
  perModel?: boolean;
  active?: boolean;
  equippedDefault?: boolean;
  notes?: Record<string, unknown>;
  minimum?: number;
  maximum?: number;
};

export type ArmyUnit = {
  id?: string;
  name_en?: string;
  name_de?: string;
  name_fr?: string;
  name_es?: string;
  name_pl?: string;
  name?: string;
  points?: number;
  armyComposition?: ArmyCompositionMap;
  command?: ArmyUnitOption[];
  equipment?: ArmyUnitOption[];
  armor?: ArmyUnitOption[];
  mounts?: ArmyUnitOption[];
  options?: ArmyUnitOption[];
  minimum?: number;
  maximum?: number;
  notes?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ArmyUnitsRaw = Partial<Record<CategoryKey, ArmyUnit[]>> & Record<string, unknown>;

export type NormalizedArmyUnitOption = {
  id: string;
  name: string;
  name_de?: string;
  name_fr?: string;
  name_es?: string;
  name_pl?: string;
  points: number;
  perModel: boolean;
  active: boolean;
  equippedDefault: boolean;
  notes?: Record<string, unknown>;
  note?: string;
  minimum?: number;
  maximum?: number;
};

export type NormalizedArmyUnit = {
  id: string;
  name_en: string;
  name_de?: string;
  name_fr?: string;
  name_es?: string;
  name?: string;
  name_pl?: string;
  points: number;
  armyComposition?: ArmyCompositionMap;
  command: NormalizedArmyUnitOption[];
  equipment: NormalizedArmyUnitOption[];
  armor: NormalizedArmyUnitOption[];
  mounts: NormalizedArmyUnitOption[];
  options: NormalizedArmyUnitOption[];
  minimum?: number;
  maximum?: number;
  notes?: Record<string, unknown>;
};

export type NormalizedArmyUnits = Partial<Record<CategoryKey, NormalizedArmyUnit[]>>;
