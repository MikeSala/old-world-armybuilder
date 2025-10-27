export type UnitId = string;
export type ArmyId = string;
export type FactionId = string;

export type Category = "Lord" | "Hero" | "Core" | "Special" | "Rare";

export interface UnitOption {
  id: string;
  name: string;
  points?: number;
  type?: "weapon" | "armor" | "mount" | "ability" | "magic-item" | "role";
}

export interface UnitDef {
  id: UnitId;
  armyId: ArmyId;
  name: string;
  category: Category;
  general?: boolean;
  standardBearer?: boolean;
  baseCost?: number;
  min?: number;
  max?: number;
  step?: number;
  magicItemsLimit?: number;
  options?: UnitOption[];
  mounts?: UnitOption[];
  abilities?: UnitOption[];
}
