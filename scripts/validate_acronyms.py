#!/usr/bin/env python3
"""
Acronym Validator for Denmark Living Documentation System

This script validates acronyms in documents for:
- Identification of acronyms in documents
- Verification that definitions are provided on first use
- Consistency of acronym definitions across documents

Requirements: 8.3
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any, Set
import argparse


class AcronymValidator:
    """Validates acronyms and their definitions in documentation."""
    
    # Common acronyms that should be defined
    COMMON_ACRONYMS = {
        'CPR': 'Civil Registration Number',
        'EU': 'European Union',
        'EEA': 'European Economic Area',
        'GP': 'General Practitioner',
        'ICS': 'International Citizen Service',
        'SKAT': 'Danish Tax Authority',
        'SU': 'State Educational Support',
        'VAT': 'Value Added Tax',
        'CVR': 'Central Business Register',
        'AM': 'Labor Market',
        'FAQ': 'Frequently Asked Questions',
        'ID': 'Identification',
        'NFC': 'Near Field Communication',
        'PIN': 'Personal Identification Number',
        'SMS': 'Short Message Service',
        'URL': 'Uniform Resource Locator',
        'PDF': 'Portable Document Format'
    }
    
    # Acronyms that typically don't need definition (very common)
    SKIP_ACRONYMS = {
        'OK', 'USA', 'UK', 'TV', 'PC', 'IT', 'HR', 'PR', 'CEO', 'CTO', 'CFO',
        'AM', 'PM', 'GMT', 'UTC', 'HTTP', 'HTTPS', 'WWW', 'HTML', 'CSS', 'JS'
    }
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.global_acronym_definitions = {}  # Track definitions across all files
    
    def validate_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Validate acronyms and their definitions in a single markdown file.
        
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
            'acronyms_found': [],
            'undefined_acronyms': [],
            'inconsistent_definitions': []
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all acronyms in the content
            acronyms = self._find_acronyms(content)
            result['acronyms_found'] = acronyms
            
            # Check for definitions
            undefined_acronyms = self._check_definitions(content, acronyms)
            result['undefined_acronyms'] = undefined_acronyms
            
            # Check for consistency with global definitions
            inconsistent = self._check_consistency(acronyms)
            result['inconsistent_definitions'] = inconsistent
            
            # Update global definitions
            self._update_global_definitions(acronyms)
            
            # Compile errors and warnings
            if undefined_acronyms:
                result['errors'].extend([
                    f"Line {item['first_use_line']}: Acronym '{item['acronym']}' used without definition"
                    for item in undefined_acronyms
                ])
            
            if inconsistent:
                result['errors'].extend([
                    f"Line {item['line']}: Inconsistent definition for '{item['acronym']}' "
                    f"(found: '{item['found_definition']}', expected: '{item['expected_definition']}')"
                    for item in inconsistent
                ])
            
            # Add warnings for best practices
            result['warnings'].extend(self._check_best_practices(acronyms))
            
            if result['errors']:
                result['valid'] = False
                
        except Exception as e:
            result['valid'] = False
            result['errors'].append(f"Failed to read file: {str(e)}")
        
        return result
    
    def _find_acronyms(self, content: str) -> List[Dict[str, Any]]:
        """
        Find acronyms in the content using various patterns.
        
        Args:
            content: Markdown content
            
        Returns:
            List of acronyms found with their information
        """
        acronyms = []
        lines = content.split('\n')
        
        # Pattern 1: Acronym (Full Definition) or Full Definition (Acronym)
        definition_patterns = [
            re.compile(r'\b([A-Z]{2,})\s*\(([^)]+)\)', re.UNICODE),  # ACRONYM (definition)
            re.compile(r'\b([^(]+)\s*\(([A-Z]{2,})\)', re.UNICODE),  # definition (ACRONYM)
        ]
        
        # Pattern 2: Standalone acronyms (2+ capital letters)
        standalone_pattern = re.compile(r'\b([A-Z]{2,})\b', re.UNICODE)
        
        # Track acronyms found with definitions
        defined_acronyms = set()
        
        for line_num, line in enumerate(lines, 1):
            # Skip code blocks and links
            if line.strip().startswith('```') or line.strip().startswith('http'):
                continue
            
            # Find acronyms with definitions
            for pattern in definition_patterns:
                for match in pattern.finditer(line):
                    group1, group2 = match.groups()
                    
                    # Determine which is the acronym and which is the definition
                    if re.match(r'^[A-Z]{2,}$', group1):
                        acronym, definition = group1, group2
                    elif re.match(r'^[A-Z]{2,}$', group2):
                        acronym, definition = group2, group1
                    else:
                        continue
                    
                    # Skip if not a valid acronym
                    if not self._is_valid_acronym(acronym):
                        continue
                    
                    acronyms.append({
                        'acronym': acronym,
                        'definition': definition.strip(),
                        'line': line_num,
                        'context': line.strip(),
                        'has_definition': True,
                        'first_use': acronym not in defined_acronyms
                    })
                    
                    defined_acronyms.add(acronym)
            
            # Find standalone acronyms (without definitions)
            for match in standalone_pattern.finditer(line):
                acronym = match.group(1)
                
                # Skip if not a valid acronym or already found with definition in this line
                if not self._is_valid_acronym(acronym):
                    continue
                
                # Skip if this line already has a definition for this acronym
                line_has_definition = any(
                    item['acronym'] == acronym and item['line'] == line_num and item['has_definition']
                    for item in acronyms
                )
                
                if not line_has_definition:
                    # Check if this is the first use of this acronym
                    first_use = acronym not in defined_acronyms and not any(
                        item['acronym'] == acronym for item in acronyms
                    )
                    
                    acronyms.append({
                        'acronym': acronym,
                        'definition': None,
                        'line': line_num,
                        'context': line.strip(),
                        'has_definition': False,
                        'first_use': first_use
                    })
        
        return acronyms
    
    def _is_valid_acronym(self, text: str) -> bool:
        """
        Determine if text is a valid acronym that should be checked.
        
        Args:
            text: Text to check
            
        Returns:
            True if text appears to be a valid acronym
        """
        # Must be 2+ characters, all uppercase
        if len(text) < 2 or not text.isupper():
            return False
        
        # Skip very common acronyms that don't need definition
        if text in self.SKIP_ACRONYMS:
            return False
        
        # Skip if it's just Roman numerals
        if re.match(r'^[IVX]+$', text):
            return False
        
        # Skip if it's just numbers
        if text.isdigit():
            return False
        
        # Skip single letters (not really acronyms)
        if len(text) == 1:
            return False
        
        # Skip very long strings (probably not acronyms)
        if len(text) > 10:
            return False
        
        return True
    
    def _check_definitions(self, content: str, acronyms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Check which acronyms are missing definitions.
        
        Args:
            content: Full document content
            acronyms: List of acronyms found
            
        Returns:
            List of acronyms missing definitions
        """
        undefined_acronyms = []
        
        # Group acronyms by acronym text
        acronym_groups = {}
        for item in acronyms:
            acronym = item['acronym']
            if acronym not in acronym_groups:
                acronym_groups[acronym] = []
            acronym_groups[acronym].append(item)
        
        for acronym, instances in acronym_groups.items():
            # Check if any instance has a definition
            has_definition = any(instance['has_definition'] for instance in instances)
            
            # Check if it's a common acronym that should be defined
            should_be_defined = (
                acronym in self.COMMON_ACRONYMS or
                len([inst for inst in instances if not inst['has_definition']]) > 1  # Used multiple times
            )
            
            if should_be_defined and not has_definition:
                # Find first use
                first_use = min(instances, key=lambda x: x['line'])
                undefined_acronyms.append({
                    'acronym': acronym,
                    'first_use_line': first_use['line'],
                    'context': first_use['context'],
                    'total_uses': len(instances),
                    'suggested_definition': self.COMMON_ACRONYMS.get(acronym, '')
                })
        
        return undefined_acronyms
    
    def _check_consistency(self, acronyms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Check consistency of acronym definitions with global definitions.
        
        Args:
            acronyms: List of acronyms found in current file
            
        Returns:
            List of inconsistent definitions
        """
        inconsistent = []
        
        for item in acronyms:
            if item['has_definition']:
                acronym = item['acronym']
                definition = item['definition']
                
                # Check against global definitions
                if acronym in self.global_acronym_definitions:
                    expected_definition = self.global_acronym_definitions[acronym]
                    if not self._definitions_match(definition, expected_definition):
                        inconsistent.append({
                            'acronym': acronym,
                            'found_definition': definition,
                            'expected_definition': expected_definition,
                            'line': item['line'],
                            'context': item['context']
                        })
                
                # Check against common acronyms
                elif acronym in self.COMMON_ACRONYMS:
                    expected_definition = self.COMMON_ACRONYMS[acronym]
                    if not self._definitions_match(definition, expected_definition):
                        inconsistent.append({
                            'acronym': acronym,
                            'found_definition': definition,
                            'expected_definition': expected_definition,
                            'line': item['line'],
                            'context': item['context']
                        })
        
        return inconsistent
    
    def _definitions_match(self, def1: str, def2: str) -> bool:
        """
        Check if two definitions are equivalent, allowing for minor variations.
        
        Args:
            def1: First definition
            def2: Second definition
            
        Returns:
            True if definitions are considered equivalent
        """
        # Normalize definitions
        def normalize(text):
            # Convert to lowercase, remove punctuation, normalize whitespace
            text = re.sub(r'[^\w\s]', '', text.lower())
            text = re.sub(r'\s+', ' ', text).strip()
            return text
        
        norm1 = normalize(def1)
        norm2 = normalize(def2)
        
        # Exact match
        if norm1 == norm2:
            return True
        
        # Check if one contains the other (for longer vs shorter forms)
        if norm1 in norm2 or norm2 in norm1:
            return True
        
        # Check for common variations
        variations = {
            'general practitioner': 'family doctor',
            'civil registration number': 'personal identification number',
            'european union': 'eu',
            'value added tax': 'vat',
            'frequently asked questions': 'faq'
        }
        
        for var1, var2 in variations.items():
            if (norm1 == var1 and norm2 == var2) or (norm1 == var2 and norm2 == var1):
                return True
        
        return False
    
    def _update_global_definitions(self, acronyms: List[Dict[str, Any]]):
        """
        Update global acronym definitions with those found in current file.
        
        Args:
            acronyms: List of acronyms found in current file
        """
        for item in acronyms:
            if item['has_definition']:
                acronym = item['acronym']
                definition = item['definition']
                
                # Only update if we don't have a definition yet, or if this is more authoritative
                if acronym not in self.global_acronym_definitions:
                    self.global_acronym_definitions[acronym] = definition
    
    def _check_best_practices(self, acronyms: List[Dict[str, Any]]) -> List[str]:
        """
        Check for acronym best practices.
        
        Args:
            acronyms: List of acronyms found
            
        Returns:
            List of best practice warnings
        """
        warnings = []
        
        # Group by acronym
        acronym_groups = {}
        for item in acronyms:
            acronym = item['acronym']
            if acronym not in acronym_groups:
                acronym_groups[acronym] = []
            acronym_groups[acronym].append(item)
        
        for acronym, instances in acronym_groups.items():
            # Check if acronym is used many times but never defined
            undefined_instances = [inst for inst in instances if not inst['has_definition']]
            if len(undefined_instances) > 3:  # Used more than 3 times without definition
                warnings.append(f"Acronym '{acronym}' used {len(undefined_instances)} times but never defined")
            
            # Check if definition comes after first use
            defined_instances = [inst for inst in instances if inst['has_definition']]
            if defined_instances and undefined_instances:
                first_use_line = min(inst['line'] for inst in undefined_instances)
                first_definition_line = min(inst['line'] for inst in defined_instances)
                
                if first_definition_line > first_use_line:
                    warnings.append(f"Acronym '{acronym}' used before definition (first use: line {first_use_line}, definition: line {first_definition_line})")
        
        return warnings
    
    def validate_directory(self, directory: Path, recursive: bool = True) -> Dict[str, Any]:
        """
        Validate acronyms in all markdown files in a directory.
        
        Args:
            directory: Directory to validate
            recursive: Whether to search subdirectories
            
        Returns:
            Dictionary containing validation results for all files
        """
        # Reset global definitions for directory validation
        self.global_acronym_definitions = {}
        
        results = {
            'directory': str(directory),
            'files': [],
            'summary': {
                'total_files': 0,
                'valid_files': 0,
                'invalid_files': 0,
                'files_with_acronyms': 0,
                'total_acronyms': 0,
                'total_undefined_acronyms': 0,
                'total_inconsistent_definitions': 0,
                'unique_acronyms': set(),
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
                
                if file_result['acronyms_found']:
                    results['summary']['files_with_acronyms'] += 1
                    results['summary']['total_acronyms'] += len(file_result['acronyms_found'])
                    
                    # Track unique acronyms
                    for item in file_result['acronyms_found']:
                        results['summary']['unique_acronyms'].add(item['acronym'])
                
                results['summary']['total_undefined_acronyms'] += len(file_result['undefined_acronyms'])
                results['summary']['total_inconsistent_definitions'] += len(file_result['inconsistent_definitions'])
                results['summary']['total_errors'] += len(file_result['errors'])
                results['summary']['total_warnings'] += len(file_result['warnings'])
        
        # Convert set to count for JSON serialization
        results['summary']['unique_acronyms_count'] = len(results['summary']['unique_acronyms'])
        results['summary']['unique_acronyms'] = sorted(list(results['summary']['unique_acronyms']))
        
        return results


def print_results(results: Dict[str, Any], verbose: bool = False):
    """
    Print validation results in a readable format.
    
    Args:
        results: Validation results dictionary
        verbose: Whether to show detailed output
    """
    summary = results['summary']
    
    print(f"\n=== Acronym Validation Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Valid files: {summary['valid_files']}")
    print(f"Invalid files: {summary['invalid_files']}")
    print(f"Files with acronyms: {summary['files_with_acronyms']}")
    print(f"Total acronym instances: {summary['total_acronyms']}")
    print(f"Unique acronyms: {summary['unique_acronyms_count']}")
    print(f"Undefined acronyms: {summary['total_undefined_acronyms']}")
    print(f"Inconsistent definitions: {summary['total_inconsistent_definitions']}")
    print(f"Total errors: {summary['total_errors']}")
    print(f"Total warnings: {summary['total_warnings']}")
    
    if verbose:
        print(f"\nUnique acronyms found: {', '.join(summary['unique_acronyms'])}")
    
    if summary['invalid_files'] > 0 or verbose:
        print(f"\n=== File Details ===")
        
        for file_result in results['files']:
            if not file_result['valid'] or (verbose and file_result['acronyms_found']):
                print(f"\nFile: {file_result['file']}")
                print(f"Status: {'✓ Valid' if file_result['valid'] else '✗ Invalid'}")
                print(f"Acronyms found: {len(file_result['acronyms_found'])}")
                
                if verbose and file_result['acronyms_found']:
                    print("Acronyms:")
                    for item in file_result['acronyms_found']:
                        definition = f" ({item['definition']})" if item['definition'] else " (no definition)"
                        print(f"  Line {item['line']}: {item['acronym']}{definition}")
                
                if file_result['errors']:
                    print("Errors:")
                    for error in file_result['errors']:
                        print(f"  - {error}")
                
                if file_result['warnings'] and verbose:
                    print("Warnings:")
                    for warning in file_result['warnings']:
                        print(f"  - {warning}")


def main():
    """Main function to run the acronym validator."""
    parser = argparse.ArgumentParser(description='Validate acronyms and their definitions in Denmark Living Documentation System')
    parser.add_argument('path', help='Path to markdown file or directory to validate')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including all acronyms found')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    validator = AcronymValidator()
    
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
                'valid_files': 1 if result['valid'] else 0,
                'invalid_files': 0 if result['valid'] else 1,
                'files_with_acronyms': 1 if result['acronyms_found'] else 0,
                'total_acronyms': len(result['acronyms_found']),
                'total_undefined_acronyms': len(result['undefined_acronyms']),
                'total_inconsistent_definitions': len(result['inconsistent_definitions']),
                'unique_acronyms': sorted(list(set(item['acronym'] for item in result['acronyms_found']))),
                'unique_acronyms_count': len(set(item['acronym'] for item in result['acronyms_found'])),
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