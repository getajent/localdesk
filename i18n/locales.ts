/**
 * Locale configuration with text direction support
 * This file defines all supported locales and their properties
 */

export type Locale = 'en' | 'da' | 'de' | 'uk' | 'pl' | 'ro' | 'ru';
export type TextDirection = 'ltr' | 'rtl';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  direction: TextDirection;
}

/**
 * Configuration for all supported locales
 * All current locales use left-to-right (ltr) text direction
 */
export const localeConfigs: LocaleConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr' }
];

/**
 * Map of locale codes to their configurations for quick lookup
 */
const localeConfigMap = new Map<string, LocaleConfig>(
  localeConfigs.map(config => [config.code, config])
);

/**
 * Get the text direction for a given locale
 * @param locale - The locale code (e.g., 'en', 'da', 'ar')
 * @returns The text direction ('ltr' or 'rtl'), defaults to 'ltr' for unknown locales
 */
export function getTextDirection(locale: string): TextDirection {
  const config = localeConfigMap.get(locale);
  return config?.direction ?? 'ltr';
}

/**
 * Get the full configuration for a given locale
 * @param locale - The locale code
 * @returns The locale configuration or undefined if not found
 */
export function getLocaleConfig(locale: string): LocaleConfig | undefined {
  return localeConfigMap.get(locale);
}

/**
 * Check if a locale is supported
 * @param locale - The locale code to check
 * @returns True if the locale is supported, false otherwise
 */
export function isLocaleSupported(locale: string): locale is Locale {
  return localeConfigMap.has(locale);
}
