'use client';

import { useEffect, useRef, useState } from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    id: '01',
    title: 'Instant Resolution',
    description: 'Get immediate responses to your questions about Danish bureaucracy without the traditional waiting period.',
  },
  {
    id: '02',
    title: 'Expert Logic',
    description: 'Specialized information systems covering SKAT, visa protocols, and housing regulations with precise accuracy.',
  },
  {
    id: '03',
    title: 'Frictionless Entry',
    description: 'Designed for immediate utility. Access our systems without the requirement of traditional account registration.',
  },
  {
    id: '04',
    title: 'Perpetual Access',
    description: 'Continuous operational status. Our systems remain online 24/7 to support your transition to Danish life.',
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
      className={`w-full bg-background py-24 lg:py-48 border-t border-border transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Column: Vertical Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-danish-red mb-8 font-sans">
              Core Capabilities
            </h2>
            <p className="font-serif text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-foreground">
              Built for <br />
              <span className="italic text-muted-foreground">clarity.</span>
            </p>
          </div>

          {/* Right Column: Feature List */}
          <div className="lg:col-span-8 space-y-20">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group border-t border-border pt-12 flex flex-col md:flex-row gap-8 md:gap-16 items-start transition-all hover:-translate-y-1 duration-500"
              >
                <span className="font-serif text-6xl text-border group-hover:text-danish-red/30 transition-colors duration-500">
                  {feature.id}
                </span>
                <div className="space-y-4">
                  <h3 className="text-3xl lg:text-3xl font-serif font-medium text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-sans font-light leading-relaxed max-w-xl">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
