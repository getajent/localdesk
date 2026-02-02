# Design Document: Landing Page Redesign

## Overview

This design document outlines the technical approach for redesigning the LocalDesk landing page to achieve a modern, premium aesthetic using Bento grid principles and Tailwind CSS. The redesign transforms the current uniform grid layout into an asymmetric, card-based design that conveys professionalism and trustworthiness while maintaining all existing functionality.

The design emphasizes visual hierarchy through varied card sizes, refined typography, sophisticated color palettes, and subtle animations. The implementation leverages Tailwind CSS utilities and CSS Grid for responsive layouts that adapt seamlessly across mobile, tablet, and desktop breakpoints.

Key design principles:
- **Compartmentalization**: Content organized into distinct visual sections like a bento box
- **Asymmetry with balance**: Varied card sizes arranged in visually balanced compositions
- **Premium aesthetic**: Refined details including shadows, gradients, and micro-interactions
- **Professional tone**: Service-oriented imagery and language rather than technology-focused
- **Performance**: GPU-accelerated animations and optimized asset loading

## Architecture

### Component Structure

The landing page maintains its existing component hierarchy with enhanced styling:

```
PageClient (container)
├── AuthProvider (context)
└── PageContent
    ├── Header (unchanged functionality, refined styling)
    ├── Main
    │   ├── Hero (redesigned with visual enhancements)
    │   ├── Features (transformed to Bento grid)
    │   └── ChatInterfaceSection (refined styling)
    └── Footer (unchanged functionality, refined styling)
```

### Layout System

The design uses CSS Grid as the primary layout mechanism for the Bento grid implementation:

**Desktop Layout (≥1024px)**:
- 12-column grid system for maximum flexibility
- Features section uses explicit grid areas with varied column/row spans
- Asymmetric arrangement with one large featured card and smaller supporting cards

**Tablet Layout (640px-1023px)**:
- 6-column grid system
- Features reflow to 2x2 grid with some size variation
- Maintains visual interest while adapting to narrower viewports

**Mobile Layout (<640px)**:
- Single column or 2-column grid
- Cards stack vertically with consistent widths
- Maintains card hierarchy through height variation

### Styling Architecture

**Tailwind CSS Approach**:
- Utility-first styling with custom configuration extensions
- Custom color palette defined in `tailwind.config.ts`
- Reusable component classes for consistent card styling
- Responsive modifiers for breakpoint-specific styles

**CSS Custom Properties**:
- Define shadow scales for consistent depth
- Store animation timing values
- Enable theme customization if needed in future

## Components and Interfaces

### Hero Component

**Enhanced Structure**:
```typescript
interface HeroProps {
  // No props needed - self-contained component
}

export function Hero(): JSX.Element
```

**Visual Enhancements**:
- **Background**: Subtle gradient from white to light gray/tinted background
- **Decorative Elements**: Abstract geometric shapes or patterns positioned absolutely
- **Typography**: Increased size differentiation (h1: 4xl-6xl, subheadline: xl-2xl)
- **CTA Button**: Enhanced with larger size, prominent shadow, and hover lift effect
- **Layout**: Centered content with max-width constraint and generous padding

**Implementation Details**:
- Background gradient using `bg-gradient-to-b from-white to-slate-50`
- Decorative SVG shapes with low opacity positioned with absolute positioning
- Button hover state increases shadow and translates Y by -2px
- Smooth scroll behavior maintained for "Start Chatting" functionality

### Features Component (Bento Grid)

**Enhanced Structure**:
```typescript
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large'; // New property for grid sizing
  featured?: boolean; // Highlight treatment for featured card
}

interface FeaturesProps {
  // No props needed - uses internal FEATURES array
}

export function Features(): JSX.Element
```

**Bento Grid Layout**:

Desktop (lg breakpoint):
```
┌─────────────┬─────┬─────┐
│             │  2  │  3  │
│      1      ├─────┴─────┤
│  (featured) │     4     │
└─────────────┴───────────┘
```

