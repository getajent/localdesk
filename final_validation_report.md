# Denmark Living Documentation - Validation Report

**Status:** ❌ ERRORS  
**Generated:** 2026-02-04T01:35:53.796248  
**Documentation Directory:** `D:\Downloads\localdesk\docs\denmark-living`

## Summary

| Metric | Count |
|--------|-------|
| Total Validators | 10 |
| Successful | 10 |
| Failed | 0 |
| **Total Errors** | **738** |
| **Total Warnings** | **802** |

## Validator Results

### ✅ Markdown Validation
**Description:** Markdown format and structure validation
**Execution Time:** 0.24s

**Files Processed:** 72
**Errors Found:** 0
**Warnings Found:** 479


### ✅ Metadata Validation
**Description:** Frontmatter metadata validation
**Execution Time:** 0.12s

**Files Processed:** 72
**Errors Found:** 57
**Warnings Found:** 24

**Files with Issues:**
- `D:\Downloads\localdesk\docs\denmark-living\index.md`
  - No frontmatter metadata found
- `D:\Downloads\localdesk\docs\denmark-living\README.md`
  - No frontmatter metadata found
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\digital-post.md`
  - No frontmatter metadata found
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\gp-registration.md`
  - No frontmatter metadata found
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\ics-centers.md`
  - No frontmatter metadata found
- *... and 48 more files with issues*


### ✅ Tokens Validation
**Description:** Token count validation for RAG optimization
**Execution Time:** 0.31s

**Files Processed:** 72
**Errors Found:** 0
**Warnings Found:** 0


### ✅ Links Validation
**Description:** Cross-reference link validation
**Execution Time:** 0.80s

**Files Processed:** 72
**Errors Found:** 0
**Warnings Found:** 0

**Files with Issues:**
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\bank-account.md`
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\cpr-number.md`
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\digital-post.md`
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\mitid.md`
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\overview.md`
- *... and 4 more files with issues*


### ✅ Structure Validation
**Description:** Directory structure validation
**Execution Time:** 0.01s

**Files Processed:** 70
**Errors Found:** 0
**Warnings Found:** 0


### ✅ Procedures Validation
**Description:** Procedural guide completeness validation
**Execution Time:** 0.14s

**Files Processed:** 72
**Errors Found:** 153
**Warnings Found:** 114

**Files with Issues:**
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\bank-account.md`
  - Line 153: Step numbering issue - expected 1, found 7
  - Line 300: Step numbering issue - expected 1, found 2
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\cpr-number.md`
  - Line 102: Step numbering issue - expected 1, found 4
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\digital-post.md`
  - Missing required section: required_documents
  - Missing required section: processing_time
  - *... and 2 more errors*
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\gp-registration.md`
  - Missing required section: required_documents
  - Missing required section: processing_time
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\health-insurance.md`
  - Missing required section: required_documents
  - Line 101: Step numbering issue - expected 1, found 3
- *... and 41 more files with issues*


### ✅ Translations Validation
**Description:** Danish term translation validation
**Execution Time:** 0.14s

**Files Processed:** 72
**Errors Found:** 0
**Warnings Found:** 0


### ✅ Acronyms Validation
**Description:** Acronym definition validation
**Execution Time:** 0.35s

**Files Processed:** 72
**Errors Found:** 295
**Warnings Found:** 147

**Files with Issues:**
- `D:\Downloads\localdesk\docs\denmark-living\index.md`
  - Line 16: Acronym 'CPR' used without definition
  - Line 31: Acronym 'GP' used without definition
  - *... and 4 more errors*
- `D:\Downloads\localdesk\docs\denmark-living\README.md`
  - Line 5: Acronym 'AI' used without definition
  - Line 115: Acronym 'FAQ' used without definition
  - *... and 1 more errors*
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\bank-account.md`
  - Line 6: Acronym 'EU' used without definition
  - Line 7: Acronym 'IBAN' used without definition
  - *... and 8 more errors*
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\cpr-number.md`
  - Line 1: Acronym 'CPR' used without definition
  - Line 6: Acronym 'EU' used without definition
  - *... and 4 more errors*
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\digital-post.md`
  - Line 9: Acronym 'CPR' used without definition
  - Line 63: Acronym 'SMS' used without definition
  - *... and 2 more errors*
- *... and 58 more files with issues*


### ✅ Terminology Validation
**Description:** Terminology consistency validation
**Execution Time:** 0.20s

**Files Processed:** 72
**Errors Found:** 0
**Warnings Found:** 0


### ✅ Citizenship Validation
**Description:** EU/Non-EU citizenship distinction validation
**Execution Time:** 0.22s

**Files Processed:** 72
**Errors Found:** 233
**Warnings Found:** 38

**Files with Issues:**
- `D:\Downloads\localdesk\docs\denmark-living\index.md`
  - Missing citizenship distinction for: Pre-arrival information including residence permits, work permits, housing search, study programs, f...
  - Missing citizenship distinction for: Essential registration procedures: CPR number, MitID, health insurance, GP registration, tax card, b...
  - *... and 2 more errors*
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\bank-account.md`
  - Missing citizenship distinction for: 
**Problem**: Bank refuses to open an account  
**Solution**:
- **Ask for specific reasons**: Banks ...
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\cpr-number.md`
  - Missing citizenship distinction for: 
---
title: "CPR Number - Civil Registration Number"
category: "Arrival Process"
audience: ["EU Citi...
  - Missing citizenship distinction for: ...
  - *... and 7 more errors*
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\digital-post.md`
  - Missing citizenship distinction for: 
- **Tax documents**: Must respond within specified deadlines
- **Legal notices**: Response times va...
- `D:\Downloads\localdesk\docs\denmark-living\arrival-process\gp-registration.md`
  - Missing citizenship distinction for: 
> **Last Updated**: 2025-02-03  
> **Official Source**: https://borger.dk/sundhed-og-sygdom/laegeva...
  - Missing citizenship distinction for: ...
  - *... and 2 more errors*
- *... and 51 more files with issues*



## 🔧 Actionable Recommendations

1. **HIGH Priority:** 738 critical errors found
   - *Action:* Review error details and fix issues before proceeding

2. **MEDIUM Priority:** 48 files missing frontmatter metadata
   - *Action:* Add required metadata fields (title, category, source_url, last_updated)

3. **MEDIUM Priority:** 3 sections exceed 1000 token limit
   - *Action:* Split large sections or condense content for better RAG performance

4. **MEDIUM Priority:** 802 warnings found
   - *Action:* Review warnings for potential improvements to documentation quality


---

*Report generated by Denmark Living Documentation System Validator*
