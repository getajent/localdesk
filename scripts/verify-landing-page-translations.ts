/**
 * Verification script for landing page translations
 * This script checks that all required translation keys exist for the Hero and Features components
 */

const locales = ['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru'];

const requiredHeroKeys = [
  'HomePage.Hero.established',
  'HomePage.Hero.advisor',
  'HomePage.Hero.heritage',
  'HomePage.Hero.title',
  'HomePage.Hero.titleDenmark',
  'HomePage.Hero.titleFeelLikeHome',
  'HomePage.Hero.missionLabel',
  'HomePage.Hero.missionTitle',
  'HomePage.Hero.missionTitleEmphasis',
  'HomePage.Hero.missionTitleEnd',
  'HomePage.Hero.description',
  'HomePage.Hero.cta',
  'HomePage.Hero.topicSkat',
  'HomePage.Hero.topicVisas',
  'HomePage.Hero.topicSiri',
  'HomePage.Hero.topicHousing',
];

const requiredFeaturesKeys = [
  'HomePage.Features.sectionLabel',
  'HomePage.Features.title',
  'HomePage.Features.titleEmphasis',
  'HomePage.Features.titleEnd',
  'HomePage.Features.madeFor',
  'HomePage.Features.feature1.id',
  'HomePage.Features.feature1.category',
  'HomePage.Features.feature1.title',
  'HomePage.Features.feature1.description',
  'HomePage.Features.feature2.id',
  'HomePage.Features.feature2.category',
  'HomePage.Features.feature2.title',
  'HomePage.Features.feature2.description',
  'HomePage.Features.feature3.id',
  'HomePage.Features.feature3.category',
  'HomePage.Features.feature3.title',
  'HomePage.Features.feature3.description',
  'HomePage.Features.feature4.id',
  'HomePage.Features.feature4.category',
  'HomePage.Features.feature4.title',
  'HomePage.Features.feature4.description',
];

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function verifyTranslations() {
  let allValid = true;
  const allKeys = [...requiredHeroKeys, ...requiredFeaturesKeys];

  console.log('🔍 Verifying landing page translations...\n');

  for (const locale of locales) {
    console.log(`Checking locale: ${locale}`);
    
    try {
      const messages = require(`../messages/${locale}.json`);
      const missingKeys: string[] = [];

      for (const key of allKeys) {
        const value = getNestedValue(messages, key);
        if (value === undefined || value === null || value === '') {
          missingKeys.push(key);
        }
      }

      if (missingKeys.length > 0) {
        console.log(`  ❌ Missing ${missingKeys.length} keys:`);
        missingKeys.forEach(key => console.log(`     - ${key}`));
        allValid = false;
      } else {
        console.log(`  ✅ All ${allKeys.length} keys present`);
      }
    } catch (error) {
      console.log(`  ❌ Error loading translation file: ${error}`);
      allValid = false;
    }

    console.log('');
  }

  if (allValid) {
    console.log('✅ All translations verified successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Locales checked: ${locales.length}`);
    console.log(`   - Keys per locale: ${allKeys.length}`);
    console.log(`   - Total verifications: ${locales.length * allKeys.length}`);
  } else {
    console.log('❌ Some translations are missing or invalid');
    process.exit(1);
  }
}

verifyTranslations();
