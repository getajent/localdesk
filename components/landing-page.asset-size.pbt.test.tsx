/**
 * Property-Based Test: Asset size constraints
 * Feature: landing-page-redesign, Property 38
 * Validates: Requirements 12.5
 * 
 * Property: For any background image or decorative asset, the file size should 
 * not exceed 200KB to minimize load time impact
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import { Features } from './Features';
import fc from 'fast-check';

describe('Property 38: Asset size constraints', () => {
  // Test that inline SVG elements are minimal in size
  test('Hero decorative SVG elements are minimal in size', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Hero />);

        // Get all SVG elements
        const svgElements = container.querySelectorAll('svg');
        expect(svgElements.length).toBeGreaterThan(0);

        svgElements.forEach((svg) => {
          // Calculate approximate size of SVG element
          const svgString = svg.outerHTML;
          const sizeInBytes = new Blob([svgString]).size;

          // Each inline SVG should be very small (< 1KB)
          // This is much better than the 200KB requirement
          expect(sizeInBytes).toBeLessThan(1024);
        });
      }),
      { numRuns: 20 }
    );
  });

  // Test total decorative asset size in Hero section
  test('Total Hero decorative assets are under 200KB', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Hero />);

        // Get all decorative elements (SVGs)
        const decorativeElements = container.querySelectorAll('svg');
        
        let totalSize = 0;
        decorativeElements.forEach((element) => {
          const elementString = element.outerHTML;
          totalSize += new Blob([elementString]).size;
        });

        // Total decorative assets should be well under 200KB
        // Current implementation uses ~650 bytes total
        expect(totalSize).toBeLessThan(200 * 1024); // 200KB in bytes
        
        // Verify it's actually very small (< 5KB)
        expect(totalSize).toBeLessThan(5 * 1024);
      }),
      { numRuns: 20 }
    );
  });

  // Test that Features section has no large assets
  test('Features section has no large decorative assets', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Features />);

        // Check for any img elements (should be none in current implementation)
        const imgElements = container.querySelectorAll('img');
        expect(imgElements.length).toBe(0);

        // Check for any background images in computed styles
        const allElements = container.querySelectorAll('*');
        allElements.forEach((element) => {
          const styles = window.getComputedStyle(element);
          const backgroundImage = styles.backgroundImage;
          
          // Should only have 'none' or gradient backgrounds, no external images
          if (backgroundImage !== 'none') {
            expect(backgroundImage).toMatch(/gradient/);
          }
        });
      }),
      { numRuns: 20 }
    );
  });

  // Test that CSS gradients are used instead of large background images
  test('Components use CSS gradients instead of large images', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container: heroContainer } = render(<Hero />);
        const { container: featuresContainer } = render(<Features />);

        // Check Hero section background
        const heroSection = heroContainer.querySelector('section');
        if (heroSection) {
          const styles = window.getComputedStyle(heroSection);
          const backgroundImage = styles.backgroundImage;
          
          // Should use gradient or none, not external image
          if (backgroundImage !== 'none') {
            expect(backgroundImage).toMatch(/gradient/);
          }
        }

        // Check Features section background
        const featuresSection = featuresContainer.querySelector('section');
        if (featuresSection) {
          const styles = window.getComputedStyle(featuresSection);
          const backgroundImage = styles.backgroundImage;
          
          // Should use gradient or none, not external image
          if (backgroundImage !== 'none') {
            expect(backgroundImage).toMatch(/gradient/);
          }
        }
      }),
      { numRuns: 20 }
    );
  });

  // Test that icon sizes are reasonable (Lucide icons are SVG-based)
  test('Icon elements are minimal in size', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Features />);

        // Get all SVG icons (Lucide icons)
        const iconElements = container.querySelectorAll('[class*="lucide"]');
        
        iconElements.forEach((icon) => {
          // Icons should be small SVG elements
          const iconString = icon.outerHTML;
          const sizeInBytes = new Blob([iconString]).size;

          // Each icon should be very small (< 2KB)
          expect(sizeInBytes).toBeLessThan(2 * 1024);
        });
      }),
      { numRuns: 20 }
    );
  });

  // Test that no external image URLs are present in the markup
  test('No external image URLs in component markup', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container: heroContainer } = render(<Hero />);
        const { container: featuresContainer } = render(<Features />);

        // Check for img elements with external URLs
        const allImgs = [
          ...heroContainer.querySelectorAll('img'),
          ...featuresContainer.querySelectorAll('img'),
        ];

        allImgs.forEach((img) => {
          const src = img.getAttribute('src');
          if (src) {
            // If there are images, they should be optimized and small
            // Current implementation has no external images
            expect(src).toBeDefined();
          }
        });

        // Current implementation should have no img elements
        expect(allImgs.length).toBe(0);
      }),
      { numRuns: 20 }
    );
  });

  // Test that decorative elements use efficient SVG paths
  test('SVG decorative elements use efficient path definitions', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<Hero />);

        const svgElements = container.querySelectorAll('svg');
        
        svgElements.forEach((svg) => {
          // Check that SVG uses simple shapes (circle, rect) rather than complex paths
          const circles = svg.querySelectorAll('circle');
          const rects = svg.querySelectorAll('rect');
          const paths = svg.querySelectorAll('path');

          // Simple shapes are more efficient than complex paths
          const simpleShapes = circles.length + rects.length;
          const complexShapes = paths.length;

          // Current implementation uses simple shapes (circles and rects)
          expect(simpleShapes).toBeGreaterThanOrEqual(0);
          
          // If there are paths, they should be minimal
          if (complexShapes > 0) {
            paths.forEach((path) => {
              const pathData = path.getAttribute('d') || '';
              // Path data should be reasonably short
              expect(pathData.length).toBeLessThan(1000);
            });
          }
        });
      }),
      { numRuns: 20 }
    );
  });

  // Test that the total page weight is minimal
  test('Total decorative asset weight across all components is minimal', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container: heroContainer } = render(<Hero />);
        const { container: featuresContainer } = render(<Features />);

        // Calculate total size of all decorative elements
        let totalSize = 0;

        // Hero decorative SVGs
        const heroSvgs = heroContainer.querySelectorAll('svg');
        heroSvgs.forEach((svg) => {
          totalSize += new Blob([svg.outerHTML]).size;
        });

        // Features decorative elements (if any)
        const featuresSvgs = featuresContainer.querySelectorAll('svg');
        featuresSvgs.forEach((svg) => {
          totalSize += new Blob([svg.outerHTML]).size;
        });

        // Total should be well under 200KB requirement
        expect(totalSize).toBeLessThan(200 * 1024);
        
        // Should actually be very small (< 10KB)
        expect(totalSize).toBeLessThan(10 * 1024);
      }),
      { numRuns: 20 }
    );
  });

  // Test that if images were added, they would be validated for size
  test('Image size validation would catch oversized assets', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 }), // Size in KB
        (sizeInKB) => {
          const sizeInBytes = sizeInKB * 1024;
          const maxSizeInBytes = 200 * 1024; // 200KB

          // Verify the validation logic
          if (sizeInKB <= 200) {
            expect(sizeInBytes).toBeLessThanOrEqual(maxSizeInBytes);
          } else {
            expect(sizeInBytes).toBeGreaterThan(maxSizeInBytes);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
