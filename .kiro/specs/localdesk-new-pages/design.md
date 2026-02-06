# Design Document: LocalDesk New Pages

## Overview

This design document outlines the implementation of three new pages for the LocalDesk Denmark website: Services (/services), Knowledge (/knowledge), and Guidance (/guidance). These pages will provide valuable resources to expats navigating life in Denmark while maintaining the site's established design aesthetic featuring Danish red accents, modern typography, and a clean, editorial layout.

The implementation leverages existing documentation from the docs/denmark-living folder and follows the established component patterns (Hero, Features, Footer) used throughout the site. Each page serves a distinct purpose: Services showcases LocalDesk's offerings, Knowledge provides a categorized resource center, and Guidance offers step-by-step practical advice.

## Architecture

### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: React Server Components and Client Components
- **Authentication**: Supabase (already integrated)

### Page Structure

```
app/
├── services/
│   └── page.tsx          # Services page (Server Component)
├── knowledge/
│   └── page.tsx          # Knowledge page (Server Component)
├── guidance/
│   └── page.tsx          # Guidance page (Server Component)
└── layout.tsx            # Root layout (unchanged)

components/
├── Header.tsx            # Updated with working navigation links
├── services/
│   ├── ServicesHero.tsx
│   └── ServicesGrid.tsx
├── knowledge/
│   ├── KnowledgeHero.tsx
│   └── KnowledgeCategories.tsx
└── guidance/
    ├── GuidanceHero.tsx
    └── GuidanceSteps.tsx
```

### Routing
- `/services` → Services page showcasing LocalDesk offerings
- `/knowledge` → Knowledge base with categorized Denmark living information
- `/guidance` → Step-by-step guides for common expat scenarios

## Components and Interfaces

### 1. Services Page Components

#### ServicesHero Component
```typescript
interface ServicesHeroProps {
  // No props needed - static content
}

// Displays:
// - Hero headline introducing LocalDesk services
// - Subheading explaining value proposition
// - Visual elements matching existing Hero design
```

#### ServicesGrid Component
```typescript
interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  features: string[];
}

interface ServicesGridProps {
  services: Service[];
}

// Displays service offerings in a grid layout
// Categories: Consulting, Document Assistance, Relocation Support, Personalized Guidance
```

### 2. Knowledge Page Components

#### KnowledgeHero Component
```typescript
interface KnowledgeHeroProps {
  // No props needed - static content
}

// Displays:
// - Hero headline introducing knowledge base
// - Subheading explaining resource availability
// - Search or filter hint (visual only, no functionality required)
```

#### KnowledgeCategories Component
```typescript
interface KnowledgeCategory {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  topics: string[];
  documentCount: number;
}

interface KnowledgeCategoriesProps {
  categories: KnowledgeCategory[];
}

// Categories from Denmark_Living_Docs:
// - Arrival Process (CPR, MitID, Health Insurance, etc.)
// - Employment (Contracts, Unions, Workplace Rights)
// - Housing (Rental Contracts, Deposits, Tenant Rights)
// - Tax & Finance (Income Tax, Deductions, Annual Returns)
// - Social Benefits (Child Benefits, Unemployment, Pensions)
// - Essential Services (Healthcare, Banking, Transportation)
// - Practical Living (Culture, Shopping, Recreation)
```

### 3. Guidance Page Components

#### GuidanceHero Component
```typescript
interface GuidanceHeroProps {
  // No props needed - static content
}

// Displays:
// - Hero headline introducing step-by-step guides
// - Subheading explaining practical guidance
```

#### GuidanceSteps Component
```typescript
interface Guide {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "First Week", "Month 1-2"
  steps: GuideStep[];
}

interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  details: string[];
  relatedDocs?: string[]; // Links to knowledge base
}

interface GuidanceStepsProps {
  guides: Guide[];
}

// Guides:
// - Your First Week in Denmark
// - Setting Up Essential Services
// - Finding and Securing Housing
// - Understanding Your Taxes
// - Navigating Healthcare
```

### 4. Updated Header Component

