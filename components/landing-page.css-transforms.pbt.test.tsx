/**
 * Property-Based Test: CSS Transforms for Animations
 * Feature: landing-page-redesign, Property 16: CSS transforms for animations
 * Validates: Requirements 5.4, 12.1
 * 
 * Property: For any animated element, the transition-property or animation should 
 * include "transform" or "opacity" rather than layout-affecting properties 
 * (width, height, top, left, margin).
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import { Features } from './Features';
import fc from 'fast-check';

// Helper function to check if element uses GPU-accelerated properties
const usesGPUAcceleratedProperties = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  
  // Check for transform-related classes
  const hasTransform = classList.some(cls => 
    cls.includes('translate') || 
    cls.includes('scale') || 
    cls.includes('rotate') ||
    cls.includes('transform')
  );
  
  // Check for opacity-related classes
  const hasOpacity = classList.some(cls => cls.includes('opacity'));
  
  // Check for animation classes that use GPU-accelerated properties
  const hasGPUAnimation = classList.some(cls => 
    cls.includes('animate-fade') ||
    cls.includes('animate-slide') ||
    cls.includes('animate-scale')
  );
  
  return hasTransform || hasOpacity || hasGPUAnimation;
};

// Helper function to check if element avoids layout-affecting properties
const avoidsLayoutProperties = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  
  // Check for layout-affecting transition properties (these should NOT be present)
  const hasLayoutTransition = classList.some(cls => 
    cls.includes('transition-width') ||
    cls.includes('transition-height') ||
    cls.includes('transition-margin') ||
    cls.includes('transition-padding') ||
    cls.includes('transition-top') ||
    cls.includes('transition-left')
  );
  
  return !hasLayoutTransition;
};

describe('Property 16: CSS transforms for animations', () => {
  it('should use GPU-accelerated properties for Hero animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Check Hero section for animation classes
          const heroSection = container.querySelector('section');
          expect(heroSection).toBeTruthy();
          
          if (heroSection) {
            const classList = Array.from(heroSection.classList);
            
            // Should have motion-safe:animate-fade-in
            const hasAnimation = classList.some(cls => 
              cls.includes('animate-fade') || cls.includes('motion-safe:animate')
            );
            
            expect(hasAnimation).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use GPU-accelerated properties for Hero content animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Check Hero content container for animation classes
          const contentContainer = container.querySelector('.flex.flex-col');
          expect(contentContainer).toBeTruthy();
          
          if (contentContainer) {
            const classList = Array.from(contentContainer.classList);
            
            // Should have motion-safe:animate-slide-up
            const hasAnimation = classList.some(cls => 
              cls.includes('animate-slide') || cls.includes('motion-safe:animate')
            );
            
            expect(hasAnimation).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use GPU-accelerated properties for Features section animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          // Check Features section for animation classes
          const featuresSection = container.querySelector('section');
          expect(featuresSection).toBeTruthy();
          
          if (featuresSection) {
            const classList = Array.from(featuresSection.classList);
            
            // Should have motion-safe:animate-fade-in or transition-opacity
            const hasAnimation = classList.some(cls => 
              cls.includes('animate-fade') || 
              cls.includes('transition-opacity') ||
              cls.includes('motion-safe:animate')
            );
            
            expect(hasAnimation).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use transform for card hover effects', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          // Check all feature cards
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            const classList = Array.from(card.classList);
            
            // Should have hover:scale or hover:-translate (transform-based hover effects)
            const hasTransformHover = classList.some(cls => 
              cls.includes('hover:scale') || 
              cls.includes('hover:-translate') ||
              cls.includes('hover:translate')
            );
            
            expect(hasTransformHover).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should avoid layout-affecting properties in transitions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          // Check all feature cards
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            // Should not use layout-affecting transition properties
            expect(avoidsLayoutProperties(card)).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use transition-all or transition-transform for smooth animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          // Check all feature cards
          const cards = container.querySelectorAll('.grid > div');
          
          cards.forEach((card) => {
            const classList = Array.from(card.classList);
            
            // Should have transition-all (which includes transform and opacity)
            const hasTransition = classList.some(cls => 
              cls.includes('transition-all') || 
              cls.includes('transition-transform')
            );
            
            expect(hasTransition).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use opacity for fade animations', () => {
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
          
          const { container } = render(<Hero />);
          
          // Check Hero section for fade animation
          const heroSection = container.querySelector('section');
          
          if (heroSection) {
            const classList = Array.from(heroSection.classList);
            
            // Should have animate-fade-in which uses opacity
            const hasFadeAnimation = classList.some(cls => 
              cls.includes('animate-fade')
            );
            
            expect(hasFadeAnimation).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use transform for slide animations', () => {
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
          
          const { container } = render(<Hero />);
          
          // Check Hero content for slide animation
          const contentContainer = container.querySelector('.flex.flex-col');
          
          if (contentContainer) {
            const classList = Array.from(contentContainer.classList);
            
            // Should have animate-slide-up which uses transform
            const hasSlideAnimation = classList.some(cls => 
              cls.includes('animate-slide')
            );
            
            expect(hasSlideAnimation).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
