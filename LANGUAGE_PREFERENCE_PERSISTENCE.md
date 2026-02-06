# Language Preference Persistence

## Overview

This document explains how language preference persistence is implemented in the LocalDesk application using next-intl middleware integrated into a custom proxy function.

## Architecture

### Proxy as Middleware

The application uses `proxy.ts` directly as the Next.js middleware file. This allows us to combine:
1. **next-intl middleware** for i18n routing and locale detection
2. **Supabase authentication** for session management

Next.js automatically recognizes `proxy.ts` as middleware when `middleware.ts` is not present.

### Cookie-Based Persistence

Language preference persistence is handled automatically by next-intl middleware through the `NEXT_LOCALE` cookie:

1. **Cookie Setting**: When a user visits a locale-prefixed URL (e.g., `/da/services`), the middleware sets the `NEXT_LOCALE` cookie with the locale value
2. **Cookie Reading**: On subsequent visits, the middleware reads the `NEXT_LOCALE` cookie to determine the user's preferred locale
3. **Priority Order**: The middleware uses the following priority for locale detection:
   - `NEXT_LOCALE` cookie (highest priority)
   - `Accept-Language` header from browser
   - Default locale (`en`)

## Implementation Details

### Proxy Function (proxy.ts)

The proxy function integrates both i18n and authentication:

```typescript
export async function proxy(request: NextRequest) {
    // First, handle i18n routing
    const intlResponse = intlMiddleware(request);
    
    // Use intl response as base, or create new response
    let response = intlResponse || NextResponse.next({ request });

    // Create Supabase client and handle authentication
    // ... Supabase cookie handling ...

    return response;
}
```

**Key Points:**
- The intl middleware runs first and returns a response with locale cookies set
- This response is used as the base for Supabase cookie handling
- Both i18n and auth cookies are properly set on the final response

### Routing Configuration (i18n/routing.ts)

The routing configuration enables automatic cookie persistence:

```typescript
export const routing = defineRouting({
  locales: ['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
```

**Key Points:**
- `localePrefix: 'always'` ensures all URLs include the locale prefix
- This allows the middleware to detect and persist the locale from the URL
- No additional configuration is needed for cookie persistence

### Language Switcher (components/LanguageSwitcher.tsx)

The language switcher component triggers locale changes:

```typescript
function onSelectChange(newLocale: string) {
  startTransition(() => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.replace(`/${newLocale}${pathWithoutLocale}`);
  });
}
```

**Key Points:**
- Navigation to a new locale URL triggers the middleware
- The middleware detects the new locale from the URL and updates the cookie
- The cookie persists across browser sessions

## User Flow

### First Visit

1. User visits the site (e.g., `https://localdesk.com`)
2. Middleware checks for `NEXT_LOCALE` cookie (not found)
3. Middleware checks `Accept-Language` header (e.g., `da-DK,da;q=0.9`)
4. Middleware redirects to `/da` (Danish locale)
5. Middleware sets `NEXT_LOCALE=da` cookie
6. User sees Danish content

### Language Switch

1. User clicks language switcher and selects German
2. Application navigates to `/de/current-page`
3. Middleware detects locale from URL
4. Middleware updates `NEXT_LOCALE=de` cookie
5. User sees German content

### Return Visit

1. User returns to the site (e.g., `https://localdesk.com`)
2. Middleware checks for `NEXT_LOCALE` cookie (found: `de`)
3. Middleware redirects to `/de` (German locale)
4. User sees German content (preference persisted)

## Testing

### Manual Testing Steps

To verify language preference persistence:

1. **Clear cookies** in your browser
2. **Visit the site** and note the detected language
3. **Switch to a different language** using the language switcher
4. **Refresh the page** - language should remain the same
5. **Close and reopen the browser**
6. **Visit the site again** - language should still be the same
7. **Clear cookies** and visit again - should detect from browser language

### Expected Behavior

- ✅ Language preference persists across page navigation
- ✅ Language preference persists across browser sessions
- ✅ Cookie overrides browser language preference
- ✅ Clearing cookies resets to browser language detection
- ✅ All seven languages can be selected and persisted

## Cookie Details

### Cookie Name
`NEXT_LOCALE`

### Cookie Properties
- **Value**: One of `en`, `da`, `de`, `uk`, `pl`, `ro`, `ru`
- **Path**: `/` (site-wide)
- **SameSite**: `lax` (default)
- **HttpOnly**: `false` (accessible to JavaScript)
- **Secure**: `true` in production (HTTPS only)

### Cookie Lifetime
The cookie is set as a session cookie by default, but persists across browser sessions in most modern browsers.

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 2.3**: Language preference is persisted to browser storage (cookie)
- **Requirement 2.4**: Previously selected language preference is loaded on return visits
- **Requirement 1.2**: Browser language preference is detected
- **Requirement 1.3**: Supported languages are displayed in that language
- **Requirement 1.4**: Unsupported languages default to English

## Troubleshooting

### Language Not Persisting

**Symptoms**: Language resets to browser default on each visit

**Possible Causes**:
1. Cookies are disabled in browser
2. Browser is in private/incognito mode
3. Cookie is being cleared by another process

**Solutions**:
1. Enable cookies in browser settings
2. Test in normal browsing mode
3. Check for cookie-clearing extensions or settings

### Wrong Language Detected

**Symptoms**: Site shows unexpected language on first visit

**Possible Causes**:
1. Browser language settings are incorrect
2. `NEXT_LOCALE` cookie exists from previous session
3. Middleware configuration is incorrect

**Solutions**:
1. Check browser language settings
2. Clear cookies and try again
3. Verify routing configuration in `i18n/routing.ts`

### Language Switcher Not Working

**Symptoms**: Clicking language switcher doesn't change language

**Possible Causes**:
1. JavaScript is disabled
2. Navigation is blocked
3. Middleware is not running

**Solutions**:
1. Enable JavaScript in browser
2. Check browser console for errors
3. Verify `proxy.ts` exports the proxy function with proper config

## Future Enhancements

### Database Persistence

For authenticated users, language preference could be stored in the database:

1. Save locale to user profile on language change
2. Load locale from database on login
3. Sync cookie with database preference

### Locale-Specific Content

Future enhancements could include:

1. Locale-specific images and media
2. Locale-specific formatting (dates, numbers, currency)
3. Locale-specific content recommendations

## References

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
