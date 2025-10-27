import type { MagicItemDef } from "@/lib/data/domain/types/items";

// Note: Some Enchanted Items like "Laurels of Victory", "Ring of Fortune", "Ring of Taal"
// are defined in the global catalog (lib/data/domain/items/global.ts) and merged at runtime.
// Items unikatowe dla Imperium (z Twojego zrzutu)
export const EMPIRE_MAGIC_ITEMS: MagicItemDef[] = [
  // Magic Weapons
  {
    id: "runefang",
    name: "Runefang",
    points: 100,
    category: "magic-weapon",
    armyId: "empire-of-man",
    unique: true,
  },
  {
    id: "mace-of-helstrum",
    name: "Mace of Helstrum",
    points: 65,
    category: "magic-weapon",
    armyId: "empire-of-man",
  },
  {
    id: "sword-of-justice",
    name: "Sword of Justice",
    points: 50,
    category: "magic-weapon",
    armyId: "empire-of-man",
  },
  {
    id: "hammer-of-righteousness",
    name: "Hammer of Righteousness",
    points: 50,
    category: "magic-weapon",
    armyId: "empire-of-man",
  },
  {
    id: "pearl-daggers",
    name: "Pearl Daggers",
    points: 35,
    category: "magic-weapon",
    armyId: "empire-of-man",
  },
  {
    id: "dragon-bow",
    name: "Dragon Bow",
    points: 25,
    category: "magic-weapon",
    armyId: "empire-of-man",
  },

  // Magic Armour
  {
    id: "armour-of-fortune",
    name: "Armour of Fortune",
    points: 45,
    category: "magic-armour",
    armyId: "empire-of-man",
  },
  {
    id: "twice-blessed-armour",
    name: "Twice-Blessed Armour",
    points: 25,
    category: "magic-armour",
    armyId: "empire-of-man",
  },

  // Talismans
  {
    id: "the-white-cloak",
    name: "The White Cloak",
    points: 30,
    category: "talisman",
    armyId: "empire-of-man",
  },
  {
    id: "jade-amulet",
    name: "Jade Amulet",
    points: 25,
    category: "talisman",
    armyId: "empire-of-man",
  },
  {
    id: "witch-hunters-ward",
    name: "Witch Hunter's Ward",
    points: 20,
    category: "talisman",
    armyId: "empire-of-man",
  },
  {
    id: "slayers-hourglass",
    name: "Slayer's Hourglass",
    points: 10,
    category: "talisman",
    armyId: "empire-of-man",
  },

  // Enchanted Items (część też jest globalna – tu możesz trzymać tylko te stricto imperialne)
  {
    id: "silver-horn",
    name: "The Silver Horn",
    points: 15,
    category: "enchanted-item",
    armyId: "empire-of-man",
  },
  {
    id: "shroud-of-iron",
    name: "Shroud of Iron",
    points: 10,
    category: "enchanted-item",
    armyId: "empire-of-man",
  },
];

// Mapka dla szybkich lookupów
export const EMPIRE_MAGIC_ITEMS_MAP = Object.fromEntries(
  EMPIRE_MAGIC_ITEMS.map((i) => [i.id, i] as const)
);
