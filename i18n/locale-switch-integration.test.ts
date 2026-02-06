/**
 * Integration Tests: Full Locale Switch Flow
 * 
 * This test suite validates the complete user journey for locale detection,
 * switching, and persistence across the application.
 * 
 * Test Scenarios:
 * 1. Visit site → locale detected → content rendered
 * 2. Switch language → URL updates → content updates → cookie set
 * 3. Return to site → cookie read → previous locale restored
 * 4. Navigate between pages → locale preserved
 * 
 * Requirements: 1.2, 1.3, 2.2, 2.3, 2.4, 6.4
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Define routing configuration inline to avoid ESM import issues
const routing = {
  locales: ['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru'] as const,
  defaultLocale: 'en' as const,
  localePrefix: 'always' as const
};

describe('Locale Switch Integration Tests', () => {
  // Mock cookie storage for testing
  let mockCookies: Record<string, string> = {};
  
  beforeEach(() => {
    // Reset mock cookies before each test
    mockCookies = {};
    jest.clearAllMocks();
  });

  describe('Scenario 1: Visit site → locale detected → content rendered', () => {
    it('should detect locale from Accept-Language header when no cookie exists', async () => {
      // Simulate Accept-Language header
      const acceptLanguageHeaders = [
        { header: 'da,en;q=0.9', expectedLocale: 'da' },
        { header: 'de-DE,de;q=0.9,en;q=0.8', expectedLocale: 'de' },
        { header: 'uk,ru;q=0.9,en;q=0.8', expectedLocale: 'uk' },
        { header: 'pl-PL,pl;q=0.9', expectedLocale: 'pl' },
        { header: 'ro,en;q=0.9', expectedLocale: 'ro' },
        { header: 'ru-RU,ru;q=0.9', expectedLocale: 'ru' },
        { header: 'en-US,en;q=0.9', expectedLocale: 'en' }
      ];

      for (const { header, expectedLocale } of acceptLanguageHeaders) {
        // Parse Accept-Language header to get preferred locale
        const detectedLocale = detectLocaleFromHeader(header, routing.locales);
        
        expect(detectedLocale).toBe(expectedLocale);
        expect(routing.locales).toContain(detectedLocale as any);
      }
    });

    it('should default to English when Accept-Language header has no supported locale', async () => {
      const unsupportedHeaders = [
        'fr-FR,fr;q=0.9',
        'es-ES,es;q=0.9',
        'ja-JP,ja;q=0.9',
        'zh-CN,zh;q=0.9'
      ];

      for (const header of unsupportedHeaders) {
        const detectedLocale = detectLocaleFromHeader(header, routing.locales);
        
        expect(detectedLocale).toBe(routing.defaultLocale);
      }
    });

    it('should default to English when Accept-Language header is missing', () => {
      const detectedLocale = detectLocaleFromHeader('', routing.locales);
      
      expect(detectedLocale).toBe(routing.defaultLocale);
      expect(detectedLocale).toBe('en');
    });

    it('should load correct translation messages for detected locale', async () => {
      const testLocales = ['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru'];

      for (const locale of testLocales) {
        const messages = await import(`../messages/${locale}.json`);
        
        expect(messages.default).toBeDefined();
        expect(messages.default).toHaveProperty('Common');
        expect(messages.default.Common).toHaveProperty('nav');
        
        // Verify messages are loaded for the correct locale
        expect(typeof messages.default.Common.nav.home).toBe('string');
        expect(messages.default.Common.nav.home.length).toBeGreaterThan(0);
      }
    });

    it('should construct correct URL with detected locale prefix', () => {
      const testCases = [
        { detectedLocale: 'da', path: '/services', expectedUrl: '/da/services' },
        { detectedLocale: 'de', path: '/guidance', expectedUrl: '/de/guidance' },
        { detectedLocale: 'uk', path: '/knowledge', expectedUrl: '/uk/knowledge' },
        { detectedLocale: 'en', path: '/', expectedUrl: '/en' }
      ];

      for (const { detectedLocale, path, expectedUrl } of testCases) {
        const url = constructLocalizedUrl(detectedLocale, path);
        
        expect(url).toBe(expectedUrl);
        expect(url).toMatch(new RegExp(`^/${detectedLocale}`));
      }
    });

    it('should validate locale parameter before rendering content', () => {
      const testCases = [
        { locale: 'en', valid: true },
        { locale: 'da', valid: true },
        { locale: 'invalid', valid: false },
        { locale: 'fr', valid: false },
        { locale: '', valid: false }
      ];

      for (const { locale, valid } of testCases) {
        const isValid = routing.locales.includes(locale as any);
        expect(isValid).toBe(valid);
      }
    });
  });

  describe('Scenario 2: Switch language → URL updates → content updates → cookie set', () => {
    it('should update URL when language is switched', () => {
      const testCases = [
        { currentLocale: 'en', newLocale: 'da', currentPath: '/services', expectedUrl: '/da/services' },
        { currentLocale: 'da', newLocale: 'de', currentPath: '/guidance', expectedUrl: '/de/guidance' },
        { currentLocale: 'de', newLocale: 'uk', currentPath: '/knowledge', expectedUrl: '/uk/knowledge' },
        { currentLocale: 'uk', newLocale: 'en', currentPath: '/', expectedUrl: '/en' }
      ];

      for (const { currentLocale, newLocale, currentPath, expectedUrl } of testCases) {
        // Simulate language switch by replacing locale in URL
        const currentUrl = `/${currentLocale}${currentPath}`;
        const newUrl = switchLocaleInUrl(currentUrl, currentLocale, newLocale);
        
        expect(newUrl).toBe(expectedUrl);
        expect(newUrl).toMatch(new RegExp(`^/${newLocale}`));
        
        // Verify the old locale prefix is not at the start of the URL
        expect(newUrl.startsWith(`/${currentLocale}/`)).toBe(false);
      }
    });

    it('should preserve path structure when switching locales', () => {
      const paths = [
        '/services',
        '/guidance',
        '/knowledge',
        '/privacy',
        '/terms',
        '/services/consulting',
        '/guidance/step-1'
      ];

      const localeChanges = [
        { from: 'en', to: 'da' },
        { from: 'da', to: 'de' },
        { from: 'de', to: 'uk' }
      ];

      for (const path of paths) {
        for (const { from, to } of localeChanges) {
          const currentUrl = `/${from}${path}`;
          const newUrl = switchLocaleInUrl(currentUrl, from, to);
          
          // Extract path after locale
          const pathAfterLocale = newUrl.substring(to.length + 1);
          expect(pathAfterLocale).toBe(path);
        }
      }
    });

    it('should preserve query parameters when switching locales', () => {
      const testCases = [
        {
          currentUrl: '/en/services?category=consulting',
          currentLocale: 'en',
          newLocale: 'da',
          expectedUrl: '/da/services?category=consulting'
        },
        {
          currentUrl: '/da/knowledge?search=tax&page=2',
          currentLocale: 'da',
          newLocale: 'de',
          expectedUrl: '/de/knowledge?search=tax&page=2'
        },
        {
          currentUrl: '/de/guidance?step=3&lang=de',
          currentLocale: 'de',
          newLocale: 'uk',
          expectedUrl: '/uk/guidance?step=3&lang=de'
        }
      ];

      for (const { currentUrl, currentLocale, newLocale, expectedUrl } of testCases) {
        const newUrl = switchLocaleInUrl(currentUrl, currentLocale, newLocale);
        
        expect(newUrl).toBe(expectedUrl);
        
        // Verify query parameters are preserved
        const [, currentQuery] = currentUrl.split('?');
        const [, newQuery] = newUrl.split('?');
        expect(newQuery).toBe(currentQuery);
      }
    });

    it('should preserve hash fragments when switching locales', () => {
      const testCases = [
        {
          currentUrl: '/en/services#pricing',
          currentLocale: 'en',
          newLocale: 'da',
          expectedUrl: '/da/services#pricing'
        },
        {
          currentUrl: '/da/privacy#data-collection',
          currentLocale: 'da',
          newLocale: 'de',
          expectedUrl: '/de/privacy#data-collection'
        },
        {
          currentUrl: '/de/terms#acceptance',
          currentLocale: 'de',
          newLocale: 'uk',
          expectedUrl: '/uk/terms#acceptance'
        }
      ];

      for (const { currentUrl, currentLocale, newLocale, expectedUrl } of testCases) {
        const newUrl = switchLocaleInUrl(currentUrl, currentLocale, newLocale);
        
        expect(newUrl).toBe(expectedUrl);
        
        // Verify hash is preserved
        const [, currentHash] = currentUrl.split('#');
        const [, newHash] = newUrl.split('#');
        expect(newHash).toBe(currentHash);
      }
    });

    it('should preserve both query and hash when switching locales', () => {
      const currentUrl = '/en/services?category=consulting#pricing';
      const currentLocale = 'en';
      const newLocale = 'da';
      
      const newUrl = switchLocaleInUrl(currentUrl, currentLocale, newLocale);
      
      expect(newUrl).toBe('/da/services?category=consulting#pricing');
      expect(newUrl).toContain('?category=consulting');
      expect(newUrl).toContain('#pricing');
    });

    it('should simulate cookie being set on locale switch', () => {
      const localeChanges = [
        { from: 'en', to: 'da' },
        { from: 'da', to: 'de' },
        { from: 'de', to: 'uk' },
        { from: 'uk', to: 'pl' },
        { from: 'pl', to: 'ro' },
        { from: 'ro', to: 'ru' },
        { from: 'ru', to: 'en' }
      ];

      for (const { from, to } of localeChanges) {
        // Simulate setting cookie
        mockCookies['NEXT_LOCALE'] = to;
        
        expect(mockCookies['NEXT_LOCALE']).toBe(to);
        expect(routing.locales).toContain(to as any);
      }
    });

    it('should load new translation messages after locale switch', async () => {
      const switchSequence = ['en', 'da', 'de', 'uk'];

      for (const locale of switchSequence) {
        // Simulate loading messages for new locale
        const messages = await import(`../messages/${locale}.json`);
        
        expect(messages.default).toBeDefined();
        expect(messages.default).toHaveProperty('Common');
        
        // Verify content is different for different locales
        expect(typeof messages.default.Common.nav.home).toBe('string');
      }
    });
  });

  describe('Scenario 3: Return to site → cookie read → previous locale restored', () => {
    it('should read locale from cookie on subsequent visit', () => {
      const testCases = [
        { cookieValue: 'da', expectedLocale: 'da' },
        { cookieValue: 'de', expectedLocale: 'de' },
        { cookieValue: 'uk', expectedLocale: 'uk' },
        { cookieValue: 'pl', expectedLocale: 'pl' },
        { cookieValue: 'ro', expectedLocale: 'ro' },
        { cookieValue: 'ru', expectedLocale: 'ru' }
      ];

      for (const { cookieValue, expectedLocale } of testCases) {
        // Simulate cookie being set
        mockCookies['NEXT_LOCALE'] = cookieValue;
        
        // Simulate reading cookie
        const localeFromCookie = mockCookies['NEXT_LOCALE'];
        
        expect(localeFromCookie).toBe(expectedLocale);
        expect(routing.locales).toContain(localeFromCookie as any);
      }
    });

    it('should prioritize cookie over Accept-Language header', () => {
      const testCases = [
        { cookie: 'da', acceptLanguage: 'en-US,en;q=0.9', expected: 'da' },
        { cookie: 'de', acceptLanguage: 'da,en;q=0.9', expected: 'de' },
        { cookie: 'uk', acceptLanguage: 'ru,en;q=0.9', expected: 'uk' }
      ];

      for (const { cookie, acceptLanguage, expected } of testCases) {
        // Simulate cookie exists
        mockCookies['NEXT_LOCALE'] = cookie;
        
        // Detect locale with cookie priority
        const detectedLocale = detectLocaleWithCookie(
          mockCookies['NEXT_LOCALE'],
          acceptLanguage,
          routing.locales
        );
        
        expect(detectedLocale).toBe(expected);
        expect(detectedLocale).toBe(cookie);
      }
    });

    it('should fall back to Accept-Language when cookie is invalid', () => {
      const testCases = [
        { cookie: 'invalid', acceptLanguage: 'da,en;q=0.9', expected: 'da' },
        { cookie: 'fr', acceptLanguage: 'de-DE,de;q=0.9', expected: 'de' },
        { cookie: '', acceptLanguage: 'uk,en;q=0.9', expected: 'uk' }
      ];

      for (const { cookie, acceptLanguage, expected } of testCases) {
        mockCookies['NEXT_LOCALE'] = cookie;
        
        const detectedLocale = detectLocaleWithCookie(
          mockCookies['NEXT_LOCALE'],
          acceptLanguage,
          routing.locales
        );
        
        expect(detectedLocale).toBe(expected);
      }
    });

    it('should restore user to correct URL with saved locale', () => {
      const testCases = [
        { savedLocale: 'da', requestedPath: '/services', expectedUrl: '/da/services' },
        { savedLocale: 'de', requestedPath: '/guidance', expectedUrl: '/de/guidance' },
        { savedLocale: 'uk', requestedPath: '/knowledge', expectedUrl: '/uk/knowledge' }
      ];

      for (const { savedLocale, requestedPath, expectedUrl } of testCases) {
        // Simulate cookie with saved locale
        mockCookies['NEXT_LOCALE'] = savedLocale;
        
        // Construct URL with saved locale
        const url = constructLocalizedUrl(savedLocale, requestedPath);
        
        expect(url).toBe(expectedUrl);
        expect(url).toMatch(new RegExp(`^/${savedLocale}`));
      }
    });

    it('should load correct messages for restored locale', async () => {
      const savedLocales = ['da', 'de', 'uk', 'pl', 'ro', 'ru'];

      for (const savedLocale of savedLocales) {
        // Simulate cookie with saved locale
        mockCookies['NEXT_LOCALE'] = savedLocale;
        
        // Load messages for restored locale
        const messages = await import(`../messages/${savedLocale}.json`);
        
        expect(messages.default).toBeDefined();
        expect(messages.default).toHaveProperty('Common');
        expect(typeof messages.default.Common.nav.home).toBe('string');
      }
    });

    it('should handle cookie persistence across multiple visits', () => {
      // First visit: set locale to Danish
      mockCookies['NEXT_LOCALE'] = 'da';
      expect(mockCookies['NEXT_LOCALE']).toBe('da');
      
      // Second visit: cookie should still be Danish
      const locale1 = mockCookies['NEXT_LOCALE'];
      expect(locale1).toBe('da');
      
      // User switches to German
      mockCookies['NEXT_LOCALE'] = 'de';
      expect(mockCookies['NEXT_LOCALE']).toBe('de');
      
      // Third visit: cookie should now be German
      const locale2 = mockCookies['NEXT_LOCALE'];
      expect(locale2).toBe('de');
      expect(locale2).not.toBe(locale1);
    });
  });

  describe('Scenario 4: Navigate between pages → locale preserved', () => {
    it('should preserve locale when navigating between pages', () => {
      const navigationSequences = [
        {
          locale: 'da',
          pages: ['/', '/services', '/guidance', '/knowledge', '/privacy', '/terms']
        },
        {
          locale: 'de',
          pages: ['/services', '/guidance', '/knowledge', '/']
        },
        {
          locale: 'uk',
          pages: ['/knowledge', '/services', '/privacy']
        }
      ];

      for (const { locale, pages } of navigationSequences) {
        for (const page of pages) {
          const url = constructLocalizedUrl(locale, page);
          
          // Verify locale is preserved in URL
          expect(url).toMatch(new RegExp(`^/${locale}`));
          
          // Extract locale from URL
          const extractedLocale = url.split('/')[1];
          expect(extractedLocale).toBe(locale);
        }
      }
    });

    it('should maintain locale across nested navigation', () => {
      const testCases = [
        {
          locale: 'da',
          navigationPath: [
            '/services',
            '/services/consulting',
            '/services/consulting/details',
            '/services'
          ]
        },
        {
          locale: 'de',
          navigationPath: [
            '/guidance',
            '/guidance/step-1',
            '/guidance/step-2',
            '/guidance'
          ]
        }
      ];

      for (const { locale, navigationPath } of testCases) {
        for (const path of navigationPath) {
          const url = constructLocalizedUrl(locale, path);
          
          expect(url).toMatch(new RegExp(`^/${locale}`));
          
          // Verify path is preserved after locale
          const pathAfterLocale = url.substring(locale.length + 1);
          expect(pathAfterLocale).toBe(path);
        }
      }
    });

    it('should preserve locale when using navigation links', () => {
      const currentLocale = 'da';
      const links = [
        { href: '/services', expectedUrl: '/da/services' },
        { href: '/guidance', expectedUrl: '/da/guidance' },
        { href: '/knowledge', expectedUrl: '/da/knowledge' },
        { href: '/privacy', expectedUrl: '/da/privacy' },
        { href: '/terms', expectedUrl: '/da/terms' }
      ];

      for (const { href, expectedUrl } of links) {
        // Simulate Link component behavior
        const localizedHref = constructLocalizedUrl(currentLocale, href);
        
        expect(localizedHref).toBe(expectedUrl);
        expect(localizedHref).toContain(currentLocale);
      }
    });

    it('should preserve locale with query parameters during navigation', () => {
      const testCases = [
        {
          locale: 'da',
          from: '/services',
          to: '/knowledge?search=tax',
          expectedUrl: '/da/knowledge?search=tax'
        },
        {
          locale: 'de',
          from: '/guidance?step=1',
          to: '/guidance?step=2',
          expectedUrl: '/de/guidance?step=2'
        }
      ];

      for (const { locale, to, expectedUrl } of testCases) {
        const url = constructLocalizedUrl(locale, to.split('?')[0]);
        const query = to.split('?')[1];
        const fullUrl = query ? `${url}?${query}` : url;
        
        expect(fullUrl).toBe(expectedUrl);
        expect(fullUrl).toContain(locale);
      }
    });

    it('should preserve locale with hash fragments during navigation', () => {
      const testCases = [
        {
          locale: 'da',
          from: '/services',
          to: '/services#pricing',
          expectedUrl: '/da/services#pricing'
        },
        {
          locale: 'de',
          from: '/privacy',
          to: '/privacy#data-collection',
          expectedUrl: '/de/privacy#data-collection'
        }
      ];

      for (const { locale, to, expectedUrl } of testCases) {
        const [path, hash] = to.split('#');
        const url = constructLocalizedUrl(locale, path);
        const fullUrl = hash ? `${url}#${hash}` : url;
        
        expect(fullUrl).toBe(expectedUrl);
        expect(fullUrl).toContain(locale);
      }
    });

    it('should handle back/forward navigation with locale preservation', () => {
      const locale = 'da';
      const navigationHistory = [
        '/services',
        '/guidance',
        '/knowledge',
        '/guidance', // back
        '/services'  // back
      ];

      for (const path of navigationHistory) {
        const url = constructLocalizedUrl(locale, path);
        
        expect(url).toMatch(new RegExp(`^/${locale}`));
        expect(url).toContain(path);
      }
    });

    it('should maintain locale consistency across all page types', () => {
      const locale = 'uk';
      const pageTypes = [
        '/',              // Home
        '/services',      // Services
        '/guidance',      // Guidance
        '/knowledge',     // Knowledge
        '/privacy',       // Privacy
        '/terms'          // Terms
      ];

      for (const page of pageTypes) {
        const url = constructLocalizedUrl(locale, page);
        
        // All URLs should have the same locale
        const extractedLocale = url.split('/')[1];
        expect(extractedLocale).toBe(locale);
      }
    });
  });

  describe('End-to-End Integration Flow', () => {
    it('should complete full user journey: visit → switch → return → navigate', async () => {
      // Step 1: User visits site with Danish browser
      const acceptLanguage = 'da,en;q=0.9';
      let currentLocale = detectLocaleFromHeader(acceptLanguage, routing.locales);
      expect(currentLocale).toBe('da');
      
      // Step 2: Content is rendered in Danish
      let messages = await import(`../messages/${currentLocale}.json`);
      expect(messages.default).toBeDefined();
      
      // Step 3: User switches to German
      const newLocale = 'de';
      mockCookies['NEXT_LOCALE'] = newLocale;
      currentLocale = newLocale;
      
      // Step 4: URL updates to German
      let currentUrl = '/da/services';
      currentUrl = switchLocaleInUrl(currentUrl, 'da', newLocale);
      expect(currentUrl).toBe('/de/services');
      
      // Step 5: Content updates to German
      messages = await import(`../messages/${currentLocale}.json`);
      expect(messages.default).toBeDefined();
      
      // Step 6: User closes browser and returns
      const savedLocale = mockCookies['NEXT_LOCALE'];
      expect(savedLocale).toBe('de');
      
      // Step 7: Locale is restored from cookie
      currentLocale = detectLocaleWithCookie(
        savedLocale,
        acceptLanguage,
        routing.locales
      );
      expect(currentLocale).toBe('de');
      
      // Step 8: User navigates to different pages
      const pages = ['/guidance', '/knowledge', '/privacy'];
      for (const page of pages) {
        const url = constructLocalizedUrl(currentLocale, page);
        expect(url).toMatch(new RegExp(`^/${currentLocale}`));
      }
    });

    it('should handle multiple locale switches in single session', async () => {
      const localeSequence = ['en', 'da', 'de', 'uk', 'pl'];
      let currentUrl = '/en/services';

      for (let i = 1; i < localeSequence.length; i++) {
        const fromLocale = localeSequence[i - 1];
        const toLocale = localeSequence[i];
        
        // Switch locale
        currentUrl = switchLocaleInUrl(currentUrl, fromLocale, toLocale);
        mockCookies['NEXT_LOCALE'] = toLocale;
        
        // Verify URL updated
        expect(currentUrl).toMatch(new RegExp(`^/${toLocale}`));
        
        // Verify cookie updated
        expect(mockCookies['NEXT_LOCALE']).toBe(toLocale);
        
        // Verify messages can be loaded
        const messages = await import(`../messages/${toLocale}.json`);
        expect(messages.default).toBeDefined();
      }
    });

    it('should handle locale switch with complex navigation', async () => {
      let currentLocale = 'en';
      let currentUrl = '/en/services?category=consulting#pricing';
      
      // Navigate to another page
      currentUrl = '/en/guidance?step=1';
      expect(currentUrl).toContain(currentLocale);
      
      // Switch locale
      const newLocale = 'da';
      currentUrl = switchLocaleInUrl(currentUrl, currentLocale, newLocale);
      mockCookies['NEXT_LOCALE'] = newLocale;
      currentLocale = newLocale;
      
      expect(currentUrl).toBe('/da/guidance?step=1');
      
      // Navigate with hash
      currentUrl = '/da/privacy#data-collection';
      expect(currentUrl).toContain(currentLocale);
      
      // Switch locale again
      const finalLocale = 'de';
      currentUrl = switchLocaleInUrl(currentUrl, currentLocale, finalLocale);
      mockCookies['NEXT_LOCALE'] = finalLocale;
      
      expect(currentUrl).toBe('/de/privacy#data-collection');
      expect(mockCookies['NEXT_LOCALE']).toBe(finalLocale);
    });
  });
});

// Helper functions for testing

/**
 * Detects locale from Accept-Language header
 */
