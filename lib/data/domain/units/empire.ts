import type { UnitDef } from "@/lib/data/domain/types/units";

export const EMPIRE_EQUIPMENT = {
  weapons: {
    "hand-weapon": { id: "hand-weapon", name: "Hand weapon", points: 0 },
    "additional-hand-weapon": {
      id: "additional-hand-weapon",
      name: "Additional hand weapon",
      points: 3,
    },
    "great-weapon": { id: "great-weapon", name: "Great weapon", points: 4 },
    halberd: { id: "halberd", name: "Halberd", points: 3 },
    lance: { id: "lance", name: "Lance", points: 4 },
    handgun: { id: "handgun", name: "Handgun", points: 6 },
    longbow: { id: "longbow", name: "Longbow", points: 4 },
  },
  armour: {
    "light-armour": { id: "light-armour", name: "Light armour", points: 0 },
    "heavy-armour": { id: "heavy-armour", name: "Heavy armour", points: 3 },
    "full-plate-armour": {
      id: "full-plate-armour",
      name: "Full plate armour",
      points: 6,
    },
  },
  options: {
    shield: { id: "shield", name: "Shield", points: 2 },
    pistol: { id: "pistol", name: "Pistol", points: 5 },
    "brace-of-pistols": {
      id: "brace-of-pistols",
      name: "Brace of pistols",
      points: 10,
    },
  },
  mounts: {
    "on-foot": { id: "on-foot", name: "On foot", points: 0 },
    "barded-warhorse": {
      id: "barded-warhorse",
      name: "Barded Warhorse",
      points: 16,
    },
    "empire-warhorse": {
      id: "empire-warhorse",
      name: "Empire warhorse",
      points: 12,
    },
    pegasus: { id: "pegasus", name: "Pegasus", points: 30 },
    demigryph: { id: "demigryph", name: "Demigryph", points: 50 },
    griffon: { id: "griffon", name: "Griffon", points: 130 },
  },
} as const;

