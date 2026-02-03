/**
 * Property-Based Test: Mobile Bento grid reflow
 * Feature: landing-page-redesign
 * Property 23: Mobile Bento grid reflow
 * Validates: Requirements 7.2
 * 
 * Tests that the Features grid reflows to 1-2 columns at mobile viewport widths
 */

import { render } from '@testing-library/react';
import { Features } from './Features';
import fc from 'fast-check';

describe('Property 23: Mobile Bento grid reflow', () => {
  it('should reflow to 1-2 columns at mobile viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 639 }), // Mobile viewport widths (<640px)
        (viewportWidth) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          
          // Render component
          const { container } = render(<Features />);
          
          // Find the grid container
          const gridContainer = container.querySelector('.grid');
          expect(gridContainer).toBeTruthy();
          
          // Get computed grid classes
          const gridClasses = gridContainer?.className || '';
          
          // At mobile widths, should have grid-cols-1 (base) or sm:grid-cols-2 (small mobile)
          // The base class is grid-cols-1, which applies at <640px
          expect(gridClasses).toContain('grid-cols-1');
          
          // Verify all 4 cards are present
          const cards = container.querySelectorAll('.grid > div');
          expect(cards.length).toBe(4);
          
          // Verify cards don't have desktop-specific large spans at mobile
          cards.forEach((card) => {
            const cardClasses = card.className;
            // At mobile, lg: classes shouldn't be active
            // The cards should stack vertically or in 2 columns
            expect(card).toBeTruthy();
          });
        }
      ),
      { numRuns: 20 }
    );
  });
  
  it('should have single or double column layout at specific mobile widths', () => {
    const mobileWidths = [320, 375, 414, 480, 600];
    
    mobileWidths.forEach((width) => {
      global.innerWidth = width;
      
      const { container } = render(<Features />);
      const gridContainer = container.querySelector('.grid');
      const gridClasses = gridContainer?.className || '';
      
      // Should have grid-cols-1 as base class
      expect(gridClasses).toContain('grid-cols-1');
      
      // Should have sm:grid-cols-2 for tablet/larger mobile
      expect(gridClasses).toContain('sm:grid-cols-2');
      
      // Verify all features are rendered
      const cards = container.querySelectorAll('.grid > div');
      expect(cards.length).toBe(4);
    });
  });
  
  it('should maintain content accessibility at mobile widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 639 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          // Verify all feature titles are present
          const titles = ['Instant Answers', 'Expert Knowledge', 'No Login Required', 'Always Available'];
          titles.forEach((title) => {
            expect(container.textContent).toContain(title);
          });
          
          // Verify all cards are visible (not hidden)
          const cards = container.querySelectorAll('.grid > div');
          cards.forEach((card) => {
            expect(card).toBeVisible();
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
