"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import ArmyPointsCounter from "@/components/builder/ArmyPointsCounter";
import ArmyRulesSelectClient from "@/components/builder/ArmyRulesSelectClient";
import RosterMetaClient from "@/components/builder/RosterMetaClient";
import { Button } from "@/components/ui/Button";
import Select, { SelectOption } from "@/components/ui/Select";
import { ARMIES } from "@/lib/data/armies/armies";
import type { AppDispatch, RootState } from "@/lib/store";
import { setCatalogArmy } from "@/lib/store/slices/catalogSlice";
import type { RosterDraft, ValidationErrors } from "@/lib/store/slices/rosterSlice";
import {
  setArmy,
  setComposition,
  setArmyRule,
  setSaving,
  setSavedAt,
  setValidationErrors,
  rosterInitialState,
  setSetupCollapsed,
} from "@/lib/store/slices/rosterSlice";

// Minimal dictionary the component expects
type Dict = {
  // labels/placeholders
  selectPlaceholder: string;
  armyLabel: string; // e.g. "Army"
  armyCompositionLabel: string; // e.g. "Composition"
  armyRuleLabel: string; // e.g. "Army Rule"
  armyPointsLabel: string; // for ArmyPointsCounter
  armyPointsSuggestionsLabel: string; // for ArmyPointsCounter
  armyPointsPlaceholder: string;
  armyPointsIncreaseAria: string;
  armyPointsDecreaseAria: string;
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
  rosterSetupHeading: string;
  rosterSetupEditButton: string;
  rosterSetupCollapseButton: string;
  rosterSetupSaveButton: string;
  rosterSetupSavedButton: string;
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
  const { errors, saving, savedAt, setupCollapsed } = uiState;
  const { armyId, compositionId, armyRuleId, pointsLimit, name, description } = draftState;
  const collapsed = setupCollapsed ?? false;

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
    dispatch(setSavedAt(timestamp));
    onSaved?.(snapshot);
    dispatch(setSaving(false));
    dispatch(setSetupCollapsed(true));
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            {dict.rosterSetupHeading}
          </h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(setSetupCollapsed(!collapsed))}
          >
            {collapsed ? dict.rosterSetupEditButton : dict.rosterSetupCollapseButton}
          </Button>
        </div>

        {!collapsed ? (
          <section className="rounded-2xl border border-amber-300/30 bg-slate-900/30 p-6 shadow-lg shadow-amber-900/10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                  <ArmyRulesSelectClient
                    dict={{
                      selectPlaceholder: dict.selectPlaceholder,
                      armyRule: dict.armyRuleLabel,
                    }}
                    defaultValue={armyRuleId}
                    onChange={(id) => dispatch(setArmyRule(id))}
                    className="w-full"
                  />
                  <ArmyPointsCounter
                    dict={dict}
                    className="flex items-center gap-2"
                    showLabel={true}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <RosterMetaClient dict={dict} />
                {errors.points ? <p className="text-sm text-red-300">{errors.points}</p> : null}
              </div>
            </div>
          </section>
        ) : null}
        <Button
          type="button"
          size="md"
          onClick={handleSave}
          disabled={saving}
          className={`mt-4 rounded-md px-4 py-2 self-center font-semibold text-amber-50 shadow disabled:opacity-60 ${
            savedAt
              ? "bg-amber-700 hover:bg-amber-700/90 focus-visible:bg-amber-700"
              : "bg-amber-600 hover:bg-amber-500"
          }`}
        >
          {savedAt ? dict.rosterSetupSavedButton : dict.rosterSetupSaveButton}
        </Button>
      </div>
    </div>
  );
}
