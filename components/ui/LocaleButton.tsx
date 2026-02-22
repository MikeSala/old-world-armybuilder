"use client";

import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

import { Locale } from "../../lib/i18n/dictionaries";

type LocaleButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  locale: Locale;
  href: string;
  label?: string;
  className?: string;
};

const baseClasses =
  "locale-btn inline-flex items-center justify-center transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-sm overflow-hidden";

// Mapowanie: locale → kod kraju ISO 3166-1 alpha-2 dla flag-icons
const LOCALE_FLAG_CODES: Record<Locale, string> = {
  pl: "pl",
  en: "gb",
  de: "de",
  fr: "fr",
  es: "es",
};

export function LocaleButton({ locale, href, className, label, ...props }: LocaleButtonProps) {
  const mergedClassName = className ? `${baseClasses} ${className}` : baseClasses;
  const ariaLabel = label ?? `Switch language to ${locale.toUpperCase()}`;
  const flagCode = LOCALE_FLAG_CODES[locale];

  return (
    <Link href={href} className={mergedClassName} aria-label={ariaLabel} {...props}>
      <span className={`fi fi-${flagCode}`} style={{ width: "1.875rem", height: "1.4rem" }} />
    </Link>
  );
}
