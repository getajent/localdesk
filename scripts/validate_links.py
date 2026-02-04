#!/usr/bin/env python3
"""
Link Validator for Denmark Living Documentation System

This script validates markdown links by:
- Extracting all relative markdown links
- Verifying target files exist
- Reporting broken links

Requirements: 1.5
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any
import argparse
from urllib.parse import urlparse


class LinkValidator:
    """Validates markdown links in documentation files."""
    
    def __init__(self, base_directory: Path):
        self.base_directory = base_directory
    
    def validate_file(self, file_path: Path) -> Dict[str, Any]:
        """
        Validate all links in a single markdown file.
        
        Args:
            file_path: Path to the markdown file
            
        Returns:
            Dictionary containing validation results
        """
        result = {
            'file': str(file_path),
            'valid': True,
            'links': [],
            'broken_links': [],
            'external_links': [],
            'total_links': 0,
            'broken_count': 0,
            'external_count': 0
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract all links
            links = self._extract_links(content, file_path)
            result['links'] = links
            result['total_links'] = len(links)
            
            # Validate each link
            for link in links:
                if link['type'] == 'relative':
                    if not self._validate_relative_link(link, file_path):
                        result['broken_links'].append(link)
                        result['broken_count'] += 1
                elif link['type'] == 'external':
                    result['external_links'].append(link)
                    result['external_count'] += 1
            
            if result['broken_count'] > 0:
                result['valid'] = False
                
        except Exception as e:
            result['valid'] = False
            result['error'] = f"Failed to read file: {str(e)}"
        
        return result
    
    def _extract_links(self, content: str, file_path: Path) -> List[Dict[str, Any]]:
        """
        Extract all markdown links from content.
        
        Args:
            content: Markdown content
            file_path: Path to the file being processed
            
        Returns:
            List of link dictionaries with metadata
        """
        links = []
        lines = content.split('\n')
        
        # Regular expression for markdown links: [text](url)
        link_pattern = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')
        
        for line_num, line in enumerate(lines, 1):
            for match in link_pattern.finditer(line):
                link_text = match.group(1)
                link_url = match.group(2).strip()
                
                # Skip empty links
                if not link_url:
                    continue
                
                # Determine link type
                link_type = self._classify_link(link_url)
                
                link_info = {
                    'text': link_text,
                    'url': link_url,
                    'type': link_type,
                    'line': line_num,
                    'column': match.start() + 1
                }
                
                links.append(link_info)
        
        return links
    
    def _classify_link(self, url: str) -> str:
        """
        Classify a link as relative, absolute, or external.
        
        Args:
            url: URL to classify
            
        Returns:
            Link type: 'relative', 'absolute', 'external', or 'anchor'
        """
        # Remove any anchor fragments for classification
        url_without_anchor = url.split('#')[0]
        
        # Check for anchor-only links
        if url.startswith('#'):
            return 'anchor'
        
        # Check for external links (http/https)
        if url.startswith(('http://', 'https://')):
            return 'external'
        
        # Check for absolute paths (starting with /)
        if url.startswith('/'):
            return 'absolute'
        
        # Everything else is relative
        return 'relative'
    
    def _validate_relative_link(self, link: Dict[str, Any], source_file: Path) -> bool:
        """
        Validate that a relative link points to an existing file.
        
        Args:
            link: Link information dictionary
            source_file: Path to the file containing the link
            
        Returns:
            True if the link target exists
        """
        url = link['url']
        
        # Remove anchor fragment if present
        url_without_anchor = url.split('#')[0]
        
        # Skip if it's just an anchor
        if not url_without_anchor:
            return True
        
        # Resolve the relative path
        source_dir = source_file.parent
        target_path = source_dir / url_without_anchor
        
        try:
            # Resolve to absolute path and check if it exists
            resolved_path = target_path.resolve()
            
            # Check if the resolved path is within the base directory
            try:
                resolved_path.relative_to(self.base_directory.resolve())
            except ValueError:
                # Path is outside the base directory
                link['error'] = f"Link points outside base directory: {resolved_path}"
                return False
            
            # Check if file exists
            if not resolved_path.exists():
                link['error'] = f"Target file does not exist: {resolved_path}"
                return False
            
            # Check if it's a file (not a directory)
            if not resolved_path.is_file():
                link['error'] = f"Target is not a file: {resolved_path}"
                return False
            
            return True
            
        except Exception as e:
            link['error'] = f"Error resolving path: {str(e)}"
            return False
    
    def validate_directory(self, directory: Path, recursive: bool = True) -> Dict[str, Any]:
        """
        Validate links in all markdown files in a directory.
        
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
                'total_links': 0,
                'broken_links': 0,
                'external_links': 0,
                'relative_links': 0,
                'anchor_links': 0
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
                
                results['summary']['total_links'] += file_result['total_links']
                results['summary']['broken_links'] += file_result['broken_count']
                results['summary']['external_links'] += file_result['external_count']
                
                # Count link types
                for link in file_result['links']:
                    if link['type'] == 'relative':
                        results['summary']['relative_links'] += 1
                    elif link['type'] == 'anchor':
                        results['summary']['anchor_links'] += 1
        
        return results
    
    def generate_link_report(self, results: Dict[str, Any]) -> str:
        """
        Generate a detailed link report.
        
        Args:
            results: Validation results dictionary
            
        Returns:
            Formatted report string
        """
        report_lines = []
        summary = results['summary']
        
        report_lines.append("# Link Validation Report")
        report_lines.append("")
        report_lines.append(f"**Directory:** {results['directory']}")
        report_lines.append(f"**Total files:** {summary['total_files']}")
        report_lines.append(f"**Files with valid links:** {summary['valid_files']}")
        report_lines.append(f"**Files with broken links:** {summary['invalid_files']}")
        report_lines.append("")
        report_lines.append("## Link Statistics")
        report_lines.append("")
        report_lines.append(f"- **Total links:** {summary['total_links']}")
        report_lines.append(f"- **Relative links:** {summary['relative_links']}")
        report_lines.append(f"- **External links:** {summary['external_links']}")
        report_lines.append(f"- **Anchor links:** {summary['anchor_links']}")
        report_lines.append(f"- **Broken links:** {summary['broken_links']}")
        
        if summary['broken_links'] > 0:
            report_lines.append("")
            report_lines.append("## Broken Links")
            report_lines.append("")
            
            for file_result in results['files']:
                if file_result['broken_links']:
                    report_lines.append(f"### {file_result['file']}")
                    report_lines.append("")
                    
                    for broken_link in file_result['broken_links']:
                        report_lines.append(f"- **Line {broken_link['line']}:** `{broken_link['url']}`")
                        report_lines.append(f"  - Text: \"{broken_link['text']}\"")
                        if 'error' in broken_link:
                            report_lines.append(f"  - Error: {broken_link['error']}")
                        report_lines.append("")
        
        return '\n'.join(report_lines)


