import { MarginLayout } from "@/components/layout/MarginLayout";
import { FactionGrid } from "@/components/home/FactionGrid";
import UnitSearch from "@/components/unit/UnitSearch";
import type { Locale, LocaleDictionary } from "@/lib/i18n/dictionaries";

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
          <h2 className="mb-4 text-center text-heading-section font-bold uppercase tracking-wider text-stone-200 sm:mb-5">
            {dict.landingFactionHeading}
          </h2>
          <FactionGrid locale={locale} editSlug={dict.editSlug} />
        </MarginLayout>
      </section>

      {/* Unit Search Section */}
      <section className=" bg-stone-500">
        <MarginLayout>
          <UnitSearch dict={dict} className="w-full text-left" />
        </MarginLayout>
      </section>

      {dict.landingSeoTitle ? (
        <section className="py-section-y">
          <MarginLayout>
            <div className="rounded-3xl border border-stone-300/20 bg-stone-800/70 p-6 text-stone-100 shadow-lg shadow-stone-950/40 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight">
                {dict.landingSeoTitle}
              </h2>
              <p className="mt-2 text-sm text-stone-200/70">{dict.landingSeoLabel}</p>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-stone-100/85">
                <p>{dict.landingSeoIntro}</p>
                <p>{dict.landingSeoLore}</p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-stone-100/85">
                <h3 className="text-base font-semibold text-stone-100">
                  {dict.landingSeoPrimaryFactionsTitle}
                </h3>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {dict.landingSeoPrimaryFactions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 text-sm text-stone-100/85">
                <h3 className="text-base font-semibold text-stone-100">
                  {dict.landingSeoLegacyFactionsTitle}
                </h3>
                <p>{dict.landingSeoLegacyFactions}</p>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-100/85">
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
