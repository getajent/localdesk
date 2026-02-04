#!/usr/bin/env python3
"""
Danish Term Validator for Denmark Living Documentation System

This script validates Danish terms in documents for:
- Identification of Danish terms in documents
- Verification that English translations follow in parentheses
- Cross-checking against glossary definitions
- Consistency of term usage across documents

Requirements: 8.2
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any, Set
import argparse


class DanishTermValidator:
    """Validates Danish terms and their English translations in documentation."""
    
    def __init__(self, glossary_path: Optional[Path] = None):
        self.glossary_terms = {}
        self.errors = []
        self.warnings = []
        
        # Load glossary if provided
        if glossary_path and glossary_path.exists():
            self.glossary_terms = self._load_glossary(glossary_path)
    
    def _load_glossary(self, glossary_path: Path) -> Dict[str, Dict[str, str]]:
        """
        Load Danish terms and their translations from the glossary.
        
        Args:
            glossary_path: Path to the glossary.md file
            
        Returns:
            Dictionary mapping Danish terms to their information
        """
        glossary_terms = {}
        
        try:
            with open(glossary_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse glossary entries
            # Look for pattern: ### Danish Term followed by **English**: translation
            current_term = None
            current_info = {}
            
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                
                # Check for term heading (### Term)
                if line.startswith('### ') and not line.startswith('### '):
                    # Save previous term
                    if current_term and current_info:
                        glossary_terms[current_term.lower()] = current_info
                    
                    # Start new term
                    current_term = line[4:].strip()
                    current_info = {'term': current_term}
                
                # Check for English translation
                elif line.startswith('**English**:'):
                    english = line[12:].strip()
                    current_info['english'] = english
                
                # Check for pronunciation
                elif line.startswith('**Pronunciation**:'):
                    pronunciation = line[18:].strip()
                    current_info['pronunciation'] = pronunciation
                
                # Check for definition
                elif line.startswith('**Definition**:'):
                    definition = line[15:].strip()
                    current_info['definition'] = definition
            
            # Save last term
            if current_term and current_info:
                glossary_terms[current_term.lower()] = current_info
        
        except Exception as e:
            print(f"Warning: Could not load glossary from {glossary_path}: {e}")
        
        return glossary_terms
    
    def validate_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Validate Danish terms and translations in a single markdown file.
        
        Args:
            file_path: Path to the markdown file
            
        Returns:
            Dictionary containing validation results
        """
        result = {
            'file': str(file_path),
            'valid': True,
            'errors': [],
            'warnings': [],
            'danish_terms_found': [],
            'missing_translations': [],
            'inconsistent_translations': [],
            'unknown_terms': []
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find Danish terms in the content
            danish_terms = self._find_danish_terms(content)
            result['danish_terms_found'] = danish_terms
            
            # Validate translations
            missing_translations = self._validate_translations(content, danish_terms)
            result['missing_translations'] = missing_translations
            
            # Check consistency with glossary
            if self.glossary_terms:
                inconsistent, unknown = self._check_glossary_consistency(danish_terms)
                result['inconsistent_translations'] = inconsistent
                result['unknown_terms'] = unknown
            
            # Compile errors and warnings
            if missing_translations:
                result['errors'].extend([
                    f"Line {item['line']}: Danish term '{item['term']}' missing English translation"
                    for item in missing_translations
                ])
            
            if result['inconsistent_translations']:
                result['errors'].extend([
                    f"Line {item['line']}: Translation for '{item['term']}' ('{item['found_translation']}') "
                    f"differs from glossary ('{item['expected_translation']}')"
                    for item in result['inconsistent_translations']
                ])
            
            if result['unknown_terms']:
                result['warnings'].extend([
                    f"Line {item['line']}: Danish term '{item['term']}' not found in glossary"
                    for item in result['unknown_terms']
                ])
            
            if result['errors']:
                result['valid'] = False
                
        except Exception as e:
            result['valid'] = False
            result['errors'].append(f"Failed to read file: {str(e)}")
        
        return result
    
    def _find_danish_terms(self, content: str) -> List[Dict[str, Any]]:
        """
        Find Danish terms in the content using various patterns.
        
        Args:
            content: Markdown content
            
        Returns:
            List of Danish terms found with their locations
        """
        danish_terms = []
        lines = content.split('\n')
        
        # Pattern 1: **Danish term** (English translation)
        pattern1 = re.compile(r'\*\*([^*]+)\*\*\s*\(([^)]+)\)', re.IGNORECASE)
        
        # Pattern 2: Danish term (English translation) - for terms that might not be bolded
        pattern2 = re.compile(r'\b([A-ZÆØÅ][a-zæøå-]+(?:\s+[a-zæøå-]+)*)\s*\(([^)]+)\)', re.UNICODE)
        
        # Pattern 3: Known Danish terms from glossary (if available)
        glossary_pattern = None
        if self.glossary_terms:
            # Create pattern for known Danish terms
            known_terms = list(self.glossary_terms.keys())
            if known_terms:
                # Escape special regex characters and sort by length (longest first)
                escaped_terms = [re.escape(term) for term in known_terms]
                escaped_terms.sort(key=len, reverse=True)
                glossary_pattern = re.compile(r'\b(' + '|'.join(escaped_terms) + r')\b', re.IGNORECASE)
        
        for line_num, line in enumerate(lines, 1):
            # Find bolded terms with translations
            for match in pattern1.finditer(line):
                danish_term = match.group(1).strip()
                english_translation = match.group(2).strip()
                
                if self._looks_danish(danish_term):
                    danish_terms.append({
                        'term': danish_term,
                        'translation': english_translation,
                        'line': line_num,
                        'pattern': 'bolded_with_translation',
                        'context': line.strip()
                    })
            
            # Find unbolded terms with translations
            for match in pattern2.finditer(line):
                danish_term = match.group(1).strip()
                english_translation = match.group(2).strip()
                
                # Skip if already found as bolded term
                already_found = any(
                    term['term'].lower() == danish_term.lower() and term['line'] == line_num
                    for term in danish_terms
                )
                
                if not already_found and self._looks_danish(danish_term):
                    danish_terms.append({
                        'term': danish_term,
                        'translation': english_translation,
                        'line': line_num,
                        'pattern': 'unbolded_with_translation',
                        'context': line.strip()
                    })
            
            # Find known glossary terms without translations
            if glossary_pattern:
                for match in glossary_pattern.finditer(line):
                    danish_term = match.group(1).strip()
                    
                    # Check if this term already has a translation in this line
                    has_translation = (
                        f'({danish_term})' in line or
                        f'**{danish_term}**' in line or
                        any(term['term'].lower() == danish_term.lower() and term['line'] == line_num
                            for term in danish_terms)
                    )
                    
                    if not has_translation:
                        danish_terms.append({
                            'term': danish_term,
                            'translation': None,
                            'line': line_num,
                            'pattern': 'glossary_term_no_translation',
                            'context': line.strip()
                        })
        
        return danish_terms
    
    def _looks_danish(self, term: str) -> bool:
        """
        Determine if a term looks like it could be Danish.
        
        Args:
            term: Term to check
            
        Returns:
            True if term appears to be Danish
        """
        # Danish characteristics
        danish_chars = set('æøåÆØÅ')
        
        # Check for Danish characters
        if any(char in danish_chars for char in term):
            return True
        
        # Check for common Danish word patterns
        danish_patterns = [
            r'.*-nummer$',  # CPR-nummer, etc.
            r'.*kort$',     # skattekort, sundhedskort, etc.
            r'.*skat$',     # bundskat, topskat, etc.
            r'.*støtte$',   # boligstøtte, etc.
            r'.*penge$',    # børnepenge, dagpenge, etc.
            r'.*konto$',    # nemkonto, etc.
            r'.*bidrag$',   # AM-bidrag, etc.
            r'.*forsikring$', # indboforsikring, etc.
        ]
        
        term_lower = term.lower()
        if any(re.match(pattern, term_lower) for pattern in danish_patterns):
            return True
        
        # Check against known Danish words (common ones)
        danish_words = {
            'borger', 'skat', 'kommune', 'arbejde', 'bolig', 'sundhed',
            'pension', 'dagpenge', 'kontanthjælp', 'barsel', 'mitid',
            'nemkonto', 'lejekontrakt', 'depositum', 'moms', 'årsopgørelse'
        }
        
        if term_lower in danish_words:
            return True
        
        # Check for compound words (common in Danish)
        if '-' in term and len(term) > 5:
            return True
        
        return False
    
    def _validate_translations(self, content: str, danish_terms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Validate that Danish terms have English translations.
        
        Args:
            content: Full document content
            danish_terms: List of Danish terms found
            
        Returns:
            List of terms missing translations
        """
        missing_translations = []
        
        for term_info in danish_terms:
            if term_info['translation'] is None:
                # Check if translation appears elsewhere in the document
                term = term_info['term']
                
                # Look for translation patterns in the document
                translation_patterns = [
                    rf'\*\*{re.escape(term)}\*\*\s*\([^)]+\)',
                    rf'{re.escape(term)}\s*\([^)]+\)',
                    rf'{re.escape(term)}.*?english[:\s]+([^.\n]+)',
                ]
                
                has_translation_elsewhere = any(
                    re.search(pattern, content, re.IGNORECASE)
                    for pattern in translation_patterns
                )
                
                if not has_translation_elsewhere:
                    missing_translations.append({
                        'term': term,
                        'line': term_info['line'],
                        'context': term_info['context']
                    })
        
        return missing_translations
    
    def _check_glossary_consistency(self, danish_terms: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Check consistency of translations against the glossary.
        
        Args:
            danish_terms: List of Danish terms found in document
            
        Returns:
            Tuple of (inconsistent_translations, unknown_terms)
        """
        inconsistent = []
        unknown = []
        
        for term_info in danish_terms:
            term = term_info['term'].lower()
            found_translation = term_info.get('translation')
            
            if term in self.glossary_terms:
                expected_translation = self.glossary_terms[term].get('english', '').lower()
                
                if found_translation and expected_translation:
                    # Normalize translations for comparison
                    found_normalized = found_translation.lower().strip()
                    expected_normalized = expected_translation.lower().strip()
                    
                    # Allow for minor variations
                    if not self._translations_match(found_normalized, expected_normalized):
                        inconsistent.append({
                            'term': term_info['term'],
                            'found_translation': found_translation,
                            'expected_translation': self.glossary_terms[term]['english'],
                            'line': term_info['line'],
                            'context': term_info['context']
                        })
            else:
                # Term not in glossary
                if found_translation:  # Only report if it has a translation
                    unknown.append({
                        'term': term_info['term'],
                        'translation': found_translation,
                        'line': term_info['line'],
                        'context': term_info['context']
                    })
        
        return inconsistent, unknown
    
    def _translations_match(self, found: str, expected: str) -> bool:
        """
        Check if two translations are equivalent, allowing for minor variations.
        
        Args:
            found: Translation found in document
            expected: Expected translation from glossary
            
        Returns:
            True if translations are considered equivalent
        """
        # Exact match
        if found == expected:
            return True
        
        # Remove common variations
        def normalize(text):
            # Remove articles, common words, punctuation
            text = re.sub(r'\b(the|a|an|and|or)\b', '', text)
            text = re.sub(r'[^\w\s]', '', text)
            text = re.sub(r'\s+', ' ', text).strip()
            return text
        
        found_norm = normalize(found)
        expected_norm = normalize(expected)
        
        if found_norm == expected_norm:
            return True
        
        # Check if one is contained in the other (for longer vs shorter forms)
        if found_norm in expected_norm or expected_norm in found_norm:
            return True
        
        # Check for common synonyms
        synonyms = {
            'civil registration number': 'personal identification number',
            'unemployment benefits': 'unemployment insurance',
            'housing benefits': 'housing support',
            'tax card': 'tax deduction card',
        }
        
        for syn1, syn2 in synonyms.items():
            if (found_norm == syn1 and expected_norm == syn2) or (found_norm == syn2 and expected_norm == syn1):
                return True
        
        return False
    
    def validate_directory(self, directory: Path, recursive: bool = True, glossary_path: Optional[Path] = None) -> Dict[str, Any]:
        """
        Validate Danish terms in all markdown files in a directory.
        
        Args:
            directory: Directory to validate
            recursive: Whether to search subdirectories
            glossary_path: Path to glossary file (if not provided in constructor)
            
        Returns:
            Dictionary containing validation results for all files
        """
        # Load glossary if provided and not already loaded
        if glossary_path and not self.glossary_terms:
            self.glossary_terms = self._load_glossary(glossary_path)
        
        results = {
            'directory': str(directory),
            'glossary_loaded': bool(self.glossary_terms),
            'glossary_terms_count': len(self.glossary_terms),
            'files': [],
            'summary': {
                'total_files': 0,
                'valid_files': 0,
                'invalid_files': 0,
                'files_with_danish_terms': 0,
                'total_danish_terms': 0,
                'total_missing_translations': 0,
                'total_inconsistent_translations': 0,
                'total_unknown_terms': 0,
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
                if file_result['valid']:
                    results['summary']['valid_files'] += 1
                else:
                    results['summary']['invalid_files'] += 1
                
                if file_result['danish_terms_found']:
                    results['summary']['files_with_danish_terms'] += 1
                    results['summary']['total_danish_terms'] += len(file_result['danish_terms_found'])
                
                results['summary']['total_missing_translations'] += len(file_result['missing_translations'])
                results['summary']['total_inconsistent_translations'] += len(file_result['inconsistent_translations'])
                results['summary']['total_unknown_terms'] += len(file_result['unknown_terms'])
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
    
    print(f"\n=== Danish Term Translation Validation Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Glossary loaded: {'Yes' if results['glossary_loaded'] else 'No'}")
    if results['glossary_loaded']:
        print(f"Glossary terms: {results['glossary_terms_count']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Valid files: {summary['valid_files']}")
    print(f"Invalid files: {summary['invalid_files']}")
    print(f"Files with Danish terms: {summary['files_with_danish_terms']}")
    print(f"Total Danish terms found: {summary['total_danish_terms']}")
    print(f"Missing translations: {summary['total_missing_translations']}")
    print(f"Inconsistent translations: {summary['total_inconsistent_translations']}")
    print(f"Unknown terms: {summary['total_unknown_terms']}")
    print(f"Total errors: {summary['total_errors']}")
    print(f"Total warnings: {summary['total_warnings']}")
    
    if summary['invalid_files'] > 0 or verbose:
        print(f"\n=== File Details ===")
        
        for file_result in results['files']:
            if not file_result['valid'] or (verbose and file_result['danish_terms_found']):
                print(f"\nFile: {file_result['file']}")
                print(f"Status: {'✓ Valid' if file_result['valid'] else '✗ Invalid'}")
                print(f"Danish terms found: {len(file_result['danish_terms_found'])}")
                
                if verbose and file_result['danish_terms_found']:
                    print("Danish terms:")
                    for term in file_result['danish_terms_found']:
                        translation = f" ({term['translation']})" if term['translation'] else " (no translation)"
                        print(f"  Line {term['line']}: {term['term']}{translation}")
                
                if file_result['errors']:
                    print("Errors:")
                    for error in file_result['errors']:
                        print(f"  - {error}")
                
                if file_result['warnings'] and verbose:
                    print("Warnings:")
                    for warning in file_result['warnings']:
                        print(f"  - {warning}")


def main():
    """Main function to run the Danish term validator."""
    parser = argparse.ArgumentParser(description='Validate Danish terms and translations in Denmark Living Documentation System')
    parser.add_argument('path', help='Path to markdown file or directory to validate')
    parser.add_argument('--glossary', '-g', help='Path to glossary.md file for term validation')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including all Danish terms found')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    glossary_path = Path(args.glossary) if args.glossary else None
    
    # Try to find glossary automatically if not provided
    if not glossary_path:
        # Look for glossary in common locations
        possible_glossary_paths = [
            path / 'docs' / 'denmark-living' / 'metadata' / 'glossary.md',
            path / 'metadata' / 'glossary.md',
            path.parent / 'docs' / 'denmark-living' / 'metadata' / 'glossary.md',
            Path('docs/denmark-living/metadata/glossary.md')
        ]
        
        for possible_path in possible_glossary_paths:
            if possible_path.exists():
                glossary_path = possible_path
                print(f"Found glossary at: {glossary_path}")
                break
    
    validator = DanishTermValidator(glossary_path)
    
    if not path.exists():
        print(f"Error: Path '{path}' does not exist")
        sys.exit(1)
    
    if path.is_file():
        # Validate single file
        result = validator.validate_file(path)
        results = {
            'directory': str(path.parent),
            'glossary_loaded': bool(validator.glossary_terms),
            'glossary_terms_count': len(validator.glossary_terms),
            'files': [result],
            'summary': {
                'total_files': 1,
                'valid_files': 1 if result['valid'] else 0,
                'invalid_files': 0 if result['valid'] else 1,
                'files_with_danish_terms': 1 if result['danish_terms_found'] else 0,
                'total_danish_terms': len(result['danish_terms_found']),
                'total_missing_translations': len(result['missing_translations']),
                'total_inconsistent_translations': len(result['inconsistent_translations']),
                'total_unknown_terms': len(result['unknown_terms']),
                'total_errors': len(result['errors']),
                'total_warnings': len(result['warnings'])
            }
        }
    else:
        # Validate directory
        results = validator.validate_directory(path, recursive=not args.no_recursive, glossary_path=glossary_path)
    
    print_results(results, verbose=args.verbose)
    
    # Exit with error code if validation failed
    if results['summary']['invalid_files'] > 0:
        sys.exit(1)


if __name__ == '__main__':
    main()