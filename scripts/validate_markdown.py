#!/usr/bin/env python3
"""
Markdown Parser and Validator for Denmark Living Documentation System

This script validates markdown files for:
- Valid markdown syntax
- Consistent heading hierarchy (no skipped levels)
- Proper document structure

Requirements: 1.2
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import argparse


class MarkdownValidator:
    """Validates markdown files for syntax and structure compliance."""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
    
    def validate_file(self, file_path: Path) -> Dict[str, any]:
        """
        Validate a single markdown file.
        
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
            'structure': {}
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse and validate the markdown content
            result['structure'] = self._parse_structure(content, file_path)
            result['errors'].extend(self._validate_syntax(content, file_path))
            result['errors'].extend(self._validate_heading_hierarchy(result['structure'], file_path))
            result['warnings'].extend(self._check_best_practices(content, file_path))
            
            if result['errors']:
                result['valid'] = False
                
        except Exception as e:
            result['valid'] = False
            result['errors'].append(f"Failed to read file: {str(e)}")
        
        return result
    
    def _parse_structure(self, content: str, file_path: Path) -> Dict[str, any]:
        """
        Parse the markdown structure and extract headings.
        
        Args:
            content: Markdown content
            file_path: Path to the file being parsed
            
        Returns:
            Dictionary containing document structure
        """
        structure = {
            'headings': [],
            'has_frontmatter': False,
            'frontmatter': {},
            'sections': []
        }
        
        lines = content.split('\n')
        
        # Check for frontmatter
        if len(lines) > 0 and lines[0].strip() == '---':
            structure['has_frontmatter'] = True
            frontmatter_end = -1
            for i, line in enumerate(lines[1:], 1):
                if line.strip() == '---':
                    frontmatter_end = i
                    break
            
            if frontmatter_end > 0:
                frontmatter_content = '\n'.join(lines[1:frontmatter_end])
                structure['frontmatter'] = self._parse_frontmatter(frontmatter_content)
        
        # Extract headings
        heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
        for match in heading_pattern.finditer(content):
            level = len(match.group(1))
            text = match.group(2).strip()
            line_num = content[:match.start()].count('\n') + 1
            
            structure['headings'].append({
                'level': level,
                'text': text,
                'line': line_num
            })
        
        return structure
    
    def _parse_frontmatter(self, frontmatter_content: str) -> Dict[str, any]:
        """
        Parse YAML frontmatter.
        
        Args:
            frontmatter_content: YAML content from frontmatter
            
        Returns:
            Dictionary of frontmatter data
        """
        frontmatter = {}
        
        # Simple YAML parsing for basic key-value pairs
        for line in frontmatter_content.split('\n'):
            line = line.strip()
            if ':' in line and not line.startswith('#'):
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip().strip('"\'')
                
                # Handle arrays
                if value.startswith('[') and value.endswith(']'):
                    value = [item.strip().strip('"\'') for item in value[1:-1].split(',')]
                
                frontmatter[key] = value
        
        return frontmatter
    
    def _validate_syntax(self, content: str, file_path: Path) -> List[str]:
        """
        Validate basic markdown syntax.
        
        Args:
            content: Markdown content
            file_path: Path to the file being validated
            
        Returns:
            List of syntax errors
        """
        errors = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check for malformed headings
            if line.strip().startswith('#'):
                if not re.match(r'^#{1,6}\s+.+', line.strip()):
                    errors.append(f"Line {i}: Malformed heading - headings must have space after # symbols")
            
            # Check for unmatched brackets in links
            open_brackets = line.count('[')
            close_brackets = line.count(']')
            open_parens = line.count('(')
            close_parens = line.count(')')
            
            if open_brackets != close_brackets:
                errors.append(f"Line {i}: Unmatched square brackets in line")
            
            # Check for basic link syntax
            link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
            links = re.findall(link_pattern, line)
            for link_text, link_url in links:
                if not link_text.strip():
                    errors.append(f"Line {i}: Empty link text")
                if not link_url.strip():
                    errors.append(f"Line {i}: Empty link URL")
        
        return errors
    
    def _validate_heading_hierarchy(self, structure: Dict[str, any], file_path: Path) -> List[str]:
        """
        Validate heading hierarchy (no skipped levels).
        
        Args:
            structure: Parsed document structure
            file_path: Path to the file being validated
            
        Returns:
            List of hierarchy errors
        """
        errors = []
        headings = structure['headings']
        
        if not headings:
            return errors
        
        # Check if document starts with H1
        if headings[0]['level'] != 1:
            errors.append(f"Document should start with H1 heading, found H{headings[0]['level']} at line {headings[0]['line']}")
        
        # Check for skipped heading levels
        for i in range(1, len(headings)):
            current_level = headings[i]['level']
            previous_level = headings[i-1]['level']
            
            # Allow same level, one level deeper, or any level shallower
            if current_level > previous_level + 1:
                errors.append(f"Line {headings[i]['line']}: Skipped heading level - jumped from H{previous_level} to H{current_level}")
        
        return errors
    
    def _check_best_practices(self, content: str, file_path: Path) -> List[str]:
        """
        Check for markdown best practices.
        
        Args:
            content: Markdown content
            file_path: Path to the file being checked
            
        Returns:
            List of best practice warnings
        """
        warnings = []
        lines = content.split('\n')
        
        # Check for multiple consecutive empty lines
        empty_line_count = 0
        for i, line in enumerate(lines, 1):
            if line.strip() == '':
                empty_line_count += 1
                if empty_line_count > 2:
                    warnings.append(f"Line {i}: More than 2 consecutive empty lines")
            else:
                empty_line_count = 0
        
        # Check for very long lines (over 120 characters)
        for i, line in enumerate(lines, 1):
            if len(line) > 120:
                warnings.append(f"Line {i}: Line exceeds 120 characters ({len(line)} chars)")
        
        return warnings
    
    def validate_directory(self, directory: Path, recursive: bool = True) -> Dict[str, any]:
        """
        Validate all markdown files in a directory.
        
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
                'valid_files': 0,
                'invalid_files': 0,
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
                
                results['summary']['total_errors'] += len(file_result['errors'])
                results['summary']['total_warnings'] += len(file_result['warnings'])
        
        return results


def print_results(results: Dict[str, any], verbose: bool = False):
    """
    Print validation results in a readable format.
    
    Args:
        results: Validation results dictionary
        verbose: Whether to show detailed output
    """
    summary = results['summary']
    
    print(f"\n=== Markdown Validation Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Valid files: {summary['valid_files']}")
    print(f"Invalid files: {summary['invalid_files']}")
    print(f"Total errors: {summary['total_errors']}")
    print(f"Total warnings: {summary['total_warnings']}")
    
    if summary['invalid_files'] > 0 or verbose:
        print(f"\n=== File Details ===")
        
        for file_result in results['files']:
            if not file_result['valid'] or verbose:
                print(f"\nFile: {file_result['file']}")
                print(f"Status: {'✓ Valid' if file_result['valid'] else '✗ Invalid'}")
                
                if file_result['errors']:
                    print("Errors:")
                    for error in file_result['errors']:
                        print(f"  - {error}")
                
                if file_result['warnings'] and verbose:
                    print("Warnings:")
                    for warning in file_result['warnings']:
                        print(f"  - {warning}")
                
                if verbose and file_result['structure']['headings']:
                    print("Heading structure:")
                    for heading in file_result['structure']['headings']:
                        indent = "  " * (heading['level'] - 1)
                        print(f"  {indent}H{heading['level']}: {heading['text']}")


def main():
    """Main function to run the markdown validator."""
    parser = argparse.ArgumentParser(description='Validate markdown files for Denmark Living Documentation System')
    parser.add_argument('path', help='Path to markdown file or directory to validate')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including warnings')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    validator = MarkdownValidator()
    
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