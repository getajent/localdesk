import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming locale parameter is valid
  let locale = await requestLocale;
  
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages;
  
  try {
    // Try to load the requested locale's messages
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    // If loading fails, fall back to English
    if (process.env.NODE_ENV === 'development') {
      console.error(`Failed to load translations for locale "${locale}". Falling back to English.`, error);
    }
    
    try {
      messages = (await import(`../messages/en.json`)).default;
    } catch (fallbackError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load English fallback translations.', fallbackError);
      }
      // Return empty object as last resort
      messages = {};
    }
  }

  return {
    locale,
    messages,
    // Configure next-intl to return the key itself when a translation is missing
    // This makes missing keys visible during development
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: "${path}" for locale "${locale}"`);
      }
      
      return path;
    }
  };
});
