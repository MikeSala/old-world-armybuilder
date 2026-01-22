import type { LocaleDictionary } from "@/lib/i18n/dictionaries";

type HeroSectionProps = {
  dict: LocaleDictionary;
};

export function HeroSection({ dict }: HeroSectionProps) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-section-y">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-slate-900" />
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        {/* Title */}
        <h1
          className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text
                     text-heading-hero font-bold tracking-tight text-transparent
                     animate-fade-in-up"
        >
          {dict.heroTitle}
        </h1>
      </div>
    </section>
  );
}
