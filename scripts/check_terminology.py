#!/usr/bin/env python3
"""
Terminology Consistency Checker for Denmark Living Documentation System

This script validates terminology consistency across documents by:
- Extracting term usage across all documents
- Comparing against glossary definitions
- Reporting inconsistencies in term usage
- Identifying potential terminology conflicts

Requirements: 8.4
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any, Set
import argparse
from collections import defaultdict, Counter


class TerminologyConsistencyChecker:
    """Checks terminology consistency across documentation."""
    
    def __init__(self, glossary_path: Optional[Path] = None):
        self.glossary_terms = {}
        self.term_usage = defaultdict(list)  # term -> list of usage instances
        self.term_variations = defaultdict(set)  # canonical term -> set of variations found
        self.errors = []
        self.warnings = []
        
        # Load glossary if provided
        if glossary_path and glossary_path.exists():
            self.glossary_terms = self._load_glossary(glossary_path)
    
    def _load_glossary(self, glossary_path: Path) -> Dict[str, Dict[str, str]]:
        """
        Load terms and their canonical definitions from the glossary.
        
        Args:
            glossary_path: Path to the glossary.md file
            
        Returns:
            Dictionary mapping canonical terms to their information
        """
        glossary_terms = {}
        
        try:
            with open(glossary_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse glossary entries
            current_term = None
            current_info = {}
            
            lines = content.split('\n')
            for line in lines:
                line = line.strip()
                
                # Check for term heading (### Term)
                if line.startswith('### ') and not line.startswith('#### '):
                    # Save previous term
                    if current_term and current_info:
                        # Store both the original term and lowercase version
                        glossary_terms[current_term.lower()] = current_info
                        glossary_terms[current_term] = current_info
                    
                    # Start new term
                    current_term = line[4:].strip()
                    current_info = {
                        'canonical_term': current_term,
                        'term_lower': current_term.lower()
                    }
                
                # Check for English translation
                elif line.startswith('**English**:'):
                    english = line[12:].strip()
                    current_info['english'] = english
                    # Also store English term as a variation
                    glossary_terms[english.lower()] = current_info
                
                # Check for definition
                elif line.startswith('**Definition**:'):
                    definition = line[15:].strip()
                    current_info['definition'] = definition
            
            # Save last term
            if current_term and current_info:
                glossary_terms[current_term.lower()] = current_info
                glossary_terms[current_term] = current_info
        
        except Exception as e:
            print(f"Warning: Could not load glossary from {glossary_path}: {e}")
        
        return glossary_terms
    
    def analyze_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Analyze terminology usage in a single file.
        
        Args:
            file_path: Path to the markdown file
            
        Returns:
            Dictionary containing analysis results
        """
        result = {
            'file': str(file_path),
            'terms_found': [],
            'potential_inconsistencies': [],
            'glossary_mismatches': []
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract terms from content
            terms = self._extract_terms(content, file_path)
            result['terms_found'] = terms
            
            # Check for potential inconsistencies within the file
            inconsistencies = self._check_file_consistency(terms)
            result['potential_inconsistencies'] = inconsistencies
            
            # Check against glossary
            if self.glossary_terms:
                mismatches = self._check_glossary_consistency(terms)
                result['glossary_mismatches'] = mismatches
            
            # Update global term usage tracking
            self._update_term_usage(terms, file_path)
            
        except Exception as e:
            result['error'] = f"Failed to read file: {str(e)}"
        
        return result
    
    def _extract_terms(self, content: str, file_path: Path) -> List[Dict[str, Any]]:
        """
        Extract terminology from content.
        
        Args:
            content: Markdown content
            file_path: Path to the file
            
        Returns:
            List of terms found with context
        """
        terms = []
        lines = content.split('\n')
        
        # Patterns to identify terms
        patterns = [
            # Bolded terms (likely important terminology)
            (re.compile(r'\*\*([^*]+)\*\*'), 'bolded'),
            # Terms in quotes
            (re.compile(r'"([^"]+)"'), 'quoted'),
            # Terms with translations: Term (English)
            (re.compile(r'\b([A-ZÆØÅ][a-zæøå-]+(?:\s+[a-zæøå-]+)*)\s*\(([^)]+)\)'), 'with_translation'),
            # Known glossary terms (if glossary is loaded)
        ]
        
        # Add glossary terms pattern if available
        if self.glossary_terms:
            glossary_keys = [term for term in self.glossary_terms.keys() if len(term) > 2]
            if glossary_keys:
                # Sort by length (longest first) to avoid partial matches
                glossary_keys.sort(key=len, reverse=True)
                escaped_terms = [re.escape(term) for term in glossary_keys]
                glossary_pattern = re.compile(r'\b(' + '|'.join(escaped_terms) + r')\b', re.IGNORECASE)
                patterns.append((glossary_pattern, 'glossary_term'))
        
        for line_num, line in enumerate(lines, 1):
            # Skip code blocks, links, and metadata
            if (line.strip().startswith('```') or 
                line.strip().startswith('http') or
                line.strip().startswith('---') or
                line.strip().startswith('#')):
                continue
            
            for pattern, pattern_type in patterns:
                for match in pattern.finditer(line):
                    if pattern_type == 'with_translation':
                        term = match.group(1).strip()
                        translation = match.group(2).strip()
                        
                        terms.append({
                            'term': term,
                            'normalized_term': self._normalize_term(term),
                            'translation': translation,
                            'line': line_num,
                            'context': line.strip(),
                            'pattern_type': pattern_type,
                            'file': str(file_path)
                        })
                    else:
                        term = match.group(1).strip()
                        
                        # Filter out very short terms or common words
                        if len(term) < 3 or term.lower() in {'the', 'and', 'for', 'you', 'are', 'can', 'will', 'this', 'that'}:
                            continue
                        
                        terms.append({
                            'term': term,
                            'normalized_term': self._normalize_term(term),
                            'translation': None,
                            'line': line_num,
                            'context': line.strip(),
                            'pattern_type': pattern_type,
                            'file': str(file_path)
                        })
        
        return terms
    
    def _normalize_term(self, term: str) -> str:
        """
        Normalize a term for comparison purposes.
        
        Args:
            term: Original term
            
        Returns:
            Normalized term
        """
        # Convert to lowercase, remove extra whitespace, remove punctuation
        normalized = re.sub(r'[^\w\s-]', '', term.lower())
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        
        # Handle common variations
        variations = {
            'cpr number': 'cpr-nummer',
            'civil registration number': 'cpr-nummer',
            'personal identification number': 'cpr-nummer',
            'tax card': 'skattekort',
            'health insurance card': 'sundhedskort',
            'yellow card': 'sundhedskort',
            'unemployment benefits': 'dagpenge',
            'housing benefits': 'boligstøtte',
            'child benefits': 'børnepenge',
            'general practitioner': 'gp',
            'family doctor': 'gp',
        }
        
        return variations.get(normalized, normalized)
    
    def _check_file_consistency(self, terms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Check for terminology inconsistencies within a single file.
        
        Args:
            terms: List of terms found in the file
            
        Returns:
            List of potential inconsistencies
        """
        inconsistencies = []
        
        # Group terms by normalized form
        term_groups = defaultdict(list)
        for term in terms:
            term_groups[term['normalized_term']].append(term)
        
        # Check for variations of the same concept
        for normalized_term, instances in term_groups.items():
            if len(instances) > 1:
                # Get unique surface forms
                surface_forms = set(instance['term'] for instance in instances)
                
                if len(surface_forms) > 1:
                    # Multiple ways of referring to the same concept
                    inconsistencies.append({
                        'normalized_term': normalized_term,
                        'variations': list(surface_forms),
                        'instances': instances,
                        'type': 'multiple_forms'
                    })
        
        return inconsistencies
    
    def _check_glossary_consistency(self, terms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Check terms against glossary definitions.
        
        Args:
            terms: List of terms found in the file
            
        Returns:
            List of glossary mismatches
        """
        mismatches = []
        
        for term_info in terms:
            term = term_info['term']
            normalized = term_info['normalized_term']
            
            # Check if term exists in glossary
            glossary_match = None
            for glossary_key, glossary_info in self.glossary_terms.items():
                if (glossary_key.lower() == term.lower() or 
                    glossary_key.lower() == normalized or
                    glossary_info.get('english', '').lower() == term.lower()):
                    glossary_match = glossary_info
                    break
            
            if glossary_match:
                canonical_term = glossary_match['canonical_term']
                
                # Check if the term used matches the canonical form
                if term != canonical_term and term.lower() != canonical_term.lower():
                    # Check if it's the English translation
                    english_translation = glossary_match.get('english', '')
                    if term != english_translation:
                        mismatches.append({
                            'found_term': term,
                            'canonical_term': canonical_term,
                            'english_translation': english_translation,
                            'line': term_info['line'],
                            'context': term_info['context'],
                            'type': 'non_canonical_form'
                        })
        
        return mismatches
    
    def _update_term_usage(self, terms: List[Dict[str, Any]], file_path: Path):
        """
        Update global term usage tracking.
        
        Args:
            terms: List of terms found in the file
            file_path: Path to the file
        """
        for term_info in terms:
            normalized = term_info['normalized_term']
            self.term_usage[normalized].append({
                'term': term_info['term'],
                'file': str(file_path),
                'line': term_info['line'],
                'context': term_info['context']
            })
            
            # Track variations
            self.term_variations[normalized].add(term_info['term'])
    
    def analyze_directory(self, directory: Path, recursive: bool = True, glossary_path: Optional[Path] = None) -> Dict[str, Any]:
        """
        Analyze terminology consistency across all files in a directory.
        
        Args:
            directory: Directory to analyze
            recursive: Whether to search subdirectories
            glossary_path: Path to glossary file (if not provided in constructor)
            
        Returns:
            Dictionary containing analysis results
        """
        # Load glossary if provided and not already loaded
        if glossary_path and not self.glossary_terms:
            self.glossary_terms = self._load_glossary(glossary_path)
        
        # Reset tracking for directory analysis
        self.term_usage.clear()
        self.term_variations.clear()
        
        results = {
            'directory': str(directory),
            'glossary_loaded': bool(self.glossary_terms),
            'glossary_terms_count': len(self.glossary_terms),
            'files': [],
            'global_inconsistencies': [],
            'summary': {
                'total_files': 0,
                'files_with_terms': 0,
                'total_terms': 0,
                'unique_normalized_terms': 0,
                'terms_with_variations': 0,
                'total_file_inconsistencies': 0,
                'total_glossary_mismatches': 0
            }
        }
        
        # Find all markdown files
        pattern = '**/*.md' if recursive else '*.md'
        markdown_files = list(directory.glob(pattern))
        
        # Analyze each file
        for file_path in markdown_files:
            if file_path.is_file():
                file_result = self.analyze_file(file_path)
                results['files'].append(file_result)
                
                results['summary']['total_files'] += 1
                
                if file_result['terms_found']:
                    results['summary']['files_with_terms'] += 1
                    results['summary']['total_terms'] += len(file_result['terms_found'])
                
                results['summary']['total_file_inconsistencies'] += len(file_result.get('potential_inconsistencies', []))
                results['summary']['total_glossary_mismatches'] += len(file_result.get('glossary_mismatches', []))
        
        # Analyze global consistency
        global_inconsistencies = self._analyze_global_consistency()
        results['global_inconsistencies'] = global_inconsistencies
        
        # Update summary
        results['summary']['unique_normalized_terms'] = len(self.term_usage)
        results['summary']['terms_with_variations'] = len([
            term for term, variations in self.term_variations.items() 
            if len(variations) > 1
        ])
        
        return results
    
    def _analyze_global_consistency(self) -> List[Dict[str, Any]]:
        """
        Analyze terminology consistency across all files.
        
        Returns:
            List of global inconsistencies
        """
        inconsistencies = []
        
        # Check for terms with multiple variations across files
        for normalized_term, variations in self.term_variations.items():
            if len(variations) > 1:
                # Get usage statistics
                usage_stats = Counter()
                file_usage = defaultdict(set)
                
                for usage in self.term_usage[normalized_term]:
                    usage_stats[usage['term']] += 1
                    file_usage[usage['term']].add(usage['file'])
                
                # Determine if this is a real inconsistency
                most_common_term = usage_stats.most_common(1)[0][0]
                
                # Check if there's a clear canonical form from glossary
                canonical_term = None
                if self.glossary_terms:
                    for variation in variations:
                        if variation.lower() in self.glossary_terms:
                            canonical_term = self.glossary_terms[variation.lower()].get('canonical_term')
                            break
                
                inconsistencies.append({
                    'normalized_term': normalized_term,
                    'variations': list(variations),
                    'usage_stats': dict(usage_stats),
                    'most_common': most_common_term,
                    'canonical_term': canonical_term,
                    'file_usage': {term: list(files) for term, files in file_usage.items()},
                    'total_usage': sum(usage_stats.values()),
                    'type': 'global_variation'
                })
        
        # Sort by total usage (most used terms first)
        inconsistencies.sort(key=lambda x: x['total_usage'], reverse=True)
        
        return inconsistencies


def print_results(results: Dict[str, Any], verbose: bool = False):
    """
    Print analysis results in a readable format.
    
    Args:
        results: Analysis results dictionary
        verbose: Whether to show detailed output
    """
    summary = results['summary']
    
    print(f"\n=== Terminology Consistency Analysis Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Glossary loaded: {'Yes' if results['glossary_loaded'] else 'No'}")
    if results['glossary_loaded']:
        print(f"Glossary terms: {results['glossary_terms_count']}")
    print(f"Total files analyzed: {summary['total_files']}")
    print(f"Files with terms: {summary['files_with_terms']}")
    print(f"Total terms found: {summary['total_terms']}")
    print(f"Unique normalized terms: {summary['unique_normalized_terms']}")
    print(f"Terms with variations: {summary['terms_with_variations']}")
    print(f"File-level inconsistencies: {summary['total_file_inconsistencies']}")
    print(f"Glossary mismatches: {summary['total_glossary_mismatches']}")
    
    # Show global inconsistencies
    if results['global_inconsistencies']:
        print(f"\n=== Global Terminology Inconsistencies ===")
        
        for inconsistency in results['global_inconsistencies'][:10]:  # Show top 10
            print(f"\nTerm: {inconsistency['normalized_term']}")
            print(f"Variations found: {', '.join(inconsistency['variations'])}")
            print(f"Usage statistics:")
            for term, count in inconsistency['usage_stats'].items():
                files = inconsistency['file_usage'][term]
                print(f"  '{term}': {count} times in {len(files)} files")
            
            if inconsistency['canonical_term']:
                print(f"Canonical form (from glossary): {inconsistency['canonical_term']}")
            else:
                print(f"Most common form: {inconsistency['most_common']}")
    
    # Show file details if verbose or if there are issues
    if verbose or summary['total_file_inconsistencies'] > 0 or summary['total_glossary_mismatches'] > 0:
        print(f"\n=== File Details ===")
        
        for file_result in results['files']:
            if (file_result.get('potential_inconsistencies') or 
                file_result.get('glossary_mismatches') or 
                verbose):
                
                print(f"\nFile: {file_result['file']}")
                print(f"Terms found: {len(file_result.get('terms_found', []))}")
                
                if file_result.get('potential_inconsistencies'):
                    print("File inconsistencies:")
                    for inconsistency in file_result['potential_inconsistencies']:
                        print(f"  - {inconsistency['normalized_term']}: {', '.join(inconsistency['variations'])}")
                
                if file_result.get('glossary_mismatches'):
                    print("Glossary mismatches:")
                    for mismatch in file_result['glossary_mismatches']:
                        print(f"  - Line {mismatch['line']}: '{mismatch['found_term']}' should be '{mismatch['canonical_term']}'")


def main():
    """Main function to run the terminology consistency checker."""
    parser = argparse.ArgumentParser(description='Check terminology consistency in Denmark Living Documentation System')
    parser.add_argument('path', help='Path to markdown file or directory to analyze')
    parser.add_argument('--glossary', '-g', help='Path to glossary.md file for term validation')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including all terms found')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    glossary_path = Path(args.glossary) if args.glossary else None
    
    # Try to find glossary automatically if not provided
    if not glossary_path:
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
    
    checker = TerminologyConsistencyChecker(glossary_path)
    
    if not path.exists():
        print(f"Error: Path '{path}' does not exist")
        sys.exit(1)
    
    if path.is_file():
        # Analyze single file
        result = checker.analyze_file(path)
        results = {
            'directory': str(path.parent),
            'glossary_loaded': bool(checker.glossary_terms),
            'glossary_terms_count': len(checker.glossary_terms),
            'files': [result],
            'global_inconsistencies': [],
            'summary': {
                'total_files': 1,
                'files_with_terms': 1 if result['terms_found'] else 0,
                'total_terms': len(result['terms_found']),
                'unique_normalized_terms': len(set(term['normalized_term'] for term in result['terms_found'])),
                'terms_with_variations': 0,  # Can't determine from single file
                'total_file_inconsistencies': len(result.get('potential_inconsistencies', [])),
                'total_glossary_mismatches': len(result.get('glossary_mismatches', []))
            }
        }
    else:
        # Analyze directory
        results = checker.analyze_directory(path, recursive=not args.no_recursive, glossary_path=glossary_path)
    
    print_results(results, verbose=args.verbose)
    
    # Exit with warning if significant inconsistencies found
    if (results['summary']['total_file_inconsistencies'] > 0 or 
        results['summary']['total_glossary_mismatches'] > 0 or
        len(results['global_inconsistencies']) > 0):
        print(f"\nWarning: Terminology inconsistencies found. Consider reviewing and standardizing term usage.")
        sys.exit(1)


if __name__ == '__main__':
    main()