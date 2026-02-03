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
    // Prevent navigation when dragging
    if (isDragging) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href={buildLocalePath(locale, `${editSlug}?army=${faction.id}`)}
      onClick={handleClick}
      draggable={false}
      className={`group relative flex flex-none snap-start items-center justify-center p-4
                 h-[160px] w-[170px]
                 rounded-xl border border-amber-400/20 bg-slate-900/60
                 backdrop-blur-sm transition-all duration-300 ease-out
                 hover:bg-slate-900/80 hover:rounded-2xl
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                 ${isDragging ? "cursor-grabbing" : "hover:scale-[1.03] hover:-translate-y-1"}`}
      style={
        {
          "--faction-primary": theme.primary,
          "--faction-glow": theme.glow,
        } as React.CSSProperties
      }
    >
      {/* Animated background glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${theme.glow}20 0%, transparent 70%)`,
        }}
      />

      {/* Icon container with pulse animation */}
      <div
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 -mt-2 items-center justify-center rounded-full
                   border-2 transition-all duration-300 ease-out
                   group-hover:scale-110 group-hover:shadow-lg"
        style={{
          borderColor: theme.primary,
          backgroundColor: `${theme.bg}60`,
          boxShadow: `0 0 0 0 ${theme.glow}00`,
        }}
      >
        <Icon
          className="h-7 w-7 transition-all duration-300 group-hover:scale-110"
          style={{ color: theme.primary }}
        />
      </div>

      {/* Faction name with better typography */}
      <h3
        className="absolute left-3 right-3 top-[108px] text-[11px] font-semibold uppercase tracking-wider text-amber-100/90
                   text-center leading-snug transition-all duration-300
                   group-hover:text-amber-50 group-hover:tracking-widest"
      >
        {name}
      </h3>

      {/* Hover border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-all duration-300
                   group-hover:opacity-100 group-hover:rounded-2xl"
        style={{
          boxShadow: `inset 0 0 20px ${theme.glow}20, 0 0 30px ${theme.glow}15`,
          border: `1px solid ${theme.primary}50`,
        }}
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full transition-all duration-300 ease-out
                   group-hover:w-16"
        style={{ backgroundColor: theme.primary }}
      />
    </Link>
  );
}
