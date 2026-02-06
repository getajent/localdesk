'use client';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  details: string[];
  relatedDocs?: string[];
}

interface Guide {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: GuideStep[];
}

interface GuidanceStepsProps {
  guides: Guide[];
}

export function GuidanceSteps({ guides }: GuidanceStepsProps) {
  const t = useTranslations('GuidancePage.Steps');

  return (
    <section className="w-full py-24 lg:py-32 bg-background" aria-labelledby="guidance-steps-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <header className="mb-12 sm:mb-16 lg:mb-24">
            <p className="text-[10px] font-black tracking-[0.3em] text-danish-red uppercase mb-4 sm:mb-6">
              {t('sectionLabel')}
            </p>
            <h2 id="guidance-steps-heading" className="font-serif text-3xl sm:text-4xl lg:text-6xl font-light text-foreground leading-tight">
              {t('title')} <span className="italic">{t('titleEmphasis')}</span> {t('titleEnd')}
            </h2>
          </header>

          {/* Guides List */}
          <div className="space-y-16 sm:space-y-24">
            {guides.map((guide, guideIndex) => (
              <article
                key={guide.id}
                className="motion-safe:animate-fade-in"
                style={{ animationDelay: `${guideIndex * 100}ms` }}
                aria-labelledby={`guide-${guide.id}-title`}
              >
                {/* Guide Header */}
                <header className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-border/40">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="text-[9px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-danish-red uppercase">
                      {guide.duration}
                    </span>
                    <div className="h-[1px] flex-1 bg-border/40" aria-hidden="true" />
                  </div>
                  <h3 id={`guide-${guide.id}-title`} className="font-serif text-2xl sm:text-3xl lg:text-5xl font-medium text-foreground mb-3 sm:mb-4">
                    {guide.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-3xl">
                    {guide.description}
                  </p>
                </header>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                  {guide.steps.map((step, stepIndex) => (
                    <article
                      key={stepIndex}
                      className="group relative border border-border/40 p-6 sm:p-8 hover:border-danish-red/40 transition-all duration-500 min-h-[44px]"
                      aria-labelledby={`guide-${guide.id}-step-${step.stepNumber}-title`}
                    >
                      {/* Step Number */}
                      <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-background border border-border/40 group-hover:border-danish-red/40 transition-all duration-500 flex items-center justify-center" aria-hidden="true">
                        <span className="font-serif text-xl sm:text-2xl font-medium text-danish-red">
                          {step.stepNumber}
                        </span>
                      </div>

                      {/* Step Content */}
                      <div className="mt-3 sm:mt-4">
                        <h4 id={`guide-${guide.id}-step-${step.stepNumber}-title`} className="font-serif text-lg sm:text-xl font-medium text-foreground mb-2 sm:mb-3 group-hover:text-danish-red transition-colors">
                          {step.title}
                        </h4>

                        <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4 sm:mb-6">
                          {step.description}
                        </p>

                        {/* Details List */}
                        <ul className="space-y-2 sm:space-y-3">
                          {step.details.map((detail, detailIndex) => (
                            <li
                              key={detailIndex}
                              className="flex items-start text-xs text-foreground/70"
                            >
                              <ChevronRight
                                className="w-3 h-3 text-danish-red mt-0.5 mr-2 flex-shrink-0"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                              <span className="font-light">{detail}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Related Docs */}
                        {step.relatedDocs && step.relatedDocs.length > 0 && (
                          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/20">
                            <span className="text-[9px] font-bold tracking-[0.2em] text-foreground/60 uppercase block mb-2 sm:mb-3">
                              {t('relatedResources')}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {step.relatedDocs.map((doc, docIndex) => (
                                <button
                                  key={docIndex}
                                  className="text-[9px] font-light text-danish-red/70 hover:text-danish-red transition-colors cursor-pointer bg-transparent border-0 p-0 focus-visible:text-danish-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danish-red focus-visible:ring-offset-2"
                                  aria-label={`View related resource: ${doc}`}
                                  tabIndex={0}
                                >
                                  {doc}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-danish-red/0 group-hover:border-danish-red/40 transition-all duration-500" aria-hidden="true" />
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
