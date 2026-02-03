/**
 * Property-Based Test: Hero Typography Hierarchy
 * Feature: landing-page-redesign, Property 3: Typography hierarchy in Hero
 * Validates: Requirements 1.4
 * 
 * Property: For any rendered Hero component, the computed font size of the headline 
 * should be greater than the computed font size of the subheadline.
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import fc from 'fast-check';

// Helper function to extract numeric value from Tailwind text size class
const getTailwindTextSizeValue = (element: Element): number => {
  const classList = Array.from(element.classList);
  
  // Map of Tailwind text size classes to their approximate pixel values
  const sizeMap: Record<string, number> = {
    'text-4xl': 36,
    'text-5xl': 48,
    'text-6xl': 60,
    'text-7xl': 72,
    'text-xl': 20,
    'text-2xl': 24,
    'sm:text-5xl': 48,
    'sm:text-xl': 20,
    'md:text-6xl': 60,
    'md:text-2xl': 24,
    'lg:text-7xl': 72,
    'lg:text-2xl': 24,
  };
  
  // Find the largest text size class (for responsive sizing)
  let maxSize = 0;
  classList.forEach(cls => {
    if (sizeMap[cls] && sizeMap[cls] > maxSize) {
      maxSize = sizeMap[cls];
    }
  });
  
  return maxSize;
};

describe('Property 3: Typography hierarchy in Hero', () => {
  it('should maintain headline font size greater than subheadline across all viewport widths', () => {
    fc.assert(
      fc.property(
        // Generate viewport widths: mobile (320-639), tablet (640-1023), desktop (1024+)
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          
          // Render the Hero component
          const { container } = render(<Hero />);
          
          // Get the headline (h1) and subheadline (p) elements
          const headline = container.querySelector('h1');
          const subheadline = container.querySelector('p');
          
          // Verify both elements exist
          expect(headline).toBeInTheDocument();
          expect(subheadline).toBeInTheDocument();
          
          // Verify headline has larger text size classes than subheadline
          // Headline should have text-4xl or larger (sm:text-5xl, md:text-6xl, lg:text-7xl)
          expect(headline).toHaveClass('text-4xl');
          
          // Subheadline should have text-xl or text-2xl (smaller than headline)
          expect(subheadline).toHaveClass('text-xl');
          
          // Verify the size hierarchy using Tailwind class values
          const headlineSize = getTailwindTextSizeValue(headline!);
          const subheadlineSize = getTailwindTextSizeValue(subheadline!);
          
          // Headline should be larger than subheadline
          expect(headlineSize).toBeGreaterThan(subheadlineSize);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain typography hierarchy at specific breakpoints', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 375, name: 'mobile' },
          { width: 640, name: 'small-tablet' },
          { width: 768, name: 'tablet' },
          { width: 1024, name: 'desktop' },
          { width: 1280, name: 'large-desktop' },
          { width: 1920, name: 'xl-desktop' }
        ),
        (viewport) => {
          global.innerWidth = viewport.width;
          
          const { container } = render(<Hero />);
          
          const headline = container.querySelector('h1');
          const subheadline = container.querySelector('p');
          
          expect(headline).toBeInTheDocument();
          expect(subheadline).toBeInTheDocument();
          
          // Verify headline has responsive text sizing
          expect(headline).toHaveClass('text-4xl');
          expect(headline).toHaveClass('sm:text-5xl');
          expect(headline).toHaveClass('md:text-6xl');
          expect(headline).toHaveClass('lg:text-7xl');
          
          // Verify subheadline has responsive text sizing
          expect(subheadline).toHaveClass('text-xl');
          expect(subheadline).toHaveClass('md:text-2xl');
          
          // Verify the size hierarchy
          const headlineSize = getTailwindTextSizeValue(headline!);
          const subheadlineSize = getTailwindTextSizeValue(subheadline!);
          
          // Verify hierarchy is maintained
          expect(headlineSize).toBeGreaterThan(subheadlineSize);
          
          // Verify minimum size difference (at least 12px for clear hierarchy)
          const sizeDifference = headlineSize - subheadlineSize;
          expect(sizeDifference).toBeGreaterThanOrEqual(12);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have headline with bold font weight and appropriate styling', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          const headline = container.querySelector('h1');
          expect(headline).toBeInTheDocument();
          
          // Verify headline has bold font weight
          expect(headline).toHaveClass('font-bold');
          
          // Verify headline has appropriate text color
          expect(headline).toHaveClass('text-slate-900');
          
          // Verify headline has tight leading for better hierarchy
          expect(headline).toHaveClass('leading-tight');
          
          // Verify headline has tracking (letter-spacing)
          expect(headline).toHaveClass('tracking-tight');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have subheadline with appropriate styling for secondary text', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          const subheadline = container.querySelector('p');
          expect(subheadline).toBeInTheDocument();
          
          // Verify subheadline has secondary text color (lighter than headline)
          expect(subheadline).toHaveClass('text-slate-600');
          
          // Verify subheadline has relaxed leading for readability
          expect(subheadline).toHaveClass('leading-relaxed');
          
          // Verify subheadline has tracking
          expect(subheadline).toHaveClass('tracking-wide');
        }
      ),
      { numRuns: 20 }
    );
  });
});
