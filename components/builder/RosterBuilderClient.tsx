"use client";

import * as React from "react";
import Select, { SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import ArmyRulesSelectClient from "@/components/builder/ArmyRulesSelectClient";
import ArmyPointsCounter from "@/components/builder/ArmyPointsCounter";
import RosterMetaClient from "@/components/builder/RosterMetaClient";
import { ARMIES } from "@/lib/data/armies/armies";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import type { RosterDraft, ValidationErrors } from "@/lib/store/slices/rosterSlice";
import {
  setArmy,
  setComposition,
  setArmyRule,
  setSaving,
  setSavedAt,
  setValidationErrors,
  rosterInitialState,
} from "@/lib/store/slices/rosterSlice";
import { setCatalogArmy } from "@/lib/store/slices/catalogSlice";

// Minimal dictionary the component expects
type Dict = {
  // labels/placeholders
  selectPlaceholder: string;
  armyLabel: string; // e.g. "Army"
  armyCompositionLabel: string; // e.g. "Composition"
  armyRuleLabel: string; // e.g. "Army Rule"
  armyPointsLabel: string; // for ArmyPointsCounter
  armyPointsSuggestionsLabel: string; // for ArmyPointsCounter
  rosterNameLabel: string;
  rosterNamePh?: string;
  rosterDescLabel: string;
  rosterDescPh?: string;
  optionalHint?: string;
  // buttons / validation / feedback
  saveButtonLabel: string; // e.g. "Save and continue"
  validationArmyRequired: string; // e.g. "Select an army"
  validationPointsRequired: string; // e.g. "Set points limit > 0"
  saveSuccess: string; // e.g. "Saved"
  saveError: string; // e.g. "Could not save"
};

type DraftSnapshot = RosterDraft & { updatedAt: number };

type Props = {
  dict: Dict;
  className?: string;
  onSaved?: (draft: DraftSnapshot) => void;
};

export default function RosterBuilderClient({ dict, className, onSaved }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const rosterState = useSelector((s: RootState) => s.roster) ?? rosterInitialState;
  const draftState = rosterState?.draft ?? rosterInitialState.draft;
  const uiState = rosterState?.ui ?? rosterInitialState.ui;
  const { errors, saving, savedAt } = uiState;
  const { armyId, compositionId, armyRuleId, pointsLimit, name, description } = draftState;
  const [collapsed, setCollapsed] = React.useState(false);

  const clientArmies = React.useMemo(
    () =>
      ARMIES.map((a) => ({
        id: a.id,
        label: a.name,
        children: (a.compositions ?? []).map((c) => ({ id: c.id, label: c.name })),
      })),
    []
  );

  React.useEffect(() => {
    dispatch(setCatalogArmy(armyId ?? undefined));
  }, [dispatch, armyId]);

  const compositionOptions: SelectOption[] = React.useMemo(() => {
    const army = clientArmies.find((a) => a.id === armyId);
    return (army?.children ?? []).map((c) => ({ id: c.id, label: c.label }));
  }, [clientArmies, armyId]);

  const validate = (): boolean => {
    const next: ValidationErrors = {};
    if (!armyId) next.army = dict.validationArmyRequired;
    if (!pointsLimit || pointsLimit <= 0) next.points = dict.validationPointsRequired;
    dispatch(setValidationErrors(next));
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    dispatch(setSaving(true));
    const timestamp = Date.now();
    const snapshot: DraftSnapshot = { ...draftState, updatedAt: timestamp };
    // Redux-persist will store the state; no manual localStorage writes
    dispatch(setSavedAt(timestamp));
    onSaved?.(snapshot);
    dispatch(setSaving(false));
    setCollapsed(true);
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            Roster Setup
          </h3>
          <Button variant="secondary" size="sm" onClick={() => setCollapsed((prev) => !prev)}>
            {collapsed ? "Edit details" : "Collapse"}
          </Button>
        </div>

        {!collapsed ? (
          <div className="flex flex-col gap-6 xl:flex-row">
            <section className="flex-1 space-y-6">
          <div className="rounded-xl border border-amber-300/30 bg-slate-900/30 p-6 shadow-lg shadow-amber-900/10">
            <div className="flex flex-wrap gap-4">
              <div className="flex min-w-[220px] flex-1 flex-col gap-2 md:max-w-xs">
                <Select
                  label={dict.armyLabel}
                  placeholder={dict.selectPlaceholder}
                  options={clientArmies}
                  value={armyId}
                  onChange={(id) => {
                    dispatch(setArmy(id));
                    dispatch(setCatalogArmy(id));
                  }}
                  className="w-full"
                />
                    {errors.army ? <p className="text-sm text-red-300">{errors.army}</p> : null}
                  </div>
                  <div className="flex min-w-[220px] flex-1 flex-col gap-2 md:max-w-xs">
                    <Select
                      label={dict.armyCompositionLabel}
                      placeholder={dict.selectPlaceholder}
                      options={compositionOptions}
                      value={compositionId}
                      onChange={(id) => dispatch(setComposition(id))}
                      disabled={!armyId}
                      className="w-full"
                    />
                  </div>
                  <div className="flex min-w-[220px] flex-1 flex-col gap-2 md:max-w-xs">
                    <ArmyRulesSelectClient
                      dict={{ selectPlaceholder: dict.selectPlaceholder, armyRule: dict.armyRuleLabel }}
                      defaultValue={armyRuleId}
                      onChange={(id) => dispatch(setArmyRule(id))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-300/30 bg-slate-900/30 p-6 shadow-lg shadow-amber-900/10">
                <ArmyPointsCounter
                  dict={{
                    armyPointsLabel: dict.armyPointsLabel,
                    armyPointsSuggestionsLabel: dict.armyPointsSuggestionsLabel,
                  }}
                  className="max-w-xs"
                />
                {errors.points ? <p className="mt-3 text-sm text-red-300">{errors.points}</p> : null}
              </div>
            </section>

            <section className="flex-1 rounded-xl border border-amber-300/30 bg-slate-900/30 p-6 shadow-lg shadow-amber-900/10">
              <RosterMetaClient
                dict={{
                  rosterNameLabel: dict.rosterNameLabel,
                  rosterNamePh: dict.rosterNamePh,
                  rosterDescLabel: dict.rosterDescLabel,
                  rosterDescPh: dict.rosterDescPh,
                  optionalHint: dict.optionalHint,
                }}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-4 rounded-md bg-amber-600 px-4 py-2 font-semibold text-amber-50 shadow hover:bg-amber-500 disabled:opacity-60"
              >
                {dict.saveButtonLabel}
              </button>
              {savedAt ? <span className="ml-3 text-sm text-amber-200">{dict.saveSuccess}</span> : null}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
