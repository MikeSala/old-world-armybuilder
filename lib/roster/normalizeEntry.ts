import type { CategoryKey } from "@/lib/data/domain/types/categories";

export type SelectedOption = {
  id: string;
  name: string;
  points: number;
  group: string;
  note?: string;
  perModel?: boolean;
  baseCost?: number;
  sourceId?: string;
};

export type RosterEntry = {
  id: string;
  unitId: string;
  name: string;
  category: CategoryKey;
  unitSize: number;
  pointsPerModel: number;
  basePoints: number;
  options: SelectedOption[];
  totalPoints: number;
  notes?: string;
  owned: boolean;
};

const CATEGORY_KEYS: CategoryKey[] = [
  "characters",
  "core",
  "special",
  "rare",
  "mercenaries",
  "allies",
];

const isCategoryKey = (value: unknown): value is CategoryKey =>
  typeof value === "string" && CATEGORY_KEYS.includes(value as CategoryKey);

const randomId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2)}`;

export const normalizeRosterOption = (option: any): SelectedOption => ({
  id:
    typeof option?.id === "string" && option.id.trim().length > 0
      ? option.id
      : randomId("option"),
  name: typeof option?.name === "string" && option.name.trim().length > 0 ? option.name : "",
  points: typeof option?.points === "number" ? option.points : 0,
  group: typeof option?.group === "string" && option.group.trim().length > 0 ? option.group : "",
  note: typeof option?.note === "string" ? option.note : undefined,
  perModel: typeof option?.perModel === "boolean" ? option.perModel : undefined,
  baseCost: typeof option?.baseCost === "number" ? option.baseCost : undefined,
  sourceId: typeof option?.sourceId === "string" ? option.sourceId : undefined,
});

export type RosterEntryLike = Partial<RosterEntry> | Record<string, unknown>;

export const normalizeRosterEntry = (entry: RosterEntryLike): RosterEntry => {
  const optionsArray = Array.isArray((entry as any)?.options)
    ? (entry as any).options.map(normalizeRosterOption)
    : [];

  const rawUnitSize = Number((entry as any)?.unitSize);
  const unitSize = Number.isFinite(rawUnitSize) && rawUnitSize > 0 ? Math.floor(rawUnitSize) : 1;

  const rawPointsPerModel = Number((entry as any)?.pointsPerModel);
  const basePointsSource =
    typeof (entry as any)?.basePoints === "number"
      ? (entry as any).basePoints
      : typeof (entry as any)?.points === "number"
      ? (entry as any).points
      : 0;

  const pointsPerModel =
    Number.isFinite(rawPointsPerModel) && rawPointsPerModel > 0
      ? rawPointsPerModel
      : unitSize > 0
      ? basePointsSource / unitSize
      : basePointsSource;

  const normalizedPointsPerModel = Number.isFinite(pointsPerModel) ? pointsPerModel : 0;
  const basePoints = Math.max(0, normalizedPointsPerModel * unitSize);
  const optionsPoints = optionsArray.reduce((sum: number, opt: SelectedOption) => sum + opt.points, 0);

  const totalPoints =
    typeof (entry as any)?.totalPoints === "number" ? (entry as any).totalPoints : basePoints + optionsPoints;

  const category = isCategoryKey((entry as any)?.category) ? ((entry as any).category as CategoryKey) : "core";

  return {
    id:
      typeof (entry as any)?.id === "string" && (entry as any).id.trim().length > 0
        ? (entry as any).id
        : randomId("entry"),
    unitId:
      typeof (entry as any)?.unitId === "string" && (entry as any).unitId.trim().length > 0
        ? (entry as any).unitId
        : "unknown-unit",
    name: typeof (entry as any)?.name === "string" && (entry as any).name.trim().length > 0 ? (entry as any).name : "",
    category,
    unitSize,
    pointsPerModel: normalizedPointsPerModel,
    basePoints,
    options: optionsArray,
    totalPoints,
    notes: typeof (entry as any)?.notes === "string" ? (entry as any).notes : undefined,
    owned: typeof (entry as any)?.owned === "boolean" ? (entry as any).owned : false,
  };
};

export const normalizeRosterEntries = (entries: unknown): RosterEntry[] => {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => normalizeRosterEntry(entry));
};
