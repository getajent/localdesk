# Implementation Plan: Multi-Language Support (i18n)

## Overview

This implementation plan breaks down the i18n feature into discrete coding tasks that build incrementally. The approach follows next-intl best practices for Next.js App Router, starting with core configuration, then middleware setup, translation infrastructure, UI components, and finally comprehensive testing.

## Tasks

- [x] 1. Install dependencies and create i18n configuration
  - Install next-intl package: `npm install next-intl`
  - Create `i18n/routing.ts` with locale configuration for all seven languages
  - Create `i18n/request.ts` for server-side translation loading
  - Update `next.config.js` to include next-intl plugin if needed
  - _Requirements: 1.1, 1.5_

- [x] 2. Set up middleware for locale detection and routing
  - Create `middleware.ts` at project root
  - Implement createMiddleware from next-intl with routing configuration
  - Configure matcher to exclude API routes and static files
  - Test middleware redirects unprefixed URLs to locale-prefixed URLs
  - _Requirements: 1.2, 1.3, 1.4, 6.2_

- [ ]* 2.1 Write property test for locale detection
  - **Property 1: Locale Detection and Fallback**
  - **Validates: Requirements 1.2, 1.3, 1.4**

- [ ]* 2.2 Write property test for unprefixed URL redirects
  - **Property 14: Unprefixed URL Redirects**
  - **Validates: Requirements 6.2**

- [x] 3. Restructure app directory for locale-based routing
  - Create `app/[locale]` directory
  - Move existing `app/page.tsx` to `app/[locale]/page.tsx`
  - Move all page routes under `app/[locale]/` (guidance, knowledge, services, privacy, terms)
  - Create `app/[locale]/layout.tsx` as the new root layout
  - Move existing root layout content into locale layout
  - _Requirements: 6.1, 6.3_

- [x] 4. Implement locale layout with translation provider
  - In `app/[locale]/layout.tsx`, import NextIntlClientProvider
  - Implement getMessages() to load translations server-side
  - Wrap children with NextIntlClientProvider
  - Add generateStaticParams() for all seven locales
  - Validate locale parameter and call notFound() for invalid locales
  - _Requirements: 1.5, 4.1_

- [ ]* 4.1 Write property test for translation file existence
  - **Property 2: Translation File Existence**
  - **Validates: Requirements 1.5, 4.1**

- [x] 5. Create translation file structure and English translations
  - Create `messages/` directory at project root
  - Create `messages/en.json` with complete English translations
  - Organize translations hierarchically: Common, HomePage, ServicesPage, GuidancePage, KnowledgePage, PrivacyPage, TermsPage, ChatInterface, AuthModal
  - Include all navigation, footer, hero, feature, and component text
  - Add interpolation examples (e.g., "{count} items")
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 4.5_

- [x] 6. Create translation files for remaining six languages
  - Create `messages/da.json` (Danish translations)
  - Create `messages/de.json` (German translations)
  - Create `messages/uk.json` (Ukrainian translations)
  - Create `messages/pl.json` (Polish translations)
  - Create `messages/ro.json` (Romanian translations)
  - Create `messages/ru.json` (Russian translations)
  - Ensure all files have the same key structure as English
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [ ]* 6.1 Write property test for translation completeness
  - **Property 6: Translation Completeness**
  - **Validates: Requirements 3.1-3.11**

- [ ]* 6.2 Write property test for translation key lookup
  - **Property 7: Translation Key Lookup**
  - **Validates: Requirements 4.2**

- [x] 7. Create TypeScript types for translation messages
  - Create `messages/types.ts` with Messages interface
  - Define nested structure matching translation JSON files
  - Add global IntlMessages interface declaration
  - Update tsconfig.json to include message types
  - _Requirements: 9.4_

- [x] 8. Create navigation utilities with locale awareness
  - Create `i18n/navigation.ts`
  - Export createNavigation with routing configuration
  - Export Link, redirect, usePathname, useRouter from createNavigation
  - _Requirements: 6.4, 6.5_

- [ ]* 8.1 Write property test for locale switch preserving path
  - **Property 15: Locale Switch Preserves Path**
  - **Validates: Requirements 6.4**