def print_results(results: Dict[str, Any], verbose: bool = False):
    """
    Print validation results in a readable format.
    
    Args:
        results: Validation results dictionary
        verbose: Whether to show detailed output
    """
    summary = results['summary']
    
    print(f"\n=== Link Validation Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Valid files: {summary['valid_files']}")
    print(f"Files with broken links: {summary['invalid_files']}")
    print(f"Total links: {summary['total_links']}")
    print(f"Broken links: {summary['broken_links']}")
    print(f"External links: {summary['external_links']}")
    print(f"Relative links: {summary['relative_links']}")
    print(f"Anchor links: {summary['anchor_links']}")
    
    if summary['broken_links'] > 0:
        print(f"\n=== Broken Links ===")
        
        for file_result in results['files']:
            if file_result['broken_links']:
                print(f"\nFile: {file_result['file']}")
                for broken_link in file_result['broken_links']:
                    print(f"  Line {broken_link['line']}: [{broken_link['text']}]({broken_link['url']})")
                    if 'error' in broken_link:
                        print(f"    Error: {broken_link['error']}")
    
    if verbose:
        print(f"\n=== All Links ===")
        
        for file_result in results['files']:
            if 'error' in file_result:
                print(f"\nFile: {file_result['file']}")
                print(f"Error: {file_result['error']}")
                continue
            
            if file_result['links']:
                print(f"\nFile: {file_result['file']}")
                print(f"Total links: {file_result['total_links']}")
                
                for link in file_result['links']:
                    status = "✗" if link in file_result['broken_links'] else "✓"
                    print(f"  {status} Line {link['line']}: [{link['text']}]({link['url']}) ({link['type']})")


def main():
    """Main function to run the link validator."""
    parser = argparse.ArgumentParser(description='Validate markdown links in documentation files')
    parser.add_argument('path', help='Path to markdown file or directory to validate')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output including all links')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    parser.add_argument('--report', '-r', help='Generate detailed report and save to file')
    parser.add_argument('--base-dir', '-b', help='Base directory for resolving relative paths (default: parent of target path)')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    
    if not path.exists():
        print(f"Error: Path '{path}' does not exist")
        sys.exit(1)
    
    # Determine base directory
    if args.base_dir:
        base_directory = Path(args.base_dir)
    else:
        base_directory = path.parent if path.is_file() else path
    
    validator = LinkValidator(base_directory)
    
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
                'total_links': result['total_links'],
                'broken_links': result['broken_count'],
                'external_links': result['external_count'],
                'relative_links': sum(1 for link in result['links'] if link['type'] == 'relative'),
                'anchor_links': sum(1 for link in result['links'] if link['type'] == 'anchor')
            }
        }
    else:
        # Validate directory
        results = validator.validate_directory(path, recursive=not args.no_recursive)
    
    print_results(results, verbose=args.verbose)
    
    # Generate report if requested
    if args.report:
        report_content = validator.generate_link_report(results)
        with open(args.report, 'w', encoding='utf-8') as f:
            f.write(report_content)
        print(f"\nDetailed report saved to: {args.report}")
    
    # Exit with error code if there are broken links
    if results['summary']['broken_links'] > 0:
        sys.exit(1)


if __name__ == '__main__':
    main()