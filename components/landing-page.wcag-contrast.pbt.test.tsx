/**
 * Property-Based Test: WCAG AA contrast compliance
 * Feature: landing-page-redesign, Property 13
 * Validates: Requirements 4.4
 * 
 * Property: For any text element on the Landing Page, the contrast ratio between 
 * the text color and its background color should meet WCAG AA standards 
 * (4.5:1 for normal text, 3:1 for large text ≥18pt)
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Footer } from './Footer';
import fc from 'fast-check';

// Helper function to parse RGB color
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Handle rgb() format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  // Handle rgba() format
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
    };
  }

  // Handle hex format
  const hexMatch = color.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
    };
  }

  return null;
}

// Calculate relative luminance
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number | null {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  if (!rgb1 || !rgb2) return null;

  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check if text is large (18pt+ or 14pt+ bold)
function isLargeText(element: Element): boolean {
  const styles = window.getComputedStyle(element);
  const fontSize = parseFloat(styles.fontSize);
  const fontWeight = parseInt(styles.fontWeight) || 400;

  // 18pt = 24px, 14pt = 18.67px
  return fontSize >= 24 || (fontSize >= 18.67 && fontWeight >= 700);
}

describe('Property 13: WCAG AA contrast compliance', () => {
  // Test Hero component text contrast
  test('Hero component text meets WCAG AA contrast requirements', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Hero />);

        // Get all text elements
        const textElements = container.querySelectorAll('h1, p, button');

        textElements.forEach((element) => {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;

          // Skip if background is transparent (will inherit from parent)
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            return;
          }

          const contrastRatio = getContrastRatio(color, backgroundColor);

          if (contrastRatio !== null) {
            const requiredRatio = isLargeText(element) ? 3 : 4.5;
            expect(contrastRatio).toBeGreaterThanOrEqual(requiredRatio);
          }
        });
      }),
      { numRuns: 20 }
    );
  });

  // Test Features component text contrast
  test('Features component text meets WCAG AA contrast requirements', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Features />);

        // Get all text elements in feature cards
        const textElements = container.querySelectorAll('h2, h3, p');

        textElements.forEach((element) => {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;

          // Skip if background is transparent
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            return;
          }

          const contrastRatio = getContrastRatio(color, backgroundColor);

          if (contrastRatio !== null) {
            const requiredRatio = isLargeText(element) ? 3 : 4.5;
            expect(contrastRatio).toBeGreaterThanOrEqual(requiredRatio);
          }
        });
      }),
      { numRuns: 20 }
    );
  });

  // Test Footer component text contrast
  test('Footer component text meets WCAG AA contrast requirements', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Footer />);

        // Get all text elements
        const textElements = container.querySelectorAll('div, a');

        textElements.forEach((element) => {
          // Only check elements with text content
          if (!element.textContent?.trim()) return;

          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;

          // Skip if background is transparent
          if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
            return;
          }

          const contrastRatio = getContrastRatio(color, backgroundColor);

          if (contrastRatio !== null) {
            const requiredRatio = isLargeText(element) ? 3 : 4.5;
            expect(contrastRatio).toBeGreaterThanOrEqual(requiredRatio);
          }
        });
      }),
      { numRuns: 20 }
    );
  });

  // Test specific color combinations used in the design
  test('Danish Red on white meets WCAG AA contrast', () => {
    const danishRed = '#C8102E';
    const white = '#FFFFFF';
    const contrastRatio = getContrastRatio(danishRed, white);

    expect(contrastRatio).not.toBeNull();
    expect(contrastRatio!).toBeGreaterThanOrEqual(4.5);
  });

  test('Slate-700 on white meets WCAG AA contrast', () => {
    const slate700 = 'rgb(51, 65, 85)'; // Tailwind slate-700
    const white = '#FFFFFF';
    const contrastRatio = getContrastRatio(slate700, white);

    expect(contrastRatio).not.toBeNull();
    expect(contrastRatio!).toBeGreaterThanOrEqual(4.5);
  });

  test('Slate-900 on white meets WCAG AA contrast', () => {
    const slate900 = 'rgb(15, 23, 42)'; // Tailwind slate-900
    const white = '#FFFFFF';
    const contrastRatio = getContrastRatio(slate900, white);

    expect(contrastRatio).not.toBeNull();
    expect(contrastRatio!).toBeGreaterThanOrEqual(4.5);
  });
});