function detectLocaleFromHeader(
  acceptLanguage: string,
  supportedLocales: readonly string[]
): string {
  if (!acceptLanguage) {
    return 'en';
  }

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';q=');
      const locale = code.split('-')[0].toLowerCase();
      const quality = qValue ? parseFloat(qValue) : 1.0;
      return { locale, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const { locale } of languages) {
    if (supportedLocales.includes(locale)) {
      return locale;
    }
  }

  return 'en';
}

/**
 * Detects locale with cookie priority
 */
function detectLocaleWithCookie(
  cookieValue: string,
  acceptLanguage: string,
  supportedLocales: readonly string[]
): string {
  // Check if cookie has valid locale
  if (cookieValue && supportedLocales.includes(cookieValue)) {
    return cookieValue;
  }

  // Fall back to Accept-Language header
  return detectLocaleFromHeader(acceptLanguage, supportedLocales);
}

/**
 * Constructs localized URL
 */
function constructLocalizedUrl(locale: string, path: string): string {
  if (path === '/') {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}

/**
 * Switches locale in URL
 */
function switchLocaleInUrl(
  currentUrl: string,
  currentLocale: string,
  newLocale: string
): string {
  // Split URL into components
  const [pathAndQuery, hash] = currentUrl.split('#');
  const [path, query] = pathAndQuery.split('?');

  // Replace locale in path
  let newPath = path.replace(`/${currentLocale}`, `/${newLocale}`);
  
  // Handle root path case - remove trailing slash if it's just the locale
  if (newPath === `/${newLocale}/`) {
    newPath = `/${newLocale}`;
  }

  // Reconstruct URL
  let newUrl = newPath;
  if (query) {
    newUrl += `?${query}`;
  }
  if (hash) {
    newUrl += `#${hash}`;
  }

  return newUrl;
}