- Card 1 (Instant Answers): Large featured card, spans 2 rows and 2 columns
- Card 2 (Expert Knowledge): Medium card, 1 row, 1 column
- Card 3 (No Login Required): Medium card, 1 row, 1 column
- Card 4 (Always Available): Wide card, 1 row, 2 columns

**Grid Implementation**:
```css
/* Desktop grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 1.5rem;
}

.card-1 { grid-column: 1 / 3; grid-row: 1 / 3; }
.card-2 { grid-column: 3 / 4; grid-row: 1 / 2; }
.card-3 { grid-column: 4 / 5; grid-row: 1 / 2; }
.card-4 { grid-column: 3 / 5; grid-row: 2 / 3; }
```

**Card Styling**:
- **Base**: White background, rounded corners (lg), subtle shadow
- **Hover**: Increased shadow, slight scale transform (1.02), border highlight
- **Featured Card**: Gradient background, larger icon, emphasized typography
- **Padding**: Generous internal spacing (p-6 to p-8)
- **Icons**: Larger size in featured card, consistent color treatment

**Responsive Behavior**:
- **Tablet**: 2x2 grid with card 1 spanning 2 columns
- **Mobile**: Single column stack, all cards full width

### Header Component

**Refined Styling** (functionality unchanged):
- Increased shadow for elevated appearance
- Refined spacing and typography
- Enhanced avatar ring color on hover
- Smoother transitions on all interactive elements

### Footer Component

**Refined Styling** (functionality unchanged):
- Subtle background tint instead of pure white
- Enhanced link hover states with underline animation
- Improved spacing and typography hierarchy

### ChatInterfaceSection Component

**Refined Styling** (functionality unchanged):
- Enhanced section heading typography
- Refined container styling with subtle background
- Improved spacing around chat interface

## Data Models

No new data models are required. The existing component props and state management remain unchanged:

**Existing Models**:
```typescript
// From @supabase/supabase-js
interface User {
  id: string;
  email?: string;
  // ... other Supabase user properties
}

// From Features component
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}
```

