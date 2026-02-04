#!/usr/bin/env python3
"""
Validation Report Generator for Denmark Living Documentation System

This script formats validation results, highlights violations and errors,
and provides actionable recommendations for fixing issues.

Requirements: All
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
import argparse
from datetime import datetime
from collections import defaultdict


class ValidationReportGenerator:
    """Generates comprehensive validation reports from validation results."""
    
    def __init__(self, results_data: Dict[str, Any]):
        self.results = results_data
        self.recommendations = []
    
    def generate_html_report(self, output_file: Path) -> None:
        """
        Generate an HTML validation report.
        
        Args:
            output_file: Path to save the HTML report
        """
        html_content = self._build_html_report()
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"HTML report generated: {output_file}")
        except Exception as e:
            print(f"Error generating HTML report: {str(e)}")
    
    def generate_markdown_report(self, output_file: Path) -> None:
        """
        Generate a Markdown validation report.
        
        Args:
            output_file: Path to save the Markdown report
        """
        markdown_content = self._build_markdown_report()
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
            print(f"Markdown report generated: {output_file}")
        except Exception as e:
            print(f"Error generating Markdown report: {str(e)}")
    
    def generate_console_report(self, detailed: bool = False) -> None:
        """
        Generate a console-friendly validation report.
        
        Args:
            detailed: Whether to show detailed information
        """
        print(self._build_console_report(detailed))
    
    def _build_html_report(self) -> str:
        """Build HTML report content."""
        summary = self.results['summary']
        timestamp = self.results['timestamp']
        
        # Determine status color
        status_colors = {
            'PASSED': '#28a745',
            'WARNINGS': '#ffc107', 
            'ERRORS': '#fd7e14',
            'FAILED': '#dc3545'
        }
        status_color = status_colors.get(summary['overall_status'], '#6c757d')
        
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Denmark Living Documentation - Validation Report</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }}
        .container {{ max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }}
        .header h1 {{ margin: 0; font-size: 2.5em; }}
        .header p {{ margin: 10px 0 0 0; opacity: 0.9; }}
        .status-badge {{ display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; background: {status_color}; }}
        .content {{ padding: 30px; }}
        .summary-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }}
        .summary-card {{ background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }}
        .summary-card h3 {{ margin: 0 0 10px 0; color: #495057; }}
        .summary-card .number {{ font-size: 2em; font-weight: bold; color: #007bff; }}
        .validator-section {{ margin: 30px 0; }}
        .validator-card {{ border: 1px solid #dee2e6; border-radius: 8px; margin: 15px 0; }}
        .validator-header {{ padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; }}
        .validator-content {{ padding: 20px; }}
        .status-success {{ color: #28a745; }}
        .status-error {{ color: #dc3545; }}
        .status-warning {{ color: #ffc107; }}
        .error-list {{ background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin: 10px 0; }}
        .warning-list {{ background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 10px 0; }}
        .file-path {{ font-family: monospace; background: #e9ecef; padding: 2px 6px; border-radius: 3px; }}
        .recommendations {{ background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0; }}
        .recommendations h3 {{ color: #0c5460; margin-top: 0; }}
        .footer {{ text-align: center; padding: 20px; color: #6c757d; border-top: 1px solid #dee2e6; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Denmark Living Documentation</h1>
            <p>Validation Report - {timestamp}</p>
            <div style="margin-top: 15px;">
                <span class="status-badge">{summary['overall_status']}</span>
            </div>
        </div>
        
        <div class="content">
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Validators</h3>
                    <div class="number">{summary['total_validators']}</div>
                    <small>{summary['successful_validators']} successful, {summary['failed_validators']} failed</small>
                </div>
                <div class="summary-card">
                    <h3>Errors</h3>
                    <div class="number" style="color: #dc3545;">{summary['total_errors']}</div>
                    <small>Critical issues found</small>
                </div>
                <div class="summary-card">
                    <h3>Warnings</h3>
                    <div class="number" style="color: #ffc107;">{summary['total_warnings']}</div>
                    <small>Potential improvements</small>
                </div>
            </div>
            
            {self._build_html_validator_sections()}
            
            {self._build_html_recommendations()}
        </div>
        
        <div class="footer">
            <p>Generated by Denmark Living Documentation System Validator</p>
        </div>
    </div>
</body>
</html>"""
        
        return html
    
    def _build_html_validator_sections(self) -> str:
        """Build HTML sections for each validator."""
        sections = []
        
        for validator_name, result in self.results['validation_results'].items():
            status_class = "status-success" if result['success'] else "status-error"
            status_icon = "✓" if result['success'] else "✗"
            
            section = f"""
            <div class="validator-section">
                <div class="validator-card">
                    <div class="validator-header">
                        <h3><span class="{status_class}">{status_icon}</span> {validator_name.title()} Validation</h3>
                        <small>{result['execution_time']:.2f}s</small>
                    </div>
                    <div class="validator-content">
                        <p>{result['description']}</p>
                        {self._build_html_validator_details(result)}
                    </div>
                </div>
            </div>"""
            
            sections.append(section)
        
        return ''.join(sections)
    
    def _build_html_validator_details(self, result: Dict[str, Any]) -> str:
        """Build HTML details for a specific validator result."""
        if not result['success']:
            return f'<div class="error-list"><strong>Error:</strong> {result["error"]}</div>'
        
        if not result['data']:
            return '<p>No detailed results available.</p>'
        
        data = result['data']
        details = []
        
        # Show summary if available
        if 'summary' in data:
            summary = data['summary']
            details.append(f"""
                <p><strong>Summary:</strong> 
                {summary.get('total_files', 0)} files processed, 
                {summary.get('total_errors', 0)} errors, 
                {summary.get('total_warnings', 0)} warnings</p>
            """)
        
        # Show file-level issues
        if 'files' in data:
            error_files = [f for f in data['files'] if f.get('errors') or not f.get('valid', True)]
            if error_files:
                details.append('<div class="error-list">')
                details.append('<strong>Files with Issues:</strong>')
                details.append('<ul>')
                for file_result in error_files[:10]:  # Limit to first 10 files
                    file_path = file_result.get('file', 'Unknown file')
                    errors = file_result.get('errors', [])
                    details.append(f'<li><span class="file-path">{file_path}</span>')
                    if errors:
                        details.append('<ul>')
                        for error in errors[:3]:  # Limit to first 3 errors per file
                            details.append(f'<li>{error}</li>')
                        if len(errors) > 3:
                            details.append(f'<li><em>... and {len(errors) - 3} more errors</em></li>')
                        details.append('</ul>')
                    details.append('</li>')
                if len(error_files) > 10:
                    details.append(f'<li><em>... and {len(error_files) - 10} more files with issues</em></li>')
                details.append('</ul>')
                details.append('</div>')
        
        return ''.join(details)
    
    def _build_html_recommendations(self) -> str:
        """Build HTML recommendations section."""
        recommendations = self._generate_recommendations()
        
        if not recommendations:
            return ""
        
        html = ['<div class="recommendations">']
        html.append('<h3>🔧 Actionable Recommendations</h3>')
        html.append('<ol>')
        
        for rec in recommendations:
            html.append(f'<li><strong>{rec["priority"]} Priority:</strong> {rec["description"]}')
            if rec.get('action'):
                html.append(f'<br><em>Action:</em> {rec["action"]}')
            html.append('</li>')
        
        html.append('</ol>')
        html.append('</div>')
        
        return ''.join(html)
    
    def _build_markdown_report(self) -> str:
        """Build Markdown report content."""
        summary = self.results['summary']
        timestamp = self.results['timestamp']
        
        # Status emoji
        status_emojis = {
            'PASSED': '✅',
            'WARNINGS': '⚠️',
            'ERRORS': '❌',
            'FAILED': '💥'
        }
        status_emoji = status_emojis.get(summary['overall_status'], '❓')
        
        markdown = f"""# Denmark Living Documentation - Validation Report

**Status:** {status_emoji} {summary['overall_status']}  
**Generated:** {timestamp}  
**Documentation Directory:** `{self.results['docs_directory']}`

## Summary

| Metric | Count |
|--------|-------|
| Total Validators | {summary['total_validators']} |
| Successful | {summary['successful_validators']} |
| Failed | {summary['failed_validators']} |
| **Total Errors** | **{summary['total_errors']}** |
| **Total Warnings** | **{summary['total_warnings']}** |

## Validator Results

{self._build_markdown_validator_sections()}

{self._build_markdown_recommendations()}

---

*Report generated by Denmark Living Documentation System Validator*
"""
        
        return markdown
    
    def _build_markdown_validator_sections(self) -> str:
        """Build Markdown sections for each validator."""
        sections = []
        
        for validator_name, result in self.results['validation_results'].items():
            status_emoji = "✅" if result['success'] else "❌"
            
            sections.append(f"### {status_emoji} {validator_name.title()} Validation")
            sections.append(f"**Description:** {result['description']}")
            sections.append(f"**Execution Time:** {result['execution_time']:.2f}s")
            sections.append("")
            
            if not result['success']:
                sections.append(f"**Error:** {result['error']}")
            elif result['data']:
                sections.append(self._build_markdown_validator_details(result))
            
            sections.append("")
        
        return '\n'.join(sections)
    
    def _build_markdown_validator_details(self, result: Dict[str, Any]) -> str:
        """Build Markdown details for a specific validator result."""
        data = result['data']
        details = []
        
        # Show summary if available
        if 'summary' in data:
            summary = data['summary']
            details.append(f"**Files Processed:** {summary.get('total_files', 0)}")
            details.append(f"**Errors Found:** {summary.get('total_errors', 0)}")
            details.append(f"**Warnings Found:** {summary.get('total_warnings', 0)}")
            details.append("")
        
        # Show top issues
        if 'files' in data:
            error_files = [f for f in data['files'] if f.get('errors') or not f.get('valid', True)]
            if error_files:
                details.append("**Files with Issues:**")
                for file_result in error_files[:5]:  # Limit to first 5 files
                    file_path = file_result.get('file', 'Unknown file')
                    errors = file_result.get('errors', [])
                    details.append(f"- `{file_path}`")
                    for error in errors[:2]:  # Limit to first 2 errors per file
                        details.append(f"  - {error}")
                    if len(errors) > 2:
                        details.append(f"  - *... and {len(errors) - 2} more errors*")
                
                if len(error_files) > 5:
                    details.append(f"- *... and {len(error_files) - 5} more files with issues*")
                details.append("")
        
        return '\n'.join(details)
    
    def _build_markdown_recommendations(self) -> str:
        """Build Markdown recommendations section."""
        recommendations = self._generate_recommendations()
        
        if not recommendations:
            return ""
        
        markdown = ["## 🔧 Actionable Recommendations", ""]
        
        for i, rec in enumerate(recommendations, 1):
            markdown.append(f"{i}. **{rec['priority']} Priority:** {rec['description']}")
            if rec.get('action'):
                markdown.append(f"   - *Action:* {rec['action']}")
            markdown.append("")
        
        return '\n'.join(markdown)
    
    def _build_console_report(self, detailed: bool = False) -> str:
        """Build console-friendly report content."""
        summary = self.results['summary']
        timestamp = self.results['timestamp']
        
        # Status symbols
        status_symbols = {
            'PASSED': '✅',
            'WARNINGS': '⚠️ ',
            'ERRORS': '❌',
            'FAILED': '💥'
        }
        status_symbol = status_symbols.get(summary['overall_status'], '❓')
        
        lines = [
            "=" * 70,
            "DENMARK LIVING DOCUMENTATION - VALIDATION REPORT",
            "=" * 70,
            f"Status: {status_symbol} {summary['overall_status']}",
            f"Generated: {timestamp}",
            f"Documentation: {self.results['docs_directory']}",
            "",
            "SUMMARY:",
            f"  Validators: {summary['total_validators']} ({summary['successful_validators']} successful, {summary['failed_validators']} failed)",
            f"  Errors: {summary['total_errors']}",
            f"  Warnings: {summary['total_warnings']}",
            "",
            "VALIDATOR RESULTS:",
        ]
        
        # Add validator results
        for validator_name, result in self.results['validation_results'].items():
            status = "✅" if result['success'] else "❌"
            time_str = f"({result['execution_time']:.2f}s)"
            
            lines.append(f"  {status} {validator_name}: {result['description']} {time_str}")
            
            if detailed:
                if not result['success']:
                    lines.append(f"     Error: {result['error']}")
                elif result['data'] and 'summary' in result['data']:
                    data_summary = result['data']['summary']
                    errors = data_summary.get('total_errors', 0)
                    warnings = data_summary.get('total_warnings', 0)
                    files = data_summary.get('total_files', 0)
                    lines.append(f"     Files: {files}, Errors: {errors}, Warnings: {warnings}")
        
        # Add recommendations
        recommendations = self._generate_recommendations()
        if recommendations:
            lines.extend(["", "RECOMMENDATIONS:"])
            for i, rec in enumerate(recommendations[:5], 1):  # Top 5 recommendations
                lines.append(f"  {i}. [{rec['priority']}] {rec['description']}")
                if rec.get('action'):
                    lines.append(f"     Action: {rec['action']}")
        
        lines.append("=" * 70)
        
        return '\n'.join(lines)
    
    def _generate_recommendations(self) -> List[Dict[str, str]]:
        """Generate actionable recommendations based on validation results."""
        recommendations = []
        summary = self.results['summary']
        
        # High priority recommendations
        if summary['failed_validators'] > 0:
            recommendations.append({
                'priority': 'HIGH',
                'description': f"{summary['failed_validators']} validator(s) failed to run",
                'action': "Check validator scripts exist and dependencies are installed"
            })
        
        if summary['total_errors'] > 0:
            recommendations.append({
                'priority': 'HIGH', 
                'description': f"{summary['total_errors']} critical errors found",
                'action': "Review error details and fix issues before proceeding"
            })
        
        # Analyze specific validator results for targeted recommendations
        for validator_name, result in self.results['validation_results'].items():
            if not result['success'] or not result['data']:
                continue
            
            data = result['data']
            
            # Markdown validation recommendations
            if validator_name == 'markdown' and 'summary' in data:
                invalid_files = data['summary'].get('invalid_files', 0)
                if invalid_files > 0:
                    recommendations.append({
                        'priority': 'HIGH',
                        'description': f"{invalid_files} files have markdown syntax errors",
                        'action': "Fix heading hierarchy and markdown formatting issues"
                    })
            
            # Metadata validation recommendations
            elif validator_name == 'metadata' and 'summary' in data:
                no_metadata = data['summary'].get('files_without_metadata', 0)
                if no_metadata > 0:
                    recommendations.append({
                        'priority': 'MEDIUM',
                        'description': f"{no_metadata} files missing frontmatter metadata",
                        'action': "Add required metadata fields (title, category, source_url, last_updated)"
                    })
            
            # Token count recommendations
            elif validator_name == 'tokens' and 'summary' in data:
                over_limit = data['summary'].get('sections_over_limit', 0)
                if over_limit > 0:
                    recommendations.append({
                        'priority': 'MEDIUM',
                        'description': f"{over_limit} sections exceed 1000 token limit",
                        'action': "Split large sections or condense content for better RAG performance"
                    })
            
            # Link validation recommendations
            elif validator_name == 'links' and 'summary' in data:
                broken_links = data['summary'].get('total_errors', 0)
                if broken_links > 0:
                    recommendations.append({
                        'priority': 'HIGH',
                        'description': f"{broken_links} broken cross-references found",
                        'action': "Fix broken links or create missing target documents"
                    })
        
        # Medium priority recommendations
        if summary['total_warnings'] > 10:
            recommendations.append({
                'priority': 'MEDIUM',
                'description': f"{summary['total_warnings']} warnings found",
                'action': "Review warnings for potential improvements to documentation quality"
            })
        
        # Low priority recommendations
        if summary['total_warnings'] > 0 and summary['total_errors'] == 0:
            recommendations.append({
                'priority': 'LOW',
                'description': "Consider addressing warnings to improve documentation quality",
                'action': "Review warning details and implement suggested improvements"
            })
        
        # Sort by priority
        priority_order = {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 3))
        
        return recommendations


