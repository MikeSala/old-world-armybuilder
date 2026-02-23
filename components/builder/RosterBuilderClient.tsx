"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import ArmyPointsCounter from "@/components/builder/ArmyPointsCounter";
import ArmyRulesSelectClient from "@/components/builder/ArmyRulesSelectClient";
import RosterMetaClient from "@/components/builder/RosterMetaClient";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
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
  const { errors, saving, savedAt } = uiState;
  const { armyId, compositionId, armyRuleId, pointsLimit } = draftState;
  const clipboardItems = useSelector((s: RootState) => s.clipboard?.items ?? []);
  const [clipboardOpen, setClipboardOpen] = React.useState(false);

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

  // Auto-select first composition when army changes and composition is not set
  React.useEffect(() => {
    if (armyId && !compositionId && compositionOptions.length > 0) {
      dispatch(setComposition(compositionOptions[0].id));
    }
  }, [armyId, compositionId, compositionOptions, dispatch]);

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
    setClipboardOpen(true);
  };

  const handleRestoreFromClipboard = (draft: RosterDraft, restoredSavedAt: number) => {
    dispatch(loadDraft(draft));
    dispatch(setSavedAt(restoredSavedAt));
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
  };

  return (
    <div className={className}>
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-lg shadow-stone-200/50 dark:border-stone-300/30 dark:bg-stone-800/30 dark:shadow-stone-900/10">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-stone-600 dark:text-stone-300">
          {dict.rosterSetupHeading}
        </h3>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Left column - Army settings */}
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
              {errors.army && <p className="text-sm text-red-500 dark:text-red-300">{errors.army}</p>}
            </div>

            <ArmyPointsCounter
              dict={dict}
              className="flex items-center gap-2"
              showLabel={true}
            />
            {errors.points && <p className="text-sm text-red-500 dark:text-red-300">{errors.points}</p>}

            <Select
              label={dict.armyCompositionLabel}
              placeholder={dict.selectPlaceholder}
              options={compositionOptions}
              value={compositionId}
              onChange={(id) => dispatch(setComposition(id))}
              disabled={!armyId}
              className="w-full"
            />

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
          </div>

          {/* Right column - Meta */}
          <div className="flex flex-col gap-4">
            <RosterMetaClient dict={dict} />
          </div>
        </div>

        {/* Action bar + Clipboard — full width below both columns */}
        <div className="mt-4 border-t border-stone-200 pt-4 dark:border-stone-300/10">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="md"
              onClick={handleSave}
              disabled={saving}
              className={`min-w-[120px] rounded-lg border px-4 py-2.5 font-semibold transition-all duration-200 disabled:opacity-60 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-700 ${
                savedAt
                  ? "border-stone-500 bg-stone-200 text-stone-900 hover:bg-stone-300 hover:border-stone-600 dark:border-stone-500 dark:bg-stone-700"
                  : "border-stone-400 bg-stone-100 text-stone-900 hover:bg-stone-200 hover:border-stone-500 dark:border-stone-600 dark:bg-stone-800"
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

            {/* Clipboard toggle */}
            <button
              type="button"
              onClick={() => setClipboardOpen(!clipboardOpen)}
              className="ml-auto flex items-center gap-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
            >
              {dict.rosterClipboardHeading} ({clipboardItems.length}/{CLIPBOARD_LIMIT})
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition-transform duration-200 ${clipboardOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Clipboard items — compact */}
          <div
            className={`grid transition-all duration-300 ease-out ${
              clipboardOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-3">
                {clipboardItems.length === 0 ? (
                  <p className="text-sm text-stone-500 dark:text-stone-200/60">{dict.rosterClipboardEmpty}</p>
                ) : (
                  <ul className="space-y-1.5">
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
                          className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-100 bg-stone-50 px-3 py-1.5 dark:border-stone-300/10 dark:bg-stone-800/50"
                        >
                          <span className="min-w-0 flex-1 truncate text-sm">
                            <span className="font-medium text-stone-800 dark:text-stone-100">{rosterName}</span>
                            <span className="ml-2 text-xs text-stone-500 dark:text-stone-200/60">
                              {armyLabel} · {pointsLabel}
                            </span>
                          </span>
                          <div className="flex shrink-0 items-center gap-1.5">
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
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
