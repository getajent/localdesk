#!/usr/bin/env python3
"""
Citizenship Distinction Validator for Denmark Living Documentation System

This script validates citizenship-dependent content for:
- Identification of documents with citizenship-dependent content
- Verification of clear EU/Non-EU distinction
- Proper labeling and organization of citizenship-specific information

Requirements: 2.7, 7.6
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any, Set
import argparse


class CitizenshipDistinctionValidator:
    """Validates citizenship distinctions in documentation."""
    
    # Keywords that indicate citizenship-dependent content
    CITIZENSHIP_KEYWORDS = [
        'eu citizen', 'non-eu citizen', 'european union', 'eea', 'european economic area',
        'visa', 'residence permit', 'work permit', 'immigration', 'permit',
        'nordic citizen', 'swiss citizen', 'third country', 'foreign national',
        'citizenship', 'nationality', 'passport', 'schengen'
    ]
    
    # Procedures that typically have citizenship distinctions
    CITIZENSHIP_DEPENDENT_PROCEDURES = [
        'residence permit', 'work permit', 'visa', 'immigration', 'registration',
        'cpr', 'mitid', 'bank account', 'employment', 'study', 'family reunification'
    ]
    
    # Expected citizenship categories
    CITIZENSHIP_CATEGORIES = {
        'eu_citizen': ['eu citizen', 'european union citizen', 'eu/eea citizen', 'eea citizen'],
        'non_eu_citizen': ['non-eu citizen', 'third country national', 'foreign national'],
        'nordic_citizen': ['nordic citizen', 'scandinavian citizen'],
        'swiss_citizen': ['swiss citizen', 'switzerland citizen']
    }
    
    def __init__(self):
        self.errors = []
        self.warnings = []
    
    def validate_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Validate citizenship distinctions in a single markdown file.
        
        Args:
            file_path: Path to the markdown file
            
        Returns:
            Dictionary containing validation results
        """
        result = {
            'file': str(file_path),
            'has_citizenship_content': False,
            'valid': True,
            'errors': [],
            'warnings': [],
            'citizenship_references': [],
            'missing_distinctions': [],
            'unclear_distinctions': [],
            'good_distinctions': []
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file contains citizenship-dependent content
            has_citizenship_content = self._has_citizenship_content(content, file_path)
            result['has_citizenship_content'] = has_citizenship_content
            
            if has_citizenship_content:
                # Find citizenship references
                citizenship_refs = self._find_citizenship_references(content)
                result['citizenship_references'] = citizenship_refs
                
                # Validate distinctions
                missing, unclear, good = self._validate_distinctions(content, citizenship_refs)
                result['missing_distinctions'] = missing
                result['unclear_distinctions'] = unclear
                result['good_distinctions'] = good
                
                # Compile errors and warnings
                if missing:
                    result['errors'].extend([
                        f"Missing citizenship distinction for: {item['context'][:100]}..."
                        for item in missing
                    ])
                
                if unclear:
                    result['errors'].extend([
                        f"Line {item['line']}: Unclear citizenship distinction - {item['issue']}"
                        for item in unclear
                    ])
                
                # Add warnings for best practices
                result['warnings'].extend(self._check_best_practices(content, citizenship_refs))
                
                if result['errors']:
                    result['valid'] = False
                
        except Exception as e:
            result['valid'] = False
            result['errors'].append(f"Failed to read file: {str(e)}")
        
        return result
    
    def _has_citizenship_content(self, content: str, file_path: Path) -> bool:
        """
        Determine if a document contains citizenship-dependent content.
        
        Args:
            content: Markdown content
            file_path: Path to the file
            
        Returns:
            True if document contains citizenship-dependent content
        """
        content_lower = content.lower()
        
        # Check for citizenship keywords
        keyword_count = sum(1 for keyword in self.CITIZENSHIP_KEYWORDS if keyword in content_lower)
        
        # Check for citizenship-dependent procedures
        procedure_count = sum(1 for procedure in self.CITIZENSHIP_DEPENDENT_PROCEDURES if procedure in content_lower)
        
        # Check file path for citizenship-related directories
        path_parts = [part.lower() for part in file_path.parts]
        citizenship_path = any(
            'visa' in part or 'permit' in part or 'immigration' in part or 'arrival' in part
            for part in path_parts
        )
        
        # Check metadata for audience specification
        has_audience_metadata = 'audience:' in content_lower and ('eu citizen' in content_lower or 'non-eu citizen' in content_lower)
        
        # Determine if citizenship-dependent
        return (
            keyword_count >= 2 or
            procedure_count >= 1 or
            citizenship_path or
            has_audience_metadata
        )
    
    def _find_citizenship_references(self, content: str) -> List[Dict[str, Any]]:
        """
        Find all citizenship references in the content.
        
        Args:
            content: Markdown content
            
        Returns:
            List of citizenship references found
        """
        references = []
        lines = content.split('\n')
        
        # Patterns for citizenship references
        patterns = [
            # Direct citizenship mentions
            (re.compile(r'\b(eu\s+citizen|non-eu\s+citizen|european\s+union\s+citizen|eea\s+citizen|nordic\s+citizen|swiss\s+citizen|third\s+country\s+national)\b', re.IGNORECASE), 'direct_mention'),
            # Permit/visa references
            (re.compile(r'\b(residence\s+permit|work\s+permit|visa|immigration\s+status)\b', re.IGNORECASE), 'permit_reference'),
            # Procedural distinctions
            (re.compile(r'\b(for\s+eu\s+citizens|for\s+non-eu\s+citizens|eu/eea\s+citizens|if\s+you\s+are\s+from)\b', re.IGNORECASE), 'procedural_distinction'),
        ]
        
        for line_num, line in enumerate(lines, 1):
            for pattern, ref_type in patterns:
                for match in pattern.finditer(line):
                    references.append({
                        'text': match.group(0),
                        'type': ref_type,
                        'line': line_num,
                        'context': line.strip(),
                        'match_start': match.start(),
                        'match_end': match.end()
                    })
        
        return references
    
    def _validate_distinctions(self, content: str, citizenship_refs: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Validate citizenship distinctions in the content.
        
        Args:
            content: Full document content
            citizenship_refs: List of citizenship references found
            
        Returns:
            Tuple of (missing_distinctions, unclear_distinctions, good_distinctions)
        """
        missing = []
        unclear = []
        good = []
        
        lines = content.split('\n')
        
        # Check for sections that should have citizenship distinctions
        sections_needing_distinction = self._find_sections_needing_distinction(content)
        
        for section in sections_needing_distinction:
            section_content = section['content']
            section_refs = [ref for ref in citizenship_refs if section['start_line'] <= ref['line'] <= section['end_line']]
            
            if not section_refs:
                # Section needs distinction but doesn't have any
                missing.append({
                    'section': section['heading'],
                    'context': section_content[:200],
                    'start_line': section['start_line'],
                    'end_line': section['end_line'],
                    'reason': 'No citizenship distinction found in section that likely needs it'
                })
            else:
                # Check quality of distinctions
                distinction_quality = self._assess_distinction_quality(section_content, section_refs)
                
                if distinction_quality['unclear']:
                    unclear.extend(distinction_quality['unclear'])
                
                if distinction_quality['good']:
                    good.extend(distinction_quality['good'])
        
        # Check for general citizenship mentions without clear context
        for ref in citizenship_refs:
            if ref['type'] == 'direct_mention':
                context_quality = self._assess_context_quality(ref, lines)
                
                if context_quality == 'unclear':
                    unclear.append({
                        'line': ref['line'],
                        'text': ref['text'],
                        'context': ref['context'],
                        'issue': 'Citizenship mentioned without clear procedural context'
                    })
                elif context_quality == 'good':
                    good.append({
                        'line': ref['line'],
                        'text': ref['text'],
                        'context': ref['context'],
                        'type': 'clear_citizenship_reference'
                    })
        
        return missing, unclear, good
    
    def _find_sections_needing_distinction(self, content: str) -> List[Dict[str, Any]]:
        """
        Find sections that likely need citizenship distinctions.
        
        Args:
            content: Markdown content
            
        Returns:
            List of sections that need citizenship distinctions
        """
        sections = []
        lines = content.split('\n')
        
        current_section = None
        current_content = []
        
        # Parse sections
        heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$')
        
        for line_num, line in enumerate(lines, 1):
            heading_match = heading_pattern.match(line)
            
            if heading_match:
                # Save previous section
                if current_section:
                    section_content = '\n'.join(current_content)
                    if self._section_needs_distinction(current_section['heading'], section_content):
                        current_section['content'] = section_content
                        current_section['end_line'] = line_num - 1
                        sections.append(current_section)
                
                # Start new section
                level = len(heading_match.group(1))
                heading = heading_match.group(2).strip()
                
                current_section = {
                    'level': level,
                    'heading': heading,
                    'start_line': line_num,
                    'end_line': None
                }
                current_content = []
            else:
                if current_section:
                    current_content.append(line)
        
        # Handle last section
        if current_section:
            section_content = '\n'.join(current_content)
            if self._section_needs_distinction(current_section['heading'], section_content):
                current_section['content'] = section_content
                current_section['end_line'] = len(lines)
                sections.append(current_section)
        
        return sections
    
    def _section_needs_distinction(self, heading: str, content: str) -> bool:
        """
        Determine if a section needs citizenship distinction.
        
        Args:
            heading: Section heading
            content: Section content
            
        Returns:
            True if section needs citizenship distinction
        """
        heading_lower = heading.lower()
        content_lower = content.lower()
        
        # Headings that typically need distinction
        distinction_headings = [
            'eligibility', 'requirements', 'application', 'process', 'procedure',
            'documents', 'permits', 'visa', 'registration', 'who needs'
        ]
        
        if any(keyword in heading_lower for keyword in distinction_headings):
            return True
        
        # Content that suggests need for distinction
        distinction_content = [
            'residence permit', 'work permit', 'visa', 'immigration',
            'eligibility', 'requirements', 'documents needed', 'application process'
        ]
        
        content_matches = sum(1 for keyword in distinction_content if keyword in content_lower)
        
        return content_matches >= 2
    
    def _assess_distinction_quality(self, section_content: str, section_refs: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """
        Assess the quality of citizenship distinctions in a section.
        
        Args:
            section_content: Content of the section
            section_refs: Citizenship references in the section
            
        Returns:
            Dictionary with 'unclear' and 'good' distinction lists
        """
        quality = {'unclear': [], 'good': []}
        
        # Check for clear structural distinctions
        has_clear_structure = self._has_clear_distinction_structure(section_content)
        
        for ref in section_refs:
            if ref['type'] == 'procedural_distinction':
                if has_clear_structure:
                    quality['good'].append({
                        'line': ref['line'],
                        'text': ref['text'],
                        'context': ref['context'],
                        'type': 'clear_procedural_distinction'
                    })
                else:
                    quality['unclear'].append({
                        'line': ref['line'],
                        'text': ref['text'],
                        'context': ref['context'],
                        'issue': 'Procedural distinction mentioned but not clearly structured'
                    })
        
        return quality
    
    def _has_clear_distinction_structure(self, content: str) -> bool:
        """
        Check if content has clear citizenship distinction structure.
        
        Args:
            content: Section content
            
        Returns:
            True if content has clear distinction structure
        """
        content_lower = content.lower()
        
        # Look for clear structural patterns
        patterns = [
            # Subheadings for different citizenship types
            r'#{3,6}\s+(for\s+)?eu\s+citizen',
            r'#{3,6}\s+(for\s+)?non-eu\s+citizen',
            r'#{3,6}\s+(for\s+)?nordic\s+citizen',
            # List items for different citizenship types
            r'^\s*[-*]\s+.*eu\s+citizen',
            r'^\s*[-*]\s+.*non-eu\s+citizen',
            # Clear conditional statements
            r'if\s+you\s+are\s+(an?\s+)?eu\s+citizen',
            r'if\s+you\s+are\s+(a\s+)?non-eu\s+citizen',
        ]
        
        pattern_matches = sum(1 for pattern in patterns if re.search(pattern, content_lower, re.MULTILINE))
        
        return pattern_matches >= 2
    
    def _assess_context_quality(self, ref: Dict[str, Any], lines: List[str]) -> str:
        """
        Assess the quality of context around a citizenship reference.
        
        Args:
            ref: Citizenship reference
            lines: All lines in the document
            
        Returns:
            'good', 'unclear', or 'neutral'
        """
        line_num = ref['line'] - 1  # Convert to 0-based index
        
        # Get context lines (2 before and after)
        start_line = max(0, line_num - 2)
        end_line = min(len(lines), line_num + 3)
        context_lines = lines[start_line:end_line]
        context = '\n'.join(context_lines).lower()
        
        # Good context indicators
        good_indicators = [
            'requirements', 'eligibility', 'documents needed', 'application process',
            'steps', 'procedure', 'how to', 'must', 'need to', 'required'
        ]
        
        # Unclear context indicators
        unclear_indicators = [
            'may', 'might', 'sometimes', 'generally', 'usually', 'typically'
        ]
        
        good_count = sum(1 for indicator in good_indicators if indicator in context)
        unclear_count = sum(1 for indicator in unclear_indicators if indicator in context)
        
        if good_count >= 2:
            return 'good'
        elif unclear_count >= 1:
            return 'unclear'
        else:
            return 'neutral'
    
    def _check_best_practices(self, content: str, citizenship_refs: List[Dict[str, Any]]) -> List[str]:
        """
        Check for citizenship distinction best practices.
        
        Args:
            content: Full document content
            citizenship_refs: List of citizenship references
            
        Returns:
            List of best practice warnings
        """
        warnings = []
        
        # Check for metadata audience specification
        if citizenship_refs and 'audience:' not in content.lower():
            warnings.append("Consider adding 'audience' metadata to specify which citizenship types this document applies to")
        
        # Check for "Applies to" section
        if citizenship_refs and 'applies to' not in content.lower():
            warnings.append("Consider adding an 'Applies to' section to clearly specify citizenship requirements")
        
        # Check for balanced coverage
        eu_mentions = sum(1 for ref in citizenship_refs if 'eu' in ref['text'].lower())
        non_eu_mentions = sum(1 for ref in citizenship_refs if 'non-eu' in ref['text'].lower())
        
        if eu_mentions > 0 and non_eu_mentions == 0:
            warnings.append("Document mentions EU citizens but not Non-EU citizens - consider if both need coverage")
        elif non_eu_mentions > 0 and eu_mentions == 0:
            warnings.append("Document mentions Non-EU citizens but not EU citizens - consider if both need coverage")
        
        # Check for clear headings
        has_clear_headings = any(
            re.search(r'#{2,6}\s+(for\s+)?(eu|non-eu)\s+citizen', content, re.IGNORECASE)
            for ref in citizenship_refs
        )
        
        if len(citizenship_refs) > 3 and not has_clear_headings:
            warnings.append("Consider using clear subheadings to organize citizenship-specific information")
        
        return warnings
    
    def validate_directory(self, directory: Path, recursive: bool = True) -> Dict[str, Any]:
        """
        Validate citizenship distinctions in all markdown files in a directory.
        
        Args:
            directory: Directory to validate
            recursive: Whether to search subdirectories
            
        Returns:
            Dictionary containing validation results for all files
        """
        results = {
            'directory': str(directory),
            'files': [],
            'summary': {
                'total_files': 0,
                'citizenship_dependent_files': 0,
                'valid_files': 0,
                'invalid_files': 0,
                'files_with_good_distinctions': 0,
                'files_with_missing_distinctions': 0,
                'files_with_unclear_distinctions': 0,
                'total_citizenship_references': 0,
                'total_errors': 0,
                'total_warnings': 0
            }
        }
        
        # Find all markdown files
        pattern = '**/*.md' if recursive else '*.md'
        markdown_files = list(directory.glob(pattern))
        
        for file_path in markdown_files:
            if file_path.is_file():
                file_result = self.validate_file(file_path)
                results['files'].append(file_result)
                
                results['summary']['total_files'] += 1
                
                if file_result['has_citizenship_content']:
                    results['summary']['citizenship_dependent_files'] += 1
                    
                    if file_result['valid']:
                        results['summary']['valid_files'] += 1
                    else:
                        results['summary']['invalid_files'] += 1
                    
                    if file_result['good_distinctions']:
                        results['summary']['files_with_good_distinctions'] += 1
                    
                    if file_result['missing_distinctions']:
                        results['summary']['files_with_missing_distinctions'] += 1
                    
                    if file_result['unclear_distinctions']:
                        results['summary']['files_with_unclear_distinctions'] += 1
                    
                    results['summary']['total_citizenship_references'] += len(file_result['citizenship_references'])
                
                results['summary']['total_errors'] += len(file_result['errors'])
                results['summary']['total_warnings'] += len(file_result['warnings'])
        
        return results


def print_results(results: Dict[str, Any], verbose: bool = False):
    """
    Print validation results in a readable format.
    
    Args:
        results: Validation results dictionary
        verbose: Whether to show detailed output
    """
    summary = results['summary']
    
    print(f"\n=== Citizenship Distinction Validation Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Citizenship-dependent files: {summary['citizenship_dependent_files']}")
    print(f"Valid citizenship distinctions: {summary['valid_files']}")
    print(f"Invalid citizenship distinctions: {summary['invalid_files']}")
    print(f"Files with good distinctions: {summary['files_with_good_distinctions']}")
    print(f"Files with missing distinctions: {summary['files_with_missing_distinctions']}")
    print(f"Files with unclear distinctions: {summary['files_with_unclear_distinctions']}")
    print(f"Total citizenship references: {summary['total_citizenship_references']}")
    print(f"Total errors: {summary['total_errors']}")
    print(f"Total warnings: {summary['total_warnings']}")
    
    if summary['invalid_files'] > 0 or verbose:
        print(f"\n=== File Details ===")
        
        for file_result in results['files']:
            if (not file_result['valid'] and file_result['has_citizenship_content']) or (verbose and file_result['has_citizenship_content']):
                print(f"\nFile: {file_result['file']}")
                print(f"Has citizenship content: {'Yes' if file_result['has_citizenship_content'] else 'No'}")
                print(f"Status: {'✓ Valid' if file_result['valid'] else '✗ Invalid'}")
                print(f"Citizenship references: {len(file_result['citizenship_references'])}")
                
                if verbose and file_result['citizenship_references']:
                    print("Citizenship references found:")
                    for ref in file_result['citizenship_references']:
                        print(f"  Line {ref['line']}: {ref['text']} ({ref['type']})")
                
                if file_result['good_distinctions']:
                    print(f"Good distinctions: {len(file_result['good_distinctions'])}")
                    if verbose:
                        for distinction in file_result['good_distinctions']:
                            print(f"  ✓ Line {distinction['line']}: {distinction['text']}")
                
                if file_result['missing_distinctions']:
                    print(f"Missing distinctions: {len(file_result['missing_distinctions'])}")
                    if verbose:
                        for missing in file_result['missing_distinctions']:
                            print(f"  ✗ Section '{missing['section']}': {missing['reason']}")
                
                if file_result['unclear_distinctions']:
                    print(f"Unclear distinctions: {len(file_result['unclear_distinctions'])}")
                    if verbose:
                        for unclear in file_result['unclear_distinctions']:
                            print(f"  ? Line {unclear['line']}: {unclear['issue']}")
                
                if file_result['errors']:
                    print("Errors:")
                    for error in file_result['errors']:
                        print(f"  - {error}")
                
                if file_result['warnings'] and verbose:
                    print("Warnings:")
                    for warning in file_result['warnings']:
                        print(f"  - {warning}")


def main():
    """Main function to run the citizenship distinction validator."""
    parser = argparse.ArgumentParser(description='Validate citizenship distinctions in Denmark Living Documentation System')
    parser.add_argument('path', help='Path to markdown file or directory to validate')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including all citizenship references')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    validator = CitizenshipDistinctionValidator()
    
    if not path.exists():
        print(f"Error: Path '{path}' does not exist")
        sys.exit(1)
    
    if path.is_file():
        # Validate single file
        result = validator.validate_file(path)
        results = {
            'directory': str(path.parent),
            'files': [result],
            'summary': {
                'total_files': 1,
                'citizenship_dependent_files': 1 if result['has_citizenship_content'] else 0,
                'valid_files': 1 if result['has_citizenship_content'] and result['valid'] else 0,
                'invalid_files': 1 if result['has_citizenship_content'] and not result['valid'] else 0,
                'files_with_good_distinctions': 1 if result['good_distinctions'] else 0,
                'files_with_missing_distinctions': 1 if result['missing_distinctions'] else 0,
                'files_with_unclear_distinctions': 1 if result['unclear_distinctions'] else 0,
                'total_citizenship_references': len(result['citizenship_references']),
                'total_errors': len(result['errors']),
                'total_warnings': len(result['warnings'])
            }
        }
    else:
        # Validate directory
        results = validator.validate_directory(path, recursive=not args.no_recursive)
    
    print_results(results, verbose=args.verbose)
    
    # Exit with error code if validation failed
    if results['summary']['invalid_files'] > 0:
        sys.exit(1)


if __name__ == '__main__':
    main()