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
  isDragging?: boolean;
};

export function FactionCard({ faction, locale, editSlug, isDragging = false }: FactionCardProps) {
  const theme = getFactionTheme(faction.id);
  const name = tData(faction.nameKey as DataKey, locale);
  const Icon = theme.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href={buildLocalePath(locale, `${editSlug}?army=${faction.id}`)}
      onClick={handleClick}
      draggable={false}
      className={`group relative flex flex-none snap-start items-center gap-1.5 px-2.5
                 h-8 rounded-full border
                 backdrop-blur-sm transition-all duration-200 ease-out
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400
                 ${isDragging ? "cursor-grabbing" : "hover:scale-[1.04]"}`}
      style={{
        borderColor: `${theme.primary}50`,
        backgroundColor: `${theme.bg}40`,
      }}
    >
      <Icon
        className="h-3.5 w-3.5 flex-none transition-all duration-200 group-hover:scale-110"
        style={{ color: theme.primary }}
      />
      <span
        className="text-[9px] font-semibold uppercase tracking-wider text-stone-800 whitespace-nowrap transition-colors duration-200 group-hover:text-stone-900 dark:text-stone-100/90 dark:group-hover:text-stone-50"
      >
        {name}
      </span>
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 12px ${theme.glow}40, inset 0 0 8px ${theme.glow}15`,
          border: `1px solid ${theme.primary}80`,
        }}
      />
    </Link>
  );
}
