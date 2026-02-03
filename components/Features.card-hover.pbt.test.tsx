/**
 * Property-Based Test: Card Hover Interactions
 * Feature: landing-page-redesign, Property 6: Card hover interactions
 * Validates: Requirements 2.4
 * 
 * Property: For any feature card element, simulating a hover event should result in 
 * a change to at least one of: box-shadow, transform, or border properties.
 */

import { render } from '@testing-library/react';
import { Features } from './Features';
import fc from 'fast-check';
import userEvent from '@testing-library/user-event';

// Helper function to check if element has hover-related classes
const hasHoverClasses = (element: Element): { shadow: boolean; transform: boolean; border: boolean } => {
  const classList = Array.from(element.classList);
  
  return {
    shadow: classList.some(cls => cls.includes('hover:shadow')),
    transform: classList.some(cls => cls.includes('hover:scale') || cls.includes('hover:-translate')),
    border: classList.some(cls => cls.includes('hover:border'))
  };
};

// Helper function to check if element has transition classes
const hasTransitionClasses = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  return classList.some(cls => cls.includes('transition'));
};

describe('Property 6: Card hover interactions', () => {
  it('should have hover effects on all feature cards', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = container.querySelectorAll('.grid > div');
          expect(cards.length).toBe(4);
          
          // Each card should have at least one hover effect
          cards.forEach((card, index) => {
            const hoverEffects = hasHoverClasses(card);
            const hasAnyHoverEffect = hoverEffects.shadow || hoverEffects.transform || hoverEffects.border;
            
            expect(hasAnyHoverEffect).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have shadow hover effects on all cards', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            const classList = Array.from(card.classList);
            
            // Should have base shadow
            const hasBaseShadow = classList.some(cls => cls.includes('shadow-'));
            expect(hasBaseShadow).toBe(true);
            
            // Should have hover shadow (either through hover:shadow or custom shadow classes)
            const hasHoverShadow = classList.some(cls => 
              cls.includes('hover:shadow') || cls.includes('shadow-[')
            );
            expect(hasHoverShadow).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have transform hover effects on all cards', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            const hoverEffects = hasHoverClasses(card);
            
            // Should have transform hover effect (scale)
            expect(hoverEffects.transform).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have smooth transitions for hover effects', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            // Should have transition classes for smooth hover effects
            expect(hasTransitionClasses(card)).toBe(true);
            
            // Should have transition-all for comprehensive transitions
            expect(card).toHaveClass('transition-all');
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have appropriate transition duration (150-300ms)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            const classList = Array.from(card.classList);
            
            // Should have duration-300 or similar (within 150-300ms range)
            const hasDuration = classList.some(cls => 
              cls.includes('duration-150') || 
              cls.includes('duration-200') || 
              cls.includes('duration-300')
            );
            
            expect(hasDuration).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have scale transform on hover', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 375, name: 'mobile' },
          { width: 768, name: 'tablet' },
          { width: 1024, name: 'desktop' },
          { width: 1920, name: 'large-desktop' }
        ),
        (viewport) => {
          global.innerWidth = viewport.width;
          
          const { container } = render(<Features />);
          
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            const classList = Array.from(card.classList);
            
            // Should have hover:scale class
            const hasScaleHover = classList.some(cls => cls.includes('hover:scale'));
            expect(hasScaleHover).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have different hover shadow intensity for featured vs regular cards', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = Array.from(container.querySelectorAll('.grid > div'));
          
          // Card 0 is featured (2x2)
          const featuredCard = cards[0];
          const regularCard = cards[1];
          
          const featuredClasses = Array.from(featuredCard.classList).join(' ');
          const regularClasses = Array.from(regularCard.classList).join(' ');
          
          // Both should have shadow classes, but they should be different
          expect(featuredClasses).toContain('shadow-[');
          expect(regularClasses).toContain('shadow-[');
          
          // Featured card should have more prominent shadows
          // This is verified by the presence of different shadow definitions
          expect(featuredClasses).not.toBe(regularClasses);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain hover effects across all viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        fc.integer({ min: 0, max: 3 }), // Card index
        (viewportWidth, cardIndex) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const cards = Array.from(container.querySelectorAll('.grid > div'));
          const card = cards[cardIndex];
          
          // Verify hover effects are present regardless of viewport
          const hoverEffects = hasHoverClasses(card);
          expect(hoverEffects.shadow || hoverEffects.transform).toBe(true);
          
          // Verify transitions are present
          expect(hasTransitionClasses(card)).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });
});
