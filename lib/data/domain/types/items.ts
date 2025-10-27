// Minimal set – łatwo rozszerzyć (Arcane, Banners itd.)
export type MagicItemCategory =
  | "magic-weapon"
  | "magic-armour"
  | "talisman"
  | "enchanted-item";

export interface MagicItemDef {
  id: string; // stable key, np. "runefang"
  name: string; // UI label (EN)
  points: number; // cost
  category: MagicItemCategory;
  armyId?: string; // jeśli item jest tylko dla danej armii
  unique?: boolean; // 0–1 w armii
}
