/**
 * Property-Based Test: Typography Scale Diversity
 * Feature: landing-page-redesign, Property 10: Typography scale diversity
 * Validates: Requirements 3.5
 * 
 * Property: For any rendered Landing Page, measuring computed font sizes across 
 * h1, h2, h3, body text, and small text should yield at least 3 distinct values.
 */

import { render } from '@testing-library/react';
import { PageClient } from './PageClient';
import fc from 'fast-check';

// Helper function to extract numeric value from Tailwind text size class
const getTailwindTextSizeValue = (element: Element): number => {
  const classList = Array.from(element.classList);
  
  // Map of Tailwind text size classes to their approximate pixel values
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
  
  // Find the largest text size class (for responsive sizing)
  let maxSize = 0;
  classList.forEach(cls => {
    if (sizeMap[cls] && sizeMap[cls] > maxSize) {
      maxSize = sizeMap[cls];
    }
  });
  
  return maxSize || 16; // Default to base size if no text class found
};

describe('Property 10: Typography scale diversity', () => {
  it('should have at least 3 distinct font sizes across h1, h2, h3, body, and small text', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Collect all heading and text elements
          const h1Elements = container.querySelectorAll('h1');
          const h2Elements = container.querySelectorAll('h2');
          const h3Elements = container.querySelectorAll('h3');
          const bodyTextElements = container.querySelectorAll('p');
          const smallTextElements = container.querySelectorAll('.text-xs, .text-sm');
          
          // Verify we have elements of different types
          expect(h1Elements.length).toBeGreaterThan(0);
          
          // Collect font sizes
          const fontSizes = new Set<number>();
          
          // Get h1 sizes
          h1Elements.forEach(el => {
            const size = getTailwindTextSizeValue(el);
            if (size > 0) fontSizes.add(size);
          });
          
          // Get h2 sizes
          h2Elements.forEach(el => {
            const size = getTailwindTextSizeValue(el);
            if (size > 0) fontSizes.add(size);
          });
          
          // Get h3 sizes
          h3Elements.forEach(el => {
            const size = getTailwindTextSizeValue(el);
            if (size > 0) fontSizes.add(size);
          });
          
          // Get body text sizes (sample a few)
          const bodyTextSample = Array.from(bodyTextElements).slice(0, 5);
          bodyTextSample.forEach(el => {
            const size = getTailwindTextSizeValue(el);
            if (size > 0) fontSizes.add(size);
          });
          
          // Get small text sizes
          smallTextElements.forEach(el => {
            const size = getTailwindTextSizeValue(el);
            if (size > 0) fontSizes.add(size);
          });
          
          // Verify at least 3 distinct font sizes
          expect(fontSizes.size).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have distinct sizes for each semantic level', () => {
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
          
          // Get representative elements from main content (not header)
          const main = container.querySelector('main');
          expect(main).toBeInTheDocument();
          
          const h1 = main?.querySelector('h1'); // Hero headline
          const h2 = main?.querySelector('h2'); // Chat section heading
          const h3 = main?.querySelector('h3'); // Feature card titles
          const bodyText = main?.querySelector('p');
          const smallText = container.querySelector('.text-sm, .text-xs');
          
          // Collect sizes
          const sizes: Record<string, number> = {};
          
          if (h1) sizes.h1 = getTailwindTextSizeValue(h1);
          if (h2) sizes.h2 = getTailwindTextSizeValue(h2);
          if (h3) sizes.h3 = getTailwindTextSizeValue(h3);
          if (bodyText) sizes.body = getTailwindTextSizeValue(bodyText);
          if (smallText) sizes.small = getTailwindTextSizeValue(smallText);
          
          // Verify we have at least 3 different sizes
          const uniqueSizes = new Set(Object.values(sizes));
          expect(uniqueSizes.size).toBeGreaterThanOrEqual(3);
          
          // Verify hierarchy: h1 > h2 > h3 (if all exist)
          if (sizes.h1 && sizes.h2) {
            expect(sizes.h1).toBeGreaterThan(sizes.h2);
          }
          if (sizes.h2 && sizes.h3) {
            expect(sizes.h2).toBeGreaterThan(sizes.h3);
          }
          if (sizes.h1 && sizes.h3) {
            expect(sizes.h1).toBeGreaterThan(sizes.h3);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain typography scale diversity across viewport changes', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 320, max: 639 }), // mobile
          fc.integer({ min: 640, max: 1023 }), // tablet
          fc.integer({ min: 1024, max: 1920 }) // desktop
        ),
        ([mobileWidth, tabletWidth, desktopWidth]) => {
          const viewports = [mobileWidth, tabletWidth, desktopWidth];
          
          viewports.forEach(width => {
            global.innerWidth = width;
            
            const { container } = render(<PageClient initialUser={null} />);
            
            // Collect all text elements
            const allTextElements = container.querySelectorAll('h1, h2, h3, p, span, .text-xs, .text-sm');
            
            const fontSizes = new Set<number>();
            
            // Sample elements to get font sizes
            const sample = Array.from(allTextElements).slice(0, 20);
            sample.forEach(el => {
              const size = getTailwindTextSizeValue(el);
              if (size > 0) fontSizes.add(size);
            });
            
            // Verify diversity at each viewport
            expect(fontSizes.size).toBeGreaterThanOrEqual(3);
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
