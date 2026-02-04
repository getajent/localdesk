#!/usr/bin/env python3
"""
Directory Structure Validator for Denmark Living Documentation System

This script validates the documentation directory structure by:
- Verifying all required category directories exist
- Checking that files are in correct categories
- Verifying overview.md exists in each category

Requirements: 1.1, 1.3
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any, Set
import argparse


class StructureValidator:
    """Validates directory structure for the Denmark Living Documentation System."""
    
    # Required category directories based on the design document
    REQUIRED_CATEGORIES = {
        'before-moving': 'Before Moving',
        'arrival-process': 'Arrival Process',
        'essential-services': 'Essential Services',
        'social-benefits': 'Social Benefits',
        'employment': 'Employment',
        'tax-finance': 'Tax Finance',
        'housing': 'Housing',
        'practical-living': 'Practical Living',
        'metadata': 'Metadata'
    }
    
    # Expected files in each category (based on the design document)
    EXPECTED_FILES = {
        'before-moving': {
            'overview.md',
            'residence-permits.md',
            'work-permits.md',
            'housing-search.md',
            'study-programs.md',
            'family-reunification.md',
            'cultural-preparation.md'
        },
        'arrival-process': {
            'overview.md',
            'cpr-number.md',
            'mitid.md',
            'health-insurance.md',
            'gp-registration.md',
            'tax-card.md',
            'bank-account.md',
            'digital-post.md',
            'vehicle-import.md',
            'ics-centers.md',
            'language-courses.md'
        },
        'essential-services': {
            'overview.md',
            'healthcare-system.md',
            'banking-services.md',
            'digital-government.md',
            'education-childcare.md',
            'transportation.md'
        },
        'social-benefits': {
            'overview.md',
            'boligstotte.md',
            'unemployment-benefits.md',
            'child-benefits.md',
            'pension-system.md',
            'parental-leave.md',
            'student-support.md',
            'social-assistance.md',
            'disability-benefits.md',
            'elderly-care.md'
        },
        'employment': {
            'overview.md',
            'employment-contracts.md',
            'working-hours.md',
            'unions-akasse.md',
            'salary-payslips.md',
            'workplace-rights.md',
            'parental-leave-work.md'
        },
        'tax-finance': {
            'overview.md',
            'tax-system-overview.md',
            'income-tax.md',
            'tax-deductions.md',
            'annual-tax-return.md',
            'skat-registration.md',
            'self-employment-tax.md'
        },
        'housing': {
            'overview.md',
            'rental-contracts.md',
            'deposits-utilities.md',
            'tenant-insurance.md',
            'housing-types.md',
            'tenant-disputes.md',
            'moving-procedures.md'
        },
        'practical-living': {
            'overview.md',
            'shopping-guide.md',
            'cultural-norms.md',
            'cost-saving-tips.md',
            'mobile-internet.md',
            'cycling-culture.md',
            'waste-recycling.md',
            'public-holidays.md',
            'community-resources.md',
            'dining-culture.md',
            'sports-recreation.md'
        },
        'metadata': {
            'sources.md',
            'glossary.md',
            'update-log.md',
            'document-template.md'
        }
    }
    
    def __init__(self):
        pass
    
    def validate_structure(self, docs_directory: Path) -> Dict[str, Any]:
        """
        Validate the complete directory structure.
        
        Args:
            docs_directory: Path to the docs directory
            
        Returns:
            Dictionary containing validation results
        """
        result = {
            'directory': str(docs_directory),
            'valid': True,
            'errors': [],
            'warnings': [],
            'categories': {},
            'summary': {
                'required_categories': len(self.REQUIRED_CATEGORIES),
                'existing_categories': 0,
                'missing_categories': 0,
                'total_files': 0,
                'expected_files': 0,
                'missing_files': 0,
                'unexpected_files': 0,
                'overview_files': 0,
                'missing_overviews': 0
            }
        }
        
        if not docs_directory.exists():
            result['valid'] = False
            result['errors'].append(f"Documentation directory does not exist: {docs_directory}")
            return result
        
        if not docs_directory.is_dir():
            result['valid'] = False
            result['errors'].append(f"Path is not a directory: {docs_directory}")
            return result
        
        # Validate each required category
        for category_dir, category_name in self.REQUIRED_CATEGORIES.items():
            category_path = docs_directory / category_dir
            category_result = self._validate_category(category_path, category_dir, category_name)
            result['categories'][category_dir] = category_result
            
            # Update summary
            if category_result['exists']:
                result['summary']['existing_categories'] += 1
            else:
                result['summary']['missing_categories'] += 1
            
            result['summary']['total_files'] += category_result['total_files']
            result['summary']['expected_files'] += category_result['expected_files']
            result['summary']['missing_files'] += category_result['missing_files_count']
            result['summary']['unexpected_files'] += category_result['unexpected_files_count']
            
            if category_result['has_overview']:
                result['summary']['overview_files'] += 1
            else:
                result['summary']['missing_overviews'] += 1
            
            # Collect errors and warnings
            result['errors'].extend(category_result['errors'])
            result['warnings'].extend(category_result['warnings'])
        
        # Check for unexpected top-level directories
        self._check_unexpected_directories(docs_directory, result)
        
        # Check for main index file
        self._check_main_index(docs_directory, result)
        
        if result['errors']:
            result['valid'] = False
        
        return result
    
    def _validate_category(self, category_path: Path, category_dir: str, category_name: str) -> Dict[str, Any]:
        """
        Validate a single category directory.
        
        Args:
            category_path: Path to the category directory
            category_dir: Directory name (e.g., 'before-moving')
            category_name: Human-readable category name
            
        Returns:
            Dictionary containing category validation results
        """
        result = {
            'path': str(category_path),
            'name': category_name,
            'exists': False,
            'has_overview': False,
            'files': [],
            'missing_files': [],
            'unexpected_files': [],
            'total_files': 0,
            'expected_files': 0,
            'missing_files_count': 0,
            'unexpected_files_count': 0,
            'errors': [],
            'warnings': []
        }
        
        # Check if category directory exists
        if not category_path.exists():
            result['errors'].append(f"Missing required category directory: {category_dir}/")
            result['expected_files'] = len(self.EXPECTED_FILES.get(category_dir, set()))
            result['missing_files_count'] = result['expected_files']
            return result
        
        if not category_path.is_dir():
            result['errors'].append(f"Category path is not a directory: {category_path}")
            return result
        
        result['exists'] = True
        
        # Get expected files for this category
        expected_files = self.EXPECTED_FILES.get(category_dir, set())
        result['expected_files'] = len(expected_files)
        
        # Get actual files in the directory
        actual_files = set()
        for file_path in category_path.glob('*.md'):
            if file_path.is_file():
                actual_files.add(file_path.name)
                result['files'].append(file_path.name)
        
        result['total_files'] = len(actual_files)
        
        # Check for overview.md (required for all categories except metadata)
        if category_dir != 'metadata':
            if 'overview.md' in actual_files:
                result['has_overview'] = True
            else:
                result['errors'].append(f"Missing required overview.md in {category_dir}/")
        
        # Find missing files
        missing_files = expected_files - actual_files
        result['missing_files'] = list(missing_files)
        result['missing_files_count'] = len(missing_files)
        
        for missing_file in missing_files:
            result['warnings'].append(f"Expected file not found in {category_dir}/: {missing_file}")
        
        # Find unexpected files
        unexpected_files = actual_files - expected_files
        result['unexpected_files'] = list(unexpected_files)
        result['unexpected_files_count'] = len(unexpected_files)
        
        for unexpected_file in unexpected_files:
            result['warnings'].append(f"Unexpected file found in {category_dir}/: {unexpected_file}")
        
        return result
    
    def _check_unexpected_directories(self, docs_directory: Path, result: Dict[str, Any]):
        """
        Check for unexpected directories in the docs folder.
        
        Args:
            docs_directory: Path to the docs directory
            result: Result dictionary to update
        """
        expected_dirs = set(self.REQUIRED_CATEGORIES.keys())
        actual_dirs = set()
        
        for item in docs_directory.iterdir():
            if item.is_dir():
                actual_dirs.add(item.name)
        
        unexpected_dirs = actual_dirs - expected_dirs
        for unexpected_dir in unexpected_dirs:
            result['warnings'].append(f"Unexpected directory found: {unexpected_dir}/")
    
    def _check_main_index(self, docs_directory: Path, result: Dict[str, Any]):
        """
        Check for main index file.
        
        Args:
            docs_directory: Path to the docs directory
            result: Result dictionary to update
        """
        index_files = ['index.md', 'README.md']
        has_index = False
        
        for index_file in index_files:
            if (docs_directory / index_file).exists():
                has_index = True
                break
        
        if not has_index:
            result['warnings'].append("No main index file (index.md or README.md) found in docs directory")
    
    def generate_structure_report(self, result: Dict[str, Any]) -> str:
        """
        Generate a detailed structure validation report.
        
        Args:
            result: Validation results dictionary
            
        Returns:
            Formatted report string
        """
        report_lines = []
        summary = result['summary']
        
        report_lines.append("# Directory Structure Validation Report")
        report_lines.append("")
        report_lines.append(f"**Directory:** {result['directory']}")
        report_lines.append(f"**Status:** {'✓ Valid' if result['valid'] else '✗ Invalid'}")
        report_lines.append("")
        
        report_lines.append("## Summary")
        report_lines.append("")
        report_lines.append(f"- **Required categories:** {summary['required_categories']}")
        report_lines.append(f"- **Existing categories:** {summary['existing_categories']}")
        report_lines.append(f"- **Missing categories:** {summary['missing_categories']}")
        report_lines.append(f"- **Total files:** {summary['total_files']}")
        report_lines.append(f"- **Expected files:** {summary['expected_files']}")
        report_lines.append(f"- **Missing files:** {summary['missing_files']}")
        report_lines.append(f"- **Unexpected files:** {summary['unexpected_files']}")
        report_lines.append(f"- **Overview files:** {summary['overview_files']}")
        report_lines.append(f"- **Missing overviews:** {summary['missing_overviews']}")
        
        if result['errors']:
            report_lines.append("")
            report_lines.append("## Errors")
            report_lines.append("")
            for error in result['errors']:
                report_lines.append(f"- {error}")
        
        if result['warnings']:
            report_lines.append("")
            report_lines.append("## Warnings")
            report_lines.append("")
            for warning in result['warnings']:
                report_lines.append(f"- {warning}")
        
        report_lines.append("")
        report_lines.append("## Category Details")
        report_lines.append("")
        
        for category_dir, category_result in result['categories'].items():
            status = "✓" if category_result['exists'] else "✗"
            overview_status = "✓" if category_result['has_overview'] else "✗"
            
            report_lines.append(f"### {status} {category_result['name']} (`{category_dir}/`)")
            report_lines.append("")
            report_lines.append(f"- **Exists:** {'Yes' if category_result['exists'] else 'No'}")
            if category_dir != 'metadata':
                report_lines.append(f"- **Has overview.md:** {'Yes' if category_result['has_overview'] else 'No'}")
            report_lines.append(f"- **Files:** {category_result['total_files']}/{category_result['expected_files']}")
            
            if category_result['files']:
                report_lines.append("- **Existing files:**")
                for file_name in sorted(category_result['files']):
                    report_lines.append(f"  - {file_name}")
            
            if category_result['missing_files']:
                report_lines.append("- **Missing files:**")
                for file_name in sorted(category_result['missing_files']):
                    report_lines.append(f"  - {file_name}")
            
            if category_result['unexpected_files']:
                report_lines.append("- **Unexpected files:**")
                for file_name in sorted(category_result['unexpected_files']):
                    report_lines.append(f"  - {file_name}")
            
            report_lines.append("")
        
        return '\n'.join(report_lines)


def print_results(result: Dict[str, Any], verbose: bool = False):
    """
    Print validation results in a readable format.
    
    Args:
        result: Validation results dictionary
        verbose: Whether to show detailed output
    """
    summary = result['summary']
    
    print(f"\n=== Directory Structure Validation Results ===")
    print(f"Directory: {result['directory']}")
    print(f"Status: {'✓ Valid' if result['valid'] else '✗ Invalid'}")
    print(f"Categories: {summary['existing_categories']}/{summary['required_categories']}")
    print(f"Files: {summary['total_files']} (expected: {summary['expected_files']})")
    print(f"Overview files: {summary['overview_files']}/{summary['required_categories'] - 1}")  # -1 for metadata
    print(f"Errors: {len(result['errors'])}")
    print(f"Warnings: {len(result['warnings'])}")
    
    if result['errors']:
        print(f"\n=== Errors ===")
        for error in result['errors']:
            print(f"  - {error}")
    
    if result['warnings'] and verbose:
        print(f"\n=== Warnings ===")
        for warning in result['warnings']:
            print(f"  - {warning}")
    
    if verbose:
        print(f"\n=== Category Details ===")
        
        for category_dir, category_result in result['categories'].items():
            status = "✓" if category_result['exists'] else "✗"
            overview_status = "✓" if category_result['has_overview'] else "✗"
            
            print(f"\n{status} {category_result['name']} ({category_dir}/)")
            print(f"  Files: {category_result['total_files']}/{category_result['expected_files']}")
            
            if category_dir != 'metadata':
                print(f"  Overview: {overview_status}")
            
            if category_result['missing_files']:
                print(f"  Missing: {', '.join(sorted(category_result['missing_files']))}")
            
            if category_result['unexpected_files']:
                print(f"  Unexpected: {', '.join(sorted(category_result['unexpected_files']))}")


def main():
    """Main function to run the structure validator."""
    parser = argparse.ArgumentParser(description='Validate directory structure for Denmark Living Documentation System')
    parser.add_argument('path', help='Path to the documentation directory')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including warnings')
    parser.add_argument('--report', '-r', help='Generate detailed report and save to file')
    
    args = parser.parse_args()
    
    docs_path = Path(args.path)
    validator = StructureValidator()
    
    if not docs_path.exists():
        print(f"Error: Path '{docs_path}' does not exist")
        sys.exit(1)
    
    result = validator.validate_structure(docs_path)
    
    print_results(result, verbose=args.verbose)
    
    # Generate report if requested
    if args.report:
        report_content = validator.generate_structure_report(result)
        with open(args.report, 'w', encoding='utf-8') as f:
            f.write(report_content)
        print(f"\nDetailed report saved to: {args.report}")
    
    # Exit with error code if validation failed
    if not result['valid']:
        sys.exit(1)


if __name__ == '__main__':
    main()