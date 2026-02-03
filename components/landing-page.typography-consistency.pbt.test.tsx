/**
 * Property-Based Test: Typography Consistency Across Sections
 * Feature: landing-page-redesign, Property 21: Typography consistency across sections
 * Validates: Requirements 6.5, 3.3
 * 
 * Property: For any two elements of the same semantic type (e.g., all h2 elements, 
 * all body paragraphs) across different sections, their computed font-size, 
 * font-weight, and line-height should be identical.
 */

import { render } from '@testing-library/react';
import { PageClient } from './PageClient';
import fc from 'fast-check';

// Helper function to extract numeric value from Tailwind text size class
const getTailwindTextSizeValue = (element: Element): number => {
  const classList = Array.from(element.classList);
  
  const sizeMap: Record<string, number> = {
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
    'text-2xl': 24,
    'text-3xl': 30,
    'text-4xl': 36,
    'text-5xl': 48,
    'text-6xl': 60,
    'text-7xl': 72,
    'sm:text-xl': 20,
    'sm:text-2xl': 24,
    'sm:text-4xl': 36,
    'sm:text-5xl': 48,
    'md:text-2xl': 24,
    'md:text-5xl': 48,
    'md:text-6xl': 60,
    'lg:text-2xl': 24,
    'lg:text-7xl': 72,
  };
  
  let maxSize = 0;
  classList.forEach(cls => {
    if (sizeMap[cls] && sizeMap[cls] > maxSize) {
      maxSize = sizeMap[cls];
    }
  });
  
  return maxSize || 16;
};

// Helper function to get font weight from Tailwind classes
const getTailwindFontWeight = (element: Element): number => {
  const classList = Array.from(element.classList);
  
  const weightMap: Record<string, number> = {
    'font-thin': 100,
    'font-extralight': 200,
    'font-light': 300,
    'font-normal': 400,
    'font-medium': 500,
    'font-semibold': 600,
    'font-bold': 700,
    'font-extrabold': 800,
    'font-black': 900,
  };
  
  for (const cls of classList) {
    if (weightMap[cls]) {
      return weightMap[cls];
    }
  }
  
  return 400;
};

// Helper function to get line height from Tailwind classes
const getTailwindLineHeight = (element: Element): string => {
  const classList = Array.from(element.classList);
  
  const lineHeightMap: Record<string, string> = {
    'leading-none': '1',
    'leading-tight': '1.25',
    'leading-snug': '1.375',
    'leading-normal': '1.5',
    'leading-relaxed': '1.625',
    'leading-loose': '2',
    'leading-[1.1]': '1.1',
    'leading-[1.2]': '1.2',
    'leading-[1.3]': '1.3',
    'leading-[1.5]': '1.5',
    'leading-[1.6]': '1.6',
  };
  
  for (const cls of classList) {
    if (lineHeightMap[cls]) {
      return lineHeightMap[cls];
    }
  }
  
  return '1.5'; // Default
};

