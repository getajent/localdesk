/**
 * Property-Based Test: Color Palette Diversity
 * Feature: landing-page-redesign, Property 7: Color palette diversity
 * Validates: Requirements 3.1, 4.2
 * 
 * Property: For any rendered Landing Page, extracting computed background colors 
 * and text colors from major sections should yield at least 5 distinct color values.
 */

import { render } from '@testing-library/react';
import { PageClient } from './PageClient';
import fc from 'fast-check';

// Mock ChatInterface to avoid AI SDK dependencies
jest.mock('./ChatInterface', () => ({
  ChatInterface: ({ userId }: { userId?: string | null }) => (
    <div data-testid="chat-interface">
      <input placeholder="Ask about SKAT, visas, or housing..." />
      <button>Send</button>
    </div>
  ),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
  },
  saveMessage: jest.fn(),
  getChatHistory: jest.fn().mockResolvedValue([]),
  getMessages: jest.fn().mockResolvedValue([]),
}));

// Helper function to extract Tailwind color classes from elements
const extractTailwindColorClasses = (container: HTMLElement): Set<string> => {
  const colors = new Set<string>();
  
  // Define major sections to check
  const selectors = [
    'header', // Header
    'section:nth-of-type(1)', // Hero section
    'section:nth-of-type(2)', // Features section
    'section#chat-interface', // Chat interface section
    'footer', // Footer
    'h1', // Main headline
    'h2', // Section headings
    'h3', // Card titles
    'p', // Body text
    'button', // Buttons
    'a', // Links
    'div', // Divs (for cards and containers)
  ];
  
  // Regex patterns to match Tailwind color classes
  const colorPatterns = [
    /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm)-\d+/g,
    /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm)-\d+/g,
    /from-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm|white)-\d+/g,
    /via-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm)-\d+/g,
    /to-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm)-\d+/g,
    /bg-danish-red/g,
    /text-danish-red/g,
    /ring-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red)-\d+/g,
    /from-white/g,
    /to-neutral-\d+/g,
  ];
  
  selectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        const className = element.className;
        
        // Extract all color classes from the element
        colorPatterns.forEach(pattern => {
          const matches = className.match(pattern);
          if (matches) {
            matches.forEach(match => colors.add(match));
          }
        });
        
        // Check for gradient classes
        if (className.includes('bg-gradient-to-')) {
          colors.add('gradient-present');
        }
      }
    });
  });
  
  return colors;
};

describe('Property 7: Color palette diversity', () => {
  it('should have at least 5 distinct color values across major sections', () => {
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
          
          const { container } = render(<PageClient initialUser={null} />);
          
          const colors = extractTailwindColorClasses(container);
          
          // Should have at least 5 distinct Tailwind color classes
          expect(colors.size).toBeGreaterThanOrEqual(5);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use varied colors across different sections', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Extract color classes from specific sections
          const header = container.querySelector('header');
          const hero = container.querySelector('section:nth-of-type(1)');
          const features = container.querySelector('section:nth-of-type(2)');
          const footer = container.querySelector('footer');
          
          const sectionColors = new Set<string>();
          
          const colorPatterns = [
            /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm)-\d+/g,
            /from-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm|white)-\d+/g,
            /to-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm)-\d+/g,
            /bg-white/g,
            /bg-gradient-to-/g,
          ];
          
          [header, hero, features, footer].forEach(section => {
            if (section instanceof HTMLElement) {
              const className = section.className;
              colorPatterns.forEach(pattern => {
                const matches = className.match(pattern);
                if (matches) {
                  matches.forEach(match => sectionColors.add(match));
                }
              });
            }
          });
          
          // Should have multiple distinct section background colors
          expect(sectionColors.size).toBeGreaterThanOrEqual(2);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should include gradients in the color palette', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Check for gradient usage in major sections
          const sections = container.querySelectorAll('section, footer');
          let hasGradient = false;
          
          sections.forEach(section => {
            if (section instanceof HTMLElement) {
              const className = section.className;
              if (className.includes('bg-gradient-to-')) {
                hasGradient = true;
              }
            }
          });
          
          // At least one section should use a gradient
          expect(hasGradient).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use complementary colors beyond just Danish Red', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 375, name: 'mobile' },
          { width: 1024, name: 'desktop' }
        ),
        (viewport) => {
          global.innerWidth = viewport.width;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          const colors = extractTailwindColorClasses(container);
          
          // Should have more than just Danish Red and basic neutrals
          // At least 5 distinct colors indicates a refined palette
          expect(colors.size).toBeGreaterThanOrEqual(5);
          
          // Convert to array for inspection
          const colorArray = Array.from(colors);
          
          // Should have variety (not all the same color)
          const uniqueColors = new Set(colorArray);
          expect(uniqueColors.size).toBeGreaterThanOrEqual(5);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain color diversity across viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          const colors = extractTailwindColorClasses(container);
          
          // Color diversity should be maintained regardless of viewport
          expect(colors.size).toBeGreaterThanOrEqual(5);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should use distinct text colors for hierarchy', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          const textColors = new Set<string>();
          
          // Check headings and body text for text color classes
          const textElements = container.querySelectorAll('h1, h2, h3, p, a');
          const textColorPattern = /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|danish-red|cool|warm|white)-\d+/g;
          
          textElements.forEach(element => {
            if (element instanceof HTMLElement) {
              const className = element.className;
              const matches = className.match(textColorPattern);
              if (matches) {
                matches.forEach(match => textColors.add(match));
              }
            }
          });
          
          // Should have at least 2 distinct text colors for hierarchy
          expect(textColors.size).toBeGreaterThanOrEqual(2);
        }
      ),
      { numRuns: 20 }
    );
  });
});
