import Link from "next/link";
import { tData, type DataKey } from "@/lib/i18n/data";
import type { Army } from "@/lib/data/armies/armies";
import { getFactionTheme } from "@/lib/data/factions/factionThemes";
import type { Locale } from "@/lib/i18n/dictionaries";
import { buildLocalePath } from "@/lib/i18n/paths";

type FactionCardProps = {
  faction: Army;
  locale: Locale;
  editSlug: string;
};

export function FactionCard({ faction, locale, editSlug }: FactionCardProps) {
  const theme = getFactionTheme(faction.id);
  const name = tData(faction.nameKey as DataKey, locale);
  const Icon = theme.icon;

  return (
    <Link
      href={buildLocalePath(locale, `${editSlug}?army=${faction.id}`)}
      draggable={false}
      className="group relative flex flex-none items-center gap-1.5 px-2.5
                 h-8 rounded-full
                 transition-all duration-200 ease-out hover:scale-[1.04]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{ backgroundColor: theme.primary }}
    >
      <Icon
        className="h-3.5 w-3.5 flex-none text-white transition-all duration-200 group-hover:scale-110"
      />
      <span className="text-[9px] font-semibold uppercase tracking-wider text-white whitespace-nowrap">
        {name}
      </span>
      {/* Shine overlay: left lighter, right darker */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.12) 100%)",
        }}
      />
      {/* Hover ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
        style={{ boxShadow: "0 0 0 3px rgba(120, 113, 108, 0.28)" }}
      />
    </Link>
  );
}
