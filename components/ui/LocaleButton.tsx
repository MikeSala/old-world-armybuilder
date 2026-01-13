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
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition hover:bg-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 text-sm";

// Mapowanie: jaki emoji dla danego języka
const LOCALE_FLAGS: Record<Locale, string> = {
  pl: "🇵🇱",
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
};

export function LocaleButton({ locale, href, className, label, ...props }: LocaleButtonProps) {
  const mergedClassName = className ? `${baseClasses} ${className}` : baseClasses;
  const ariaLabel = label ?? `Switch language to ${locale.toUpperCase()}`;

  return (
    <Link href={href} className={mergedClassName} aria-label={ariaLabel} {...props}>
      <span aria-hidden>{LOCALE_FLAGS[locale]}</span>
      <span className="font-medium uppercase">{locale}</span>
    </Link>
  );
}
