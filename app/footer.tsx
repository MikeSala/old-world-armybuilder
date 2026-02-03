"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Bug } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import * as React from "react";

import TextField from "@/components/builder/TextField";
import { Button } from "@/components/ui/Button";
import { ABOUT_SLUG } from "@/lib/data/about";
import { CHANGELOG_SLUG } from "@/lib/data/changelog";
import { getDictionary, defaultLocale, isLocale, type Locale } from "@/lib/i18n/dictionaries";
import { buildLocalePath, buildLocalePathWithPrefix } from "@/lib/i18n/paths";

function resolveLocaleParam(raw: string | string[] | undefined): Locale {
  if (!raw) return defaultLocale;
  if (Array.isArray(raw)) {
    const [first] = raw;
    return isLocale(first) ? first : defaultLocale;
  }
  return isLocale(raw) ? raw : defaultLocale;
}

export default function Footer() {
  const params = useParams();
  const router = useRouter();
  const locale = resolveLocaleParam(
    (params as Record<string, string | string[] | undefined>)?.locale
  );
  const dictionary = React.useMemo(() => getDictionary(locale), [locale]);
  const year = React.useMemo(() => new Date().getFullYear(), []);
  const changelogHref = React.useMemo(
    () => buildLocalePathWithPrefix("en" as Locale, CHANGELOG_SLUG),
    []
  );
  const aboutHref = React.useMemo(() => buildLocalePath(locale, ABOUT_SLUG), [locale]);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportValue, setReportValue] = React.useState("");
  const [reportError, setReportError] = React.useState<string | null>(null);

  const handleReportChange = React.useCallback(
    (value: string) => {
      setReportValue(value);
      if (reportError) {
        setReportError(null);
      }
    },
    [reportError]
  );

  const handleReportOpenChange = React.useCallback((open: boolean) => {
    setReportOpen(open);
    if (!open) {
      setReportValue("");
      setReportError(null);
    }
  }, []);

  const handleReportSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = reportValue.trim();
      if (!trimmed) {
        setReportError(dictionary.footerReportBugValidation);
        return;
      }

      setReportError(null);
      const subject = dictionary.footerReportBugSubject;
      const body = `${trimmed}\n\n---\nURL: ${window.location.href}\nLocale: ${locale}`;
      const mailtoHref = `mailto:maciek.a.sala@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoHref;
      setReportOpen(false);
    },
    [dictionary.footerReportBugSubject, dictionary.footerReportBugValidation, locale, reportValue]
  );

  return (
    <footer
      aria-label={dictionary.footerAriaLabel}
      className="mt-20 w-full border-t border-amber-300/20 bg-slate-950/80 text-amber-200/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60"
    >
      <div className="mx-auto max-w-wide px-container py-section-y">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm leading-relaxed">{dictionary.footerLegalNotice}</p>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0"
                onClick={() => router.push(aboutHref)}
              >
                {dictionary.aboutTitle}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0"
                onClick={() => router.push(changelogHref)}
              >
                {dictionary.footerChangelogLinkLabel}
              </Button>
            </div>
            <Dialog.Root open={reportOpen} onOpenChange={handleReportOpenChange}>
              <Dialog.Trigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  leftIcon={<Bug className="h-4 w-4" aria-hidden />}
                >
                  {dictionary.footerReportBugButton}
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                {reportOpen ? (
                  <>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/80 data-[state=open]:animate-fade-in" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-amber-300/25 bg-slate-950/95 p-6 text-amber-50 shadow-2xl shadow-amber-900/30 focus:outline-none">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Dialog.Title className="text-lg font-semibold text-amber-100">
                            {dictionary.footerReportBugTitle}
                          </Dialog.Title>
                          <Dialog.Description className="mt-1 text-sm text-amber-200/70">
                            {dictionary.footerReportBugDescription}
                          </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="rounded-full border border-amber-300/30 px-3 py-1 text-xs uppercase tracking-widest text-amber-200/70 transition hover:border-amber-300/60 hover:text-amber-100"
                          >
                            {dictionary.footerReportBugCancel}
                          </button>
                        </Dialog.Close>
                      </div>

                      <form onSubmit={handleReportSubmit} className="mt-5 space-y-4">
                        <TextField
                          label={dictionary.footerReportBugFieldLabel}
                          placeholder={dictionary.footerReportBugPlaceholder}
                          value={reportValue}
                          onChange={handleReportChange}
                          multiline
                          rows={4}
                          maxChars={900}
                          required
                        />
                        {reportError ? (
                          <p className="text-xs text-red-300">{reportError}</p>
                        ) : null}
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Dialog.Close asChild>
                            <Button variant="outline" size="sm" type="button">
                              {dictionary.footerReportBugCancel}
                            </Button>
                          </Dialog.Close>
                          <Button variant="accent" size="sm" type="submit">
                            {dictionary.footerReportBugSubmit}
                          </Button>
                        </div>
                      </form>
                    </Dialog.Content>
                  </>
                ) : null}
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

        <div className="mt-3 text-xs text-amber-300/70">
          © {year} Old-World Armybuilder — {dictionary.footerCommunityNote}
        </div>
      </div>
    </footer>
  );
}
