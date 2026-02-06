'use client';

import { useTranslations } from 'next-intl';

export function ServicesHero() {
  const t = useTranslations('ServicesPage.Hero');
  const tServices = useTranslations('ServicesPage.services');

  return (
    <section className="relative w-full min-h-[calc(100vh-88px)] flex flex-col justify-center py-16 lg:py-20 bg-background overflow-hidden" aria-labelledby="services-heading">
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top Detail */}
          <div className="flex items-center justify-between mb-8 lg:mb-12 motion-safe:animate-fade-in">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <span className="text-[10px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-danish-red uppercase">
                {t('title')}
              </span>
              <div className="h-[1px] w-8 sm:w-12 bg-border" aria-hidden="true" />
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground uppercase">
                {t('subtitle')}
              </span>
            </div>
            <div className="hidden lg:block text-[10px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">
              {t('tailoredGuidance')}
            </div>
          </div>

          {/* Statement Headline */}
          <header className="relative mb-12 lg:mb-20">
            <h1 id="services-heading" className="font-serif text-[12vw] sm:text-[13vw] lg:text-[8rem] font-medium leading-[0.9] tracking-tighter text-foreground motion-safe:animate-slide-up">
              {t.rich('mainTitle', {
                br: (chunks) => <br />,
                spanMuted: (chunks) => <span className="text-muted-foreground/40 italic font-light">{chunks}</span>
              })}
            </h1>
          </header>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-24 items-start pt-8 sm:pt-12 border-t border-border/40">
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <h2 className="text-[10px] font-black tracking-[0.3em] text-danish-red uppercase">
                {t('whatWeOffer')}
              </h2>
              <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-foreground/90 font-serif font-light leading-[1.2] sm:leading-[1.15] max-w-2xl motion-safe:animate-fade-in delay-200">
                {t.rich('offerLead', {
                  spanItalic: (chunks) => <span className="italic font-normal">{chunks}</span>
                })}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-6 sm:space-y-8 items-start lg:items-end w-full">
              <div className="space-y-4 sm:space-y-6 w-full lg:max-w-xs">
                <p className="text-sm sm:text-base text-muted-foreground font-sans font-light leading-relaxed">
                  {t('offerDescription')}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 text-[9px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground/30 uppercase w-full justify-start lg:justify-end">
                <button
                  className="hover:text-danish-red transition-colors cursor-pointer min-h-[44px] flex items-center bg-transparent border-0 p-0 focus-visible:text-danish-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danish-red focus-visible:ring-offset-2"
                  aria-label="View consulting services"
                  tabIndex={0}
                >
                  {tServices('consulting.category')}
                </button>
                <button
                  className="hover:text-danish-red transition-colors cursor-pointer min-h-[44px] flex items-center bg-transparent border-0 p-0 focus-visible:text-danish-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danish-red focus-visible:ring-offset-2"
                  aria-label="View document services"
                  tabIndex={0}
                >
                  {tServices('documents.category')}
                </button>
                <button
                  className="hover:text-danish-red transition-colors cursor-pointer min-h-[44px] flex items-center bg-transparent border-0 p-0 focus-visible:text-danish-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danish-red focus-visible:ring-offset-2"
                  aria-label="View relocation services"
                  tabIndex={0}
                >
                  {tServices('relocation.category')}
                </button>
                <button
                  className="hover:text-danish-red transition-colors cursor-pointer min-h-[44px] flex items-center bg-transparent border-0 p-0 focus-visible:text-danish-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danish-red focus-visible:ring-offset-2"
                  aria-label="View support services"
                  tabIndex={0}
                >
                  {tServices('ongoing.category')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-border/20 hidden xl:block" />
    </section>
  );
}
