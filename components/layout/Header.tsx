import clsx from "clsx";
import Link from "next/link";
import { LocaleButton } from "../ui/LocaleButton";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";

// Layout styles
const headerClass =
  "fixed inset-x-0 top-0 z-50 border-b border-amber-300/20 bg-slate-950/80 backdrop-blur";
const innerClass =
  "mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-8 lg:px-10";

// Button styles
const localeBtnBase = "border text-amber-200/80 transition-colors";
const localeBtnActive = "border-amber-400 bg-amber-500/10 text-amber-200";
const localeBtnIdle = "border-amber-300/40 hover:!border-amber-400 hover:!text-amber-100";

// Safely join URL parts without creating double slashes
function joinPath(parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join("/");
}

// Validate provided locale and fallback to "pl"
function resolveLocale(input: Locale | null | undefined): Locale {
  const candidate = (input ?? "pl") as Locale;
  return locales.includes(candidate) ? candidate : "pl";
}

export async function Header({
  locale,
  restSegments = [],
}: {
  locale: Locale | null;
  restSegments?: readonly string[];
}) {
  const activeBrandLocale = resolveLocale(locale);
  const dictionary = await getDictionary(activeBrandLocale);

  const buildHref = (l: Locale) => `/${joinPath([l, ...(restSegments ?? [])])}`;

  return (
    <header className={headerClass}>
      <div className={innerClass}>
        <Link
          href={`/${activeBrandLocale}`}
          className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200 hover:text-amber-400"
          aria-label={dictionary.headerBrandLabel}
          title={dictionary.headerBrandLabel}
        >
          {dictionary.headerBrandLabel}
        </Link>
        <div className="flex items-center gap-2">
          {locales.map((l) => {
            const isActive = l === activeBrandLocale;
            return (
              <LocaleButton
                key={l}
                locale={l}
                href={buildHref(l)}
                className={clsx(localeBtnBase, isActive ? localeBtnActive : localeBtnIdle)}
              />
            );
          })}
        </div>
      </div>
    </header>
  );
}
