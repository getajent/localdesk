import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales: English, Danish, German, Ukrainian, Polish, Romanian, Russian
  locales: ['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru'],
  
  // Default locale (fallback)
  defaultLocale: 'en',
  
  // Locale prefix strategy: always include locale in URL
  localePrefix: 'always'
});
