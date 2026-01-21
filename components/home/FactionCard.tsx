import Link from "next/link";
import { tData, type DataKey } from "@/lib/i18n/data";
import type { Army } from "@/lib/data/armies/armies";
import { getFactionTheme } from "@/lib/data/factions/factionThemes";
import type { Locale } from "@/lib/i18n/dictionaries";

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
      href={`/${locale}/${editSlug}?army=${faction.id}`}
      className="group relative flex flex-col items-center gap-2 p-3 sm:gap-3 sm:p-4
                 rounded-lg border border-amber-400/20 bg-slate-900/60
                 backdrop-blur-sm transition-all duration-300 ease-out
                 hover:scale-[1.03] hover:-translate-y-0.5
                 hover:bg-slate-900/80 hover:shadow-lg
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      style={
        {
          "--faction-primary": theme.primary,
          "--faction-glow": theme.glow,
        } as React.CSSProperties
      }
    >
      {/* Icon container */}
      <div
        className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full
                   border-2 transition-all duration-300
                   group-hover:scale-110"
        style={{
          borderColor: theme.primary,
          backgroundColor: `${theme.bg}60`,
        }}
      >
        <Icon
          className="h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300"
          style={{ color: theme.primary }}
        />
      </div>

      {/* Faction name */}
      <h3
        className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-amber-100/90
                   text-center leading-tight transition-colors duration-300
                   group-hover:text-amber-50"
      >
        {name}
      </h3>

      {/* Hover border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300
                   group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 15px ${theme.glow}15, 0 0 20px ${theme.glow}15`,
          border: `1px solid ${theme.primary}40`,
          borderRadius: "0.5rem",
        }}
      />
    </Link>
  );
}
