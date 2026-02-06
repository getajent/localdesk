# Implementation Plan: LocalDesk New Pages

## Overview

This implementation plan covers the creation of three new pages for the LocalDesk Denmark website: Services (/services), Knowledge (/knowledge), and Guidance (/guidance). The implementation follows the established Next.js App Router structure and maintains design consistency with existing pages.

## Tasks

- [x] 1. Update Header component with working navigation links
  - Replace placeholder "#" hrefs with actual routes: /services, /knowledge, /guidance
  - Verify all existing functionality (authentication, theme toggle) remains intact
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ]* 1.1 Write unit tests for Header navigation updates
  - Test that navigation links have correct href values
  - Test that clicking links navigates to correct routes
  - Test that existing auth and theme functionality still works
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 2. Create Services page components and route
  - [x] 2.1 Create ServicesHero component
    - Build hero section with headline and subheading
    - Match existing Hero component design patterns
    - Use Danish red accent and typography hierarchy
    - _Requirements: 1.2, 1.5, 6.1, 6.2_
  
  - [x] 2.2 Create ServicesGrid component
    - Build grid layout for service offerings
    - Display four service categories: Consulting, Document Assistance, Relocation Support, Personalized Guidance
    - Include service descriptions and feature lists
    - Use responsive grid (1 column mobile, 2 columns tablet, 4 columns desktop)
    - _Requirements: 1.3, 1.7, 7.1, 7.2, 7.3_
  
  - [x] 2.3 Create /services page route
    - Create app/services/page.tsx
    - Compose ServicesHero and ServicesGrid components
    - Include Footer component
    - Add proper meta tags and page title
    - _Requirements: 1.1, 1.4, 1.5_

- [ ]* 2.4 Write unit tests for Services page
  - Test that /services route exists and returns 200
  - Test that ServicesHero renders with correct content
  - Test that all four service categories are displayed
  - Test that Footer component is present
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7_

- [ ]* 2.5 Write property test for Services page design consistency
  - **Property 1: Design System Consistency Across Pages**
  - **Validates: Requirements 1.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

- [x] 3. Create Knowledge page components and route
  - [x] 3.1 Create KnowledgeHero component
    - Build hero section introducing knowledge base
    - Match existing Hero component design patterns
    - Use Danish red accent and typography hierarchy
    - _Requirements: 2.2, 2.8, 6.1, 6.2_
  
  - [x] 3.2 Create KnowledgeCategories component
    - Build grid layout for seven knowledge categories
    - Display category cards with icons, titles, descriptions, and topic lists
    - Use Lucide React icons for category icons
    - Implement responsive grid (1 column mobile, 2 columns tablet, 3-4 columns desktop)
    - _Requirements: 2.3, 2.4, 2.5, 7.1, 7.2, 7.3_
  
  - [x] 3.3 Create /knowledge page route
    - Create app/knowledge/page.tsx
    - Compose KnowledgeHero and KnowledgeCategories components
    - Include Footer component
    - Add proper meta tags and page title
    - _Requirements: 2.1, 2.7, 2.8_

- [ ]* 3.4 Write unit tests for Knowledge page
  - Test that /knowledge route exists and returns 200
  - Test that KnowledgeHero renders with correct content
  - Test that all seven categories are displayed
  - Test that each category has description and topics
  - Test that Footer component is present
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

- [ ]* 3.5 Write property test for Knowledge category descriptions
  - **Property 5: Knowledge Category Descriptions**
  - **Validates: Requirements 2.5**

- [x] 4. Create Guidance page components and route
  - [x] 4.1 Create GuidanceHero component
    - Build hero section introducing step-by-step guides
    - Match existing Hero component design patterns
    - Use Danish red accent and typography hierarchy
    - _Requirements: 3.2, 3.7, 6.1, 6.2_
  
  - [x] 4.2 Create GuidanceSteps component
    - Build layout for five guidance scenarios
    - Display guides with sequential step numbers
    - Include step titles, descriptions, and details
    - Add visual indicators for step progression
    - Implement responsive layout
    - _Requirements: 3.3, 3.4, 3.5, 7.1, 7.2, 7.3_
  
  - [x] 4.3 Create /guidance page route
    - Create app/guidance/page.tsx
    - Compose GuidanceHero and GuidanceSteps components
    - Include Footer component
    - Add proper meta tags and page title
    - _Requirements: 3.1, 3.6, 3.7_

