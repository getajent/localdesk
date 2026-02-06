import { describe, it, expect } from '@jest/globals';
import { 
  getTextDirection, 
  getLocaleConfig, 
  isLocaleSupported,
  localeConfigs,
  type Locale 
} from './locales';

describe('Locale Configuration', () => {
  describe('localeConfigs', () => {
    it('should have all seven supported locales', () => {
      expect(localeConfigs).toHaveLength(7);
      
      const localeCodes = localeConfigs.map(config => config.code);
      expect(localeCodes).toEqual(['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru']);
    });

    it('should have ltr direction for all current locales', () => {
      localeConfigs.forEach(config => {
        expect(config.direction).toBe('ltr');
      });
    });

    it('should have required properties for each locale', () => {
      localeConfigs.forEach(config => {
        expect(config).toHaveProperty('code');
        expect(config).toHaveProperty('name');
        expect(config).toHaveProperty('nativeName');
        expect(config).toHaveProperty('direction');
        expect(typeof config.code).toBe('string');
        expect(typeof config.name).toBe('string');
        expect(typeof config.nativeName).toBe('string');
        expect(['ltr', 'rtl']).toContain(config.direction);
      });
    });
  });

  describe('getTextDirection', () => {
    it('should return ltr for all supported locales', () => {
      const supportedLocales: Locale[] = ['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru'];
      
      supportedLocales.forEach(locale => {
        expect(getTextDirection(locale)).toBe('ltr');
      });
    });

    it('should return ltr as default for unknown locales', () => {
      expect(getTextDirection('unknown')).toBe('ltr');
      expect(getTextDirection('ar')).toBe('ltr');
      expect(getTextDirection('')).toBe('ltr');
    });
  });

  describe('getLocaleConfig', () => {
    it('should return config for supported locales', () => {
      const config = getLocaleConfig('en');
      expect(config).toBeDefined();
      expect(config?.code).toBe('en');
      expect(config?.name).toBe('English');
      expect(config?.nativeName).toBe('English');
      expect(config?.direction).toBe('ltr');
    });

    it('should return undefined for unsupported locales', () => {
      expect(getLocaleConfig('unknown')).toBeUndefined();
      expect(getLocaleConfig('ar')).toBeUndefined();
    });
  });

  describe('isLocaleSupported', () => {
    it('should return true for supported locales', () => {
      expect(isLocaleSupported('en')).toBe(true);
      expect(isLocaleSupported('da')).toBe(true);
      expect(isLocaleSupported('de')).toBe(true);
      expect(isLocaleSupported('uk')).toBe(true);
      expect(isLocaleSupported('pl')).toBe(true);
      expect(isLocaleSupported('ro')).toBe(true);
      expect(isLocaleSupported('ru')).toBe(true);
    });

    it('should return false for unsupported locales', () => {
      expect(isLocaleSupported('unknown')).toBe(false);
      expect(isLocaleSupported('ar')).toBe(false);
      expect(isLocaleSupported('fr')).toBe(false);
      expect(isLocaleSupported('')).toBe(false);
    });
  });
});
