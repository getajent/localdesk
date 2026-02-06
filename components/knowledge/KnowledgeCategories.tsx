'use client';

import { useTranslations } from 'next-intl';
import {
  Plane,
  Briefcase,
  Home,
  Calculator,
  Heart,
  Zap,
  Coffee,
  LucideIcon,
} from 'lucide-react';

interface KnowledgeCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: string[];
  documentCount: number;
}

interface KnowledgeCategoriesProps {
  categories: KnowledgeCategory[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Plane,
  Briefcase,
  Home,
  Calculator,
  Heart,
  Zap,
  Coffee,
};

// Map category IDs to translation keys
const CATEGORY_KEY_MAP: Record<string, string> = {
  'arrival': 'arrival',
  'employment': 'employment',
  'housing': 'housing',
  'tax-finance': 'taxFinance',
  'social-benefits': 'socialBenefits',
  'essential-services': 'essentialServices',
  'practical-living': 'practicalLiving',
};

export function KnowledgeCategories({ categories }: KnowledgeCategoriesProps) {
  const t = useTranslations('KnowledgePage.categories');
  const tPage = useTranslations('KnowledgePage.Categories');

  return (
    <section className="w-full py-24 lg:py-32 bg-background" aria-labelledby="knowledge-categories-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <header className="mb-12 sm:mb-16 lg:mb-24">
            <p className="text-[10px] font-black tracking-[0.3em] text-danish-red uppercase mb-4 sm:mb-6">
              {tPage('label')}
            </p>
            <h2 id="knowledge-categories-heading" className="font-serif text-3xl sm:text-4xl lg:text-6xl font-light text-foreground leading-tight">
              {tPage('title')} <span className="italic">{tPage('titleEmphasis')}</span> {tPage('titleEnd')}
            </h2>
          </header>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {categories.map((category, index) => {
              const IconComponent = ICON_MAP[category.icon];
              const categoryKey = CATEGORY_KEY_MAP[category.id];

              return (
                <article
                  key={category.id}
                  className="group relative border border-border/40 p-6 sm:p-8 hover:border-danish-red/40 transition-all duration-500 motion-safe:animate-fade-in min-h-[44px]"
                  style={{ animationDelay: `${index * 100}ms` }}
                  aria-labelledby={`category-${category.id}-title`}
                >
                  {/* Icon */}
                  <div className="mb-4 sm:mb-6" aria-hidden="true">
                    <IconComponent
                      className="w-7 h-7 sm:w-8 sm:h-8 text-danish-red group-hover:scale-110 transition-transform duration-300"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Title */}
                  <h3 id={`category-${category.id}-title`} className="font-serif text-xl sm:text-2xl font-medium text-foreground mb-2 sm:mb-3 group-hover:text-danish-red transition-colors">
                    {categoryKey ? t(`${categoryKey}.title`) : category.title}
                  </h3>

                  {/* Document Count */}
                  <div className="mb-3 sm:mb-4">
                    <span className="text-[9px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground uppercase">
                      {categoryKey ? t(`${categoryKey}.documentCount`, { count: category.documentCount }) : `${category.documentCount} ${category.documentCount === 1 ? 'Guide' : 'Guides'}`}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4 sm:mb-6">
                    {categoryKey ? t(`${categoryKey}.description`) : category.description}
                  </p>

                  {/* Topics List */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-foreground/60 uppercase block mb-2 sm:mb-3">
                      {tPage('topics')}
                    </span>
                    <ul className="space-y-2">
                      {category.topics.slice(0, 5).map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-start text-xs text-foreground/70"
                        >
                          <span className="inline-block w-1 h-1 rounded-full bg-danish-red mt-2 mr-3 flex-shrink-0" />
                          <span className="font-light">{topic}</span>
                        </li>
                      ))}
                      {category.topics.length > 5 && (
                        <li className="text-xs text-danish-red/60 font-light italic pl-4">
                          {tPage('moreTopics', { count: category.topics.length - 5 })}
                        </li>
                      )}
                    </ul>
                  </div>

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
