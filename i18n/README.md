# i18n Translation Fallback Logic

## Overview

This directory contains the internationalization (i18n) configuration for the application using next-intl. The system implements a robust fallback mechanism to handle missing translations and errors gracefully.

## Fallback Behavior

### 1. Translation File Loading

When a locale is requested, the system attempts to load the corresponding translation file:

```typescript
// Try to load requested locale
messages = (await import(`../messages/${locale}.json`)).default;
```

If loading fails (file missing, malformed JSON, etc.), the system:
1. Logs an error in development mode
2. Falls back to English translations
3. If English also fails, returns an empty object

### 2. Missing Translation Keys

When a translation key is requested but doesn't exist:

1. **First attempt**: Look for the key in the active locale
2. **Second attempt**: Fall back to English (default locale)
3. **Final fallback**: Return the key path itself (e.g., "HomePage.Hero.title")

This makes missing keys immediately visible during development.

### 3. Development Logging

In development mode (`NODE_ENV === 'development'`), the system logs:

- **Errors**: When translation files fail to load
- **Warnings**: When translation keys are missing

Example warning:
```
Missing translation key: "HomePage.newFeature.title" for locale "da"
```

In production mode, these logs are suppressed to avoid console noise.

## Configuration

### request.ts

The main configuration file that:
- Validates incoming locale parameters
- Loads translation files with error handling
- Implements the `getMessageFallback` function for missing keys

### routing.ts

Defines:
- Supported locales: `['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru']`
- Default locale: `'en'`
- Locale prefix strategy: `'always'`

## Testing

The fallback logic is tested in `i18n/request.test.ts`:

- ✅ Translation file loading for all locales
- ✅ Consistent structure across translation files
- ✅ Missing key behavior
- ✅ Development logging
- ✅ Error handling
- ✅ Fallback chain verification

Run tests with:
```bash
npm test -- i18n/request.test.ts
```

## Usage Examples

### Basic Translation

```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('HomePage.Hero');
  
  return <h1>{t('title')}</h1>;
}
```

### Handling Missing Keys

If a key doesn't exist:
```typescript
t('nonExistent.key') // Returns: "nonExistent.key"
```

This makes it easy to spot missing translations during development.

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

async function MyServerComponent() {
  const t = await getTranslations('HomePage.Hero');
  
  return <h1>{t('title')}</h1>;
}
```

## Best Practices

1. **Always use English as the source of truth**: All translation keys should exist in `messages/en.json`
2. **Keep translation structures consistent**: All locale files should have the same key structure
3. **Test missing keys**: Verify fallback behavior works as expected
4. **Monitor development logs**: Check for missing key warnings during development
5. **Handle errors gracefully**: The system should never crash due to missing translations

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 4.3**: Translation fallback to English for missing keys
- **Requirement 4.4**: Return key itself when missing in all locales
- **Requirement 8.5**: Graceful fallback when translation files fail to load