**Extended Feature Model** (internal to Features component):
```typescript
interface EnhancedFeature extends Feature {
  size: 'small' | 'medium' | 'large';
  featured?: boolean;
  gridArea?: string; // CSS grid-area value for explicit positioning
}
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Visual Structure Properties

Property 1: Hero section contains required elements
*For any* rendered Hero component, it should contain a headline element, a subheadline element, and a call-to-action button
**Validates: Requirements 1.1**

Property 2: Hero scroll functionality
*For any* click event on the "Start Chatting" button, the system should trigger smooth scroll behavior to the element with id "chat-interface"
**Validates: Requirements 1.3, 9.2**

Property 3: Typography hierarchy in Hero
*For any* rendered Hero component, the computed font size of the headline should be greater than the computed font size of the subheadline
**Validates: Requirements 1.4**

Property 4: Bento grid card size variation
*For any* rendered Features component, the cards should have at least three distinct width or height values, with at least one card being significantly larger (1.5x or more) than the smallest card
**Validates: Requirements 2.1, 2.2, 2.5**

Property 5: Features content preservation
*For any* rendered Features component, it should contain all four feature titles: "Instant Answers", "Expert Knowledge", "No Login Required", and "Always Available"
**Validates: Requirements 2.3**

Property 6: Card hover interactions
*For any* feature card element, simulating a hover event should result in a change to at least one of: box-shadow, transform, or border properties
**Validates: Requirements 2.4**

### Color and Visual Styling Properties

Property 7: Color palette diversity
*For any* rendered Landing Page, extracting computed background colors and text colors from major sections should yield at least 5 distinct color values
**Validates: Requirements 3.1, 4.2**

Property 8: Shadow application to cards
*For any* card element in the Features section, the computed box-shadow property should contain at least one shadow definition (non-zero values)
**Validates: Requirements 3.2, 10.1, 10.2**

Property 9: Transition duration constraints
*For any* interactive element (buttons, cards, links), the computed transition-duration should be between 150ms and 300ms inclusive
**Validates: Requirements 3.4**

Property 10: Typography scale diversity
*For any* rendered Landing Page, measuring computed font sizes across h1, h2, h3, body text, and small text should yield at least 3 distinct values
**Validates: Requirements 3.5**

Property 11: Danish Red brand color presence
*For any* rendered Landing Page, the color #C8102E (Danish Red) should appear in the computed styles of at least one primary action element (button or link)
**Validates: Requirements 4.1**

Property 12: Non-flat backgrounds
*For any* major section background (Hero, Features, Chat Interface), the computed background should either contain a gradient (linear-gradient or radial-gradient) or a non-white color value
**Validates: Requirements 4.3**

Property 13: WCAG AA contrast compliance
*For any* text element on the Landing Page, the contrast ratio between the text color and its background color should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text ≥18pt)
**Validates: Requirements 4.4**

### Animation and Interaction Properties

Property 14: Interactive element hover feedback
*For any* interactive element (button, card, link), simulating a hover event should result in a measurable change to computed styles (shadow, transform, color, or border)
**Validates: Requirements 5.1**

Property 15: Hero entrance animation
*For any* initial render of the Hero component, animation-related CSS properties (animation-name, opacity, or transform) should be applied within the first render cycle
**Validates: Requirements 5.3**

Property 16: CSS transforms for animations
*For any* animated element, the transition-property or animation should include "transform" or "opacity" rather than layout-affecting properties (width, height, top, left, margin)
**Validates: Requirements 5.4, 12.1**

Property 17: Reduced motion support
*For any* animated element, when the prefers-reduced-motion media query is set to "reduce", animations should be disabled (animation-duration: 0s) or significantly reduced
**Validates: Requirements 5.5, 11.2**

### Typography Properties

Property 18: Heading hierarchy differentiation
*For any* rendered Landing Page, the computed font sizes should follow the hierarchy: h1 > h2 > h3, and headings should have font-weight ≥ 600 while body text has font-weight ≤ 400
**Validates: Requirements 6.1, 6.2**

Property 19: Heading letter-spacing and line-height
*For any* heading element (h1, h2, h3), the computed letter-spacing and line-height properties should be explicitly set (not default/normal)
**Validates: Requirements 6.3**

Property 20: Body text line length constraint
*For any* body text container, the maximum width should constrain line length to approximately 65-75 characters (typically max-width between 60ch and 75ch or equivalent pixel values)
**Validates: Requirements 6.4**

Property 21: Typography consistency across sections
*For any* two elements of the same semantic type (e.g., all h2 elements, all body paragraphs) across different sections, their computed font-size, font-weight, and line-height should be identical
**Validates: Requirements 6.5, 3.3**

### Responsive Design Properties

Property 22: Responsive breakpoint adaptation
*For any* viewport width in the ranges <640px, 640-1024px, and >1024px, the Features grid should have different computed grid-template-columns values, demonstrating layout adaptation
**Validates: Requirements 7.1**

Property 23: Mobile Bento grid reflow
*For any* viewport width <640px, the Features grid should have grid-template-columns with 1 or 2 columns (1fr or repeat(2, 1fr))
**Validates: Requirements 7.2**

Property 24: Responsive typography scaling
*For any* viewport width change across breakpoints, heading font sizes should change proportionally while maintaining the hierarchy relationship (h1 > h2 > h3)
**Validates: Requirements 7.3**

Property 25: Touch target minimum size
*For any* interactive element (button, link) at mobile viewport widths (<640px), the computed width and height should both be at least 44px
**Validates: Requirements 7.4**

### Functionality Preservation Properties

Property 26: Authentication functionality preservation
*For any* user authentication state (logged in or logged out), the Header component should render appropriate UI elements (avatar and logout button for logged in, login button for logged out) and clicking these elements should trigger the expected authentication actions
**Validates: Requirements 9.1**

Property 27: Chat interface functionality preservation
*For any* interaction with the Chat Interface section, all existing capabilities (message input, message sending, message display, suggested questions) should function identically to the pre-redesign implementation
**Validates: Requirements 9.3**

Property 28: Footer content preservation
*For any* rendered Footer component, it should contain links with text "Privacy Policy", "Terms of Service", and "Contact", plus copyright text containing the current year
**Validates: Requirements 9.4**

Property 29: Accessibility attribute preservation
*For any* interactive element that had an aria-label or aria-describedby attribute in the original implementation, the redesigned version should maintain that attribute with the same or equivalent value
**Validates: Requirements 9.5**

### Depth and Layering Properties

Property 30: Layered shadow definitions
*For any* card element, the box-shadow property should contain multiple comma-separated shadow definitions (at least 2) to create layered depth
**Validates: Requirements 10.1**

Property 31: Hover shadow intensity increase
*For any* elevated element (card or button), the box-shadow blur radius or spread radius in the hover state should be greater than in the default state
**Validates: Requirements 10.4**

### Accessibility Properties

Property 32: WCAG 2.1 AA compliance
*For any* rendered Landing Page, running automated accessibility checks (e.g., axe-core) should return zero violations for WCAG 2.1 Level AA criteria
**Validates: Requirements 11.1**

Property 33: Keyboard navigation support
*For any* interactive element, simulating Tab key navigation should move focus to that element, and the element should have a visible focus indicator (outline or ring with non-zero width)
**Validates: Requirements 11.3**

Property 34: Semantic heading hierarchy
*For any* rendered Landing Page, heading elements should appear in sequential order (h1, then h2, then h3) without skipping levels
**Validates: Requirements 11.4**

Property 35: Image alt text presence
*For any* img element on the Landing Page, it should have an alt attribute (empty string for decorative images, descriptive text for informative images)
**Validates: Requirements 11.5**

### Performance Properties

Property 36: Lazy loading for below-fold images
*For any* image element that is positioned below the initial viewport (below the fold), it should have the loading="lazy" attribute or be loaded via intersection observer
**Validates: Requirements 12.3**

Property 37: Lighthouse performance threshold
*For any* production build of the Landing Page, running Lighthouse performance audit should yield a score of at least 90
**Validates: Requirements 12.4**

Property 38: Asset size constraints
*For any* background image or decorative asset, the file size should not exceed 200KB to minimize load time impact
**Validates: Requirements 12.5**

## Error Handling

### Responsive Layout Fallbacks

**Issue**: Grid layout may not be supported in very old browsers
**Handling**: 
- Use `@supports (display: grid)` to detect grid support
- Provide flexbox fallback for browsers without grid support
- Ensure content remains accessible even if layout degrades

**Issue**: Custom properties (CSS variables) may not be supported
**Handling**:
- Provide fallback values before custom property declarations
- Example: `color: #C8102E; color: var(--danish-red);`

