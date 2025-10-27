import type { MagicItemDef } from "@/lib/data/domain/types/items";

// Trzy przykłady – dodasz resztę kiedy chcesz
export const GLOBAL_MAGIC_ITEMS: MagicItemDef[] = [
  // Example global items (uzupełnisz własnymi)
  {
    id: "ring-of-fortune",
    name: "Ring of Fortune",
    points: 20,
    category: "enchanted-item",
  },
  {
    id: "ring-of-taal",
    name: "Ring of Taal",
    points: 20,
    category: "enchanted-item",
  },
  {
    id: "laurels-of-victory",
    name: "Laurels of Victory",
    points: 40,
    category: "enchanted-item",
  },
];

// Szybkie wyszukiwanie po id
export const GLOBAL_MAGIC_ITEMS_MAP = Object.fromEntries(
  GLOBAL_MAGIC_ITEMS.map((i) => [i.id, i] as const)
);