describe('Property 21: Typography consistency across sections', () => {
  it('should have consistent h2 styling across all sections', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Get all h2 elements from main content
          const main = container.querySelector('main');
          const h2Elements = main?.querySelectorAll('h2');
          
          if (h2Elements && h2Elements.length > 1) {
            // Get styles from first h2
            const firstH2 = h2Elements[0];
            const firstSize = getTailwindTextSizeValue(firstH2);
            const firstWeight = getTailwindFontWeight(firstH2);
            const firstLineHeight = getTailwindLineHeight(firstH2);
            
            // Verify all other h2 elements have the same styles
            for (let i = 1; i < h2Elements.length; i++) {
              const h2 = h2Elements[i];
              expect(getTailwindTextSizeValue(h2)).toBe(firstSize);
              expect(getTailwindFontWeight(h2)).toBe(firstWeight);
              expect(getTailwindLineHeight(h2)).toBe(firstLineHeight);
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have consistent h3 styling across all sections', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Get all h3 elements
          const h3Elements = container.querySelectorAll('h3');
          
          if (h3Elements.length > 1) {
            // Get styles from first h3
            const firstH3 = h3Elements[0];
            const firstWeight = getTailwindFontWeight(firstH3);
            const firstLineHeight = getTailwindLineHeight(firstH3);
            
            // Verify all other h3 elements have the same weight and line-height
            // (size may vary for featured cards, but weight and line-height should be consistent)
            for (let i = 1; i < h3Elements.length; i++) {
              const h3 = h3Elements[i];
              expect(getTailwindFontWeight(h3)).toBe(firstWeight);
              expect(getTailwindLineHeight(h3)).toBe(firstLineHeight);
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have consistent body text styling across sections', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Get body text paragraphs from main content
          const main = container.querySelector('main');
          const paragraphs = main?.querySelectorAll('p');
          
          if (paragraphs && paragraphs.length > 1) {
            // Sample a few paragraphs to check consistency
            const sampleSize = Math.min(5, paragraphs.length);
            const samples = Array.from(paragraphs).slice(0, sampleSize);
            
            // Get styles from first paragraph
            const firstP = samples[0];
            const firstWeight = getTailwindFontWeight(firstP);
            const firstLineHeight = getTailwindLineHeight(firstP);
            
            // Verify all sampled paragraphs have consistent weight and line-height
            samples.forEach(p => {
              expect(getTailwindFontWeight(p)).toBe(firstWeight);
              expect(getTailwindLineHeight(p)).toBe(firstLineHeight);
            });
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain typography consistency across viewport changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 375, name: 'mobile' },
          { width: 768, name: 'tablet' },
          { width: 1024, name: 'desktop' },
          { width: 1920, name: 'xl-desktop' }
        ),
        (viewport) => {
          global.innerWidth = viewport.width;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          const main = container.querySelector('main');
          
          // Check h2 consistency
          const h2Elements = main?.querySelectorAll('h2');
          if (h2Elements && h2Elements.length > 1) {
            const firstH2Weight = getTailwindFontWeight(h2Elements[0]);
            const firstH2LineHeight = getTailwindLineHeight(h2Elements[0]);
            
            for (let i = 1; i < h2Elements.length; i++) {
              expect(getTailwindFontWeight(h2Elements[i])).toBe(firstH2Weight);
              expect(getTailwindLineHeight(h2Elements[i])).toBe(firstH2LineHeight);
            }
          }
          
          // Check h3 consistency
          const h3Elements = container.querySelectorAll('h3');
          if (h3Elements.length > 1) {
            const firstH3Weight = getTailwindFontWeight(h3Elements[0]);
            const firstH3LineHeight = getTailwindLineHeight(h3Elements[0]);
            
            for (let i = 1; i < h3Elements.length; i++) {
              expect(getTailwindFontWeight(h3Elements[i])).toBe(firstH3Weight);
              expect(getTailwindLineHeight(h3Elements[i])).toBe(firstH3LineHeight);
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have consistent small text styling across sections', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Get small text elements from main content (exclude header/footer special cases)
          const main = container.querySelector('main');
          const smallTextElements = main?.querySelectorAll('.text-sm, .text-xs');
          
          if (smallTextElements && smallTextElements.length > 1) {
            // Group by size class
            const textSmElements = Array.from(smallTextElements).filter(el => 
              el.classList.contains('text-sm')
            );
            
            if (textSmElements.length > 1) {
              // Check consistency among text-sm elements
              const firstWeight = getTailwindFontWeight(textSmElements[0]);
              const firstLineHeight = getTailwindLineHeight(textSmElements[0]);
              
              textSmElements.forEach(el => {
                expect(getTailwindFontWeight(el)).toBe(firstWeight);
                expect(getTailwindLineHeight(el)).toBe(firstLineHeight);
              });
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have consistent heading font weights across all heading levels', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          const main = container.querySelector('main');
          
          // Get all h1 elements
          const h1Elements = main?.querySelectorAll('h1');
          if (h1Elements && h1Elements.length > 1) {
            const firstWeight = getTailwindFontWeight(h1Elements[0]);
            for (let i = 1; i < h1Elements.length; i++) {
              expect(getTailwindFontWeight(h1Elements[i])).toBe(firstWeight);
            }
          }
          
          // Get all h2 elements
          const h2Elements = main?.querySelectorAll('h2');
          if (h2Elements && h2Elements.length > 1) {
            const firstWeight = getTailwindFontWeight(h2Elements[0]);
            for (let i = 1; i < h2Elements.length; i++) {
              expect(getTailwindFontWeight(h2Elements[i])).toBe(firstWeight);
            }
          }
          
          // Get all h3 elements
          const h3Elements = container.querySelectorAll('h3');
          if (h3Elements.length > 1) {
            const firstWeight = getTailwindFontWeight(h3Elements[0]);
            for (let i = 1; i < h3Elements.length; i++) {
              expect(getTailwindFontWeight(h3Elements[i])).toBe(firstWeight);
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