```typescript
// Update existing Header.tsx navigation links
const navigationItems = [
  { label: 'Services', href: '/services' },
  { label: 'Knowledge', href: '/knowledge' },
  { label: 'Guidance', href: '/guidance' },
];

// Replace existing "#" placeholders with actual routes
```

## Data Models

### Services Data Structure

```typescript
const SERVICES_DATA: Service[] = [
  {
    id: 'consulting',
    category: 'Expert Guidance',
    title: 'Personal Consulting',
    description: 'One-on-one guidance tailored to your specific situation in Denmark',
    features: [
      'CPR and MitID registration assistance',
      'Tax card and SKAT guidance',
      'Healthcare system navigation',
      'Housing search strategies',
      'Employment contract review'
    ]
  },
  {
    id: 'documents',
    category: 'Documentation',
    title: 'Document Assistance',
    description: 'Help with understanding and completing Danish administrative forms',
    features: [
      'Residence permit applications',
      'Bank account setup guidance',
      'Rental contract review',
      'Tax return assistance',
      'Official correspondence translation'
    ]
  },
  {
    id: 'relocation',
    category: 'Relocation',
    title: 'Relocation Support',
    description: 'Comprehensive support for your move to Denmark',
    features: [
      'Pre-arrival planning',
      'Housing search assistance',
      'Utility setup coordination',
      'School enrollment guidance',
      'Cultural orientation'
    ]
  },
  {
    id: 'ongoing',
    category: 'Ongoing Support',
    title: 'Personalized Guidance',
    description: '24/7 AI-powered assistance for your questions about Denmark',
    features: [
      'Instant answers to Denmark-related questions',
      'Up-to-date information on regulations',
      'Personalized recommendations',
      'Multi-language support',
      'Always available'
    ]
  }
];
```

### Knowledge Categories Data Structure

```typescript
const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'arrival',
    title: 'Arrival Process',
    description: 'Essential registrations and procedures when you first arrive',
    icon: 'Plane',
    topics: [
      'CPR Number Registration',
      'MitID Setup',
      'Health Insurance Card',
      'GP Registration',
      'Bank Account Opening',
      'Tax Card Application',
      'Digital Post Registration',
      'ICS Centers'
    ],
    documentCount: 10
  },
  {
    id: 'employment',
    title: 'Employment',
    description: 'Working in Denmark: contracts, rights, and workplace culture',
    icon: 'Briefcase',
    topics: [
      'Employment Contracts',
      'Salary and Payslips',
      'Working Hours',
      'Unions and A-kasse',
      'Workplace Rights',
      'Parental Leave'
    ],
    documentCount: 7
  },
  {
    id: 'housing',
    title: 'Housing',
    description: 'Finding, renting, and maintaining your home in Denmark',
    icon: 'Home',
    topics: [
      'Housing Types',
      'Rental Contracts',
      'Deposits and Utilities',
      'Tenant Insurance',
      'Tenant Rights',
      'Moving Procedures'
    ],
    documentCount: 7
  },
  {
    id: 'tax-finance',
    title: 'Tax & Finance',
    description: 'Understanding Danish taxation and managing your finances',
    icon: 'Calculator',
    topics: [
      'Tax System Overview',
      'Income Tax',
      'Tax Deductions',
      'Annual Tax Return',
      'SKAT Registration',
      'Self-Employment Tax'
    ],
    documentCount: 8
  },
  {
    id: 'social-benefits',
    title: 'Social Benefits',
    description: 'Healthcare, pensions, and social support systems',
    icon: 'Heart',
    topics: [
      'Child Benefits',
      'Unemployment Benefits',
      'Parental Leave',
      'Housing Support (Boligstøtte)',
      'Pension System',
      'Student Support (SU)',
      'Disability Benefits',
      'Elderly Care'
    ],
    documentCount: 10
  },
  {
    id: 'essential-services',
    title: 'Essential Services',
    description: 'Healthcare, banking, education, and transportation',
    icon: 'Zap',
    topics: [
      'Healthcare System',
      'Banking Services',
      'Digital Government',
      'Education and Childcare',
      'Transportation'
    ],
    documentCount: 5
  },
  {
    id: 'practical-living',
    title: 'Practical Living',
    description: 'Daily life, culture, and community in Denmark',
    icon: 'Coffee',
    topics: [
      'Cultural Norms',
      'Cycling Culture',
      'Shopping Guide',
      'Dining Culture',
      'Mobile and Internet',
      'Public Holidays',
      'Sports and Recreation',
      'Community Resources',
      'Waste and Recycling'
    ],
    documentCount: 11
  }
];
```