def load_results(results_file: Path) -> Dict[str, Any]:
    """
    Load validation results from JSON file.
    
    Args:
        results_file: Path to the validation results JSON file
        
    Returns:
        Dictionary containing validation results
    """
    try:
        with open(results_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading results file: {str(e)}")
        sys.exit(1)


def main():
    """Main function to generate validation reports."""
    parser = argparse.ArgumentParser(description='Generate validation reports from validation results')
    parser.add_argument('results_file', type=Path, help='Path to validation results JSON file')
    parser.add_argument('--html', type=Path, help='Generate HTML report to specified file')
    parser.add_argument('--markdown', type=Path, help='Generate Markdown report to specified file')
    parser.add_argument('--console', action='store_true', help='Display console report (default)')
    parser.add_argument('--detailed', '-d', action='store_true', help='Show detailed information')
    
    args = parser.parse_args()
    
    # Check if results file exists
    if not args.results_file.exists():
        print(f"Error: Results file does not exist: {args.results_file}")
        sys.exit(1)
    
    # Load validation results
    results_data = load_results(args.results_file)
    
    # Create report generator
    generator = ValidationReportGenerator(results_data)
    
    # Generate requested reports
    if args.html:
        generator.generate_html_report(args.html)
    
    if args.markdown:
        generator.generate_markdown_report(args.markdown)
    
    if args.console or (not args.html and not args.markdown):
        generator.generate_console_report(detailed=args.detailed)


if __name__ == '__main__':
    main()