- [ ]* 8.2 Write property test for locale switch preserving query and hash
  - **Property 16: Locale Switch Preserves Query and Hash**
  - **Validates: Requirements 6.5**

- [x] 9. Implement Language Switcher component
  - Create `components/LanguageSwitcher.tsx` as client component
  - Use useLocale() hook to get current locale
  - Use useRouter() and usePathname() from i18n/navigation
  - Render select dropdown with all seven languages
  - Implement onSelectChange to navigate to new locale
  - Use useTransition for pending state during language switch
  - _Requirements: 2.1, 2.2, 2.5_

- [ ]* 9.1 Write unit tests for Language Switcher
  - Test all seven languages are displayed
  - Test current locale is indicated
  - Test locale change triggers navigation
  - _Requirements: 2.1, 2.5_

- [ ]* 9.2 Write property test for language switcher updates content
  - **Property 3: Language Switcher Updates Content**
  - **Validates: Requirements 2.2**

- [ ]* 9.3 Write property test for language switcher reflects active locale
  - **Property 5: Language Switcher Reflects Active Locale**
  - **Validates: Requirements 2.5**

- [x] 10. Integrate Language Switcher into Header component
  - Import LanguageSwitcher into Header component
  - Add LanguageSwitcher to header navigation area
  - Style to match existing header design
  - Ensure it's visible on all pages
  - _Requirements: 2.1_

- [x] 11. Update landing page (app/[locale]/page.tsx) to use translations
  - Import useTranslations hook
  - Replace hardcoded text with t('HomePage.Hero.title'), etc.
  - Update Hero component to use translations
  - Update Features component to use translations
  - Test page renders correctly in all locales
  - _Requirements: 3.1_

- [x] 12. Update Header component to use translations
  - Convert Header to client component if needed
  - Import useTranslations hook
  - Replace navigation labels with t('Common.nav.home'), etc.
  - Replace auth buttons with translated text
  - _Requirements: 3.7_

- [x] 13. Update Footer component to use translations
  - Import useTranslations hook
  - Replace footer links with t('Common.footer.privacy'), etc.
  - Replace copyright text with translated version
  - _Requirements: 3.8_

- [x] 14. Update Services page to use translations
  - Update ServicesHero component with t('ServicesPage.Hero.title')
  - Update ServicesGrid component with translated service descriptions
  - Ensure all text content uses translation keys
  - _Requirements: 3.4_

- [x] 15. Update Guidance page to use translations
  - Update GuidanceHero component with translations
  - Update GuidanceSteps component with translated step content
  - Replace all hardcoded text with translation keys
  - _Requirements: 3.2_

- [x] 16. Update Knowledge page to use translations
  - Update KnowledgeHero component with translations
  - Update KnowledgeCategories component with translated categories
  - Update search placeholder with translated text
  - _Requirements: 3.3_

- [x] 17. Update Privacy page to use translations
  - Replace privacy policy content with t('PrivacyPage.sections.dataCollection.content')
  - Add date interpolation for lastUpdated field
  - Ensure all sections are translated
  - _Requirements: 3.5_

- [x] 18. Update Terms page to use translations
  - Replace terms content with t('TermsPage.sections.acceptance.content')
  - Add date interpolation for lastUpdated field
  - Ensure all sections are translated
  - _Requirements: 3.6_

- [x] 19. Update ChatInterface component to use translations
  - Update placeholder text with t('ChatInterface.placeholder')
  - Update send button with t('ChatInterface.send')
  - Update thinking state with t('ChatInterface.thinking')
  - Update error messages with t('ChatInterface.error')
  - _Requirements: 3.10_

- [x] 20. Update AuthModal component to use translations
  - Update modal title with t('AuthModal.title')
  - Update form labels with translated text
  - Update button text with translations
  - Update error messages with t('AuthModal.errors.invalidEmail'), etc.
  - _Requirements: 3.9_

- [ ]* 20.1 Write property test for dynamic content translation
  - **Property 10: Dynamic Content Translation**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 21. Implement translation fallback logic
  - Verify next-intl's built-in fallback to English works
  - Test missing keys return the key itself
  - Add error logging for missing keys in development
  - _Requirements: 4.3, 4.4_

- [ ]* 21.1 Write property test for translation fallback to English
  - **Property 8: Translation Fallback to English**
  - **Validates: Requirements 4.3**

