'use client';

import { useTranslations } from 'next-intl';

interface Service {
  id: string;
}

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const t = useTranslations('ServicesPage.services');
  const tGrid = useTranslations('ServicesPage.Grid');

  return (
    <section className="w-full py-24 lg:py-32 bg-background" aria-labelledby="services-grid-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <header className="mb-12 sm:mb-16 lg:mb-24">
            <p className="text-[10px] font-black tracking-[0.3em] text-danish-red uppercase mb-4 sm:mb-6">
              {tGrid('label')}
            </p>
            <h2 id="services-grid-heading" className="font-serif text-3xl sm:text-4xl lg:text-6xl font-light text-foreground leading-tight">
              {tGrid.rich('title', {
                spanItalic: (chunks) => <span className="italic">{chunks}</span>
              })}
            </h2>
          </header>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {services.map((service, index) => {
              const serviceKey = service.id as 'consulting' | 'documents' | 'relocation' | 'ongoing';
              const features = t.raw(`${serviceKey}.features`) as Record<string, string>;
              const featureValues = Object.values(features);

              return (
                <article
                  key={service.id}
                  className="group relative border border-border/40 p-6 sm:p-8 hover:border-danish-red/40 transition-all duration-500 motion-safe:animate-fade-in min-h-[44px]"
                  style={{ animationDelay: `${index * 100}ms` }}
                  aria-labelledby={`service-${service.id}-title`}
                >
                  {/* Category Label */}
                  <div className="mb-4 sm:mb-6">
                    <span className="text-[9px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-danish-red uppercase">
                      {t(`${serviceKey}.category`)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 id={`service-${service.id}-title`} className="font-serif text-xl sm:text-2xl font-medium text-foreground mb-3 sm:mb-4 group-hover:text-danish-red transition-colors">
                    {t(`${serviceKey}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4 sm:mb-6">
                    {t(`${serviceKey}.description`)}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 sm:space-y-3">
                    {featureValues.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start text-xs text-foreground/70"
                      >
                        <span className="inline-block w-1 h-1 rounded-full bg-danish-red mt-2 mr-3 flex-shrink-0" />
                        <span className="font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-danish-red/0 group-hover:border-danish-red/40 transition-all duration-500" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
