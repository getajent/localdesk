/**
 * Property-Based Test: Responsive breakpoint adaptation
 * Feature: landing-page-redesign
 * Property 22: Responsive breakpoint adaptation
 * Validates: Requirements 7.1
 * 
 * Tests that the Features grid adapts its layout at different viewport widths
 */

import { render } from '@testing-library/react';
import { Features } from './Features';
import fc from 'fast-check';

describe('Property 22: Responsive breakpoint adaptation', () => {
  it('should adapt Features grid layout at different viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }), // Generate random viewport widths
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
          
          // Verify different layouts at different breakpoints
          if (viewportWidth < 640) {
            // Mobile: should have grid-cols-1
            expect(gridClasses).toContain('grid-cols-1');
          } else if (viewportWidth >= 640 && viewportWidth < 1024) {
            // Tablet: should have sm:grid-cols-2
            expect(gridClasses).toContain('sm:grid-cols-2');
          } else {
            // Desktop: should have lg:grid-cols-4
            expect(gridClasses).toContain('lg:grid-cols-4');
          }
          
          // Verify grid has 4 feature cards
          const cards = container.querySelectorAll('.grid > div');
          expect(cards.length).toBe(4);
        }
      ),
      { numRuns: 20 }
    );
  });
  
  it('should have different grid column configurations across breakpoints', () => {
    const breakpoints = [
      { width: 375, name: 'mobile', expectedClass: 'grid-cols-1' },
      { width: 768, name: 'tablet', expectedClass: 'sm:grid-cols-2' },
      { width: 1280, name: 'desktop', expectedClass: 'lg:grid-cols-4' },
    ];
    
    breakpoints.forEach(({ width, name, expectedClass }) => {
      global.innerWidth = width;
      
      const { container } = render(<Features />);
      const gridContainer = container.querySelector('.grid');
      const gridClasses = gridContainer?.className || '';
      
      expect(gridClasses).toContain(expectedClass);
    });
  });
});
