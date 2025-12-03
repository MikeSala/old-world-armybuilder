// minimalny kształt danych — zero skomplikowania
export type Army = {
  id: string;
  name: string;
  compositions?: { id: string; name: string }[];
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
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "minotaur-blood-herd", name: "Minotaur Blood Herd" },
      { id: "wild-herd", name: "Wild Herd" },
    ],
  },
  {
    id: "chaos-dwarfs",
    name: "Chaos Dwarfs",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "renegade", name: "Renegade" },
    ],
  },
  {
    id: "daemons-of-chaos",
    name: "Daemons of Chaos",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "renegade", name: "Renegade" },
    ],
  },
  {
    id: "dark-elves",
    name: "Dark Elves",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "renegade", name: "Renegade" },
    ],
  },
  {
    id: "dwarfen-mountain-holds",
    name: "Dwarfen Mountain Holds",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "royal-clan", name: "Royal Clan" },
      { id: "expeditionary-force", name: "Expeditionary Force" },
      { id: "slayer-host", name: "Slayer Host" },
    ],
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
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "chracian-warhost", name: "The Chracian Warhost" },
      { id: "sea-guard-garrison", name: "Sea Guard Garrison" },
    ],
  },
  {
    id: "kingdom-of-bretonnia",
    name: "Kingdom of Bretonnia",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "errantry-crusades", name: "Errantry Crusades" },
      { id: "bretonnian-exiles", name: "Bretonnian Exiles" },
    ],
  },
  {
    id: "lizardmen",
    name: "Lizardmen",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "renegade", name: "Renegade" },
    ],
  },
  {
    id: "ogre-kingdoms",
    name: "Ogre Kingdoms",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "renegade", name: "Renegade" },
    ],
  },
  {
    id: "orc-goblin-tribes",
    name: "Orc & Goblin Tribes",
    compositions: [
      { id: "nomadic-waaagh", name: "Nomadic Waaagh!" },
      { id: "troll-horde", name: "Troll Horde" },
    ],
  },
  {
    id: "renegade-crowns",
    name: "Renegade Crowns",
    compositions: [{ id: "grand-army", name: "Grand Army" }],
  },
  {
    id: "skaven",
    name: "Skaven",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "renegade", name: "Renegade" },
    ],
  },
  {
    id: "tomb-kings-of-khemri",
    name: "Tomb Kings of Khemri",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "nehekharan-royal-hosts", name: "Nehekharan Royal Hosts" },
      { id: "mortuary-cults", name: "Mortuary Cults" },
    ],
  },
  {
    id: "vampire-counts",
    name: "Vampire Counts",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "renegade", name: "Renegade" },
    ],
  },
  {
    id: "warriors-of-chaos",
    name: "Warriors of Chaos",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "wolves-of-the-sea", name: "Wolves of the Sea" },
      { id: "heralds-of-darkness", name: "Heralds of Darkness" },
    ],
  },
  {
    id: "wood-elf-realms",
    name: "Wood Elf Realms",
    compositions: [
      { id: "grand-army", name: "Grand Army" },
      { id: "orions-wild-hunt", name: "Orion’s Wild Hunt" },
      { id: "host-of-talsyn", name: "Host of Talsyn" },
    ],
  },
];
