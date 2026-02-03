'use client';

import { useEffect, useRef, useState } from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
}

const FEATURES: Feature[] = [
  {
    id: '01',
    category: 'Performance',
    title: 'Swift Answers',
    description: 'Find what you need in seconds, without the long waits or confusing paperwork.',
  },
  {
    id: '02',
    category: 'Knowledge',
    title: 'Trusted Details',
    description: 'Deeply researched insights on SKAT, visas, and housing, tailored specifically for life in Denmark.',
  },
  {
    id: '03',
    category: 'Ease',
    title: 'No Sign-up Required',
    description: 'Start right away. We value your time, so there’s no need to create an account to get the help you need.',
  },
  {
    id: '04',
    category: 'Service',
    title: 'Always Ready',
    description: 'We’re here for you 24/7, helping you feel at home in Denmark from your very first day.',
  },
];

export function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      className={`w-full bg-background py-32 lg:py-64 border-t border-border/40 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-baseline mb-32 border-b border-border/40 pb-12">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-danish-red mb-8">
                How we help
              </h2>
              <h2 className="font-serif text-5xl lg:text-7xl font-medium leading-[1.1] tracking-tighter text-foreground">
                Built for <br />
                <span className="italic font-normal text-muted-foreground/60">the modern</span> expat.
              </h2>
            </div>
            <div className="mt-12 lg:mt-0 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase vertical-text hidden lg:block">
              Made for you // 2026
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-start space-y-8"
              >
                <div className="flex items-center space-x-4 w-full">
                  <span className="font-sans text-[10px] font-black tracking-[0.3em] text-danish-red uppercase">
                    {feature.id}
                  </span>
                  <div className="h-[1px] flex-1 bg-border/40 group-hover:bg-danish-red transition-all duration-700" />
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2rem] uppercase text-muted-foreground/60 mb-2 block">
                      {feature.category}
                    </span>
                    <h3 className="text-2xl font-serif font-medium text-foreground tracking-tight group-hover:text-danish-red transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative accent */}
                <div className="absolute -bottom-12 left-0 w-0 h-1 bg-danish-red/20 group-hover:w-full transition-all duration-1000 ease-in-out" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