- [ ]* 4.4 Write unit tests for Guidance page
  - Test that /guidance route exists and returns 200
  - Test that GuidanceHero renders with correct content
  - Test that all five guides are displayed
  - Test that steps are numbered sequentially
  - Test that Footer component is present
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ]* 4.5 Write property test for Guidance step sequencing
  - **Property 6: Guidance Step Sequencing**
  - **Validates: Requirements 3.5**

- [x] 5. Checkpoint - Ensure all pages render correctly
  - Manually test all three pages in browser
  - Verify navigation works between pages
  - Verify design consistency across pages
  - Ensure all tests pass, ask the user if questions arise

- [x] 6. Implement responsive design refinements
  - [x] 6.1 Test and refine mobile layouts (< 768px)
    - Verify single-column layouts on all pages
    - Ensure touch targets are minimum 44x44px
    - Test text readability at small sizes
    - _Requirements: 7.1, 7.4, 7.5_
  
  - [x] 6.2 Test and refine tablet layouts (768px - 1024px)
    - Verify medium-width layouts adapt correctly
    - Test grid layouts at tablet breakpoints
    - _Requirements: 7.2_
  
  - [x] 6.3 Test and refine desktop layouts (> 1024px)
    - Verify multi-column layouts display correctly
    - Test maximum width constraints
    - _Requirements: 7.3_

- [ ]* 6.4 Write property test for responsive layout adaptation
  - **Property 2: Responsive Layout Adaptation**
  - **Validates: Requirements 1.6, 2.9, 3.8, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**

- [x] 7. Implement accessibility features
  - [x] 7.1 Add semantic HTML structure
    - Use header, main, section, article, footer elements
    - Ensure proper heading hierarchy (h1, h2, h3)
    - _Requirements: 8.1_
  
  - [x] 7.2 Add ARIA labels to interactive elements
    - Add aria-label to buttons without visible text
    - Add aria-labelledby where appropriate
    - _Requirements: 8.2_
  
  - [x] 7.3 Verify color contrast ratios
    - Test text/background contrast meets WCAG AA (4.5:1)
    - Test Danish red accent contrast
    - _Requirements: 8.3_
  
  - [x] 7.4 Implement keyboard navigation support
    - Ensure all interactive elements are focusable
    - Add visible focus indicators
    - Test tab order is logical
    - _Requirements: 8.4, 8.6_
  
  - [x] 7.5 Add alt text to images
    - Add descriptive alt text to all meaningful images
    - Use empty alt="" for decorative images
    - _Requirements: 8.5_

- [ ]* 7.6 Write property tests for accessibility
  - **Property 7: Semantic HTML Usage**
  - **Property 8: ARIA Labels for Interactive Elements**
  - **Property 9: Color Contrast Compliance**
  - **Property 10: Keyboard Navigation Support**
  - **Property 11: Image Alt Text Presence**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

- [x] 8. Final integration and testing
  - [x] 8.1 Run all unit tests and property tests
    - Verify all tests pass
    - Fix any failing tests
    - _Requirements: All_
  
  - [x] 8.2 Test navigation flow between all pages
    - Test home → services → knowledge → guidance
    - Test header navigation from each page
    - Verify back button works correctly
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 8.3 Verify design consistency across all pages
    - Check color palette consistency
    - Check typography consistency
    - Check spacing and layout consistency
    - Check animation consistency
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ]* 8.4 Write property test for Footer component presence
  - **Property 3: Footer Component Presence**
  - **Validates: Requirements 1.4, 2.7, 3.6, 6.7**

- [ ]* 8.5 Write property test for navigation link functionality
  - **Property 4: Navigation Link Functionality**
  - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**

- [x] 9. Final checkpoint - Complete verification
  - Run full test suite (unit + property tests)
  - Manually test all pages at different viewport sizes
  - Test with keyboard navigation
  - Test with screen reader (if available)
  - Verify all requirements are met
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All pages use TypeScript with Next.js App Router and React components
- Design follows existing LocalDesk patterns with Danish red accent (#C8102E)
- Content is organized from existing Denmark living documentation
