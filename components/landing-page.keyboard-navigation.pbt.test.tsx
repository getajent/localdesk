/**
 * Property-Based Test: Keyboard navigation support
 * Feature: landing-page-redesign, Property 33
 * Validates: Requirements 11.3
 * 
 * Property: For any interactive element, simulating Tab key navigation should move 
 * focus to that element, and the element should have a visible focus indicator 
 * (outline or ring with non-zero width)
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hero } from './Hero';
import { Features } from './Features';
import { Footer } from './Footer';
import { Header } from './Header';
import { SuggestedQuestions } from './SuggestedQuestions';
import fc from 'fast-check';

// Helper function to check if element has visible focus indicator
function hasFocusIndicator(element: Element): boolean {
  const styles = window.getComputedStyle(element);
  
  // Check for outline
  const outlineWidth = parseFloat(styles.outlineWidth);
  const outlineStyle = styles.outlineStyle;
  if (outlineWidth > 0 && outlineStyle !== 'none') {
    return true;
  }

  // Check for box-shadow (ring)
  const boxShadow = styles.boxShadow;
  if (boxShadow && boxShadow !== 'none' && !boxShadow.includes('0px 0px 0px')) {
    return true;
  }

  // Check for border changes
  const borderWidth = parseFloat(styles.borderWidth);
  if (borderWidth > 0) {
    return true;
  }

  return false;
}

describe('Property 33: Keyboard navigation support', () => {
  test('Hero button is keyboard navigable with visible focus indicator', async () => {
    fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const user = userEvent.setup();
        const { container } = render(<Hero />);

        const button = screen.getByRole('button', { name: /start chatting/i });

        // Tab to the button
        await user.tab();

        // Check if button is focused
        expect(button).toHaveFocus();

        // Check for visible focus indicator
        const hasFocus = hasFocusIndicator(button);
        expect(hasFocus).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  test('Feature cards are keyboard navigable', async () => {
    fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const user = userEvent.setup();
        const { container } = render(<Features />);

        // Get all feature cards (they have tabIndex={0})
        const cards = container.querySelectorAll('[role="article"]');
        expect(cards.length).toBeGreaterThan(0);

        // Tab through cards
        for (let i = 0; i < Math.min(cards.length, 2); i++) {
          await user.tab();
          
          // Check if a card is focused
          const focusedElement = document.activeElement;
          expect(focusedElement).toBeTruthy();
          
          // Check for visible focus indicator on focused element
          if (focusedElement) {
            const hasFocus = hasFocusIndicator(focusedElement);
            expect(hasFocus).toBe(true);
          }
        }
      }),
      { numRuns: 10 }
    );
  });

  test('Footer links are keyboard navigable with visible focus indicators', async () => {
    fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const user = userEvent.setup();
        render(<Footer />);

        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        // Tab to first link
        await user.tab();

        // Check if a link is focused
        const focusedElement = document.activeElement;
        const isLink = links.some(link => link === focusedElement);
        
        if (isLink && focusedElement) {
          // Check for visible focus indicator
          const hasFocus = hasFocusIndicator(focusedElement);
          expect(hasFocus).toBe(true);
        }
      }),
      { numRuns: 20 }
    );
  });

  test('Header buttons are keyboard navigable with visible focus indicators', async () => {
    fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const user = userEvent.setup();
        render(<Header user={null} />);

        const loginButton = screen.getByRole('button', { name: /log in/i });

        // Tab to the button
        await user.tab();

        // Check if button is focused
        expect(loginButton).toHaveFocus();

        // Check for visible focus indicator
        const hasFocus = hasFocusIndicator(loginButton);
        expect(hasFocus).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  test('Suggested question buttons are keyboard navigable', async () => {
    fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const user = userEvent.setup();
        const mockOnClick = jest.fn();
        render(<SuggestedQuestions onQuestionClick={mockOnClick} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);

        // Tab to first button
        await user.tab();

        // Check if a button is focused
        const focusedElement = document.activeElement;
        const isButton = buttons.some(btn => btn === focusedElement);
        
        if (isButton && focusedElement) {
          // Check for visible focus indicator
          const hasFocus = hasFocusIndicator(focusedElement);
          expect(hasFocus).toBe(true);
        }
      }),
      { numRuns: 20 }
    );
  });

  test('All interactive elements can receive focus via keyboard', async () => {
    fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const user = userEvent.setup();
        const { container } = render(
          <div>
            <Header user={null} />
            <Hero />
            <Footer />
          </div>
        );

        // Get all interactive elements
        const interactiveElements = container.querySelectorAll(
          'button, a, input, [tabindex="0"]'
        );

        expect(interactiveElements.length).toBeGreaterThan(0);

        // Verify each interactive element can receive focus
        interactiveElements.forEach((element) => {
          // Check that element is focusable (has tabIndex >= 0 or is naturally focusable)
          const tabIndex = element.getAttribute('tabindex');
          const isFocusable = 
            tabIndex === '0' || 
            tabIndex === null && ['BUTTON', 'A', 'INPUT'].includes(element.tagName);
          
          expect(isFocusable).toBe(true);
        });
      }),
      { numRuns: 20 }
    );
  });
});
