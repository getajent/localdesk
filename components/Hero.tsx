'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const t = useTranslations('HomePage.Hero');

  const handleStartChatting = () => {
    const chatElement = document.getElementById('chat-section');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-88px)] flex flex-col justify-center py-12 sm:py-16 md:py-20 lg:py-24 bg-background overflow-hidden">
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top Detail */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12 motion-safe:animate-fade-in">
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-danish-red uppercase">
                {t('established')}
              </span>
              <div className="h-[1px] w-8 sm:w-10 md:w-12 bg-border" />
              <span className="hidden sm:inline text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground uppercase">
                {t('advisor')}
              </span>
            </div>
            <div className="hidden lg:block text-[10px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">
              {t('heritage')}
            </div>
          </div>

          {/* Statement Headline */}
          <div className="relative mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <h1 className="font-serif text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8rem] font-medium leading-[0.9] tracking-tighter text-foreground motion-safe:animate-slide-up">
              {t('title')} <br />
              <span className="relative inline-block">
                {t('titleDenmark')}
                <div className="absolute -right-8 sm:-right-10 md:-right-12 top-0 text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] font-sans font-black text-danish-red opacity-40 hidden lg:block">
                  &reg;
                </div>
              </span>
              <br />
              <span className="text-muted-foreground/40 italic font-light decoration-danish-red/20 underline decoration-1 underline-offset-[0.5rem] sm:underline-offset-[0.75rem] md:underline-offset-[1rem]">{t('titleFeelLikeHome')}</span>
            </h1>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-24 items-start pt-8 sm:pt-10 md:pt-12 border-t border-border/40">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 md:space-y-6">
              <h2 className="text-[9px] sm:text-[10px] font-black tracking-[0.25em] sm:tracking-[0.3em] text-danish-red uppercase">
                {t('missionLabel')}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-foreground/90 font-serif font-light leading-[1.2] sm:leading-[1.15] max-w-2xl motion-safe:animate-fade-in delay-200">
                {t('missionTitle')} <span className="italic font-normal">{t('missionTitleEmphasis')}</span> {t('missionTitleEnd')}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-6 sm:space-y-7 md:space-y-8 items-start lg:items-end w-full">
              <div className="space-y-4 sm:space-y-5 md:space-y-6 w-full lg:max-w-xs">
                <p className="text-sm sm:text-base text-muted-foreground font-sans font-light leading-relaxed">
                  {t('description')}
                </p>
                <Button
                  onClick={handleStartChatting}
                  className="w-full sm:w-auto sm:min-w-[280px] bg-foreground text-background btn-trend rounded-none h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-500 active:scale-95 group"
                >
                  <span className="relative z-10">{t('cta')}</span>
                  <ArrowRight className="ml-3 sm:ml-4 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-2 relative z-10" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 sm:gap-y-4 text-[8px] sm:text-[9px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground/30 uppercase w-full justify-start lg:justify-end">
                <span className="hover:text-danish-red transition-colors cursor-pointer">{t('topicSkat')}</span>
                <span className="hover:text-danish-red transition-colors cursor-pointer">{t('topicVisas')}</span>
                <span className="hover:text-danish-red transition-colors cursor-pointer">{t('topicSiri')}</span>
                <span className="hover:text-danish-red transition-colors cursor-pointer">{t('topicHousing')}</span>
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
