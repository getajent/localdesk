/**
 * Property-Based Test: Bento Grid Card Size Variation
 * Feature: landing-page-redesign, Property 4: Bento grid card size variation
 * Validates: Requirements 2.1, 2.2, 2.5
 * 
 * Property: For any rendered Features component, the cards should have at least three 
 * distinct width or height values, with at least one card being significantly larger 
 * (1.5x or more) than the smallest card.
 */

import { render } from '@testing-library/react';
import { Features } from './Features';
import fc from 'fast-check';

// Helper function to extract grid span values from Tailwind classes
const getGridSpanValue = (element: Element, type: 'col' | 'row'): number => {
  const classList = Array.from(element.classList);
  const prefix = type === 'col' ? 'lg:col-span-' : 'lg:row-span-';
  
  for (const cls of classList) {
    if (cls.startsWith(prefix)) {
      const spanValue = parseInt(cls.replace(prefix, ''), 10);
      if (!isNaN(spanValue)) {
        return spanValue;
      }
    }
  }
  
  return 1; // Default span is 1
};

// Helper function to calculate card "size" (area = col-span * row-span)
const getCardArea = (element: Element): number => {
  const colSpan = getGridSpanValue(element, 'col');
  const rowSpan = getGridSpanValue(element, 'row');
  return colSpan * rowSpan;
};

describe('Property 4: Bento grid card size variation', () => {
  it('should have at least three distinct card sizes at desktop viewport', () => {
    fc.assert(
      fc.property(
        // Generate desktop viewport widths (1024px and above)
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          // Get all feature cards
          const cards = container.querySelectorAll('.grid > div');
          expect(cards.length).toBe(4);
          
          // Calculate area for each card
          const cardAreas = Array.from(cards).map(card => getCardArea(card));
          
          // Get unique sizes
          const uniqueSizes = [...new Set(cardAreas)];
          
          // Should have at least 3 distinct sizes
          expect(uniqueSizes.length).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have at least one card significantly larger (1.5x) than the smallest', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = container.querySelectorAll('.grid > div');
          const cardAreas = Array.from(cards).map(card => getCardArea(card));
          
          const minArea = Math.min(...cardAreas);
          const maxArea = Math.max(...cardAreas);
          
          // At least one card should be 1.5x or larger than the smallest
          const ratio = maxArea / minArea;
          expect(ratio).toBeGreaterThanOrEqual(1.5);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have correct grid span assignments for Bento layout', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = Array.from(container.querySelectorAll('.grid > div'));
          expect(cards.length).toBe(4);
          
          // Card 1 (index 0): 2x2 featured card
          expect(cards[0]).toHaveClass('lg:col-span-2');
          expect(cards[0]).toHaveClass('lg:row-span-2');
          
          // Card 2 (index 1): 1x1
          expect(cards[1]).toHaveClass('lg:col-span-1');
          expect(cards[1]).toHaveClass('lg:row-span-1');
          
          // Card 3 (index 2): 1x1
          expect(cards[2]).toHaveClass('lg:col-span-1');
          expect(cards[2]).toHaveClass('lg:row-span-1');
          
          // Card 4 (index 3): 2x1
          expect(cards[3]).toHaveClass('lg:col-span-2');
          expect(cards[3]).toHaveClass('lg:row-span-1');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain asymmetric Bento layout with varied card dimensions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 1024, name: 'desktop' },
          { width: 1280, name: 'large-desktop' },
          { width: 1440, name: 'xl-desktop' },
          { width: 1920, name: 'xxl-desktop' }
        ),
        (viewport) => {
          global.innerWidth = viewport.width;
          
          const { container } = render(<Features />);
          
          const cards = Array.from(container.querySelectorAll('.grid > div'));
          const cardAreas = cards.map(card => getCardArea(card));
          
          // Expected areas: [4, 1, 1, 2] for cards [0, 1, 2, 3]
          expect(cardAreas[0]).toBe(4); // 2x2 = 4
          expect(cardAreas[1]).toBe(1); // 1x1 = 1
          expect(cardAreas[2]).toBe(1); // 1x1 = 1
          expect(cardAreas[3]).toBe(2); // 2x1 = 2
          
          // Verify asymmetry: not all cards are the same size
          const allSame = cardAreas.every(area => area === cardAreas[0]);
          expect(allSame).toBe(false);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use CSS Grid with explicit rows and columns at desktop', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).toBeInTheDocument();
          
          // Should have 4-column grid at desktop
          expect(gridContainer).toHaveClass('lg:grid-cols-4');
          
          // Should have explicit 2-row grid at desktop
          expect(gridContainer).toHaveClass('lg:grid-rows-2');
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should reflow to simpler grid on mobile and tablet', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 375, name: 'mobile', expectedCols: 1 },
          { width: 640, name: 'tablet', expectedCols: 2 },
          { width: 768, name: 'large-tablet', expectedCols: 2 }
        ),
        (viewport) => {
          global.innerWidth = viewport.width;
          
          const { container } = render(<Features />);
          
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).toBeInTheDocument();
          
          // Mobile: single column
          expect(gridContainer).toHaveClass('grid-cols-1');
          
          // Tablet: 2 columns
          expect(gridContainer).toHaveClass('sm:grid-cols-2');
          
          // All 4 cards should still be present
          const cards = container.querySelectorAll('.grid > div');
          expect(cards.length).toBe(4);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain visual balance with varied card sizes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = Array.from(container.querySelectorAll('.grid > div'));
          const cardAreas = cards.map(card => getCardArea(card));
          
          // Total area should be 8 (4 + 1 + 1 + 2)
          const totalArea = cardAreas.reduce((sum, area) => sum + area, 0);
          expect(totalArea).toBe(8);
          
          // Should have a mix of sizes (not all 1, not all 4)
          const hasSmallCards = cardAreas.some(area => area === 1);
          const hasMediumCards = cardAreas.some(area => area === 2);
          const hasLargeCards = cardAreas.some(area => area >= 4);
          
          expect(hasSmallCards).toBe(true);
          expect(hasMediumCards).toBe(true);
          expect(hasLargeCards).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });
});
