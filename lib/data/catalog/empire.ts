import empire from "@/lib/data/domain/units/empire-of-man.json";

export type EmpireRaw = typeof empire;

type EmpireCharacter = EmpireRaw["characters"] extends Array<infer T> ? T : never;
type EquipmentLike = { id?: string; name_en?: string } & Record<string, unknown>;

export function buildEmpireIndexes(data: EmpireRaw) {
  const unitsById = new Map<string, EmpireCharacter>();
  const equipmentByName = new Map<string, EquipmentLike>();
  const compositions = new Set<string>();

  const registerEquipment = (items: unknown[] | undefined) => {
    if (!items) return;
    for (const rawItem of items) {
      const eq = rawItem as EquipmentLike;
      const keySource = eq.id ?? eq.name_en;
      if (!keySource) continue;
      const key = String(keySource).toLowerCase();
      if (!equipmentByName.has(key)) {
        equipmentByName.set(key, eq);
      }
    }
  };

  for (const unit of data.characters ?? []) {
    if (unit?.id) {
      unitsById.set(unit.id, unit as EmpireCharacter);
    }
    Object.keys(unit?.armyComposition ?? {}).forEach((composition) => compositions.add(composition));

    registerEquipment(unit?.equipment as unknown[] | undefined);
    registerEquipment(unit?.armor as unknown[] | undefined);
    registerEquipment(unit?.mounts as unknown[] | undefined);
  }

  return { unitsById, equipmentByName, compositions };
}

export const empireIndexes = buildEmpireIndexes(empire);
