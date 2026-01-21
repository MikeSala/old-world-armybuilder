import type { LucideIcon } from "lucide-react";
import {
  Shield,
  Axe,
  Leaf,
  Skull,
  Flame,
  Rat,
  Crown,
  Mountain,
  Swords,
  Cat,
  Gem,
  Sun,
  Moon,
  Snowflake,
  Bug,
  Beef,
} from "lucide-react";

export type FactionTheme = {
  primary: string;
  glow: string;
  bg: string;
  icon: LucideIcon;
};

export const FACTION_THEMES: Record<string, FactionTheme> = {
  // ORDER FACTIONS
  "empire-of-man": {
    primary: "#dc2626", // Red
    glow: "#fbbf24", // Gold
    bg: "#7f1d1d",
    icon: Shield,
  },
  "kingdom-of-bretonnia": {
    primary: "#2563eb", // Royal blue
    glow: "#fcd34d", // Gold
    bg: "#1e3a8a",
    icon: Crown,
  },
  "dwarfen-mountain-holds": {
    primary: "#d97706", // Bronze
    glow: "#f59e0b", // Gold
    bg: "#78350f",
    icon: Axe,
  },
  "high-elf-realms": {
    primary: "#38bdf8", // Sky blue
    glow: "#f8fafc", // Silver
    bg: "#0c4a6e",
    icon: Sun,
  },
  "wood-elf-realms": {
    primary: "#22c55e", // Forest green
    glow: "#84cc16", // Lime
    bg: "#14532d",
    icon: Leaf,
  },
  lizardmen: {
    primary: "#06b6d4", // Turquoise
    glow: "#fbbf24", // Aztec gold
    bg: "#164e63",
    icon: Cat,
  },
  "tomb-kings-of-khemri": {
    primary: "#eab308", // Egyptian gold
    glow: "#0ea5e9", // Magical blue
    bg: "#78350f",
    icon: Sun,
  },
  "grand-cathay": {
    primary: "#dc2626", // Imperial red
    glow: "#fcd34d", // Dragon gold
    bg: "#7f1d1d",
    icon: Mountain,
  },

  // DESTRUCTION FACTIONS
  "orc-goblin-tribes": {
    primary: "#22c55e", // Ork green
    glow: "#facc15", // Teef yellow
    bg: "#14532d",
    icon: Swords,
  },
  "ogre-kingdoms": {
    primary: "#a8a29e", // Gut-plate gray
    glow: "#dc2626", // Blood red
    bg: "#44403c",
    icon: Beef,
  },
  beastmen: {
    primary: "#b45309", // Beast brown
    glow: "#dc2626", // Blood red
    bg: "#451a03",
    icon: Flame,
  },

  // CHAOS FACTIONS
  "warriors-of-chaos": {
    primary: "#4b5563", // Chaos gray
    glow: "#dc2626", // Blood red
    bg: "#111827",
    icon: Skull,
  },
  "daemons-of-chaos": {
    primary: "#a855f7", // Warp purple
    glow: "#ec4899", // Slaanesh pink
    bg: "#4c1d95",
    icon: Flame,
  },
  "chaos-dwarfs": {
    primary: "#dc2626", // Hashut red
    glow: "#f59e0b", // Fire orange
    bg: "#450a0a",
    icon: Axe,
  },
  skaven: {
    primary: "#84cc16", // Warpstone green
    glow: "#a3e635", // Bright green
    bg: "#365314",
    icon: Rat,
  },

  // UNDEAD FACTIONS
  "vampire-counts": {
    primary: "#dc2626", // Blood red
    glow: "#6b21a8", // Purple
    bg: "#450a0a",
    icon: Moon,
  },

  // DARK ELVES
  "dark-elves": {
    primary: "#7c3aed", // Dark purple
    glow: "#0ea5e9", // Cold blue
    bg: "#2e1065",
    icon: Snowflake,
  },

  // NEUTRAL / MERCENARY
  "renegade-crowns": {
    primary: "#78716c", // Mercenary gray
    glow: "#fbbf24", // Gold coin
    bg: "#44403c",
    icon: Gem,
  },
};

export function getFactionTheme(armyId: string): FactionTheme {
  return (
    FACTION_THEMES[armyId] ?? {
      primary: "#fbbf24",
      glow: "#f59e0b",
      bg: "#78350f",
      icon: Shield,
    }
  );
}
