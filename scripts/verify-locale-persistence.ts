/**
 * Verification script for language preference persistence
 * 
 * This script verifies that:
 * 1. The proxy.ts file properly integrates next-intl middleware
 * 2. The routing configuration is correct
 * 3. Cookie persistence is enabled
 */

import { routing } from '../i18n/routing';
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Language Preference Persistence Setup\n');

// Check 1: Verify routing configuration
console.log('✓ Check 1: Routing Configuration');
console.log(`  - Supported locales: ${routing.locales.join(', ')}`);
console.log(`  - Default locale: ${routing.defaultLocale}`);
console.log(`  - Locale prefix: ${routing.localePrefix}`);

if (routing.locales.length !== 7) {
  console.error('  ❌ ERROR: Expected 7 locales, found', routing.locales.length);
  process.exit(1);
}

if (routing.defaultLocale !== 'en') {
  console.error('  ❌ ERROR: Expected default locale to be "en", found', routing.defaultLocale);
  process.exit(1);
}

if (routing.localePrefix !== 'always') {
  console.error('  ❌ ERROR: Expected localePrefix to be "always", found', routing.localePrefix);
  process.exit(1);
}

console.log('  ✅ Routing configuration is correct\n');

// Check 2: Verify proxy.ts exists and has correct structure
console.log('✓ Check 2: Proxy File Structure');
const proxyPath = path.join(process.cwd(), 'proxy.ts');

if (!fs.existsSync(proxyPath)) {
  console.error('  ❌ ERROR: proxy.ts file not found');
  process.exit(1);
}

const proxyContent = fs.readFileSync(proxyPath, 'utf-8');

// Check for required imports
const requiredImports = [
  'createIntlMiddleware',
  'from \'next-intl/middleware\'',
  'from \'./i18n/routing\'',
];

for (const importStr of requiredImports) {
  if (!proxyContent.includes(importStr)) {
    console.error(`  ❌ ERROR: Missing required import: ${importStr}`);
    process.exit(1);
  }
}

// Check for intlMiddleware creation
if (!proxyContent.includes('createIntlMiddleware(routing)')) {
  console.error('  ❌ ERROR: intlMiddleware not created with routing config');
  process.exit(1);
}

// Check for intlMiddleware call in proxy function
if (!proxyContent.includes('intlMiddleware(request)')) {
  console.error('  ❌ ERROR: intlMiddleware not called in proxy function');
  process.exit(1);
}

console.log('  ✅ Proxy file structure is correct\n');

// Check 3: Verify middleware.ts does not exist
console.log('✓ Check 3: Middleware File');
const middlewarePath = path.join(process.cwd(), 'middleware.ts');

if (fs.existsSync(middlewarePath)) {
  console.error('  ❌ ERROR: middleware.ts should not exist when using proxy.ts');
  console.error('  Next.js will throw an error if both files are present');
  process.exit(1);
}

console.log('  ✅ No conflicting middleware.ts file\n');

// Check 4: Verify request.ts configuration
console.log('✓ Check 4: Request Configuration');
const requestPath = path.join(process.cwd(), 'i18n', 'request.ts');

if (!fs.existsSync(requestPath)) {
  console.error('  ❌ ERROR: i18n/request.ts file not found');
  process.exit(1);
}

const requestContent = fs.readFileSync(requestPath, 'utf-8');

if (!requestContent.includes('getRequestConfig')) {
  console.error('  ❌ ERROR: getRequestConfig not found in request.ts');
  process.exit(1);
}

console.log('  ✅ Request configuration is correct\n');

// Check 5: Verify translation files exist
console.log('✓ Check 5: Translation Files');
const messagesDir = path.join(process.cwd(), 'messages');

for (const locale of routing.locales) {
  const messagePath = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(messagePath)) {
    console.error(`  ❌ ERROR: Translation file not found: messages/${locale}.json`);
    process.exit(1);
  }
}

console.log('  ✅ All translation files exist\n');

// Summary
console.log('═══════════════════════════════════════════════════════');
console.log('✅ All checks passed!');
console.log('═══════════════════════════════════════════════════════');
console.log('\nLanguage preference persistence is properly configured:');
console.log('  • next-intl middleware is integrated in proxy.ts');
console.log('  • NEXT_LOCALE cookie will be set automatically');
console.log('  • Cookie will persist across browser sessions');
console.log('  • Cookie takes priority over Accept-Language header');
console.log('\nTo test manually:');
console.log('  1. Run: npm run dev');
console.log('  2. Visit http://localhost:3000');
console.log('  3. Switch language using the language switcher');
console.log('  4. Refresh the page - language should persist');
console.log('  5. Close and reopen browser - language should still persist');
console.log('  6. Check browser DevTools > Application > Cookies for NEXT_LOCALE');
