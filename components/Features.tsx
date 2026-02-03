'use client';

import { MessageSquare, GraduationCap, Zap, Clock, LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    title: 'Instant Answers',
    description: 'Get immediate responses to your questions about Danish bureaucracy without waiting.',
  },
  {
    icon: GraduationCap,
    title: 'Expert Knowledge',
    description: 'Access specialized information about SKAT, visas, and housing from an AI consultant.',
  },
  {
    icon: Zap,
    title: 'No Login Required',
    description: 'Start chatting right away without creating an account or signing up.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Get help 24/7, whenever you need guidance navigating Danish systems.',
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
      className={`w-full bg-gradient-to-b from-cool-50 to-neutral-100 py-12 sm:py-16 md:py-24 transition-opacity duration-300 ${
        isVisible ? 'motion-safe:animate-fade-in' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading for accessibility */}
        <h2 className="sr-only">Features</h2>
        
        {/* Bento Grid: Mobile (1-2 cols), Tablet (2x2), Desktop (asymmetric 4-col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            // Define grid positioning for desktop Bento layout
            const gridClasses = [
              'lg:col-span-2 lg:row-span-2', // Card 1: 2x2 (featured)
              'lg:col-span-1 lg:row-span-1', // Card 2: 1x1
              'lg:col-span-1 lg:row-span-1', // Card 3: 1x1
              'lg:col-span-2 lg:row-span-1', // Card 4: 2x1
            ][index];
            
            const isFeatured = index === 0;
            
            // Premium styling with layered shadows and featured variant
            const cardBaseClasses = "flex flex-col items-center text-center space-y-4 rounded-xl transition-all duration-300";
            const cardShadowClasses = isFeatured 
              ? "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.12)]"
              : "shadow-[0_1px_4px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.10)]";
            const cardPaddingClasses = isFeatured ? "p-8 md:p-10 lg:p-12" : "p-6 md:p-8";
            const cardBackgroundClasses = isFeatured 
              ? "bg-gradient-to-br from-white via-warm-50 to-warm-100" 
              : "bg-white";
            const cardHoverClasses = "hover:scale-[1.02]";
            
            // Enhanced content styling
            const iconSizeClasses = isFeatured ? "w-16 h-16 md:w-20 md:h-20" : "w-14 h-14";
            const iconInnerSizeClasses = isFeatured ? "w-8 h-8 md:w-10 md:h-10" : "w-7 h-7";
            const titleSizeClasses = isFeatured ? "text-2xl md:text-3xl" : "text-xl";
            const descriptionSizeClasses = isFeatured ? "text-base md:text-lg" : "text-sm";
            
            return (
              <div
                key={index}
                className={`${cardBaseClasses} ${cardShadowClasses} ${cardPaddingClasses} ${cardBackgroundClasses} ${cardHoverClasses} ${gridClasses} focus-within:ring-2 focus-within:ring-danish-red focus-within:ring-offset-2`}
                tabIndex={0}
                role="article"
                aria-label={`Feature: ${feature.title}`}
              >
                {/* Icon */}
                <div className={`${iconSizeClasses} flex items-center justify-center rounded-full bg-danish-red bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                  <Icon className={`${iconInnerSizeClasses} text-danish-red`} />
                </div>

                {/* Title */}
                <h3 className={`${titleSizeClasses} font-semibold text-slate-900 tracking-[-0.01em] leading-[1.3]`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className={`${descriptionSizeClasses} text-slate-700 leading-[1.6] font-normal max-w-[70ch]`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
