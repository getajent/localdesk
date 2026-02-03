/**
 * Integration Test: WCAG 2.1 AA compliance
 * Feature: landing-page-redesign, Property 32
 * Validates: Requirements 11.1
 * 
 * Property: For any rendered Landing Page, running automated accessibility checks 
 * (e.g., axe-core) should return zero violations for WCAG 2.1 Level AA criteria
 */

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Hero } from './Hero';
import { Features } from './Features';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatInterface } from './ChatInterface';
import fc from 'fast-check';

expect.extend(toHaveNoViolations);

describe('Property 32: WCAG 2.1 AA compliance', () => {
  test('Hero component has no WCAG AA violations', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const { container } = render(<Hero />);
        const results = await axe(container, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 10 } // Reduced runs for performance
    );
  });

  test('Features component has no WCAG AA violations', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const { container } = render(<Features />);
        const results = await axe(container, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 10 }
    );
  });

  test('Header component has no WCAG AA violations', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const { container } = render(<Header user={null} />);
        const results = await axe(container, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 10 }
    );
  });

  test('Footer component has no WCAG AA violations', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const { container } = render(<Footer />);
        const results = await axe(container, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 10 }
    );
  });

  test('ChatInterface component has no WCAG AA violations', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const { container } = render(<ChatInterface userId={null} />);
        const results = await axe(container, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 10 }
    );
  });

  test('Full landing page has no WCAG AA violations', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const { container } = render(
          <div>
            <Header user={null} />
            <main>
              <Hero />
              <Features />
              <section id="chat-interface">
                <ChatInterface userId={null} />
              </section>
            </main>
            <Footer />
          </div>
        );
        
        const results = await axe(container, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
        
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 5 } // Fewer runs for full page test
    );
  });

  test('Landing page with authenticated user has no WCAG AA violations', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const mockUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
        };

        const { container } = render(
          <div>
            <Header user={mockUser as any} />
            <main>
              <Hero />
              <Features />
            </main>
            <Footer />
          </div>
        );
        
        const results = await axe(container, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        });
        
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 5 }
    );
  });

  test('Interactive elements meet WCAG AA requirements', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const { container } = render(
          <div>
            <Hero />
            <Features />
          </div>
        );
        
        // Run axe with specific rules for interactive elements
        const results = await axe(container, {
          runOnly: {
            type: 'rule',
            values: [
              'button-name',
              'link-name',
              'aria-allowed-attr',
              'aria-required-attr',
              'aria-valid-attr-value',
              'color-contrast',
              'focus-order-semantics',
            ],
          },
        });
        
        expect(results).toHaveNoViolations();
      }),
      { numRuns: 10 }
    );
  });
});
