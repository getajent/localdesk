// Simple contrast ratio verification script
// WCAG AA requires 4.5:1 for normal text, 3:1 for large text

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Test color combinations used in the new pages
const tests = [
  {
    name: 'Danish Red on Light Background',
    foreground: '#C8102E',
    background: '#FAF8F5',
    minRatio: 4.5, // Normal text
  },
  {
    name: 'Dark Foreground on Light Background',
    foreground: '#0D1117',
    background: '#FAF8F5',
    minRatio: 4.5,
  },
  {
    name: 'Muted Foreground on Light Background',
    foreground: '#575E6B',
    background: '#FAF8F5',
    minRatio: 4.5,
  },
  {
    name: 'Danish Red on Dark Background (dark mode)',
    foreground: '#C8102E',
    background: '#0F1419',
    minRatio: 4.5,
  },
  {
    name: 'Light Foreground on Dark Background (dark mode)',
    foreground: '#FAF5F0',
    background: '#0F1419',
    minRatio: 4.5,
  },
];

console.log('Color Contrast Verification\n');
console.log('WCAG AA Standard: 4.5:1 for normal text, 3:1 for large text\n');

let allPassed = true;

tests.forEach(test => {
  const ratio = getContrastRatio(test.foreground, test.background);
  const passed = ratio >= test.minRatio;
  allPassed = allPassed && passed;
  
  console.log(`${test.name}:`);
  console.log(`  Foreground: ${test.foreground}`);
  console.log(`  Background: ${test.background}`);
  console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1`);
  console.log(`  Required: ${test.minRatio}:1`);
  console.log(`  Status: ${passed ? '✓ PASS' : '✗ FAIL'}\n`);
});

console.log(allPassed ? 'All tests passed!' : 'Some tests failed!');
process.exit(allPassed ? 0 : 1);
