/**
 * Property-Based Test: Semantic heading hierarchy
 * Feature: landing-page-redesign, Property 34
 * Validates: Requirements 11.4
 * 
 * Property: For any rendered Landing Page, heading elements should appear in 
 * sequential order (h1, then h2, then h3) without skipping levels
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Header } from './Header';
import { Footer } from './Footer';
import fc from 'fast-check';

// Helper function to extract heading levels from container
function getHeadingLevels(container: HTMLElement): number[] {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  return Array.from(headings)
    .map(heading => parseInt(heading.tagName.substring(1)));
}

// Helper function to check if heading sequence is valid
function isValidHeadingSequence(levels: number[]): boolean {
  if (levels.length === 0) return true;

  // First heading should be h1
  if (levels[0] !== 1) return false;

  // Track the maximum level seen so far
  let maxLevelSeen = 1;

  // Check that no level is skipped when going deeper
  for (let i = 1; i < levels.length; i++) {
    const currentLevel = levels[i];
    const previousLevel = levels[i - 1];

    // If going deeper (higher number), should not skip levels
    if (currentLevel > previousLevel) {
      if (currentLevel > maxLevelSeen + 1) {
        return false;
      }
      maxLevelSeen = Math.max(maxLevelSeen, currentLevel);
    }
    // If going back up (lower number) or staying same, that's fine
    // Just update maxLevelSeen if needed
    maxLevelSeen = Math.max(maxLevelSeen, currentLevel);
  }

  return true;
}

describe('Property 34: Semantic heading hierarchy', () => {
  test('Full landing page has valid heading hierarchy', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(
          <div>
            <Header user={null} />
            <main>
              <Hero />
              <Features />
            </main>
            <Footer />
          </div>
        );

        const headingLevels = getHeadingLevels(container);
        
        // Should have at least one heading
        expect(headingLevels.length).toBeGreaterThan(0);

        // Check valid sequence
        const isValid = isValidHeadingSequence(headingLevels);
        expect(isValid).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  test('Hero section starts with h1', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Hero />);

        const h1 = container.querySelector('h1');
        expect(h1).toBeTruthy();
        expect(h1?.textContent).toContain('Navigate Danish Bureaucracy');
      }),
      { numRuns: 20 }
    );
  });

  test('Features section uses h3 for feature titles (after h2)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Features />);

        // Should have h2 (even if sr-only)
        const h2 = container.querySelector('h2');
        expect(h2).toBeTruthy();

        // Should have h3 elements for feature titles
        const h3Elements = container.querySelectorAll('h3');
        expect(h3Elements.length).toBeGreaterThan(0);
      }),
      { numRuns: 20 }
    );
  });

  test('Individual components have appropriate heading levels', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Hero should have h1
        const { container: heroContainer } = render(<Hero />);
        const heroHeadings = getHeadingLevels(heroContainer);
        expect(heroHeadings).toContain(1);

        // Features should have h2 and h3
        const { container: featuresContainer } = render(<Features />);
        const featuresHeadings = getHeadingLevels(featuresContainer);
        expect(featuresHeadings).toContain(2);
        expect(featuresHeadings).toContain(3);
        
        // Features should not skip from h2 to h4 or higher
        const hasSkippedLevel = featuresHeadings.some((level, i) => {
          if (i === 0) return false;
          return level > featuresHeadings[i - 1] + 1;
        });
        expect(hasSkippedLevel).toBe(false);
      }),
      { numRuns: 20 }
    );
  });

  test('Header does not contain h1 (page should have only one h1)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Header user={null} />);

        const h1 = container.querySelector('h1');
        expect(h1).toBeNull();
      }),
      { numRuns: 20 }
    );
  });

  test('Heading hierarchy is maintained across different user states', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant({ id: 'test-user', email: 'test@example.com' })
        ),
        (user: any) => {
          const { container } = render(
            <div>
              <Header user={user} />
              <main>
                <Hero />
                <Features />
              </main>
              <Footer />
            </div>
          );

          const headingLevels = getHeadingLevels(container);
          const isValid = isValidHeadingSequence(headingLevels);
          expect(isValid).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('All headings have semantic meaning (not empty)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(
          <div>
            <Hero />
            <Features />
            <Footer />
          </div>
        );

        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach((heading) => {
          // Heading should have text content or aria-label
          const hasContent = 
            heading.textContent?.trim().length > 0 ||
            heading.getAttribute('aria-label')?.length > 0;
          
          expect(hasContent).toBe(true);
        });
      }),
      { numRuns: 20 }
    );
  });
});