### Animation Fallbacks

**Issue**: User has prefers-reduced-motion enabled
**Handling**:
- Wrap all animations in `@media (prefers-reduced-motion: no-preference)`
- Provide instant state changes instead of animated transitions
- Maintain functionality without relying on animation completion

**Issue**: GPU acceleration not available
**Handling**:
- Animations will still work via CPU rendering
- May be less smooth but remain functional
- No special handling needed as CSS gracefully degrades

### Image Loading Errors

**Issue**: Decorative images fail to load
**Handling**:
- Use background images for decorative elements (fail silently)
- Ensure layout doesn't break with missing decorative images
- Provide solid color fallbacks for gradient backgrounds

### Accessibility Fallbacks

**Issue**: Screen reader encounters decorative elements
**Handling**:
- Use `aria-hidden="true"` on purely decorative elements
- Ensure all interactive elements have accessible names
- Provide text alternatives for icon-only buttons

### Performance Degradation

**Issue**: Slow network connection
**Handling**:
- Lazy load below-fold content
- Use appropriate image formats (WebP with JPEG fallback)
- Minimize critical rendering path with inline critical CSS
- Show loading states for async content

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Verify specific component renders (Hero contains expected elements)
- Test user interactions (button clicks, hover states)
- Validate accessibility attributes on specific elements
- Check responsive behavior at exact breakpoint values
- Test error states and fallback behaviors

