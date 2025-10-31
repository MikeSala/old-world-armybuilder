import beastmen from "@/lib/data/domain/units/beastmen-brayherds.json";
import chaosDwarfs from "@/lib/data/domain/units/chaos-dwarfs.json";
import daemonsOfChaos from "@/lib/data/domain/units/daemons-of-chaos.json";
import darkElves from "@/lib/data/domain/units/dark-elves.json";
import dwarfenMountainHolds from "@/lib/data/domain/units/dwarfen-mountain-holds.json";
import empireOfMan from "@/lib/data/domain/units/empire-of-man.json";
import grandCathay from "@/lib/data/domain/units/grand-cathay.json";
import highElfRealms from "@/lib/data/domain/units/high-elf-realms.json";
import kingdomOfBretonnia from "@/lib/data/domain/units/kingdom-of-bretonnia.json";
import lizardmen from "@/lib/data/domain/units/lizardmen.json";
import ogreKingdoms from "@/lib/data/domain/units/ogre-kingdoms.json";
import orcAndGoblinTribes from "@/lib/data/domain/units/orc-and-goblin-tribes.json";
import renegadeCrowns from "@/lib/data/domain/units/renegade-crowns.json";
import skaven from "@/lib/data/domain/units/skaven.json";
import tombKings from "@/lib/data/domain/units/tomb-kings-of-khemri.json";
import vampireCounts from "@/lib/data/domain/units/vampire-counts.json";
import warriorsOfChaos from "@/lib/data/domain/units/warriors-of-chaos.json";
import woodElfRealms from "@/lib/data/domain/units/wood-elf-realms.json";

export type ArmyUnitsRaw = {
  characters?: unknown[];
  core?: unknown[];
  special?: unknown[];
  rare?: unknown[];
  mercenaries?: unknown[];
  allies?: unknown[];
  [key: string]: unknown;
};

export const DEFAULT_ARMY_ID = "empire-of-man";

export const ARMY_UNIT_DATA: Record<string, ArmyUnitsRaw> = {
  "beastmen-brayherds": beastmen,
  beastmen,
  "chaos-dwarfs": chaosDwarfs,
  "daemons-of-chaos": daemonsOfChaos,
  "dark-elves": darkElves,
  "dwarfen-mountain-holds": dwarfenMountainHolds,
  "empire-of-man": empireOfMan,
  "grand-cathay": grandCathay,
  "high-elf-realms": highElfRealms,
  "kingdom-of-bretonnia": kingdomOfBretonnia,
  lizardmen,
  "ogre-kingdoms": ogreKingdoms,
  "orc-and-goblin-tribes": orcAndGoblinTribes,
  "orc-goblin-tribes": orcAndGoblinTribes,
  "renegade-crowns": renegadeCrowns,
  skaven,
  "tomb-kings-of-khemri": tombKings,
  "vampire-counts": vampireCounts,
  "warriors-of-chaos": warriorsOfChaos,
  "wood-elf-realms": woodElfRealms,
};