### Guidance Data Structure

```typescript
const GUIDANCE_DATA: Guide[] = [
  {
    id: 'first-week',
    title: 'Your First Week in Denmark',
    description: 'Essential steps to take immediately upon arrival',
    duration: 'Week 1',
    steps: [
      {
        stepNumber: 1,
        title: 'Secure Temporary Accommodation',
        description: 'Find a place to stay while you search for permanent housing',
        details: [
          'Book hotel or Airbnb for first few days',
          'Consider hostels or short-term rentals',
          'Join Facebook housing groups',
          'Contact your employer about temporary housing'
        ],
        relatedDocs: ['housing/overview']
      },
      {
        stepNumber: 2,
        title: 'Get a Danish SIM Card',
        description: 'Essential for communication and many services',
        details: [
          'Visit Lebara, Lycamobile, or major carriers',
          'Bring passport for registration',
          'Choose prepaid or contract plan',
          'Costs: 50-300 DKK/month depending on plan'
        ],
        relatedDocs: ['practical-living/mobile-internet']
      },
      {
        stepNumber: 3,
        title: 'Visit International Citizen Service (ICS)',
        description: 'Get guidance on registration procedures',
        details: [
          'Book appointment online',
          'Bring passport and residence permit',
          'Ask about CPR registration requirements',
          'Get information on next steps'
        ],
        relatedDocs: ['arrival-process/ics-centers']
      },
      {
        stepNumber: 4,
        title: 'Start Housing Search',
        description: 'Begin looking for permanent accommodation',
        details: [
          'Register on Boligportal.dk',
          'Join housing waiting lists',
          'Check Facebook groups',
          'Contact real estate agents',
          'Budget: 8,000-15,000 DKK/month for 1-bedroom'
        ],
        relatedDocs: ['housing/overview', 'before-moving/housing-search']
      }
    ]
  },
  {
    id: 'essential-services',
    title: 'Setting Up Essential Services',
    description: 'Complete your administrative registrations',
    duration: 'Month 1-2',
    steps: [
      {
        stepNumber: 1,
        title: 'Register for CPR Number',
        description: 'Your key to accessing all Danish services',
        details: [
          'Requires permanent address',
          'Book appointment at ICS or Borgerservice',
          'Bring passport, residence permit, rental contract',
          'Receive CPR number same day',
          'Health card arrives in 2-3 weeks'
        ],
        relatedDocs: ['arrival-process/cpr-number']
      },
      {
        stepNumber: 2,
        title: 'Set Up MitID',
        description: 'Digital identity for online services',
        details: [
          'Requires CPR number',
          'Download MitID app',
          'Register at Borgerservice or online',
          'Essential for banking and government services'
        ],
        relatedDocs: ['arrival-process/mitid']
      },
      {
        stepNumber: 3,
        title: 'Open Bank Account',
        description: 'Necessary for salary and bill payments',
        details: [
          'Requires CPR number and MitID',
          'Bring passport and proof of address',
          'Compare banks: Danske Bank, Nordea, Jyske Bank',
          'Set up NemKonto for government payments'
        ],
        relatedDocs: ['arrival-process/bank-account', 'essential-services/banking-services']
      },
      {
        stepNumber: 4,
        title: 'Apply for Tax Card',
        description: 'Required before starting work',
        details: [
          'Apply online via SKAT.dk',
          'Requires CPR number and MitID',
          'Choose hovedkort (main card) for primary job',
          'Employer needs your tax card information'
        ],
        relatedDocs: ['tax-finance/tax-card', 'tax-finance/skat-registration']
      },
      {
        stepNumber: 5,
        title: 'Register for Digital Post',
        description: 'Receive official communications',
        details: [
          'Mandatory for most residents',
          'Access via e-Boks or borger.dk',
          'Requires MitID',
          'Check regularly for important notices'
        ],
        relatedDocs: ['arrival-process/digital-post']
      }
    ]
  },
  {
    id: 'housing-guide',
    title: 'Finding and Securing Housing',
    description: 'Navigate the Danish rental market successfully',
    duration: 'Ongoing',
    steps: [
      {
        stepNumber: 1,
        title: 'Understand Housing Types',
        description: 'Learn about different housing options',
        details: [
          'Private rental: Most flexible, higher cost',
          'Social housing: Lower cost, long waiting lists',
          'Andelsbolig: Cooperative housing, buy shares',
          'Student housing: For enrolled students only'
        ],
        relatedDocs: ['housing/housing-types']
      },
      {
        stepNumber: 2,
        title: 'Search on Multiple Platforms',
        description: 'Cast a wide net for opportunities',
        details: [
          'Boligportal.dk: Main rental platform',
          'DBA.dk: Classified ads',
          'Facebook groups: Local housing communities',
          'University housing offices: For students',
          'Real estate agents: For higher-end rentals'
        ],
        relatedDocs: ['before-moving/housing-search']
      },
      {
        stepNumber: 3,
        title: 'Prepare Financial Documentation',
        description: 'Have documents ready for applications',
        details: [
          'Employment contract or job offer',
          'Bank statements (last 3 months)',
          'Reference letters from previous landlords',
          'CPR number and ID',
          'Budget for deposit: 3-6 months rent upfront'
        ],
        relatedDocs: ['housing/deposits-utilities']
      },
      {
        stepNumber: 4,
        title: 'Review Rental Contract Carefully',
        description: 'Understand your rights and obligations',
        details: [
          'Check rent amount and payment terms',
          'Verify deposit and prepaid rent',
          'Understand notice period (typically 3 months)',
          'Note what utilities are included',
          'Document condition at move-in'
        ],
        relatedDocs: ['housing/rental-contracts']
      },
      {
        stepNumber: 5,
        title: 'Set Up Utilities and Insurance',
        description: 'Complete your housing setup',
        details: [
          'Choose electricity provider',
          'Set up internet service',
          'Get tenant insurance (indboforsikring)',
          'Register address with authorities',
          'Update CPR address if needed'
        ],
        relatedDocs: ['housing/deposits-utilities', 'housing/tenant-insurance']
      }
    ]
  },
  {
    id: 'tax-guide',
    title: 'Understanding Your Taxes',
    description: 'Navigate the Danish tax system with confidence',
    duration: 'Ongoing',
    steps: [
      {
        stepNumber: 1,
        title: 'Understand Tax Structure',
        description: 'Learn how Danish taxes work',
        details: [
          'AM-bidrag: 8% labor market contribution',
          'Municipal tax: ~25% (varies by municipality)',
          'Bottom tax: ~12%',
          'Top tax: 15% on income above ~569,000 DKK',
          'Total effective rate: 35-52% depending on income'
        ],
        relatedDocs: ['tax-finance/tax-system-overview', 'tax-finance/income-tax']
      },
      {
        stepNumber: 2,
        title: 'Get Your Tax Card',
        description: 'Set up tax withholding',
        details: [
          'Apply via SKAT.dk with MitID',
          'Hovedkort for main job',
          'Bikort for additional income',
          'Employer uses this to withhold correct tax',
          'Update if circumstances change'
        ],
        relatedDocs: ['tax-finance/tax-card']
      },
      {
        stepNumber: 3,
        title: 'Know Your Deductions',
        description: 'Maximize your tax benefits',
        details: [
          'Transport: Commuting costs over 1,250 DKK/year',
          'Pension contributions: To approved schemes',
          'Union fees: A-kasse and union membership',
          'Interest: Mortgage interest (limited)',
          'Charitable donations: To approved organizations'
        ],
        relatedDocs: ['tax-finance/tax-deductions']
      },
      {
        stepNumber: 4,
        title: 'Review Annual Tax Return',
        description: 'Check your årsopgørelse',
        details: [
          'Available in May each year',
          'SKAT prepares automatically',
          'Review for accuracy',
          'Correct errors by deadline (June-July)',
          'Receive refund or pay additional tax'
        ],
        relatedDocs: ['tax-finance/annual-tax-return']
      }
    ]
  },
  {
    id: 'healthcare-guide',
    title: 'Navigating Healthcare',
    description: 'Access medical services in Denmark',
    duration: 'Ongoing',
    steps: [
      {
        stepNumber: 1,
        title: 'Get Health Insurance Card',
        description: 'Receive your sundhedskort',
        details: [
          'Automatic after CPR registration',
          'Yellow card arrives by mail in 2-3 weeks',
          'Shows your CPR number and assigned GP',
          'Bring to all medical appointments',
          'Free healthcare for residents'
        ],
        relatedDocs: ['arrival-process/health-insurance']
      },
      {
        stepNumber: 2,
        title: 'Register with GP',
        description: 'Choose your family doctor',
        details: [
          'GP assigned automatically with CPR',
          'Can change GP if desired',
          'GP is first point of contact for health issues',
          'Free consultations',
          'GP provides referrals to specialists'
        ],
        relatedDocs: ['arrival-process/gp-registration']
      },
      {
        stepNumber: 3,
        title: 'Understand Healthcare System',
        description: 'Learn how to access services',
        details: [
          'GP for non-emergency issues',
          'Emergency: Call 112',
          'After-hours: Call 1813 (Copenhagen) or regional number',
          'Pharmacy: Prescription required for most medications',
          'Dental: Not covered, private insurance recommended'
        ],
        relatedDocs: ['essential-services/healthcare-system']
      },
      {
        stepNumber: 4,
        title: 'Access Digital Health Services',
        description: 'Use online health platforms',
        details: [
          'Sundhed.dk: Book appointments, view records',
          'Requires MitID',
          'E-Boks: Receive health correspondence',
          'Min Læge app: Contact your GP',
          'Prescription renewal online'
        ],
        relatedDocs: ['essential-services/digital-government']
      }
    ]
  }
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Before writing the correctness properties, I need to analyze the acceptance criteria from the requirements document to determine which are testable.



### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated:

**Redundancy Analysis:**

1. **Design System Consistency (1.5, 2.8, 3.7, 6.1-6.7)**: Multiple criteria test design consistency. These can be consolidated into comprehensive properties about color palette, typography, spacing, and component patterns that apply to all pages.

2. **Responsive Design (1.6, 2.9, 3.8, 7.1-7.6)**: Multiple criteria test responsive behavior. These can be consolidated into properties about viewport adaptation, touch targets, and content scaling that apply to all pages.

3. **Footer Presence (1.4, 2.7, 3.6)**: Three separate criteria test that Footer is present. This can be a single property that applies to all new pages.

4. **Accessibility (8.1-8.6)**: While each accessibility criterion is distinct, they can be grouped into comprehensive properties about semantic HTML, ARIA labels, contrast, keyboard navigation, and alt text.

5. **Navigation Links (4.1-4.5)**: Multiple criteria test navigation behavior. These can be consolidated into properties about link functionality and href values.

**Consolidated Properties:**

After reflection, I'll create properties that:
- Test design consistency across all pages (one comprehensive property instead of three separate ones)
- Test responsive behavior across all pages (one comprehensive property instead of three separate ones)
- Test accessibility features across all pages (consolidated into fewer, more comprehensive properties)
- Test navigation functionality (consolidated into fewer properties)
- Keep example tests for specific content presence (these are not redundant as they test different content)

### Correctness Properties

Property 1: Design System Consistency Across Pages
*For any* new page (Services, Knowledge, Guidance), the page should use the Danish red accent color (#C8102E), the same typography hierarchy (font-serif for headlines, font-sans for body), the same spacing patterns (Tailwind spacing utilities), and the same component styling patterns (uppercase tracking, border styles, hover effects) as existing pages.
**Validates: Requirements 1.5, 2.8, 3.7, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

Property 2: Responsive Layout Adaptation
*For any* new page (Services, Knowledge, Guidance), when viewed at mobile viewport (< 768px), the page should display single-column layouts; when viewed at tablet viewport (768px - 1024px), the page should adapt to medium-width layouts; when viewed at desktop viewport (> 1024px), the page should display multi-column layouts; and all interactive elements should have minimum 44x44px touch targets.
**Validates: Requirements 1.6, 2.9, 3.8, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**

Property 3: Footer Component Presence
*For any* new page (Services, Knowledge, Guidance), the Footer component should be rendered and visible on the page.
**Validates: Requirements 1.4, 2.7, 3.6, 6.7**

Property 4: Navigation Link Functionality
*For any* navigation link in the Header component (Services, Knowledge, Guidance), clicking the link should navigate to the correct route (/services, /knowledge, /guidance respectively), and the href attribute should not be "#".
**Validates: Requirements 4.2, 4.3, 4.4, 4.5**

Property 5: Knowledge Category Descriptions
*For any* knowledge category displayed on the Knowledge page, the category should have an associated description and topic list.
**Validates: Requirements 2.5**

Property 6: Guidance Step Sequencing
*For any* guide displayed on the Guidance page, the steps should be numbered sequentially starting from 1, with no gaps in the sequence.
**Validates: Requirements 3.5**

Property 7: Semantic HTML Usage
*For any* new page (Services, Knowledge, Guidance), the page should use semantic HTML5 elements (header, nav, main, section, article, footer) for content structure rather than generic div elements for major page sections.
**Validates: Requirements 8.1**

Property 8: ARIA Labels for Interactive Elements
*For any* interactive element (buttons, links, form controls) on the new pages, the element should have an accessible name via aria-label, aria-labelledby, or visible text content.
**Validates: Requirements 8.2**

Property 9: Color Contrast Compliance
*For any* text content on the new pages, the color contrast ratio between text and background should meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 8.3**

Property 10: Keyboard Navigation Support
*For any* interactive element on the new pages, the element should be keyboard accessible (focusable via Tab key) and should display a visible focus indicator when focused.
**Validates: Requirements 8.4, 8.6**

Property 11: Image Alt Text Presence
*For any* meaningful image on the new pages, the img element should have a non-empty alt attribute that describes the image content.
**Validates: Requirements 8.5**

## Error Handling

### Page Not Found
- If a user navigates to an invalid route, Next.js will display the default 404 page
- No custom error handling needed for the new pages themselves

### Missing Data
- All page data is static and defined in the component files
- No external data fetching, so no error states needed for data loading

### Component Rendering Errors
- React error boundaries at the root layout level will catch any rendering errors
- Development mode will show detailed error messages
- Production mode will show generic error page

### Navigation Errors
- Next.js Link component handles navigation errors automatically
- Invalid hrefs will be caught during development

## Testing Strategy

### Unit Testing
Unit tests will verify specific examples and component rendering:

**Services Page Tests:**
- Test that /services route exists and returns 200 status
- Test that ServicesHero component renders with correct headline
- Test that ServicesGrid renders all four service categories
- Test that Footer component is present

**Knowledge Page Tests:**
- Test that /knowledge route exists and returns 200 status
- Test that KnowledgeHero component renders with correct headline
- Test that all seven knowledge categories are rendered
- Test that each category has a title, description, and topic list

**Guidance Page Tests:**
- Test that /guidance route exists and returns 200 status
- Test that GuidanceHero component renders with correct headline
- Test that all five guides are rendered
- Test that each guide has steps in sequential order

**Header Component Tests:**
- Test that navigation links have correct href values (/services, /knowledge, /guidance)
- Test that clicking each link navigates to the correct page
- Test that existing authentication and theme toggle functionality still works

### Property-Based Testing
Property tests will verify universal properties across all inputs:

**Property Test 1: Design System Consistency**
- Generate random page selections (Services, Knowledge, Guidance)
- For each page, verify presence of Danish red color (#C8102E) in CSS
- Verify font-serif class on headlines and font-sans on body text
- Verify consistent spacing utilities (p-4, py-6, etc.)
- Run 100 iterations

**Property Test 2: Responsive Layout Adaptation**
- Generate random viewport widths (mobile: 375-767px, tablet: 768-1023px, desktop: 1024-1920px)
- For each viewport, verify layout adapts correctly
- Verify interactive elements meet 44x44px minimum at mobile sizes
- Run 100 iterations

**Property Test 3: Footer Component Presence**
- For each new page, verify Footer component is in the DOM
- Verify Footer contains expected links and content
- Run 100 iterations

**Property Test 4: Navigation Link Functionality**
- For each navigation link, verify href is not "#"
- Verify href matches expected route pattern
- Run 100 iterations

**Property Test 5: Knowledge Category Descriptions**
- For each knowledge category, verify description field is non-empty
- Verify topics array has at least one item
- Run 100 iterations

**Property Test 6: Guidance Step Sequencing**
- For each guide, verify steps are numbered 1, 2, 3, ... n with no gaps
- Verify step numbers are in ascending order
- Run 100 iterations

**Property Test 7: Semantic HTML Usage**
- For each new page, verify presence of semantic elements (header, main, section, footer)
- Verify major sections use semantic elements instead of generic divs
- Run 100 iterations

**Property Test 8: ARIA Labels for Interactive Elements**
- For each interactive element, verify it has an accessible name
- Check for aria-label, aria-labelledby, or visible text content
- Run 100 iterations

**Property Test 9: Color Contrast Compliance**
- For each text element, calculate contrast ratio with background
- Verify ratio meets WCAG AA standards (4.5:1 for normal, 3:1 for large)
- Run 100 iterations

**Property Test 10: Keyboard Navigation Support**
- For each interactive element, verify it's focusable via Tab key
- Verify focus indicator is visible (not outline: none without alternative)
- Run 100 iterations

**Property Test 11: Image Alt Text Presence**
- For each img element, verify alt attribute exists and is non-empty
- Verify alt text is descriptive (not just "image" or filename)
- Run 100 iterations

### Integration Testing
- Test full user flows: navigating from home page to each new page
- Test that all pages work together with existing authentication
- Test that theme toggle works consistently across all pages

### Visual Regression Testing
- Capture screenshots of each new page at different viewport sizes
- Compare against baseline to catch unintended visual changes
- Use existing visual regression test setup

### Accessibility Testing
- Run automated accessibility tests using jest-axe
- Test keyboard navigation manually
- Verify screen reader compatibility

### Test Configuration
- All property tests configured to run minimum 100 iterations
- Each test tagged with: **Feature: localdesk-new-pages, Property {number}: {property_text}**
- Example tag: **Feature: localdesk-new-pages, Property 1: Design System Consistency Across Pages**

## Implementation Notes

### Content Strategy
- Services page content is marketing-focused, highlighting LocalDesk's value proposition
- Knowledge page content is organized by topic, mirroring the Denmark living docs structure
- Guidance page content is action-oriented, providing step-by-step instructions
- All content should be clear, concise, and valuable to expats

### Design Consistency
- Reuse existing component patterns (Hero, Features grid layout)
- Maintain Danish red accent color (#C8102E) throughout
- Use same typography scale and spacing as existing pages
- Follow same animation patterns (fade-in, slide-up)

### Performance Considerations
- All pages are static (no data fetching)
- Use Next.js Image component for any images
- Lazy load components below the fold if needed
- Minimize JavaScript bundle size by keeping components simple

### SEO Considerations
- Add appropriate meta tags for each page
- Use semantic HTML for better search engine understanding
- Include descriptive page titles and descriptions
- Ensure proper heading hierarchy (h1, h2, h3)

### Future Enhancements
- Add search functionality to Knowledge page
- Add filtering/sorting to Knowledge categories
- Add progress tracking for Guidance steps
- Add bookmarking functionality for favorite guides
- Add user feedback mechanism for content quality
