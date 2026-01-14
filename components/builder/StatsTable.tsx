import { StatTooltipLabel } from "@/components/ui/StatTooltipLabel";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import {
  formatStatLabel,
  renderStatValue,
  ROSTER_STAT_FIELDS,
  ROSTER_STAT_TOOLTIP_KEYS,
  type RosterStatFieldKey,
} from "@/lib/utils/rosterFormatting";

type StatsRow = {
  label: string;
  values: Partial<Record<RosterStatFieldKey, number | string | null>>;
};

type StatsTableDict = Pick<
  LocaleDictionary,
  | "localeName"
  | "rosterDetailProfileFallback"
  | "rosterDetailStatsModelLabel"
  | "rosterDetailStatNameM"
  | "rosterDetailStatNameWS"
  | "rosterDetailStatNameBS"
  | "rosterDetailStatNameS"
  | "rosterDetailStatNameT"
  | "rosterDetailStatNameW"
  | "rosterDetailStatNameI"
  | "rosterDetailStatNameA"
  | "rosterDetailStatNameLd"
>;

type Props = {
  rows: StatsRow[];
  dict: StatsTableDict;
};

/**
 * Reusable component for displaying unit statistics in a table format.
 * Used in both RosterSummaryList and RosterDetailSheet for consistent stat display.
 */
export function StatsTable({ rows, dict }: Props) {
  return (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="min-w-full divide-y divide-amber-400/20 text-xs print:divide-gray-300 print:text-[11px]">
        <thead className="text-amber-200/70 print:text-gray-600">
          <tr>
            <th className="px-2 py-1 text-left font-semibold uppercase tracking-wide print:text-gray-900 print:text-xs">
              {dict.rosterDetailStatsModelLabel}
            </th>
            {ROSTER_STAT_FIELDS.map((field) => (
              <th
                key={field.key}
                className="px-2 py-1 text-center font-semibold uppercase tracking-wide print:text-gray-900 print:text-xs"
              >
                <StatTooltipLabel
                  abbreviation={field.label}
                  label={dict[ROSTER_STAT_TOOLTIP_KEYS[field.key]]}
                  className="inline-flex w-full justify-center"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="text-amber-200 print:text-gray-900">
              <th className="px-2 py-2 text-left font-semibold print:text-xs">
                {formatStatLabel(row.label, dict)}
              </th>
              {ROSTER_STAT_FIELDS.map((field) => (
                <td
                  key={`${row.label}-${field.key}`}
                  className="px-2 py-2 text-center text-amber-100 print:text-gray-900 print:text-xs"
                >
                  {renderStatValue(row.values[field.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
