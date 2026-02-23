import type { Army } from "@/lib/data/armies/armies";
import { FactionCard } from "./FactionCard";
import type { Locale } from "@/lib/i18n/dictionaries";

type FactionGridProps = {
  locale: Locale;
  editSlug: string;
  armies: Army[];
};

export function FactionGrid({ locale, editSlug, armies }: FactionGridProps) {
  return (
    <div className="pl-container pr-container py-1">
      <div className="flex flex-wrap justify-center gap-2">
        {armies.map((faction) => (
          <FactionCard key={faction.id} faction={faction} locale={locale} editSlug={editSlug} />
        ))}
      </div>
    </div>
  );
}
