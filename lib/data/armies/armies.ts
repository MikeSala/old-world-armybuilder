import type { DataKey } from "@/lib/i18n/data";

// minimalny kształt danych — zero skomplikowania
export type Army = {
  id: string;
  nameKey: DataKey;
  isLegacy?: boolean;
  compositions?: { id: string; nameKey: DataKey }[];
};

export type ArmyRule = {
  id: string;
  nameKey: DataKey;
};

export const ARMY_RULES: ArmyRule[] = [
  { id: "open-war", nameKey: "armyRule.open-war" },
  { id: "grand-melee", nameKey: "armyRule.grand-melee" },
  { id: "combined-arms", nameKey: "armyRule.combined-arms" },
  { id: "hybrid", nameKey: "armyRule.hybrid" },
  { id: "battle-march", nameKey: "armyRule.battle-march" },
];

export const ARMIES: Army[] = [
  {
    id: "beastmen",
    nameKey: "army.beastmen",
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "minotaur-blood-herd", nameKey: "composition.minotaur-blood-herd" },
      { id: "wild-herd", nameKey: "composition.wild-herd" },
    ],
  },
  {
    id: "chaos-dwarfs",
    nameKey: "army.chaos-dwarfs",
    isLegacy: true,
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "renegade", nameKey: "composition.renegades" },
    ],
  },
  {
    id: "daemons-of-chaos",
    nameKey: "army.daemons-of-chaos",
    isLegacy: true,
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "renegade", nameKey: "composition.renegades" },
    ],
  },
  {
    id: "dark-elves",
    nameKey: "army.dark-elves",
    isLegacy: true,
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "renegade", nameKey: "composition.renegades" },
    ],
  },
  {
    id: "dwarfen-mountain-holds",
    nameKey: "army.dwarfen-mountain-holds",
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "royal-clan", nameKey: "composition.royal-clan" },
      { id: "expeditionary-force", nameKey: "composition.expeditionary-force" },
      { id: "slayer-host", nameKey: "composition.slayer-host" },
    ],
  },

  {
    id: "empire-of-man",
    nameKey: "army.empire-of-man",
    compositions: [
      { id: "core", nameKey: "composition.core" },
      { id: "nuln", nameKey: "composition.nuln" },
      { id: "knights-panther", nameKey: "composition.knights-panther" },
      { id: "white-wolf", nameKey: "composition.white-wolf" },
      { id: "blazing-sun", nameKey: "composition.blazing-sun" },
      { id: "morr", nameKey: "composition.morr" },
      { id: "fiery-heart", nameKey: "composition.fiery-heart" },
    ],
  },

  {
    id: "grand-cathay",
    nameKey: "army.grand-cathay",
    compositions: [{ id: "core", nameKey: "composition.core" }],
  },
  {
    id: "high-elf-realms",
    nameKey: "army.high-elf-realms",
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "chracian-warhost", nameKey: "composition.chracian-warhost" },
      { id: "sea-guard-garrison", nameKey: "composition.sea-guard-garrison" },
    ],
  },
  {
    id: "kingdom-of-bretonnia",
    nameKey: "army.kingdom-of-bretonnia",
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "errantry-crusades", nameKey: "composition.errantry-crusades" },
      { id: "bretonnian-exiles", nameKey: "composition.bretonnian-exiles" },
    ],
  },
  {
    id: "lizardmen",
    nameKey: "army.lizardmen",
    isLegacy: true,
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "renegade", nameKey: "composition.renegades" },
    ],
  },
  {
    id: "ogre-kingdoms",
    nameKey: "army.ogre-kingdoms",
    isLegacy: true,
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "renegade", nameKey: "composition.renegades" },
    ],
  },
  {
    id: "orc-goblin-tribes",
    nameKey: "army.orc-goblin-tribes",
    compositions: [
      { id: "nomadic-waaagh", nameKey: "composition.nomadic-waaagh" },
      { id: "troll-horde", nameKey: "composition.troll-horde" },
    ],
  },
  {
    id: "renegade-crowns",
    nameKey: "army.renegade-crowns",
    compositions: [{ id: "grand-army", nameKey: "composition.grand-army" }],
  },
  {
    id: "skaven",
    nameKey: "army.skaven",
    isLegacy: true,
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "renegade", nameKey: "composition.renegades" },
    ],
  },
  {
    id: "tomb-kings-of-khemri",
    nameKey: "army.tomb-kings-of-khemri",
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "nehekharan-royal-hosts", nameKey: "composition.nehekharan-royal-hosts" },
      { id: "mortuary-cults", nameKey: "composition.mortuary-cults" },
    ],
  },
  {
    id: "vampire-counts",
    nameKey: "army.vampire-counts",
    isLegacy: true,
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "renegade", nameKey: "composition.renegades" },
    ],
  },
  {
    id: "warriors-of-chaos",
    nameKey: "army.warriors-of-chaos",
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "wolves-of-the-sea", nameKey: "composition.wolves-of-the-sea" },
      { id: "heralds-of-darkness", nameKey: "composition.heralds-of-darkness" },
    ],
  },
  {
    id: "wood-elf-realms",
    nameKey: "army.wood-elf-realms",
    compositions: [
      { id: "grand-army", nameKey: "composition.grand-army" },
      { id: "orions-wild-hunt", nameKey: "composition.orions-wild-hunt" },
      { id: "host-of-talsyn", nameKey: "composition.host-of-talsyn" },
    ],
  },
];
