'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
}

export function Features() {
  const t = useTranslations('HomePage.Features');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const FEATURES: Feature[] = [
    {
      id: t('feature1.id'),
      category: t('feature1.category'),
      title: t('feature1.title'),
      description: t('feature1.description'),
    },
    {
      id: t('feature2.id'),
      category: t('feature2.category'),
      title: t('feature2.title'),
      description: t('feature2.description'),
    },
    {
      id: t('feature3.id'),
      category: t('feature3.category'),
      title: t('feature3.title'),
      description: t('feature3.description'),
    },
    {
      id: t('feature4.id'),
      category: t('feature4.category'),
      title: t('feature4.title'),
      description: t('feature4.description'),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-background py-16 sm:py-24 md:py-32 lg:py-48 xl:py-64 border-t border-border/40 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-baseline mb-16 sm:mb-20 md:mb-24 lg:mb-32 border-b border-border/40 pb-8 sm:pb-10 md:pb-12">
            <div className="max-w-xl">
              <h2 className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase text-danish-red mb-6 sm:mb-8">
                {t('sectionLabel')}
              </h2>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] tracking-tighter text-foreground">
                {t('title')} <br />
                <span className="italic font-normal text-muted-foreground/60">{t('titleEmphasis')}</span> {t('titleEnd')}
              </h2>
            </div>
            <div className="mt-8 lg:mt-0 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase vertical-text hidden lg:block">
              {t('madeFor')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 sm:gap-x-10 md:gap-x-12 gap-y-16 sm:gap-y-20 md:gap-y-24">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-start space-y-6 sm:space-y-7 md:space-y-8"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                  <span className="font-sans text-[9px] sm:text-[10px] font-black tracking-[0.25em] sm:tracking-[0.3em] text-danish-red uppercase">
                    {feature.id}
                  </span>
                  <div className="h-[1px] flex-1 bg-border/40 group-hover:bg-danish-red transition-all duration-700" />
                </div>

                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.15rem] sm:tracking-[0.2rem] uppercase text-muted-foreground/60 mb-2 block">
                      {feature.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-medium text-foreground tracking-tight group-hover:text-danish-red transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-sans font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative accent */}
                <div className="absolute -bottom-8 sm:-bottom-10 md:-bottom-12 left-0 w-0 h-1 bg-danish-red/20 group-hover:w-full transition-all duration-1000 ease-in-out" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