- [ ]* 21.2 Write property test for missing key returns key itself
  - **Property 9: Missing Key Returns Key Itself**
  - **Validates: Requirements 4.4**

- [x] 22. Implement variable interpolation in translations
  - Add translations with variables (e.g., "Hello {name}")
  - Test interpolation with t('key', { name: 'John' })
  - Verify interpolation works in all components
  - _Requirements: 5.4_

- [ ]* 22.1 Write property test for variable interpolation
  - **Property 11: Variable Interpolation**
  - **Validates: Requirements 5.4**

- [x] 23. Implement pluralization support
  - Add translations with plural forms
  - Use next-intl's pluralization syntax
  - Test with different counts (0, 1, 2, many)
  - Verify correct plural forms for each language
  - _Requirements: 5.5_

- [ ]* 23.1 Write property test for pluralization
  - **Property 12: Pluralization Support**
  - **Validates: Requirements 5.5**

- [x] 24. Add RTL support configuration structure
  - Create locale configuration with direction field
  - Add direction: 'ltr' for all current locales
  - Create utility function to get text direction for locale
  - Add conditional dir attribute to HTML element based on locale
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ]* 24.1 Write property test for RTL direction application
  - **Property 17: RTL Direction Application**
  - **Validates: Requirements 7.3**

- [x] 25. Implement language preference persistence
  - Verify middleware sets NEXT_LOCALE cookie on language change
  - Test cookie is read on subsequent visits
  - Verify cookie overrides Accept-Language header
  - _Requirements: 2.3, 2.4_

- [ ]* 25.1 Write property test for language preference persistence round-trip
  - **Property 4: Language Preference Persistence Round-Trip**
  - **Validates: Requirements 2.3, 2.4**

- [x] 26. Optimize translation loading and caching
  - Verify only active locale is loaded in initial bundle
  - Test lazy loading when switching languages
  - Verify translation files are cached after first load
  - Measure bundle size to confirm optimization
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 26.1 Write property test for only active locale loaded initially
  - **Property 18: Only Active Locale Loaded Initially**
  - **Validates: Requirements 8.1**

- [ ]* 26.2 Write property test for lazy loading on language switch
  - **Property 19: Lazy Loading on Language Switch**
  - **Validates: Requirements 8.2**

- [ ]* 26.3 Write property test for translation file caching
  - **Property 20: Translation File Caching**
  - **Validates: Requirements 8.3**

- [x] 27. Implement error handling for translation failures
  - Add try-catch in request.ts for translation file loading
  - Implement fallback to English on load failure
  - Add error logging for monitoring
  - Test with missing translation file
  - Test with malformed JSON
  - _Requirements: 8.5_

- [ ]* 27.1 Write property test for translation load failure fallback
  - **Property 21: Translation Load Failure Fallback**
  - **Validates: Requirements 8.5**

- [ ]* 27.2 Write unit tests for error conditions
  - Test missing translation file handling
  - Test malformed JSON handling
  - Test invalid locale rejection

- [x] 28. Add URL locale validation and property tests
  - Verify URL contains locale prefix for all pages
  - Test middleware redirects for unprefixed URLs
  - Test locale extraction from URL
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 28.1 Write property test for URL contains locale prefix
  - **Property 13: URL Contains Locale Prefix**
  - **Validates: Requirements 6.1, 6.3**

- [x] 29. Create integration tests for full locale switch flow
  - Test: Visit site → locale detected → content rendered
  - Test: Switch language → URL updates → content updates → cookie set
  - Test: Return to site → cookie read → previous locale restored
  - Test: Navigate between pages → locale preserved
  - _Requirements: 1.2, 1.3, 2.2, 2.3, 2.4, 6.4_

- [x] 30. Final checkpoint - Verify all translations and run full test suite
  - Manually test all seven languages on all pages
  - Verify language switcher works on every page
  - Verify URL routing works correctly
  - Run all unit tests and property tests
  - Check for missing translation keys
  - Verify bundle size optimization
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- Translation files should be created with actual translations (not placeholders) for production readiness
- The implementation follows next-intl best practices for Next.js App Router
- All components using translations must be client components or use getTranslations for server components
