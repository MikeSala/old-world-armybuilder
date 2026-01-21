import { ARMIES } from "@/lib/data/armies/armies";
import { FactionCard } from "./FactionCard";
import type { Locale } from "@/lib/i18n/dictionaries";

type FactionGridProps = {
  locale: Locale;
  editSlug: string;
};

export function FactionGrid({ locale, editSlug }: FactionGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 sm:gap-3">
      {ARMIES.map((faction) => (
        <FactionCard
          key={faction.id}
          faction={faction}
          locale={locale}
          editSlug={editSlug}
        />
      ))}
    </div>
  );
}
