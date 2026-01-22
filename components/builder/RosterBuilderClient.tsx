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
        {/* Header with edit/collapse toggle */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            {dict.rosterSetupHeading}
          </h3>
          {collapsed && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => dispatch(setSetupCollapsed(false))}
            >
              {dict.rosterSetupEditButton}
            </Button>
          )}
        </div>

        {/* Main setup form */}
        {!collapsed && (
          <section className="rounded-2xl border border-amber-300/30 bg-slate-900/30 p-6 shadow-lg shadow-amber-900/10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              {/* Left column - Army settings */}
              <div className="flex flex-col gap-4">
                {/* Army Select */}
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
                  {errors.army && <p className="text-sm text-red-300">{errors.army}</p>}
                </div>

                {/* Points - moved up for importance */}
                <ArmyPointsCounter
                  dict={dict}
                  className="flex items-center gap-2"
                  showLabel={true}
                />
                {errors.points && <p className="text-sm text-red-300">{errors.points}</p>}

                {/* Composition Select */}
                <Select
                  label={dict.armyCompositionLabel}
                  placeholder={dict.selectPlaceholder}
                  options={compositionOptions}
                  value={compositionId}
                  onChange={(id) => dispatch(setComposition(id))}
                  disabled={!armyId}
                  className="w-full"
                />

                {/* Army Rule Select */}
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

              {/* Right column - Meta + Actions */}
              <div className="flex flex-col gap-4">
                <RosterMetaClient dict={dict} />

                {/* Action buttons - inside the form section */}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 border-t border-amber-300/10">
                  <Button
                    type="button"
                    size="md"
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex-1 min-w-[120px] rounded-lg px-4 py-2.5 font-semibold text-amber-50 shadow-md transition-all duration-200 disabled:opacity-60 ${
                      savedAt
                        ? "bg-amber-700 hover:bg-amber-700/90"
                        : "bg-amber-600 hover:bg-amber-500 hover:shadow-lg"
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
                    className="flex-1 min-w-[120px]"
                  >
                    {dict.rosterClipboardSaveButton}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => dispatch(setSetupCollapsed(true))}
                    className="ml-auto opacity-70 hover:opacity-100"
                  >
                    {dict.rosterSetupCollapseButton}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Collapsible Clipboard Section */}
        <section className="rounded-2xl border border-amber-300/20 bg-slate-900/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setClipboardOpen(!clipboardOpen)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-800/30"
          >
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              {dict.rosterClipboardHeading} ({clipboardItems.length}/{CLIPBOARD_LIMIT})
            </h4>
            <ChevronDownIcon
              className={`h-4 w-4 text-amber-300 transition-transform duration-200 ${
                clipboardOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              clipboardOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 pb-4">
                {clipboardItems.length === 0 ? (
                  <p className="text-sm text-amber-200/60">{dict.rosterClipboardEmpty}</p>
                ) : (
                  <ul className="space-y-2 text-sm">
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
