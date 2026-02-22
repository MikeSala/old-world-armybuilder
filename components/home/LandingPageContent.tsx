import { MarginLayout } from "@/components/layout/MarginLayout";
import { FactionGrid } from "@/components/home/FactionGrid";
import UnitSearch from "@/components/unit/UnitSearch";
import { ARMIES } from "@/lib/data/armies/armies";
import type { Locale, LocaleDictionary } from "@/lib/i18n/dictionaries";

const officialArmies = ARMIES.filter((a) => !a.isLegacy);
const legacyArmies = ARMIES.filter((a) => a.isLegacy);

type Props = {
  dict: LocaleDictionary;
  locale: Locale;
};

export function LandingPageContent({ dict, locale }: Props) {
  return (
    <main>
      {/* Faction Grid Section */}
      <section className="mb-10 py-section-y">
        <MarginLayout>
          <h2 className="mb-4 text-center text-heading-section font-bold uppercase tracking-wider text-stone-800 sm:mb-5 dark:text-stone-200">
            {dict.landingFactionHeading}
          </h2>
        </MarginLayout>
        {/* Full-bleed rows */}
        <div className="relative left-1/2 w-screen -translate-x-1/2 mt-3">
          <FactionGrid locale={locale} editSlug={dict.editSlug} armies={officialArmies} />
        </div>
        <div className="relative left-1/2 w-screen -translate-x-1/2 mt-2">
          <FactionGrid locale={locale} editSlug={dict.editSlug} armies={legacyArmies} />
        </div>
      </section>

      {/* Unit Search Section */}
      <section className="bg-stone-100 dark:bg-stone-600">
        <MarginLayout>
          <UnitSearch dict={dict} className="w-full text-left" />
        </MarginLayout>
      </section>

      {dict.landingSeoTitle ? (
        <section className="py-section-y">
          <MarginLayout>
            <div className="rounded-3xl border border-stone-200 bg-white p-6 text-stone-900 shadow-lg shadow-stone-200/60 sm:p-8 dark:border-stone-300/20 dark:bg-stone-800/70 dark:text-stone-100 dark:shadow-stone-950/40">
              <h2 className="text-2xl font-bold tracking-tight">
                {dict.landingSeoTitle}
              </h2>
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-200/70">{dict.landingSeoLabel}</p>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-stone-700 dark:text-stone-100/85">
                <p>{dict.landingSeoIntro}</p>
                <p>{dict.landingSeoLore}</p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-100/85">
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  {dict.landingSeoPrimaryFactionsTitle}
                </h3>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {dict.landingSeoPrimaryFactions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-100/85">
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  {dict.landingSeoLegacyFactionsTitle}
                </h3>
                <p>{dict.landingSeoLegacyFactions}</p>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-700 dark:text-stone-100/85">
                <p>{dict.landingSeoSearchNote}</p>
                <p>{dict.landingSeoSupportNote}</p>
              </div>
            </div>
          </MarginLayout>
        </section>
      ) : null}
    </main>
  );
}
