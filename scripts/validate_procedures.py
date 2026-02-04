#!/usr/bin/env python3
"""
Procedural Guide Validator for Denmark Living Documentation System

This script validates procedural documents for:
- Required sections (prerequisites, required documents, steps, location, processing time, next steps)
- Numbered step format in procedural sections
- Proper procedural guide structure

Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any
import argparse


class ProceduralGuideValidator:
    """Validates procedural guide documents for completeness and structure."""
    
    # Required sections for procedural guides
    REQUIRED_SECTIONS = {
        'prerequisites': ['prerequisite', 'requirement', 'before', 'need'],
        'required_documents': ['required document', 'document', 'bring', 'paperwork'],
        'steps': ['step', 'process', 'procedure', 'how to', 'application'],
        'location': ['where', 'location', 'apply', 'office', 'center'],
        'processing_time': ['processing time', 'time', 'duration', 'how long', 'wait'],
        'next_steps': ['next step', 'after', 'what happens', 'follow up']
    }
    
    # Keywords that indicate a document is procedural
    PROCEDURAL_KEYWORDS = [
        'application', 'apply', 'register', 'registration', 'process', 'procedure',
        'how to', 'steps', 'requirements', 'documents needed', 'where to',
        'processing time', 'appointment', 'booking', 'submit', 'complete'
    ]
    
    # Directories that typically contain procedural guides
    PROCEDURAL_DIRECTORIES = [
        'arrival-process',
        'before-moving',
        'essential-services',
        'social-benefits',
        'employment',
        'tax-finance',
        'housing'
    ]
    
    def __init__(self):
        self.errors = []
        self.warnings = []
    
    def validate_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Validate a single markdown file for procedural guide compliance.
        
        Args:
            file_path: Path to the markdown file
            
        Returns:
            Dictionary containing validation results
        """
        result = {
            'file': str(file_path),
            'is_procedural': False,
            'valid': True,
            'errors': [],
            'warnings': [],
            'sections_found': {},
            'missing_sections': [],
            'step_format_issues': []
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Determine if this is a procedural guide
            result['is_procedural'] = self._is_procedural_guide(content, file_path)
            
            if result['is_procedural']:
                # Parse document structure
                structure = self._parse_structure(content)
                
                # Validate required sections
                sections_found, missing_sections = self._validate_required_sections(structure, file_path)
                result['sections_found'] = sections_found
                result['missing_sections'] = missing_sections
                
                # Validate step format
                step_issues = self._validate_step_format(structure, file_path)
                result['step_format_issues'] = step_issues
                
                # Compile errors
                if missing_sections:
                    result['errors'].extend([f"Missing required section: {section}" for section in missing_sections])
                
                if step_issues:
                    result['errors'].extend(step_issues)
                
                # Add warnings for best practices
                result['warnings'].extend(self._check_best_practices(structure, file_path))
                
                if result['errors']:
                    result['valid'] = False
            
        except Exception as e:
            result['valid'] = False
            result['errors'].append(f"Failed to read file: {str(e)}")
        
        return result
    
    def _is_procedural_guide(self, content: str, file_path: Path) -> bool:
        """
        Determine if a document is a procedural guide based on content and location.
        
        Args:
            content: Markdown content
            file_path: Path to the file
            
        Returns:
            True if document appears to be a procedural guide
        """
        # Check if file is in a procedural directory
        path_parts = file_path.parts
        is_in_procedural_dir = any(dir_name in path_parts for dir_name in self.PROCEDURAL_DIRECTORIES)
        
        # Skip overview files and metadata files
        if file_path.name in ['overview.md', 'index.md'] or 'metadata' in path_parts:
            return False
        
        # Convert content to lowercase for keyword matching
        content_lower = content.lower()
        
        # Count procedural keywords
        keyword_count = sum(1 for keyword in self.PROCEDURAL_KEYWORDS if keyword in content_lower)
        
        # Check for step-by-step patterns
        has_numbered_steps = bool(re.search(r'^\s*\d+\.\s+', content, re.MULTILINE))
        has_step_headings = bool(re.search(r'#{2,6}\s+step\s*\d+', content_lower))
        
        # Check for application/process language
        has_application_language = any(phrase in content_lower for phrase in [
            'application process', 'how to apply', 'required documents', 'processing time',
            'where to apply', 'appointment', 'registration process', 'steps to'
        ])
        
        # Determine if procedural based on multiple factors
        is_procedural = (
            is_in_procedural_dir and (
                keyword_count >= 3 or
                has_numbered_steps or
                has_step_headings or
                has_application_language
            )
        )
        
        return is_procedural
    
    def _parse_structure(self, content: str) -> Dict[str, Any]:
        """
        Parse the markdown structure and extract headings and content.
        
        Args:
            content: Markdown content
            
        Returns:
            Dictionary containing document structure
        """
        structure = {
            'headings': [],
            'sections': {},
            'numbered_lists': []
        }
        
        lines = content.split('\n')
        current_section = None
        current_content = []
        
        # Extract headings and section content
        heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
        for match in heading_pattern.finditer(content):
            level = len(match.group(1))
            text = match.group(2).strip()
            line_num = content[:match.start()].count('\n') + 1
            
            # Save previous section content
            if current_section:
                structure['sections'][current_section] = '\n'.join(current_content)
            
            # Start new section
            heading_info = {
                'level': level,
                'text': text,
                'line': line_num
            }
            structure['headings'].append(heading_info)
            current_section = text.lower()
            current_content = []
        
        # Save last section
        if current_section:
            # Get content after last heading
            last_heading_pos = content.rfind('#')
            if last_heading_pos != -1:
                remaining_content = content[last_heading_pos:].split('\n', 1)
                if len(remaining_content) > 1:
                    structure['sections'][current_section] = remaining_content[1]
        
        # Find numbered lists
        numbered_list_pattern = re.compile(r'^\s*(\d+)\.\s+(.+)$', re.MULTILINE)
        for match in numbered_list_pattern.finditer(content):
            line_num = content[:match.start()].count('\n') + 1
            structure['numbered_lists'].append({
                'number': int(match.group(1)),
                'text': match.group(2).strip(),
                'line': line_num
            })
        
        return structure
    
    def _validate_required_sections(self, structure: Dict[str, Any], file_path: Path) -> Tuple[Dict[str, List[str]], List[str]]:
        """
        Validate that required sections are present in the procedural guide.
        
        Args:
            structure: Parsed document structure
            file_path: Path to the file being validated
            
        Returns:
            Tuple of (sections_found, missing_sections)
        """
        sections_found = {}
        missing_sections = []
        
        # Get all section headings (lowercase for matching)
        section_headings = [heading['text'].lower() for heading in structure['headings']]
        section_content = structure['sections']
        
        # Check each required section type
        for section_type, keywords in self.REQUIRED_SECTIONS.items():
            found_sections = []
            
            # Look for headings that match keywords
            for heading in section_headings:
                if any(keyword in heading for keyword in keywords):
                    found_sections.append(heading)
            
            # Also check if content exists in sections (even if heading doesn't match perfectly)
            if not found_sections:
                for section_name, content in section_content.items():
                    if any(keyword in content.lower() for keyword in keywords):
                        found_sections.append(f"(content in '{section_name}' section)")
            
            if found_sections:
                sections_found[section_type] = found_sections
            else:
                missing_sections.append(section_type)
        
        return sections_found, missing_sections
    
    def _validate_step_format(self, structure: Dict[str, Any], file_path: Path) -> List[str]:
        """
        Validate that procedural steps use proper numbered format.
        
        Args:
            structure: Parsed document structure
            file_path: Path to the file being validated
            
        Returns:
            List of step format issues
        """
        issues = []
        numbered_lists = structure['numbered_lists']
        
        if not numbered_lists:
            issues.append("No numbered steps found - procedural guides should include step-by-step instructions")
            return issues
        
        # Check for proper sequential numbering
        step_sequences = {}
        for item in numbered_lists:
            line = item['line']
            number = item['number']
            
            # Group by approximate line ranges (steps in same section)
            section_key = line // 50  # Rough grouping
            if section_key not in step_sequences:
                step_sequences[section_key] = []
            step_sequences[section_key].append((number, line))
        
        # Validate each sequence
        for section_key, steps in step_sequences.items():
            steps.sort(key=lambda x: x[1])  # Sort by line number
            
            expected_number = 1
            for number, line in steps:
                if number != expected_number:
                    if number == 1 and expected_number > 1:
                        # New sequence starting - this is okay
                        expected_number = 2
                    else:
                        issues.append(f"Line {line}: Step numbering issue - expected {expected_number}, found {number}")
                        expected_number = number + 1
                else:
                    expected_number += 1
        
        # Check for very short steps (might indicate poor formatting)
        short_steps = [item for item in numbered_lists if len(item['text']) < 10]
        if len(short_steps) > len(numbered_lists) * 0.3:  # More than 30% are very short
            issues.append("Many steps are very short - consider combining or expanding step descriptions")
        
        return issues
    
    def _check_best_practices(self, structure: Dict[str, Any], file_path: Path) -> List[str]:
        """
        Check for procedural guide best practices.
        
        Args:
            structure: Parsed document structure
            file_path: Path to the file being validated
            
        Returns:
            List of best practice warnings
        """
        warnings = []
        
        # Check for "Key Information" section (recommended)
        has_key_info = any('key information' in heading['text'].lower() for heading in structure['headings'])
        if not has_key_info:
            warnings.append("Consider adding a 'Key Information' section with summary details")
        
        # Check for "Common Questions" or FAQ section
        has_faq = any(
            any(keyword in heading['text'].lower() for keyword in ['question', 'faq', 'troubleshoot'])
            for heading in structure['headings']
        )
        if not has_faq:
            warnings.append("Consider adding a 'Common Questions' or troubleshooting section")
        
        # Check for contact information
        has_contact = any(
            'contact' in section_content.lower() or 'phone' in section_content.lower() or 'email' in section_content.lower()
            for section_content in structure['sections'].values()
        )
        if not has_contact:
            warnings.append("Consider including contact information for relevant authorities or support")
        
        # Check for deadline information
        has_deadline = any(
            any(keyword in section_content.lower() for keyword in ['deadline', 'within', 'days', 'months', 'time limit'])
            for section_content in structure['sections'].values()
        )
        if not has_deadline:
            warnings.append("Consider including deadline or timing information if applicable")
        
        return warnings
    
    def validate_directory(self, directory: Path, recursive: bool = True) -> Dict[str, Any]:
        """
        Validate all markdown files in a directory for procedural guide compliance.
        
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
                'procedural_files': 0,
                'valid_procedural_files': 0,
                'invalid_procedural_files': 0,
                'non_procedural_files': 0,
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
                
                if file_result['is_procedural']:
                    results['summary']['procedural_files'] += 1
                    if file_result['valid']:
                        results['summary']['valid_procedural_files'] += 1
                    else:
                        results['summary']['invalid_procedural_files'] += 1
                else:
                    results['summary']['non_procedural_files'] += 1
                
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
    
    print(f"\n=== Procedural Guide Validation Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Procedural guides: {summary['procedural_files']}")
    print(f"Valid procedural guides: {summary['valid_procedural_files']}")
    print(f"Invalid procedural guides: {summary['invalid_procedural_files']}")
    print(f"Non-procedural files: {summary['non_procedural_files']}")
    print(f"Total errors: {summary['total_errors']}")
    print(f"Total warnings: {summary['total_warnings']}")
    
    if summary['invalid_procedural_files'] > 0 or verbose:
        print(f"\n=== File Details ===")
        
        for file_result in results['files']:
            # Show details for invalid procedural files, or all files if verbose
            if (not file_result['valid'] and file_result['is_procedural']) or verbose:
                print(f"\nFile: {file_result['file']}")
                print(f"Type: {'Procedural Guide' if file_result['is_procedural'] else 'Non-procedural'}")
                print(f"Status: {'✓ Valid' if file_result['valid'] else '✗ Invalid'}")
                
                if file_result['is_procedural']:
                    if file_result['sections_found']:
                        print("Required sections found:")
                        for section_type, found_sections in file_result['sections_found'].items():
                            print(f"  ✓ {section_type}: {', '.join(found_sections)}")
                    
                    if file_result['missing_sections']:
                        print("Missing required sections:")
                        for section in file_result['missing_sections']:
                            print(f"  ✗ {section}")
                
                if file_result['errors']:
                    print("Errors:")
                    for error in file_result['errors']:
                        print(f"  - {error}")
                
                if file_result['warnings'] and verbose:
                    print("Warnings:")
                    for warning in file_result['warnings']:
                        print(f"  - {warning}")


def main():
    """Main function to run the procedural guide validator."""
    parser = argparse.ArgumentParser(description='Validate procedural guides in Denmark Living Documentation System')
    parser.add_argument('path', help='Path to markdown file or directory to validate')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including warnings')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    validator = ProceduralGuideValidator()
    
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
                'procedural_files': 1 if result['is_procedural'] else 0,
                'valid_procedural_files': 1 if result['is_procedural'] and result['valid'] else 0,
                'invalid_procedural_files': 1 if result['is_procedural'] and not result['valid'] else 0,
                'non_procedural_files': 0 if result['is_procedural'] else 1,
                'total_errors': len(result['errors']),
                'total_warnings': len(result['warnings'])
            }
        }
    else:
        # Validate directory
        results = validator.validate_directory(path, recursive=not args.no_recursive)
    
    print_results(results, verbose=args.verbose)
    
    # Exit with error code if validation failed
    if results['summary']['invalid_procedural_files'] > 0:
        sys.exit(1)


if __name__ == '__main__':
    main()