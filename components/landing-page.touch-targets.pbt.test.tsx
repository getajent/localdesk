/**
 * Property-Based Test: Touch target minimum size
 * Feature: landing-page-redesign
 * Property 25: Touch target minimum size
 * Validates: Requirements 7.4
 * 
 * Tests that all interactive elements meet the 44x44px minimum touch target size at mobile widths
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import { Header } from './Header';
import { SuggestedQuestions } from './SuggestedQuestions';
import fc from 'fast-check';

describe('Property 25: Touch target minimum size', () => {
  it('should have minimum 44x44px touch targets for Hero button at mobile widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 639 }), // Mobile viewport widths
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          // Find the CTA button
          const button = container.querySelector('button');
          expect(button).toBeTruthy();
          
          // Check button classes for min-h-[44px]
          const buttonClasses = button?.className || '';
          expect(buttonClasses).toContain('min-h-[44px]');
          
          // Verify button has adequate padding for touch
          expect(buttonClasses).toMatch(/p[xy]-\d+/);
        }
      ),
      { numRuns: 20 }
    );
  });
  
  it('should have minimum 44x44px touch targets for Header buttons at mobile widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 639 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          // Test with logged out user (login button)
          const { container: loggedOutContainer } = render(<Header user={null} />);
          const loginButton = loggedOutContainer.querySelector('button');
          expect(loginButton).toBeTruthy();
          
          const loginButtonClasses = loginButton?.className || '';
          expect(loginButtonClasses).toContain('min-h-[44px]');
          expect(loginButtonClasses).toContain('min-w-[44px]');
          
          // Test with logged in user (logout button)
          const mockUser = {
            id: 'test-user',
            email: 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          };
          
          const { container: loggedInContainer } = render(<Header user={mockUser} />);
          const logoutButton = loggedInContainer.querySelector('button[aria-label="Log out"]');
          expect(logoutButton).toBeTruthy();
          
          const logoutButtonClasses = logoutButton?.className || '';
          expect(logoutButtonClasses).toContain('min-h-[44px]');
          expect(logoutButtonClasses).toContain('min-w-[44px]');
        }
      ),
      { numRuns: 20 }
    );
  });
  
  it('should have minimum 44x44px touch targets for suggested question buttons', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 639 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const mockOnClick = jest.fn();
          const { container } = render(<SuggestedQuestions onQuestionClick={mockOnClick} />);
          
          // Find all suggestion buttons
          const buttons = container.querySelectorAll('button');
          expect(buttons.length).toBeGreaterThan(0);
          
          // Verify each button has minimum touch target
          buttons.forEach((button) => {
            const buttonClasses = button.className;
            expect(buttonClasses).toContain('min-h-[44px]');
          });
        }
      ),
      { numRuns: 20 }
    );
  });
  
  it('should verify all interactive elements have adequate touch targets at specific mobile widths', () => {
    const mobileWidths = [320, 375, 414, 480, 600];
    
    mobileWidths.forEach((width) => {
      global.innerWidth = width;
      
      // Test Hero button
      const { container: heroContainer } = render(<Hero />);
      const heroButton = heroContainer.querySelector('button');
      expect(heroButton?.className).toContain('min-h-[44px]');
      
      // Test Header login button
      const { container: headerContainer } = render(<Header user={null} />);
      const loginButton = headerContainer.querySelector('button');
      expect(loginButton?.className).toContain('min-h-[44px]');
      expect(loginButton?.className).toContain('min-w-[44px]');
      
      // Test Suggested Questions buttons
      const mockOnClick = jest.fn();
      const { container: suggestionsContainer } = render(
        <SuggestedQuestions onQuestionClick={mockOnClick} />
      );
      const suggestionButtons = suggestionsContainer.querySelectorAll('button');
      suggestionButtons.forEach((button) => {
        expect(button.className).toContain('min-h-[44px]');
      });
    });
  });
});
