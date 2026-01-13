import { dataDe } from "./de";
import { dataEn } from "./en";
import { dataEs } from "./es";
import { dataFr } from "./fr";
import { dataPl } from "./pl";

import {
  defaultLocale,
  isLocale,
  type Locale,
  type LocaleDictionary,
} from "@/lib/i18n/dictionaries";

export type DataDictionary = typeof dataEn;
export type DataKey = keyof DataDictionary;

type LocaleHint = Pick<LocaleDictionary, "localeName">;

const dataDictionaries: Record<Locale, Partial<DataDictionary>> = {
  en: dataEn,
  pl: dataPl,
  de: dataDe,
  fr: dataFr,
  es: dataEs,
};

const resolveLocale = (value?: Locale | LocaleHint | null): Locale => {
  if (!value) return defaultLocale;
  if (typeof value === "string") {
    return isLocale(value) ? value : defaultLocale;
  }
  const candidate = value.localeName?.toLowerCase();
  return candidate && isLocale(candidate) ? candidate : defaultLocale;
};

export const tData = (key: DataKey, localeOrDict?: Locale | LocaleHint | null): string => {
  const locale = resolveLocale(localeOrDict);
  const dict = dataDictionaries[locale] ?? {};
  return dict[key] ?? dataEn[key] ?? key;
};

export const tDataMaybe = (
  key: DataKey | null | undefined,
  localeOrDict?: Locale | LocaleHint | null,
  fallback?: string | null
): string | null => {
  if (!key) return fallback ?? null;
  const value = tData(key, localeOrDict);
  return value ?? fallback ?? null;
};
