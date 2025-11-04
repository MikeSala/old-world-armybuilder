"use client";

import { useParams } from "next/navigation";
import * as React from "react";

import { getDictionary, defaultLocale, isLocale } from "@/lib/i18n/dictionaries";

function resolveLocaleParam(raw: string | string[] | undefined): string {
  if (!raw) return defaultLocale;
  if (Array.isArray(raw)) {
    const [first] = raw;
    return isLocale(first) ? first : defaultLocale;
  }
  return isLocale(raw) ? raw : defaultLocale;
}

export default function Footer() {
  const params = useParams();
  const locale = resolveLocaleParam((params as Record<string, string | string[] | undefined>)?.locale);
  const dictionary = React.useMemo(() => getDictionary(locale), [locale]);
  const year = React.useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      aria-label={dictionary.footerAriaLabel}
      className="mt-auto w-full border-t border-amber-300/20 bg-slate-950/80 text-amber-200/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60"
    >
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-sm leading-relaxed">
          {dictionary.footerLegalNotice}
        </p>

        <div className="mt-3 text-xs text-amber-300/70">
          © {year} Old-World Armybuilder — {dictionary.footerCommunityNote}
        </div>
      </div>
    </footer>
  );
}
