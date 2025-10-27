"use client";

import { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { Locale } from "../../lib/i18n/dictionaries";

type LocaleButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  locale: Locale;
  href: string;
  className?: string;
};

const baseClasses =
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition hover:bg-slate-100 text-sm";

// Mapowanie: jaki emoji dla danego języka
const LOCALE_FLAGS: Record<Locale, string> = {
  pl: "🇵🇱",
  en: "🇬🇧",
};

export function LocaleButton({
  locale,
  href,
  className,
  ...props
}: LocaleButtonProps) {
  const mergedClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <Link href={href} className={mergedClassName} {...props}>
      <span>{LOCALE_FLAGS[locale]}</span>
      <span className="font-medium uppercase">{locale}</span>
    </Link>
  );
}
