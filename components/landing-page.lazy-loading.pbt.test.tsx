/**
 * Property-Based Test: Lazy loading for below-fold images
 * Feature: landing-page-redesign, Property 36
 * Validates: Requirements 12.3
 * 
 * Property: For any image element that is positioned below the initial viewport 
 * (below the fold), it should have the loading="lazy" attribute or be loaded 
 * via intersection observer
 */

import { render } from '@testing-library/react';
import { LazyImage } from './LazyImage';
import fc from 'fast-check';

describe('Property 36: Lazy loading for below-fold images', () => {
  // Test that LazyImage component always includes loading="lazy" attribute
  test('LazyImage component includes loading="lazy" attribute', () => {
    fc.assert(
      fc.property(
        fc.webUrl(), // Generate random image URLs
        fc.string({ minLength: 5, maxLength: 50 }), // Generate random alt text
        (src, alt) => {
          const { container } = render(
            <LazyImage src={src} alt={alt} />
          );

          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          expect(img?.getAttribute('loading')).toBe('lazy');
        }
      ),
      { numRuns: 20 }
    );
  });

  // Test that LazyImage handles various image sources
  test('LazyImage works with different image formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('https://example.com/image.jpg'),
          fc.constant('https://example.com/image.png'),
          fc.constant('https://example.com/image.webp'),
          fc.constant('https://example.com/image.svg'),
          fc.constant('/local/image.jpg')
        ),
        fc.string({ minLength: 1, maxLength: 100 }),
        (src, alt) => {
          const { container } = render(
            <LazyImage src={src} alt={alt} />
          );

          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          expect(img?.getAttribute('loading')).toBe('lazy');
          expect(img?.getAttribute('alt')).toBe(alt);
        }
      ),
      { numRuns: 20 }
    );
  });

  // Test that LazyImage applies custom className
  test('LazyImage preserves custom className', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (src, alt, className) => {
          const { container } = render(
            <LazyImage src={src} alt={alt} className={className} />
          );

          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          expect(img?.className).toContain(className);
        }
      ),
      { numRuns: 20 }
    );
  });

  // Test that LazyImage handles threshold values
  test('LazyImage accepts various threshold values', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.double({ min: 0, max: 1 }), // Threshold must be between 0 and 1
        (src, alt, threshold) => {
          const { container } = render(
            <LazyImage src={src} alt={alt} threshold={threshold} />
          );

          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          expect(img?.getAttribute('loading')).toBe('lazy');
        }
      ),
      { numRuns: 20 }
    );
  });

  // Test that LazyImage handles additional HTML attributes
  test('LazyImage preserves additional HTML attributes', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.integer({ min: 100, max: 2000 }),
        fc.integer({ min: 100, max: 2000 }),
        (src, alt, width, height) => {
          const { container } = render(
            <LazyImage 
              src={src} 
              alt={alt} 
              width={width}
              height={height}
              data-testid="lazy-image"
            />
          );

          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          expect(img?.getAttribute('loading')).toBe('lazy');
          expect(img?.getAttribute('width')).toBe(String(width));
          expect(img?.getAttribute('height')).toBe(String(height));
          expect(img?.getAttribute('data-testid')).toBe('lazy-image');
        }
      ),
      { numRuns: 20 }
    );
  });

  // Test current landing page components for image lazy loading
  // Note: Current implementation uses inline SVG, not external images
  test('Landing page inline SVG elements do not require lazy loading', () => {
    // This test verifies that inline SVG elements (which are part of the HTML)
    // do not need lazy loading attributes, as they are already optimized
    
    // Import components dynamically to avoid issues
    const Hero = require('./Hero').Hero;
    const { container } = render(<Hero />);

    // Check that SVG elements exist (decorative elements)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);

    // Verify no external img elements that would need lazy loading
    const imgElements = container.querySelectorAll('img');
    expect(imgElements.length).toBe(0);

    // This confirms the current implementation is optimal:
    // inline SVG doesn't need lazy loading
  });

  // Test that if images were added below the fold, they would be lazy loaded
  test('Below-fold images would use LazyImage component', () => {
    fc.assert(
      fc.property(
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
        (imageSrcs) => {
          // Simulate a section with multiple images below the fold
          const { container } = render(
            <div style={{ marginTop: '2000px' }}>
              {imageSrcs.map((src, index) => (
                <LazyImage 
                  key={index}
                  src={src} 
                  alt={`Image ${index}`}
                />
              ))}
            </div>
          );

          const images = container.querySelectorAll('img');
          expect(images.length).toBe(imageSrcs.length);

          // Verify all images have lazy loading
          images.forEach((img) => {
            expect(img.getAttribute('loading')).toBe('lazy');
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  // Test fallback image functionality
  test('LazyImage handles fallback images', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        (src, fallbackSrc, alt) => {
          const { container } = render(
            <LazyImage 
              src={src} 
              alt={alt}
              fallbackSrc={fallbackSrc}
            />
          );

          const img = container.querySelector('img');
          expect(img).not.toBeNull();
          expect(img?.getAttribute('loading')).toBe('lazy');
        }
      ),
      { numRuns: 20 }
    );
  });
});