export const EMPIRE_UNITS: UnitDef[] = [
  {
    id: "general-of-the-empire",
    armyId: "empire-of-man",
    name: "General of the Empire",
    category: "Hero",
    baseCost: 100,
    min: 1,
    max: 1,
    magicItemsLimit: 100,
    options: [
      // Weapons
      EMPIRE_EQUIPMENT.weapons["hand-weapon"],
      EMPIRE_EQUIPMENT.weapons["additional-hand-weapon"],
      EMPIRE_EQUIPMENT.weapons["great-weapon"],
      EMPIRE_EQUIPMENT.weapons["halberd"],
      EMPIRE_EQUIPMENT.weapons["lance"], // if appropriately mounted
      EMPIRE_EQUIPMENT.weapons["handgun"],
      EMPIRE_EQUIPMENT.weapons["longbow"],

      // Armour
      EMPIRE_EQUIPMENT.armour["light-armour"],
      EMPIRE_EQUIPMENT.armour["heavy-armour"],
      EMPIRE_EQUIPMENT.armour["full-plate-armour"],

      // Options
      EMPIRE_EQUIPMENT.options["shield"],
      EMPIRE_EQUIPMENT.options["pistol"],
      EMPIRE_EQUIPMENT.options["brace-of-pistols"],
      { id: "become-general", name: "General", points: 0, type: "role" },
    ],
    mounts: [
      EMPIRE_EQUIPMENT.mounts["on-foot"],
      EMPIRE_EQUIPMENT.mounts["barded-warhorse"],
      EMPIRE_EQUIPMENT.mounts["empire-warhorse"],
      EMPIRE_EQUIPMENT.mounts["pegasus"],
      EMPIRE_EQUIPMENT.mounts["demigryph"],
      EMPIRE_EQUIPMENT.mounts["griffon"],
    ],
    // paints: [], // optionally fill later (painting checklist)
  },
  {
    id: "captain-of-the-empire",
    armyId: "empire-of-man",
    name: "Captain of the Empire",
    category: "Lord",

    baseCost: 45,
    min: 1,
    max: 1,
    magicItemsLimit: 50,
    options: [
      // Weapons
      EMPIRE_EQUIPMENT.weapons["hand-weapon"],
      EMPIRE_EQUIPMENT.weapons["additional-hand-weapon"],
      EMPIRE_EQUIPMENT.weapons["great-weapon"],
      EMPIRE_EQUIPMENT.weapons["halberd"],
      EMPIRE_EQUIPMENT.weapons["lance"], // if appropriately mounted
      EMPIRE_EQUIPMENT.weapons["handgun"],
      EMPIRE_EQUIPMENT.weapons["longbow"],

      // Armour
      EMPIRE_EQUIPMENT.armour["light-armour"],
      EMPIRE_EQUIPMENT.armour["heavy-armour"],
      EMPIRE_EQUIPMENT.armour["full-plate-armour"],

      // Options
      EMPIRE_EQUIPMENT.options["shield"],
      EMPIRE_EQUIPMENT.options["pistol"],
      EMPIRE_EQUIPMENT.options["brace-of-pistols"],
      // Roles (mutually exclusive)
      { id: "become-general", name: "General", points: 0, type: "role" },
      {
        id: "battle-standard-bearer",
        name: "Standard Bearer",
        points: 25,
        type: "role",
      },
    ],
    mounts: [
      EMPIRE_EQUIPMENT.mounts["on-foot"],
      EMPIRE_EQUIPMENT.mounts["barded-warhorse"],
      EMPIRE_EQUIPMENT.mounts["empire-warhorse"],
      EMPIRE_EQUIPMENT.mounts["pegasus"],
      EMPIRE_EQUIPMENT.mounts["demigryph"],
      EMPIRE_EQUIPMENT.mounts["griffon"],
    ],
    // paints: [], // optionally fill later (painting checklist)
  },
  // --- Core Units ---
  {
    id: "state-troops",
    armyId: "empire-of-man",
    name: "State Troops",
    category: "Core",
    baseCost: 50, // for 10 models
    min: 10,
    step: 10,
  },
  {
    id: "veteran-state-troops",
    armyId: "empire-of-man",
    name: "Veteran State Troops",
    category: "Core",
    baseCost: 70, // for 10 models
    min: 10,
    step: 10,
  },
  {
    id: "state-missile-troops",
    armyId: "empire-of-man",
    name: "State Missile Troops",
    category: "Core",
    baseCost: 70, // for 10 models
    min: 10,
    step: 10,
  },
  {
    id: "free-company-militia",
    armyId: "empire-of-man",
    name: "Free Company Militia",
    category: "Core",
    baseCost: 60, // for 10 models
    min: 10,
    step: 10,
  },
  {
    id: "empire-archers",
    armyId: "empire-of-man",
    name: "Empire Archers",
    category: "Core",
    baseCost: 35, // for 5 models
    min: 5,
    step: 5,
  },
  {
    id: "empire-knights",
    armyId: "empire-of-man",
    name: "Empire Knights",
    category: "Core",
    baseCost: 84, // for 4 models
    min: 4,
    step: 4,
  },
  {
    id: "empire-knights-panther",
    armyId: "empire-of-man",
    name: "Empire Knights Panther",
    category: "Core",
    baseCost: 92, // for 4 models
    min: 4,
    step: 4,
  },
  {
    id: "empire-knights-white-wolf",
    armyId: "empire-of-man",
    name: "Empire Knights of the White Wolf",
    category: "Core",
    baseCost: 96, // for 4 models
    min: 4,
    step: 4,
  },
  {
    id: "empire-knights-blazing-sun",
    armyId: "empire-of-man",
    name: "Empire Knights of the Blazing Sun",
    category: "Core",
    baseCost: 92, // for 4 models
    min: 4,
    step: 4,
  },
  {
    id: "empire-knights-of-morr",
    armyId: "empire-of-man",
    name: "Empire Knights of Morr",
    category: "Core",
    baseCost: 96, // for 4 models
    min: 4,
    step: 4,
  },
  {
    id: "empire-knights-fiery-heart",
    armyId: "empire-of-man",
    name: "Empire Knights of the Fiery Heart",
    category: "Core",
    baseCost: 96, // for 4 models
    min: 4,
    step: 4,
  },
];
