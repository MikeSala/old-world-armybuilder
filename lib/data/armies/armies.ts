// minimalny kształt danych — zero skomplikowania
export type Army = {
  id: string;
  name: string;
  compositions?: { id: string; name: string }[];
  units?: any[]; // TODO: refine type once unit structure is finalized
};

export type ArmyRule = {
  id: string;
  name: string;
};

export const ARMY_RULES: ArmyRule[] = [
  { id: "open-war", name: "Open War" },
  { id: "grand-melee", name: "Grand Melee" },
  { id: "combined-arms", name: "Combined Arms" },
  { id: "hybrid", name: "Grand Melee + Combined Arms" },
  { id: "battle-march", name: "Battle March" },
];

export const ARMIES: Army[] = [
  {
    id: "beastmen",
    name: "Beastmen Brayherds",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "chaos-dwarfs",
    name: "Chaos Dwarfs",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "daemons-of-chaos",
    name: "Daemons of Chaos",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "dark-elves",
    name: "Dark Elves",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "dwarfen-mountain-holds",
    name: "Dwarfen Mountain Holds",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },

  {
    id: "empire-of-man",
    name: "Empire of Man",
    compositions: [
      { id: "core", name: "Armia podstawowa" },
      { id: "nuln", name: "City-State of Nuln" },
      { id: "knights-panther", name: "Order of the Knights Panther" },
      { id: "white-wolf", name: "Order of the White Wolf" },
      { id: "blazing-sun", name: "Order of the Blazing Sun" },
      { id: "morr", name: "Order of the Knights of Morr" },
      { id: "fiery-heart", name: "Order of the Fiery Heart" },
    ],
  },

  {
    id: "grand-cathay",
    name: "Grand Cathay",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "high-elf-realms",
    name: "High Elf Realms",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "kingdom-of-bretonnia",
    name: "Kingdom of Bretonnia",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "lizardmen",
    name: "Lizardmen",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "ogre-kingdoms",
    name: "Ogre Kingdoms",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "orc-goblin-tribes",
    name: "Orc & Goblin Tribes",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "renegade-crowns",
    name: "Renegade Crowns",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "skaven",
    name: "Skaven",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "tomb-kings-of-khemri",
    name: "Tomb Kings of Khemri",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "vampire-counts",
    name: "Vampire Counts",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "warriors-of-chaos",
    name: "Warriors of Chaos",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
  {
    id: "wood-elf-realms",
    name: "Wood Elf Realms",
    compositions: [{ id: "core", name: "Armia podstawowa" }],
  },
];
