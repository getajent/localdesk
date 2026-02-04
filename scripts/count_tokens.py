#!/usr/bin/env python3
"""
Token Counter for Denmark Living Documentation System

This script counts tokens in H2 sections of markdown files and:
- Counts tokens in each H2 section
- Flags sections exceeding 1000 tokens
- Generates report of violations

Requirements: 1.4
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any
import argparse


class TokenCounter:
    """Counts tokens in markdown sections for RAG optimization."""
    
    def __init__(self, token_limit: int = 1000):
        self.token_limit = token_limit
    
    def count_file_tokens(self, file_path: Path) -> Dict[str, Any]:
        """
        Count tokens in all H2 sections of a markdown file.
        
        Args:
            file_path: Path to the markdown file
            
        Returns:
            Dictionary containing token count results
        """
        result = {
            'file': str(file_path),
            'sections': [],
            'violations': [],
            'total_sections': 0,
            'sections_over_limit': 0,
            'max_tokens': 0,
            'avg_tokens': 0
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract H2 sections
            sections = self._extract_h2_sections(content)
            result['sections'] = sections
            result['total_sections'] = len(sections)
            
            # Count tokens and check violations
            token_counts = []
            for section in sections:
                token_count = self._count_tokens(section['content'])
                section['token_count'] = token_count
                token_counts.append(token_count)
                
                if token_count > self.token_limit:
                    result['violations'].append({
                        'section': section['heading'],
                        'line': section['line'],
                        'token_count': token_count,
                        'excess': token_count - self.token_limit
                    })
                    result['sections_over_limit'] += 1
            
            # Calculate statistics
            if token_counts:
                result['max_tokens'] = max(token_counts)
                result['avg_tokens'] = sum(token_counts) / len(token_counts)
            
        except Exception as e:
            result['error'] = f"Failed to process file: {str(e)}"
        
        return result
    
    def _extract_h2_sections(self, content: str) -> List[Dict[str, Any]]:
        """
        Extract all H2 sections from markdown content.
        
        Args:
            content: Markdown content
            
        Returns:
            List of section dictionaries with heading, content, and line number
        """
        sections = []
        lines = content.split('\n')
        
        # Find all H2 headings
        h2_positions = []
        for i, line in enumerate(lines):
            if re.match(r'^##\s+', line.strip()):
                h2_positions.append({
                    'line': i + 1,
                    'heading': line.strip()[2:].strip(),
                    'start_index': i
                })
        
        # Extract content for each H2 section
        for i, h2_pos in enumerate(h2_positions):
            start_line = h2_pos['start_index']
            
            # Find the end of this section (next H1 or H2, or end of file)
            end_line = len(lines)
            for j in range(start_line + 1, len(lines)):
                if re.match(r'^#{1,2}\s+', lines[j].strip()):
                    end_line = j
                    break
            
            # Extract section content (excluding the heading line)
            section_lines = lines[start_line + 1:end_line]
            section_content = '\n'.join(section_lines).strip()
            
            sections.append({
                'heading': h2_pos['heading'],
                'line': h2_pos['line'],
                'content': section_content,
                'start_line': start_line + 1,
                'end_line': end_line
            })
        
        return sections
    
    def _count_tokens(self, text: str) -> int:
        """
        Count tokens in text using a simple approximation.
        
        This uses a rough approximation where:
        - 1 token ≈ 4 characters for English text
        - Adjusts for markdown formatting
        
        Args:
            text: Text to count tokens for
            
        Returns:
            Approximate token count
        """
        if not text:
            return 0
        
        # Remove markdown formatting for more accurate count
        clean_text = self._clean_markdown(text)
        
        # Simple token approximation: ~4 characters per token for English
        # This is a rough estimate based on OpenAI's tokenization
        char_count = len(clean_text)
        token_estimate = char_count / 4
        
        # Adjust for word boundaries (more accurate for natural language)
        words = len(clean_text.split())
        word_based_estimate = words * 1.3  # Average ~1.3 tokens per word
        
        # Use the average of both methods for better accuracy
        final_estimate = (token_estimate + word_based_estimate) / 2
        
        return int(round(final_estimate))
    
    def _clean_markdown(self, text: str) -> str:
        """
        Remove markdown formatting to get clean text for token counting.
        
        Args:
            text: Markdown text
            
        Returns:
            Clean text without markdown formatting
        """
        # Remove markdown links but keep the text
        text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
        
        # Remove markdown emphasis
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Bold
        text = re.sub(r'\*([^*]+)\*', r'\1', text)      # Italic
        text = re.sub(r'`([^`]+)`', r'\1', text)        # Inline code
        
        # Remove markdown headings (H3-H6 within sections)
        text = re.sub(r'^#{3,6}\s+', '', text, flags=re.MULTILINE)
        
        # Remove list markers
        text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
        
        # Remove blockquote markers
        text = re.sub(r'^\s*>\s*', '', text, flags=re.MULTILINE)
        
        # Remove horizontal rules
        text = re.sub(r'^---+$', '', text, flags=re.MULTILINE)
        
        # Remove extra whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = text.strip()
        
        return text
    
    def count_directory_tokens(self, directory: Path, recursive: bool = True) -> Dict[str, Any]:
        """
        Count tokens in all markdown files in a directory.
        
        Args:
            directory: Directory to process
            recursive: Whether to search subdirectories
            
        Returns:
            Dictionary containing results for all files
        """
        results = {
            'directory': str(directory),
            'files': [],
            'summary': {
                'total_files': 0,
                'total_sections': 0,
                'sections_over_limit': 0,
                'files_with_violations': 0,
                'max_tokens_overall': 0,
                'avg_tokens_overall': 0,
                'token_limit': self.token_limit
            }
        }
        
        # Find all markdown files
        pattern = '**/*.md' if recursive else '*.md'
        markdown_files = list(directory.glob(pattern))
        
        all_token_counts = []
        
        for file_path in markdown_files:
            if file_path.is_file():
                file_result = self.count_file_tokens(file_path)
                results['files'].append(file_result)
                
                results['summary']['total_files'] += 1
                results['summary']['total_sections'] += file_result['total_sections']
                results['summary']['sections_over_limit'] += file_result['sections_over_limit']
                
                if file_result['sections_over_limit'] > 0:
                    results['summary']['files_with_violations'] += 1
                
                # Collect token counts for overall statistics
                for section in file_result['sections']:
                    if 'token_count' in section:
                        all_token_counts.append(section['token_count'])
        
        # Calculate overall statistics
        if all_token_counts:
            results['summary']['max_tokens_overall'] = max(all_token_counts)
            results['summary']['avg_tokens_overall'] = sum(all_token_counts) / len(all_token_counts)
        
        return results


def print_results(results: Dict[str, Any], verbose: bool = False, show_all_sections: bool = False):
    """
    Print token counting results in a readable format.
    
    Args:
        results: Token counting results dictionary
        verbose: Whether to show detailed output
        show_all_sections: Whether to show all sections or just violations
    """
    summary = results['summary']
    
    print(f"\n=== Token Count Results ===")
    print(f"Directory: {results['directory']}")
    print(f"Token limit: {summary['token_limit']}")
    print(f"Total files: {summary['total_files']}")
    print(f"Total sections: {summary['total_sections']}")
    print(f"Sections over limit: {summary['sections_over_limit']}")
    print(f"Files with violations: {summary['files_with_violations']}")
    print(f"Max tokens (overall): {summary['max_tokens_overall']}")
    print(f"Average tokens (overall): {summary['avg_tokens_overall']:.1f}")
    
    # Show violations
    if summary['sections_over_limit'] > 0:
        print(f"\n=== Violations (Sections > {summary['token_limit']} tokens) ===")
        
        for file_result in results['files']:
            if file_result['violations']:
                print(f"\nFile: {file_result['file']}")
                for violation in file_result['violations']:
                    print(f"  - Section '{violation['section']}' (line {violation['line']}): "
                          f"{violation['token_count']} tokens (+{violation['excess']} over limit)")
    
    # Show detailed section information if requested
    if verbose or show_all_sections:
        print(f"\n=== Section Details ===")
        
        for file_result in results['files']:
            if 'error' in file_result:
                print(f"\nFile: {file_result['file']}")
                print(f"Error: {file_result['error']}")
                continue
            
            if file_result['sections'] and (show_all_sections or file_result['violations']):
                print(f"\nFile: {file_result['file']}")
                print(f"Sections: {file_result['total_sections']}, "
                      f"Max: {file_result['max_tokens']}, "
                      f"Avg: {file_result['avg_tokens']:.1f}")
                
                for section in file_result['sections']:
                    status = "⚠️ OVER LIMIT" if section['token_count'] > summary['token_limit'] else "✓"
                    if show_all_sections or section['token_count'] > summary['token_limit']:
                        print(f"  {status} {section['heading']}: {section['token_count']} tokens (line {section['line']})")


def main():
    """Main function to run the token counter."""
    parser = argparse.ArgumentParser(description='Count tokens in H2 sections of markdown files')
    parser.add_argument('path', help='Path to markdown file or directory to analyze')
    parser.add_argument('--limit', '-l', type=int, default=1000, help='Token limit per section (default: 1000)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output')
    parser.add_argument('--show-all', '-a', action='store_true', help='Show all sections, not just violations')
    parser.add_argument('--no-recursive', action='store_true', help='Do not search subdirectories')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    counter = TokenCounter(token_limit=args.limit)
    
    if not path.exists():
        print(f"Error: Path '{path}' does not exist")
        sys.exit(1)
    
    if path.is_file():
        # Count tokens in single file
        result = counter.count_file_tokens(path)
        results = {
            'directory': str(path.parent),
            'files': [result],
            'summary': {
                'total_files': 1,
                'total_sections': result['total_sections'],
                'sections_over_limit': result['sections_over_limit'],
                'files_with_violations': 1 if result['sections_over_limit'] > 0 else 0,
                'max_tokens_overall': result['max_tokens'],
                'avg_tokens_overall': result['avg_tokens'],
                'token_limit': args.limit
            }
        }
    else:
        # Count tokens in directory
        results = counter.count_directory_tokens(path, recursive=not args.no_recursive)
    
    print_results(results, verbose=args.verbose, show_all_sections=args.show_all)
    
    # Exit with error code if there are violations
    if results['summary']['sections_over_limit'] > 0:
        sys.exit(1)


if __name__ == '__main__':
    main()