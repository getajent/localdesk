# Design Document: Denmark Living Information Documentation System

## Overview

The Denmark Living Information Documentation System is a structured markdown-based knowledge base optimized for retrieval-augmented generation (RAG) systems. The system organizes comprehensive information about living in Denmark into semantically coherent chunks that can be efficiently retrieved by vector databases and used by AI chatbots to answer user questions.

The design prioritizes:
- **Semantic chunking**: Documentation structured along natural topic boundaries for optimal retrieval
- **Self-contained sections**: Each section provides sufficient context for standalone comprehension
- **Consistent formatting**: Standardized markdown structure across all documents
- **Source traceability**: Clear attribution to official Danish government sources
- **Multilingual sourcing**: Primary content from Danish-language borger.dk with accurate English translation

## Architecture

### High-Level Structure

```
docs/
├── index.md                          # Main entry point with overview and navigation
├── before-moving/
│   ├── overview.md                   # High-level pre-arrival information
│   ├── residence-permits.md          # Visa and permit requirements
│   ├── work-permits.md               # Employment authorization
│   ├── housing-search.md             # Finding accommodation before arrival
│   ├── study-programs.md             # Educational opportunities
│   ├── family-reunification.md       # Bringing family members
│   └── cultural-preparation.md       # Language and cultural readiness
├── arrival-process/
│   ├── overview.md                   # Arrival checklist and priorities
│   ├── cpr-number.md                 # Civil registration process
│   ├── mitid.md                      # Digital identity setup
│   ├── health-insurance.md           # Yellow card and healthcare access
│   ├── gp-registration.md            # Family doctor selection
│   ├── tax-card.md                   # Tax registration
│   ├── bank-account.md               # Banking and NemKonto
│   ├── digital-post.md               # Government communication system
│   ├── vehicle-import.md             # Car registration and driving license
│   ├── ics-centers.md                # International Citizen Service
│   └── language-courses.md           # Danish language learning
├── essential-services/
│   ├── healthcare-system.md          # Medical services structure
│   ├── banking-services.md           # Financial institutions and services
│   ├── digital-government.md         # Online government services
│   ├── education-childcare.md        # Schools and daycare
│   └── transportation.md             # Public transit and mobility
├── social-benefits/
│   ├── overview.md                   # Benefits system introduction
│   ├── boligstotte.md                # Housing benefits
│   ├── unemployment-benefits.md      # Dagpenge system
│   ├── child-benefits.md             # Børnepenge and family support
│   ├── pension-system.md             # Retirement and pension
│   ├── parental-leave.md             # Maternity/paternity benefits
│   ├── student-support.md            # SU grants and loans
│   ├── social-assistance.md          # Kontanthjælp
│   ├── disability-benefits.md        # Support for disabilities
│   └── elderly-care.md               # Senior services
├── employment/
│   ├── employment-contracts.md       # Worker rights and contracts
│   ├── working-hours.md              # Regulations and overtime
│   ├── unions-akasse.md              # Trade unions and unemployment insurance
│   ├── salary-payslips.md            # Payment systems
│   ├── workplace-rights.md           # Protections and safety
│   └── parental-leave-work.md        # Leave entitlements
├── tax-finance/
│   ├── tax-system-overview.md        # Danish taxation structure
│   ├── income-tax.md                 # Tax rates and calculations
│   ├── tax-deductions.md             # Available deductions and credits
│   ├── annual-tax-return.md          # Årsopgørelse process
│   ├── skat-registration.md          # Tax authority procedures
│   └── self-employment-tax.md        # VAT and business taxation
├── housing/
│   ├── rental-contracts.md           # Lejekontrakt and tenant rights
│   ├── deposits-utilities.md         # Security deposits and utility setup
│   ├── tenant-insurance.md           # Indboforsikring requirements
│   ├── housing-types.md              # Andelsbolig and cooperative housing
│   ├── tenant-disputes.md            # Conflict resolution
│   └── moving-procedures.md          # Notice periods and moving out
├── practical-living/
│   ├── shopping-guide.md             # Supermarkets and retail
│   ├── cultural-norms.md             # Danish etiquette and customs
│   ├── cost-saving-tips.md           # Budget-friendly living
│   ├── mobile-internet.md            # Telecom providers
│   ├── cycling-culture.md            # Bicycle rules and tips
│   ├── waste-recycling.md            # Sorting and disposal
│   ├── public-holidays.md            # Calendar and seasonal info
│   ├── community-resources.md        # Expat groups and integration
│   ├── dining-culture.md             # Restaurant etiquette
│   └── sports-recreation.md          # Fitness and activities
└── metadata/
    ├── sources.md                    # Complete source attribution
    ├── glossary.md                   # Danish terms and definitions
    └── update-log.md                 # Documentation version history
```

