'use client';

import { MessageSquare, GraduationCap, Zap, Clock, LucideIcon } from 'lucide-react';

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
  return (
    <section className="w-full bg-slate-50 py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout: 2x2 on mobile, 4x1 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 p-6 md:p-8 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-danish-red bg-opacity-10 group-hover:bg-opacity-20 transition-all">
                  <Icon className="w-7 h-7 text-danish-red" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">
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