**Property-Based Tests**: Verify universal properties across all inputs
- Generate random viewport sizes and verify responsive behavior holds
- Test color contrast across all text/background combinations
- Verify animation properties across all interactive elements
- Validate typography hierarchy across all heading combinations
- Test accessibility compliance across generated component states

### Property-Based Testing Configuration

**Library**: fast-check (for TypeScript/JavaScript property-based testing)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `// Feature: landing-page-redesign, Property N: [property description]`

**Example Property Test Structure**:
```typescript
import fc from 'fast-check';

// Feature: landing-page-redesign, Property 22: Responsive breakpoint adaptation
test('Features grid adapts layout at different viewport widths', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 320, max: 1920 }), // Generate random viewport widths
      (viewportWidth) => {
        // Render component at viewport width
        const { container } = render(<Features />, { 
          wrapper: ({ children }) => (
            <div style={{ width: viewportWidth }}>{children}</div>
          )
        });
        
        const grid = container.querySelector('.features-grid');
        const gridColumns = window.getComputedStyle(grid).gridTemplateColumns;
        
        // Verify different layouts at different breakpoints
        if (viewportWidth < 640) {
          expect(gridColumns).toMatch(/1fr|repeat\(2, 1fr\)/);
        } else if (viewportWidth < 1024) {
          expect(gridColumns).toMatch(/repeat\([3-4], 1fr\)/);
        } else {
          expect(gridColumns).toMatch(/repeat\(4, 1fr\)/);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

### Testing Scope

**In Scope**:
- Visual structure and layout correctness
- Responsive behavior across breakpoints
- Accessibility compliance (WCAG AA)
- Animation and interaction behavior
- Typography and color usage
- Performance characteristics (Lighthouse scores)
- Functionality preservation from original implementation

**Out of Scope**:
- Subjective aesthetic qualities ("looks premium", "feels professional")
- User preference testing (A/B testing for design variations)
- Cross-browser visual regression (handled by separate visual testing tools)
- Backend functionality (authentication, chat API)

### Test Organization

```
components/
├── Hero.test.tsx                    # Unit tests for Hero component
├── Hero.responsive.pbt.test.tsx     # Property tests for responsive behavior
├── Features.test.tsx                # Unit tests for Features component
├── Features.bento-grid.pbt.test.tsx # Property tests for Bento grid layout
├── Features.accessibility.pbt.test.tsx # Property tests for accessibility
├── Header.test.tsx                  # Unit tests for Header (existing)
├── Footer.test.tsx                  # Unit tests for Footer (existing)
└── landing-page.integration.test.tsx # Integration tests for full page
```

### Key Test Scenarios

**Unit Test Examples**:
1. Hero renders with headline, subheadline, and CTA button
2. Clicking "Start Chatting" scrolls to chat interface
3. Features section renders all four feature cards
4. Hover on feature card increases shadow
5. Footer contains all required links
6. Header authentication UI updates based on user state

**Property Test Examples**:
1. Typography hierarchy maintained across all viewport sizes
2. Color contrast meets WCAG AA for all text/background combinations
3. All interactive elements have hover feedback
4. Animations respect prefers-reduced-motion across all elements
5. Touch targets meet 44x44px minimum at mobile sizes
6. Grid layout adapts correctly across all viewport widths

### Performance Testing

**Lighthouse Audits**:
- Run on production build
- Target: Performance score ≥ 90
- Verify: Accessibility score = 100
- Check: Best Practices score ≥ 90

**Asset Optimization**:
- Verify image sizes < 200KB
- Check lazy loading implementation
- Validate CSS bundle size
- Measure Time to Interactive (TTI)

### Visual Regression Testing

While not part of automated unit/property tests, visual regression testing should be performed:
- Capture screenshots at key breakpoints (320px, 768px, 1024px, 1920px)
- Compare against approved baseline images
- Flag any unintended visual changes
- Tools: Percy, Chromatic, or similar

