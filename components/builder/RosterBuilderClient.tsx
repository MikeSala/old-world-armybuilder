"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import ArmyPointsCounter from "@/components/builder/ArmyPointsCounter";
import ArmyRulesSelectClient from "@/components/builder/ArmyRulesSelectClient";
import RosterMetaClient from "@/components/builder/RosterMetaClient";
import { Button } from "@/components/ui/Button";
import Select, { SelectOption } from "@/components/ui/Select";
import { ARMIES } from "@/lib/data/armies/armies";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import { tData } from "@/lib/i18n/data";
import type { AppDispatch, RootState } from "@/lib/store";
import { setCatalogArmy } from "@/lib/store/slices/catalogSlice";
import {
  CLIPBOARD_LIMIT,
  removeClipboardItem,
  saveToClipboard,
} from "@/lib/store/slices/clipboardSlice";
import type { RosterDraft, ValidationErrors } from "@/lib/store/slices/rosterSlice";
import {
  loadDraft,
  rosterInitialState,
  setArmy,
  setArmyRule,
  setComposition,
  setSavedAt,
  setSaving,
  setSetupCollapsed,
  setValidationErrors,
} from "@/lib/store/slices/rosterSlice";

// Minimal dictionary the component expects
type Dict = Pick<
  LocaleDictionary,
  | "localeName"
  | "selectPlaceholder"
  | "armyLabel"
  | "armyCompositionLabel"
  | "armyRuleLabel"
  | "armyPointsLabel"
  | "armyPointsSuggestionsLabel"
  | "armyPointsPlaceholder"
  | "armyPointsIncreaseAria"
  | "armyPointsDecreaseAria"
  | "rosterNameLabel"
  | "rosterNamePh"
  | "rosterDescLabel"
  | "rosterDescPh"
  | "optionalHint"
  | "saveButtonLabel"
  | "validationArmyRequired"
  | "validationPointsRequired"
  | "saveSuccess"
  | "saveError"
  | "rosterSetupHeading"
  | "rosterSetupEditButton"
  | "rosterSetupCollapseButton"
  | "rosterSetupSaveButton"
  | "rosterSetupSavedButton"
  | "rosterSummaryDefaultName"
  | "rosterExportUnknownArmy"
  | "rosterPointsLimitLabel"
  | "categoryPointsValue"
  | "rosterClipboardHeading"
  | "rosterClipboardSaveButton"
  | "rosterClipboardEmpty"
  | "rosterClipboardRestoreButton"
  | "rosterClipboardRemoveButton"
>;

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
  const { armyId, compositionId, armyRuleId, pointsLimit } = draftState;
  const collapsed = setupCollapsed ?? false;
  const clipboardItems = useSelector((s: RootState) => s.clipboard?.items ?? []);

  const clientArmies = React.useMemo(
    () =>
      ARMIES.map((a) => ({
        id: a.id,
        label: tData(a.nameKey, dict),
        children: (a.compositions ?? []).map((c) => ({
          id: c.id,
          label: tData(c.nameKey, dict),
        })),
      })),
    [dict]
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

  const handleSaveToClipboard = () => {
    if (!validate()) return;
    dispatch(saveToClipboard({ draft: draftState }));
  };

  const handleRestoreFromClipboard = (draft: RosterDraft, savedAt: number) => {
    dispatch(loadDraft(draft));
    dispatch(setSavedAt(savedAt));
    dispatch(setValidationErrors({}));
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
                      localeName: dict.localeName,
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
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            size="md"
            onClick={handleSave}
            disabled={saving}
            className={`rounded-md px-4 py-2 font-semibold text-amber-50 shadow disabled:opacity-60 ${
              savedAt
                ? "bg-amber-700 hover:bg-amber-700/90 focus-visible:bg-amber-700"
                : "bg-amber-600 hover:bg-amber-500"
            }`}
          >
            {savedAt ? dict.rosterSetupSavedButton : dict.rosterSetupSaveButton}
          </Button>
          <Button
            type="button"
            size="md"
            variant="outline"
            onClick={handleSaveToClipboard}
            disabled={saving}
          >
            {dict.rosterClipboardSaveButton}
          </Button>
        </div>

        <section className="rounded-2xl border border-amber-300/20 bg-slate-900/30 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              {dict.rosterClipboardHeading} ({clipboardItems.length}/{CLIPBOARD_LIMIT})
            </h4>
          </div>
          {clipboardItems.length === 0 ? (
            <p className="mt-3 text-sm text-amber-200/60">{dict.rosterClipboardEmpty}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {clipboardItems.map((item) => {
                const armyLabel =
                  clientArmies.find((army) => army.id === item.draft.armyId)?.label ??
                  dict.rosterExportUnknownArmy;
                const rosterName =
                  item.name && item.name.trim().length > 0
                    ? item.name
                    : item.draft.name && item.draft.name.trim().length > 0
                    ? item.draft.name
                    : dict.rosterSummaryDefaultName;
                const pointsLabel = dict.categoryPointsValue.replace(
                  "{value}",
                  String(item.draft.pointsLimit ?? 0)
                );

                return (
                  <li
                    key={item.id}
                    className="rounded-lg border border-amber-300/20 bg-slate-900/60 px-3 py-2"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-amber-100">{rosterName}</span>
                        <span className="text-xs text-amber-200/70">
                          {dict.armyLabel}: {armyLabel}
                        </span>
                        <span className="text-xs text-amber-200/70">
                          {dict.rosterPointsLimitLabel}: {pointsLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRestoreFromClipboard(item.draft, item.savedAt)}
                        >
                          {dict.rosterClipboardRestoreButton}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dispatch(removeClipboardItem(item.id))}
                        >
                          {dict.rosterClipboardRemoveButton}
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
