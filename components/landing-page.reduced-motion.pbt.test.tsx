/**
 * Property-Based Test: Reduced Motion Support
 * Feature: landing-page-redesign, Property 17: Reduced motion support
 * Validates: Requirements 5.5, 11.2
 * 
 * Property: For any animated element, when the prefers-reduced-motion media query 
 * is set to "reduce", animations should be disabled (animation-duration: 0s) or 
 * significantly reduced.
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import { Features } from './Features';
import fc from 'fast-check';

// Helper function to check if element uses motion-safe prefix
const usesMotionSafePrefix = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  
  // Check for motion-safe: prefixed animation classes
  const hasMotionSafe = classList.some(cls => 
    cls.includes('motion-safe:animate')
  );
  
  return hasMotionSafe;
};

// Helper function to check if element has animation classes
const hasAnimationClasses = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  
  return classList.some(cls => 
    cls.includes('animate-') || 
    cls.includes('transition')
  );
};

describe('Property 17: Reduced motion support', () => {
  it('should use motion-safe prefix for Hero section animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Check Hero section
          const heroSection = container.querySelector('section');
          expect(heroSection).toBeTruthy();
          
          if (heroSection) {
            // Should use motion-safe prefix for animations
            expect(usesMotionSafePrefix(heroSection)).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use motion-safe prefix for Hero content animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Check Hero content container
          const contentContainer = container.querySelector('.flex.flex-col');
          expect(contentContainer).toBeTruthy();
          
          if (contentContainer) {
            // Should use motion-safe prefix for animations
            expect(usesMotionSafePrefix(contentContainer)).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use motion-safe prefix for Features section animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          // Check Features section
          const featuresSection = container.querySelector('section');
          expect(featuresSection).toBeTruthy();
          
          if (featuresSection) {
            const classList = Array.from(featuresSection.classList);
            
            // Should have motion-safe:animate-fade-in in the conditional class
            // or transition-opacity for the fade effect
            const hasMotionSafeOrTransition = classList.some(cls => 
              cls.includes('motion-safe:animate') || 
              cls.includes('transition-opacity')
            );
            
            expect(hasMotionSafeOrTransition).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should apply animations conditionally based on motion preference', () => {
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
          
          // Check that animations are present but wrapped in motion-safe
          const heroSection = container.querySelector('section');
          
          if (heroSection) {
            const classList = Array.from(heroSection.classList);
            
            // Should have motion-safe:animate-fade-in
            const hasConditionalAnimation = classList.some(cls => 
              cls.includes('motion-safe:')
            );
            
            expect(hasConditionalAnimation).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should have animations that respect reduced motion preference', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Get all elements with animations
          const animatedElements = Array.from(container.querySelectorAll('*')).filter(
            el => hasAnimationClasses(el)
          );
          
          // All animated elements should either:
          // 1. Use motion-safe prefix, OR
          // 2. Be non-animated elements (like transitions on hover)
          animatedElements.forEach((element) => {
            const classList = Array.from(element.classList);
            const hasAnimateClass = classList.some(cls => cls.includes('animate-'));
            
            if (hasAnimateClass) {
              // If it has animate- class, it should use motion-safe prefix
              expect(usesMotionSafePrefix(element)).toBe(true);
            }
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain functionality without animations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Verify core content is present regardless of animation state
          expect(container.querySelector('h1')).toBeTruthy();
          expect(container.querySelector('p')).toBeTruthy();
          expect(container.querySelector('button')).toBeTruthy();
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use motion-safe for all entrance animations', () => {
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
          
          const { container: heroContainer } = render(<Hero />);
          const { container: featuresContainer } = render(<Features />);
          
          // Check Hero animations
          const heroSection = heroContainer.querySelector('section');
          if (heroSection) {
            expect(usesMotionSafePrefix(heroSection)).toBe(true);
          }
          
          // Check Features animations - should have transition-opacity or motion-safe
          const featuresSection = featuresContainer.querySelector('section');
          if (featuresSection) {
            const classList = Array.from(featuresSection.classList);
            const hasMotionSafeOrTransition = classList.some(cls => 
              cls.includes('motion-safe:animate') || 
              cls.includes('transition-opacity')
            );
            expect(hasMotionSafeOrTransition).toBe(true);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should not have unconditional animations on page load', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Get all elements with animate- classes
          const animatedElements = Array.from(container.querySelectorAll('*')).filter(el => {
            const classList = Array.from(el.classList);
            return classList.some(cls => cls.includes('animate-'));
          });
          
          // All should use motion-safe prefix
          animatedElements.forEach((element) => {
            expect(usesMotionSafePrefix(element)).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