### Design Principles

**1. Semantic Chunking Strategy**

Based on RAG best practices ([unstructured.io](https://unstructured.io/blog/chunking-for-rag-best-practices), [weaviate.io](https://weaviate.io/blog/chunking-strategies-for-rag)), the documentation uses markdown heading structure to create natural semantic boundaries. Each H2 section represents a logical chunk that:
- Contains 300-800 tokens (optimal for most embedding models)
- Preserves complete thoughts and procedural steps
- Includes sufficient context for standalone comprehension
- Aligns with natural user query patterns

**2. Hierarchical Organization**

Content follows a three-tier hierarchy:
- **Category level** (folders): Broad topic areas matching user journey stages
- **Document level** (files): Specific topics or procedures
- **Section level** (H2 headings): Discrete information units optimized for retrieval

**3. Context Preservation**

Each section includes:
- **Topic keywords** in the first sentence for embedding optimization
- **Prerequisites** when applicable (e.g., "Before applying for X, you must have Y")
- **Related links** to connected topics
- **Source attribution** for verification

## Components and Interfaces

### Document Structure Template

Each markdown document follows this standardized structure:

```markdown
# [Topic Title]

> **Last Updated**: [Date]  
> **Official Source**: [borger.dk URL]  
> **Applies to**: [EU Citizens / Non-EU Citizens / All Residents]

## Overview

[2-3 sentence summary with key topic keywords for embedding optimization]

## Key Information

- **Who needs this**: [Target audience]
- **When to do this**: [Timing/deadline if applicable]
- **Prerequisites**: [Required prior steps]
- **Processing time**: [Expected duration]

## [Procedural Section 1]

[Detailed step-by-step information]

### Required Documents

- Document 1
- Document 2

### Steps

1. [First step with clear action]
2. [Second step]
3. [Third step]

### Where to Apply

- **Online**: [URL and description]
- **In Person**: [Location and hours]

## [Procedural Section 2]

[Additional procedures or information]

## Common Questions

### [Question 1]

[Answer with relevant details]

### [Question 2]

[Answer with relevant details]

## Important Deadlines

- [Deadline 1]: [Description]
- [Deadline 2]: [Description]

## Related Topics

- [Link to related document 1](../category/document.md)
- [Link to related document 2](../category/document.md)

## Official Resources

- [Official source 1 name](URL)
- [Official source 2 name](URL)

---

*Content sourced from [borger.dk](URL) and translated to English. For the most current information, please refer to the official Danish government sources.*
```

### Metadata Schema

Each document includes frontmatter metadata for enhanced retrieval:

```yaml
---
title: "Document Title"
category: "Category Name"
audience: ["EU Citizens", "Non-EU Citizens", "All Residents"]
keywords: ["keyword1", "keyword2", "keyword3"]
last_updated: "2025-01-15"
source_url: "https://borger.dk/..."
language: "en"
translated_from: "da"
---
```

### Cross-Reference System

Documents use relative markdown links to maintain portability:

```markdown
For more information about [CPR numbers](../arrival-process/cpr-number.md), see the arrival process guide.
```

### Glossary Integration

Danish terms are:
1. **Bolded** on first use in each document
2. **Followed by English translation** in parentheses
3. **Linked to glossary** for detailed definitions

Example: `**CPR-nummer** (civil registration number) is required for...`

## Data Models

### Document Metadata Model

```typescript
interface DocumentMetadata {
  title: string;
  category: string;
  audience: string[];  // ["EU Citizens", "Non-EU Citizens", "All Residents"]
  keywords: string[];
  lastUpdated: string;  // ISO 8601 date
  sourceUrl: string;
  language: string;  // ISO 639-1 code
  translatedFrom?: string;  // ISO 639-1 code if translated
}
```

### Section Model

```typescript
interface DocumentSection {
  heading: string;
  level: number;  // 1-6 for H1-H6
  content: string;  // Markdown content
  tokenCount: number;  // Approximate token count
  keywords: string[];  // Extracted key terms
}
```

### Source Attribution Model

```typescript
interface SourceAttribution {
  documentPath: string;
  officialSources: {
    name: string;
    url: string;
    accessDate: string;
    language: string;
  }[];
  communitySources?: {
    name: string;
    url: string;
    type: string;  // "expat-forum", "guide", "blog"
    reliability: string;  // "high", "medium"
  }[];
}
```

### Cross-Reference Model

```typescript
interface CrossReference {
  sourceDocument: string;
  targetDocument: string;
  linkText: string;
  context: string;  // Surrounding text for context
}
```

## Content Sourcing and Translation Process

### Primary Source: borger.dk (Danish)

1. **Identify relevant pages** on borger.dk covering required topics
2. **Extract content** from Danish-language pages (most comprehensive)
3. **Translate accurately** to English while preserving:
   - Technical accuracy of procedures
   - Legal requirements and deadlines
   - Official terminology
4. **Verify translation** against English versions (lifeindenmark.dk, newtodenmark.dk) where available
5. **Note discrepancies** if Danish and English sources conflict

### Secondary Sources

- **lifeindenmark.dk**: English-language official portal (verify against Danish version)
- **newtodenmark.dk**: Newcomer-focused information
- **Community resources**: Supplement with practical tips from reputable expat guides

### Translation Guidelines

- Preserve Danish terms for official concepts (e.g., "CPR-nummer", "boligstøtte")
- Provide English translation immediately after first use
- Maintain formal tone for official procedures
- Use accessible language for practical living tips
- Include both Danish and English terms in glossary

## Documentation Generation Workflow

### Phase 1: Content Research and Extraction

1. **Identify topic areas** from requirements
2. **Locate official sources** on borger.dk (Danish version)
3. **Extract relevant information** including:
   - Procedures and requirements
   - Eligibility criteria
   - Required documents
   - Deadlines and timelines
   - Contact information
4. **Verify with English sources** (lifeindenmark.dk, newtodenmark.dk)
5. **Supplement with practical information** from community resources

### Phase 2: Content Structuring

1. **Organize by category** following directory structure
2. **Create document outlines** using standard template
3. **Write overview sections** with keyword optimization
4. **Structure procedural sections** with clear steps
5. **Add cross-references** to related topics
6. **Include source attribution** for all content

### Phase 3: Translation and Localization

1. **Translate Danish content** to clear English
2. **Preserve technical accuracy** of procedures
3. **Maintain Danish terminology** for official concepts
4. **Add glossary entries** for all Danish terms
5. **Verify consistency** across documents

### Phase 4: Optimization for RAG

1. **Review section lengths** (target 300-800 tokens)
2. **Ensure semantic coherence** within sections
3. **Add context** to sections for standalone comprehension
4. **Optimize keyword placement** in headings and opening sentences
5. **Test chunking boundaries** for natural breaks

### Phase 5: Quality Assurance

1. **Verify source accuracy** against official portals
2. **Check cross-references** for broken links
3. **Validate metadata** completeness
4. **Review for clarity** and accessibility
5. **Update version log** with changes


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Required Documentation Completeness

*For all* required topic areas specified in the requirements (pre-arrival, arrival, essential services, social benefits, employment, tax/finance, housing, practical living), the corresponding documentation files SHALL exist in the appropriate category directory and contain all required content sections.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.1, 4.2, 4.3, 4.4, 4.5, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.11, 15.12**

### Property 2: Category Organization Structure

*For all* documentation, the directory structure SHALL contain distinct category folders for before-moving, arrival-process, essential-services, social-benefits, employment, tax-finance, housing, practical-living, and metadata, with documents properly organized within their respective categories.

**Validates: Requirements 1.1**

### Property 3: Markdown Format Compliance

*For all* documentation files, the content SHALL be valid markdown with consistent heading hierarchy (no skipped heading levels), proper use of numbered lists for procedural steps, and appropriate formatting elements (headings, bullet points, emphasis).

**Validates: Requirements 1.2, 7.1, 8.5**

### Property 4: Overview-Details Pattern

*For all* category directories, an overview.md file SHALL exist, and documents within the category SHALL follow the pattern of overview sections followed by detailed procedural or informational sections.

**Validates: Requirements 1.3**

### Property 5: Section Token Limit

*For all* H2 sections within documentation, the token count SHALL not exceed 1000 tokens to optimize vector database retrieval performance.

**Validates: Requirements 1.4**

### Property 6: Cross-Reference Validity

*For all* documents that reference related procedures or topics, cross-references SHALL exist using relative markdown link format (../category/document.md) and SHALL point to existing documentation files.

**Validates: Requirements 1.5**

### Property 7: Citizenship Distinction

*For all* documents covering procedures that differ by citizenship status, the content SHALL clearly distinguish between EU_Citizen and Non_EU_Citizen procedures using separate sections, headings, or explicit markers.

**Validates: Requirements 2.7, 7.6**

### Property 8: Complete Source Attribution

*For all* documentation files, the metadata SHALL include source URLs from official Content_Source portals (borger.dk, lifeindenmark.dk, newtodenmark.dk), a last_updated date, and an "Official Resources" section with clickable source links.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 9: Procedural Guide Completeness

*For all* documents identified as procedural guides (containing step-by-step instructions), the document SHALL include sections for: prerequisites, required documents, application steps, application location (online/in-person), processing time, and next steps.

**Validates: Requirements 7.2, 7.3, 7.4, 7.5**

### Property 10: Deadline Highlighting

*For all* documents containing time-sensitive requirements or deadlines, the deadlines SHALL be highlighted in a dedicated "Important Deadlines" section or with visual formatting emphasis.

**Validates: Requirements 5.4**

### Property 11: Processing Time Documentation

*For all* procedural documents describing applications or registrations, processing time information SHALL be included in the "Key Information" or procedural steps section.

**Validates: Requirements 5.5**

### Property 12: Source Type Distinction

*For all* documents in the practical-living category containing Practical_Information, the content SHALL clearly distinguish between official government sources and Community_Resource information, and SHALL include both types of sources where applicable.

**Validates: Requirements 6.6, 15.10**

### Property 13: Danish Term Translation

*For all* documents, when Danish terms are used (identified by matching glossary entries or Danish language patterns), the term SHALL be followed immediately by an English translation in parentheses on first use in the document.

**Validates: Requirements 8.2**

### Property 14: Acronym Definition

*For all* documents, acronyms and abbreviations SHALL be defined on their first use within the document, either inline or in a glossary reference.

**Validates: Requirements 8.3**

### Property 15: Terminology Consistency

*For all* documents in the documentation system, the same concepts SHALL use consistent terminology (e.g., "CPR number" vs "CPR-nummer" vs "civil registration number" should follow a consistent pattern defined in the glossary).

**Validates: Requirements 8.4**

### Property 16: Keyword Optimization

*For all* H2 sections, the section heading and first sentence SHALL contain relevant topic keywords that align with expected user queries for that topic.

**Validates: Requirements 9.2**

### Property 17: Procedure Continuity

*For all* procedural sections containing numbered steps, all steps SHALL appear within the same H2 section without intervening H2 headings that would split the procedure across multiple chunks.

**Validates: Requirements 9.4**

### Property 18: Dual-Level Documentation

*For all* documents covering complex topics (identified by having 5+ subsections), the document SHALL provide both a high-level overview section and detailed sections to support different query types.

**Validates: Requirements 9.5**

### Property 19: Troubleshooting Information

*For all* procedural documents, the document SHALL include a troubleshooting section, common questions section, or information about handling common issues and edge cases.

**Validates: Requirements 10.3**

### Property 20: Rejection Scenario Documentation

*For all* procedural documents describing applications or registrations, the document SHALL include information about what to do if requirements cannot be met or if applications are rejected.

**Validates: Requirements 10.4**

### Property 21: Contact Information Inclusion

*For all* documents describing official procedures or services, the document SHALL include contact information for relevant authorities, support services, or help resources.

**Validates: Requirements 10.5**

### Property 22: Benefits Eligibility Requirements

*For all* documents in the social-benefits category, the document SHALL specify eligibility requirements including residency duration requirements and work history requirements where applicable.

**Validates: Requirements 11.10**

## Error Handling

### Content Validation Errors

**Missing Required Documents**
- **Detection**: Automated script checks for existence of all required documentation files
- **Handling**: Generate report of missing files with requirement references
- **Resolution**: Create missing documentation following standard template

**Invalid Markdown Format**
- **Detection**: Markdown parser identifies syntax errors or invalid structure
- **Handling**: Report file path, line number, and specific format violation
- **Resolution**: Correct markdown syntax and re-validate

**Broken Cross-References**
- **Detection**: Link validator checks all relative markdown links
- **Handling**: Report source file, target link, and reason for failure
- **Resolution**: Update link to correct path or create missing target document

**Token Limit Violations**
- **Detection**: Token counter analyzes each H2 section
- **Handling**: Report section heading, current token count, and excess amount
- **Resolution**: Split section into multiple H2 sections or condense content

### Source Attribution Errors

**Missing Source URLs**
- **Detection**: Metadata validator checks for source_url field
- **Handling**: Report file path and missing metadata field
- **Resolution**: Research and add official source URL

**Outdated Content**
- **Detection**: Date checker identifies documents with last_updated > 6 months old
- **Handling**: Generate report of potentially stale documentation
- **Resolution**: Review official sources and update content if changed

**Source Conflicts**
- **Detection**: Manual review during content creation
- **Handling**: Document conflict in content with note explaining discrepancy
- **Resolution**: Prioritize most authoritative source (borger.dk Danish version) and note alternative information

### Translation Errors

**Missing Danish Term Translations**
- **Detection**: Pattern matcher identifies Danish terms without English translations
- **Handling**: Report file path, term, and line number
- **Resolution**: Add English translation in parentheses after term

**Inconsistent Terminology**
- **Detection**: Terminology checker compares term usage across documents
- **Handling**: Report conflicting terms and their locations
- **Resolution**: Standardize on glossary-defined term and update all documents

### Content Completeness Errors

**Missing Required Sections**
- **Detection**: Section validator checks procedural documents for required sections
- **Handling**: Report file path and list of missing sections
- **Resolution**: Add missing sections with appropriate content

**Incomplete Procedural Information**
- **Detection**: Manual review during content creation
- **Handling**: Flag document for revision
- **Resolution**: Research and add missing procedural details

## Testing Strategy

The Denmark Living Information Documentation System requires a dual testing approach combining unit tests for specific validation rules and property-based tests for universal correctness properties.

### Unit Testing Approach

Unit tests focus on specific examples, edge cases, and validation logic:

**Document Validation Tests**
- Test markdown parser with valid and invalid markdown samples
- Test metadata extractor with complete and incomplete frontmatter
- Test token counter with sections of known token counts
- Test link validator with valid, broken, and malformed links

**Content Structure Tests**
- Test that specific required documents exist (e.g., cpr-number.md, mitid.md)
- Test that specific sections exist in key documents (e.g., "Prerequisites" in procedural guides)
- Test that specific deadlines are documented (e.g., 30-day vehicle registration)
- Test that specific common questions are answered

**Translation and Terminology Tests**
- Test Danish term pattern matching with known terms
- Test translation extraction with various formats
- Test acronym detection with common abbreviations
- Test glossary lookup with defined terms

**Edge Cases**
- Empty documents
- Documents with no headings
- Documents with only H1 headings (no H2 sections)
- Circular cross-references
- Very long sections (>2000 tokens)
- Missing metadata fields

### Property-Based Testing Approach

Property-based tests verify universal correctness properties across all documentation using randomized inputs and comprehensive coverage. Each property test should run a minimum of 100 iterations.

**Test Configuration**
- **Library**: Use a property-based testing library appropriate for the implementation language (e.g., Hypothesis for Python, fast-check for TypeScript/JavaScript, QuickCheck for Haskell)
- **Iterations**: Minimum 100 iterations per property test
- **Tagging**: Each test tagged with: `Feature: denmark-living-docs, Property {N}: {property description}`

**Property Test Suite**

**Property 1 Test: Required Documentation Completeness**
- **Generator**: List of all required topic areas from requirements
- **Property**: For each required topic, verify corresponding file exists and contains required sections
- **Tag**: `Feature: denmark-living-docs, Property 1: Required Documentation Completeness`

**Property 2 Test: Category Organization Structure**
- **Generator**: All documentation files in the system
- **Property**: For each file, verify it exists within one of the required category directories
- **Tag**: `Feature: denmark-living-docs, Property 2: Category Organization Structure`

**Property 3 Test: Markdown Format Compliance**
- **Generator**: All documentation files
- **Property**: For each file, parse markdown and verify no syntax errors, consistent heading hierarchy
- **Tag**: `Feature: denmark-living-docs, Property 3: Markdown Format Compliance`

**Property 4 Test: Overview-Details Pattern**
- **Generator**: All category directories
- **Property**: For each category, verify overview.md exists and documents follow overview-then-details pattern
- **Tag**: `Feature: denmark-living-docs, Property 4: Overview-Details Pattern`

**Property 5 Test: Section Token Limit**
- **Generator**: All H2 sections across all documents
- **Property**: For each section, count tokens and verify ≤ 1000
- **Tag**: `Feature: denmark-living-docs, Property 5: Section Token Limit`

**Property 6 Test: Cross-Reference Validity**
- **Generator**: All markdown links in all documents
- **Property**: For each relative link, verify target file exists
- **Tag**: `Feature: denmark-living-docs, Property 6: Cross-Reference Validity`

**Property 7 Test: Citizenship Distinction**
- **Generator**: All documents covering citizenship-dependent procedures
- **Property**: For each document, verify clear EU/Non-EU distinction exists
- **Tag**: `Feature: denmark-living-docs, Property 7: Citizenship Distinction`

**Property 8 Test: Complete Source Attribution**
- **Generator**: All documentation files
- **Property**: For each file, verify metadata contains source_url, last_updated, and Official Resources section exists
- **Tag**: `Feature: denmark-living-docs, Property 8: Complete Source Attribution`

**Property 9 Test: Procedural Guide Completeness**
- **Generator**: All procedural guide documents
- **Property**: For each procedural guide, verify all required sections exist (prerequisites, required documents, steps, location, processing time, next steps)
- **Tag**: `Feature: denmark-living-docs, Property 9: Procedural Guide Completeness`

**Property 10 Test: Deadline Highlighting**
- **Generator**: All documents containing deadline keywords
- **Property**: For each document with deadlines, verify "Important Deadlines" section exists or deadlines are formatted with emphasis
- **Tag**: `Feature: denmark-living-docs, Property 10: Deadline Highlighting`

**Property 11 Test: Processing Time Documentation**
- **Generator**: All procedural documents
- **Property**: For each procedural document, verify processing time information exists
- **Tag**: `Feature: denmark-living-docs, Property 11: Processing Time Documentation`

**Property 12 Test: Source Type Distinction**
- **Generator**: All documents in practical-living category
- **Property**: For each practical document, verify clear distinction between official and community sources
- **Tag**: `Feature: denmark-living-docs, Property 12: Source Type Distinction`

**Property 13 Test: Danish Term Translation**
- **Generator**: All Danish terms found in all documents
- **Property**: For each Danish term on first use in a document, verify English translation follows in parentheses
- **Tag**: `Feature: denmark-living-docs, Property 13: Danish Term Translation`

**Property 14 Test: Acronym Definition**
- **Generator**: All acronyms found in all documents
- **Property**: For each acronym on first use in a document, verify definition exists inline or via glossary reference
- **Tag**: `Feature: denmark-living-docs, Property 14: Acronym Definition`

**Property 15 Test: Terminology Consistency**
- **Generator**: All concept references across all documents
- **Property**: For each concept, verify consistent terminology usage matching glossary definitions
- **Tag**: `Feature: denmark-living-docs, Property 15: Terminology Consistency`

**Property 16 Test: Keyword Optimization**
- **Generator**: All H2 sections across all documents
- **Property**: For each section, verify heading and first sentence contain relevant topic keywords
- **Tag**: `Feature: denmark-living-docs, Property 16: Keyword Optimization`

**Property 17 Test: Procedure Continuity**
- **Generator**: All procedural sections with numbered steps
- **Property**: For each procedure, verify all steps appear in same H2 section without intervening H2 headings
- **Tag**: `Feature: denmark-living-docs, Property 17: Procedure Continuity`

**Property 18 Test: Dual-Level Documentation**
- **Generator**: All documents with 5+ subsections
- **Property**: For each complex document, verify both overview section and detailed sections exist
- **Tag**: `Feature: denmark-living-docs, Property 18: Dual-Level Documentation`

**Property 19 Test: Troubleshooting Information**
- **Generator**: All procedural documents
- **Property**: For each procedural document, verify troubleshooting, common questions, or common issues section exists
- **Tag**: `Feature: denmark-living-docs, Property 19: Troubleshooting Information`

**Property 20 Test: Rejection Scenario Documentation**
- **Generator**: All procedural documents describing applications
- **Property**: For each application document, verify information about rejection scenarios exists
- **Tag**: `Feature: denmark-living-docs, Property 20: Rejection Scenario Documentation`

**Property 21 Test: Contact Information Inclusion**
- **Generator**: All documents describing official procedures
- **Property**: For each official procedure document, verify contact information for authorities exists
- **Tag**: `Feature: denmark-living-docs, Property 21: Contact Information Inclusion`

**Property 22 Test: Benefits Eligibility Requirements**
- **Generator**: All documents in social-benefits category
- **Property**: For each benefits document, verify eligibility requirements including residency and work history are specified
- **Tag**: `Feature: denmark-living-docs, Property 22: Benefits Eligibility Requirements`

### Integration Testing

**End-to-End Documentation Validation**
- Run complete validation suite against entire documentation system
- Verify all properties pass for all documents
- Generate comprehensive validation report

**RAG System Integration**
- Test documentation chunking with actual vector database
- Verify chunk sizes are appropriate for embedding model
- Test retrieval quality with sample queries
- Measure retrieval accuracy for common questions

**Source Verification**
- Periodically verify official source URLs are still valid
- Check for content updates on official portals
- Flag documents that may need updating

### Continuous Validation

**Pre-Commit Validation**
- Run markdown format validation on changed files
- Verify metadata completeness for new/modified documents
- Check cross-references for broken links

**Periodic Full Validation**
- Run complete property test suite monthly
- Generate validation report with any failures
- Update documentation to fix violations

**Content Freshness Monitoring**
- Check last_updated dates quarterly
- Flag documents older than 6 months for review
- Verify official sources for changes
