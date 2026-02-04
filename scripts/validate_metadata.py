#!/usr/bin/env python3
"""
Metadata Validator for Denmark Living Documentation System

This script validates frontmatter metadata in markdown files for:
- Required fields presence
- Metadata schema compliance
- Data type validation
- Value format validation

Requirements: 6.4
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any
import argparse
from datetime import datetime


class MetadataValidator:
    """Validates frontmatter metadata in markdown files."""
    
    # Required fields according to the design document
    REQUIRED_FIELDS = {
        'title': str,
        'category': str,
        'source_url': str,
        'last_updated': str
    }
    
    # Optional fields with their expected types
    OPTIONAL_FIELDS = {
        'audience': list,
        'keywords': list,
        'language': str,
        'translated_from': str
    }
    
    # Valid categories based on the directory structure
    VALID_CATEGORIES = {
        'Before Moving',
        'Arrival Process', 
        'Essential Services',
        'Social Benefits',
        'Employment',
        'Tax Finance',
        'Housing',
        'Practical Living',
        'Metadata'
    }
    
    # Valid audience values
    VALID_AUDIENCES = {
        'EU Citizens',
        'Non-EU Citizens', 
        'All Residents'
    }
    
    def __init__(self):
        self.errors = []
        self.warnings = []
    
    def validate_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Validate metadata in a single markdown file.
        
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
            'metadata': {},
            'has_frontmatter': False
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract and validate metadata
            metadata = self._extract_frontmatter(content)
            result['metadata'] = metadata
            result['has_frontmatter'] = bool(metadata)
            
            if metadata:
                result['errors'].extend(self._validate_required_fields(metadata, file_path))
                result['errors'].extend(self._validate_field_types(metadata, file_path))
                result['errors'].extend(self._validate_field_values(metadata, file_path))
                result['warnings'].extend(self._check_optional_fields(metadata, file_path))
            else:
                result['errors'].append("No frontmatter metadata found")
            
            if result['errors']:
                result['valid'] = False
                
        except Exception as e:
            result['valid'] = False
            result['errors'].append(f"Failed to read file: {str(e)}")
        
        return result
    
    def _extract_frontmatter(self, content: str) -> Dict[str, Any]:
        """
        Extract YAML frontmatter from markdown content.
        Handles frontmatter at the beginning or after the first heading.
        
        Args:
            content: Markdown content
            
        Returns:
            Dictionary of frontmatter metadata
        """
        lines = content.split('\n')
        
        # Look for frontmatter delimiters
        frontmatter_start = -1
        frontmatter_end = -1
        
        # Check for frontmatter at the beginning
        if len(lines) > 0 and lines[0].strip() == '---':
            frontmatter_start = 0
        else:
            # Look for frontmatter after the first heading (common pattern)
            for i, line in enumerate(lines):
                if line.strip() == '---':
                    if frontmatter_start == -1:
                        frontmatter_start = i
                    else:
                        frontmatter_end = i
                        break
        
        # If frontmatter starts at beginning, find the closing delimiter
        if frontmatter_start == 0:
            for i, line in enumerate(lines[1:], 1):
                if line.strip() == '---':
                    frontmatter_end = i
                    break
        
        # If no valid frontmatter block found
        if frontmatter_start == -1 or frontmatter_end == -1:
            return {}
        
        # Parse the frontmatter content
        frontmatter_content = '\n'.join(lines[frontmatter_start + 1:frontmatter_end])
        return self._parse_yaml_simple(frontmatter_content)
    
    def _parse_yaml_simple(self, yaml_content: str) -> Dict[str, Any]:
        """
        Simple YAML parser for frontmatter.
        
        Args:
            yaml_content: YAML content string
            
        Returns:
            Dictionary of parsed YAML data
        """
        metadata = {}
        
        for line in yaml_content.split('\n'):
            line = line.strip()
            
            # Skip empty lines and comments
            if not line or line.startswith('#'):
                continue
            
            # Parse key-value pairs
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                
                # Remove quotes
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                
                # Handle arrays
                if value.startswith('[') and value.endswith(']'):
                    # Parse array values
                    array_content = value[1:-1].strip()
                    if array_content:
                        items = []
                        for item in array_content.split(','):
                            item = item.strip()
                            # Remove quotes from array items
                            if item.startswith('"') and item.endswith('"'):
                                item = item[1:-1]
                            elif item.startswith("'") and item.endswith("'"):
                                item = item[1:-1]
                            items.append(item)
                        value = items
                    else:
                        value = []
                
                metadata[key] = value
        
        return metadata
    
    def _validate_required_fields(self, metadata: Dict[str, Any], file_path: Path) -> List[str]:
        """
        Validate that all required fields are present.
        
        Args:
            metadata: Extracted metadata dictionary
            file_path: Path to the file being validated
            
        Returns:
            List of validation errors
        """
        errors = []
        
        for field_name, field_type in self.REQUIRED_FIELDS.items():
            if field_name not in metadata:
                errors.append(f"Missing required field: '{field_name}'")
            elif not metadata[field_name]:
                errors.append(f"Required field '{field_name}' is empty")
        
        return errors
    
    def _validate_field_types(self, metadata: Dict[str, Any], file_path: Path) -> List[str]:
        """
        Validate field data types.
        
        Args:
            metadata: Extracted metadata dictionary
            file_path: Path to the file being validated
            
        Returns:
            List of type validation errors
        """
        errors = []
        
        # Check required field types
        for field_name, expected_type in self.REQUIRED_FIELDS.items():
            if field_name in metadata:
                value = metadata[field_name]
                if not isinstance(value, expected_type):
                    errors.append(f"Field '{field_name}' should be {expected_type.__name__}, got {type(value).__name__}")
        
        # Check optional field types
        for field_name, expected_type in self.OPTIONAL_FIELDS.items():
            if field_name in metadata:
                value = metadata[field_name]
                if not isinstance(value, expected_type):
                    errors.append(f"Field '{field_name}' should be {expected_type.__name__}, got {type(value).__name__}")
        
        return errors
    
    def _validate_field_values(self, metadata: Dict[str, Any], file_path: Path) -> List[str]:
        """
        Validate field values against expected formats and constraints.
        
        Args:
            metadata: Extracted metadata dictionary
            file_path: Path to the file being validated
            
        Returns:
            List of value validation errors
        """
        errors = []
        
        # Validate category
        if 'category' in metadata:
            category = metadata['category']
            if category not in self.VALID_CATEGORIES:
                errors.append(f"Invalid category '{category}'. Valid categories: {', '.join(sorted(self.VALID_CATEGORIES))}")
        
        # Validate audience
        if 'audience' in metadata:
            audience = metadata['audience']
            if isinstance(audience, list):
                for aud in audience:
                    if aud not in self.VALID_AUDIENCES:
                        errors.append(f"Invalid audience '{aud}'. Valid audiences: {', '.join(sorted(self.VALID_AUDIENCES))}")
            else:
                errors.append("Field 'audience' should be a list")
        
        # Validate source_url format
        if 'source_url' in metadata:
            source_url = metadata['source_url']
            if not self._is_valid_url(source_url):
                errors.append(f"Invalid URL format in 'source_url': {source_url}")
        
        # Validate last_updated date format
        if 'last_updated' in metadata:
            last_updated = metadata['last_updated']
            if not self._is_valid_date(last_updated):
                errors.append(f"Invalid date format in 'last_updated': {last_updated}. Expected YYYY-MM-DD format")
        
        # Validate language codes
        if 'language' in metadata:
            language = metadata['language']
            if not self._is_valid_language_code(language):
                errors.append(f"Invalid language code '{language}'. Expected ISO 639-1 format (e.g., 'en', 'da')")
        
        if 'translated_from' in metadata:
            translated_from = metadata['translated_from']
            if not self._is_valid_language_code(translated_from):
                errors.append(f"Invalid language code in 'translated_from': '{translated_from}'. Expected ISO 639-1 format")
        
        return errors
    
    def _check_optional_fields(self, metadata: Dict[str, Any], file_path: Path) -> List[str]:
        """
        Check for recommended optional fields and best practices.
        
        Args:
            metadata: Extracted metadata dictionary
            file_path: Path to the file being validated
            
        Returns:
            List of warnings for missing optional fields
        """
        warnings = []
        
        # Check for recommended fields
        if 'keywords' not in metadata:
            warnings.append("Missing recommended field 'keywords' for SEO optimization")
        elif isinstance(metadata['keywords'], list) and len(metadata['keywords']) == 0:
            warnings.append("Field 'keywords' is empty - consider adding relevant keywords")
        
        if 'audience' not in metadata:
            warnings.append("Missing recommended field 'audience' to specify target users")
        
        # Check for translation fields consistency
        if 'translated_from' in metadata and 'language' not in metadata:
            warnings.append("Field 'translated_from' present but 'language' is missing")
        
        # Check date freshness (warn if older than 6 months)
        if 'last_updated' in metadata:
            try:
                last_updated = datetime.strptime(metadata['last_updated'], '%Y-%m-%d')
                months_old = (datetime.now() - last_updated).days / 30
                if months_old > 6:
                    warnings.append(f"Content may be outdated - last updated {months_old:.1f} months ago")
            except ValueError:
                pass  # Date format error already caught in validation
        
        return warnings
    
    def _is_valid_url(self, url: str) -> bool:
        """
        Check if a string is a valid URL format.
        
        Args:
            url: URL string to validate
            
        Returns:
            True if URL format is valid
        """
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        return bool(url_pattern.match(url))
    
    def _is_valid_date(self, date_str: str) -> bool:
        """
        Check if a string is a valid date in YYYY-MM-DD format.
        
        Args:
            date_str: Date string to validate
            
        Returns:
            True if date format is valid
        """
        try:
            datetime.strptime(date_str, '%Y-%m-%d')
            return True
        except ValueError:
            return False
    
    def _is_valid_language_code(self, lang_code: str) -> bool:
        """
        Check if a string is a valid ISO 639-1 language code.
        
        Args:
            lang_code: Language code to validate
            
        Returns:
            True if language code format is valid
        """
        # Simple validation for 2-letter language codes
        return bool(re.match(r'^[a-z]{2}$', lang_code))
    
    def validate_directory(self, directory: Path, recursive: bool = True) -> Dict[str, Any]:
        """
        Validate metadata in all markdown files in a directory.
        
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
                'files_with_metadata': 0,
                'files_without_metadata': 0,
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
                
                if file_result['has_frontmatter']:
                    results['summary']['files_with_metadata'] += 1
                else:
                    results['summary']['files_without_metadata'] += 1
                
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
    
    print(f"\n=== Metadata Validation Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Valid metadata: {summary['valid_files']}")
    print(f"Invalid metadata: {summary['invalid_files']}")
    print(f"Files with metadata: {summary['files_with_metadata']}")
    print(f"Files without metadata: {summary['files_without_metadata']}")
    print(f"Total errors: {summary['total_errors']}")
    print(f"Total warnings: {summary['total_warnings']}")
    
    if summary['invalid_files'] > 0 or verbose:
        print(f"\n=== File Details ===")
        
        for file_result in results['files']:
            if not file_result['valid'] or verbose:
                print(f"\nFile: {file_result['file']}")
                print(f"Status: {'✓ Valid' if file_result['valid'] else '✗ Invalid'}")
                print(f"Has metadata: {'Yes' if file_result['has_frontmatter'] else 'No'}")
                
                if file_result['errors']:
                    print("Errors:")
                    for error in file_result['errors']:
                        print(f"  - {error}")
                
                if file_result['warnings'] and verbose:
                    print("Warnings:")
                    for warning in file_result['warnings']:
                        print(f"  - {warning}")
                
                if verbose and file_result['metadata']:
                    print("Metadata fields:")
                    for key, value in file_result['metadata'].items():
                        if isinstance(value, list):
                            print(f"  {key}: [{', '.join(value)}]")
                        else:
                            print(f"  {key}: {value}")


def main():
    """Main function to run the metadata validator."""
    parser = argparse.ArgumentParser(description='Validate frontmatter metadata in markdown files')
    parser.add_argument('path', help='Path to markdown file or directory to validate')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including warnings')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    validator = MetadataValidator()
    
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
                'files_with_metadata': 1 if result['has_frontmatter'] else 0,
                'files_without_metadata': 0 if result['has_frontmatter'] else 1,
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