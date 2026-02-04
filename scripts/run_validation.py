#!/usr/bin/env python3
"""
Main Validation Runner for Denmark Living Documentation System

This script orchestrates all validation scripts and collects results from all validators
to generate a comprehensive validation report.

Requirements: All
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Any, Optional
import argparse
from datetime import datetime
import importlib.util


class ValidationOrchestrator:
    """Orchestrates all validation scripts and collects results."""
    
    def __init__(self, docs_directory: Path, scripts_directory: Path):
        self.docs_directory = docs_directory
        self.scripts_directory = scripts_directory
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'docs_directory': str(docs_directory),
            'validation_results': {},
            'summary': {
                'total_validators': 0,
                'successful_validators': 0,
                'failed_validators': 0,
                'total_errors': 0,
                'total_warnings': 0,
                'overall_status': 'UNKNOWN'
            }
        }
        
        # Define all available validators
        self.validators = {
            'markdown': {
                'script': 'validate_markdown.py',
                'description': 'Markdown format and structure validation',
                'class': 'MarkdownValidator',
                'method': 'validate_directory'
            },
            'metadata': {
                'script': 'validate_metadata.py', 
                'description': 'Frontmatter metadata validation',
                'class': 'MetadataValidator',
                'method': 'validate_directory'
            },
            'tokens': {
                'script': 'count_tokens.py',
                'description': 'Token count validation for RAG optimization',
                'class': 'TokenCounter',
                'method': 'count_directory_tokens'
            },
            'links': {
                'script': 'validate_links.py',
                'description': 'Cross-reference link validation',
                'class': 'LinkValidator',
                'method': 'validate_directory'
            },
            'structure': {
                'script': 'validate_structure.py',
                'description': 'Directory structure validation',
                'class': 'StructureValidator',
                'method': 'validate_structure'
            },
            'procedures': {
                'script': 'validate_procedures.py',
                'description': 'Procedural guide completeness validation',
                'class': 'ProceduralGuideValidator',
                'method': 'validate_directory'
            },
            'translations': {
                'script': 'validate_translations.py',
                'description': 'Danish term translation validation',
                'class': 'DanishTermValidator',
                'method': 'validate_directory'
            },
            'acronyms': {
                'script': 'validate_acronyms.py',
                'description': 'Acronym definition validation',
                'class': 'AcronymValidator',
                'method': 'validate_directory'
            },
            'terminology': {
                'script': 'check_terminology.py',
                'description': 'Terminology consistency validation',
                'class': 'TerminologyConsistencyChecker',
                'method': 'analyze_directory'
            },
            'citizenship': {
                'script': 'validate_citizenship.py',
                'description': 'EU/Non-EU citizenship distinction validation',
                'class': 'CitizenshipDistinctionValidator',
                'method': 'validate_directory'
            }
        }
    
    def run_all_validations(self, selected_validators: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Run all validation scripts and collect results.
        
        Args:
            selected_validators: List of validator names to run, or None for all
            
        Returns:
            Dictionary containing all validation results
        """
        validators_to_run = selected_validators or list(self.validators.keys())
        
        print(f"Running validation on: {self.docs_directory}")
        print(f"Validators to run: {', '.join(validators_to_run)}")
        print("=" * 60)
        
        for validator_name in validators_to_run:
            if validator_name not in self.validators:
                print(f"Warning: Unknown validator '{validator_name}', skipping...")
                continue
            
            print(f"\nRunning {validator_name} validation...")
            result = self._run_validator(validator_name)
            self.results['validation_results'][validator_name] = result
            
            # Update summary statistics
            self.results['summary']['total_validators'] += 1
            if result.get('success', False):
                self.results['summary']['successful_validators'] += 1
                # Add error/warning counts from successful validations
                if 'summary' in result.get('data', {}):
                    summary = result['data']['summary']
                    self.results['summary']['total_errors'] += summary.get('total_errors', 0)
                    self.results['summary']['total_warnings'] += summary.get('total_warnings', 0)
            else:
                self.results['summary']['failed_validators'] += 1
        
        # Determine overall status
        if self.results['summary']['failed_validators'] > 0:
            self.results['summary']['overall_status'] = 'FAILED'
        elif self.results['summary']['total_errors'] > 0:
            self.results['summary']['overall_status'] = 'ERRORS'
        elif self.results['summary']['total_warnings'] > 0:
            self.results['summary']['overall_status'] = 'WARNINGS'
        else:
            self.results['summary']['overall_status'] = 'PASSED'
        
        return self.results
    
    def _run_validator(self, validator_name: str) -> Dict[str, Any]:
        """
        Run a single validator and return its results.
        
        Args:
            validator_name: Name of the validator to run
            
        Returns:
            Dictionary containing validator results
        """
        validator_config = self.validators[validator_name]
        script_path = self.scripts_directory / validator_config['script']
        
        result = {
            'validator': validator_name,
            'description': validator_config['description'],
            'script': validator_config['script'],
            'success': False,
            'data': None,
            'error': None,
            'execution_time': 0
        }
        
        start_time = datetime.now()
        
        try:
            # Import and run the validator module
            if script_path.exists():
                result_data = self._import_and_run_validator(script_path, validator_config)
                result['data'] = result_data
                result['success'] = True
                print(f"  ✓ {validator_config['description']} completed")
            else:
                result['error'] = f"Validator script not found: {script_path}"
                print(f"  ✗ {validator_config['description']} failed: script not found")
        
        except Exception as e:
            result['error'] = str(e)
            print(f"  ✗ {validator_config['description']} failed: {str(e)}")
        
        result['execution_time'] = (datetime.now() - start_time).total_seconds()
        return result
    
    def _import_and_run_validator(self, script_path: Path, validator_config: Dict[str, str]) -> Dict[str, Any]:
        """
        Import a validator module and run its validation method.
        
        Args:
            script_path: Path to the validator script
            validator_config: Configuration for the validator
            
        Returns:
            Validation results from the validator
        """
        # Import the module dynamically
        spec = importlib.util.spec_from_file_location("validator_module", script_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        # Get the validator class
        validator_class = getattr(module, validator_config['class'])
        
        # Create validator instance
        if validator_config['class'] == 'TokenCounter':
            # TokenCounter takes a token_limit parameter
            validator = validator_class(token_limit=1000)
        elif validator_config['class'] == 'LinkValidator':
            # LinkValidator takes a base_directory parameter
            validator = validator_class(base_directory=self.docs_directory)
        else:
            validator = validator_class()
        
        # Run the validation method
        method_name = validator_config['method']
        validation_method = getattr(validator, method_name)
        
        # Call the appropriate method based on validator type
        if validator_config['class'] == 'StructureValidator':
            # Structure validator takes docs directory directly
            return validation_method(self.docs_directory)
        else:
            # Other validators take directory and recursive flag
            return validation_method(self.docs_directory, recursive=True)
    
    def save_results(self, output_file: Path) -> None:
        """
        Save validation results to a JSON file.
        
        Args:
            output_file: Path to save the results JSON file
        """
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, indent=2, ensure_ascii=False)
            print(f"\nResults saved to: {output_file}")
        except Exception as e:
            print(f"Error saving results: {str(e)}")
    
    def print_summary(self) -> None:
        """Print a summary of validation results."""
        summary = self.results['summary']
        
        print(f"\n{'=' * 60}")
        print(f"VALIDATION SUMMARY")
        print(f"{'=' * 60}")
        print(f"Overall Status: {summary['overall_status']}")
        print(f"Documentation Directory: {self.results['docs_directory']}")
        print(f"Validation Timestamp: {self.results['timestamp']}")
        print(f"")
        print(f"Validators Run: {summary['total_validators']}")
        print(f"  ✓ Successful: {summary['successful_validators']}")
        print(f"  ✗ Failed: {summary['failed_validators']}")
        print(f"")
        print(f"Issues Found:")
        print(f"  Errors: {summary['total_errors']}")
        print(f"  Warnings: {summary['total_warnings']}")
        
        # Show validator-specific results
        print(f"\nValidator Results:")
        for validator_name, result in self.results['validation_results'].items():
            status = "✓" if result['success'] else "✗"
            time_str = f"({result['execution_time']:.2f}s)"
            
            if result['success'] and result['data'] and 'summary' in result['data']:
                data_summary = result['data']['summary']
                error_count = data_summary.get('total_errors', 0)
                warning_count = data_summary.get('total_warnings', 0)
                detail = f"- {error_count} errors, {warning_count} warnings"
            elif not result['success']:
                detail = f"- {result['error']}"
            else:
                detail = ""
            
            print(f"  {status} {validator_name}: {result['description']} {time_str} {detail}")


def main():
    """Main function to run the validation orchestrator."""
    parser = argparse.ArgumentParser(description='Run comprehensive validation on Denmark Living Documentation System')
    parser.add_argument('--docs-dir', '-d', type=Path, default=Path('docs/denmark-living'),
                       help='Path to documentation directory (default: docs/denmark-living)')
    parser.add_argument('--scripts-dir', '-s', type=Path, default=Path('scripts'),
                       help='Path to validation scripts directory (default: scripts)')
    parser.add_argument('--output', '-o', type=Path, default=Path('validation_results.json'),
                       help='Output file for detailed results (default: validation_results.json)')
    parser.add_argument('--validators', '-v', nargs='+', 
                       help='Specific validators to run (default: all)')
    parser.add_argument('--list-validators', '-l', action='store_true',
                       help='List available validators and exit')
    parser.add_argument('--quiet', '-q', action='store_true',
                       help='Suppress detailed output, show only summary')
    
    args = parser.parse_args()
    
    # Resolve paths
    docs_dir = args.docs_dir.resolve()
    scripts_dir = args.scripts_dir.resolve()
    
    # Create orchestrator
    orchestrator = ValidationOrchestrator(docs_dir, scripts_dir)
    
    # List validators if requested
    if args.list_validators:
        print("Available validators:")
        for name, config in orchestrator.validators.items():
            print(f"  {name}: {config['description']}")
        return
    
    # Check if directories exist
    if not docs_dir.exists():
        print(f"Error: Documentation directory does not exist: {docs_dir}")
        sys.exit(1)
    
    if not scripts_dir.exists():
        print(f"Error: Scripts directory does not exist: {scripts_dir}")
        sys.exit(1)
    
    # Run validations
    if not args.quiet:
        print(f"Denmark Living Documentation System - Validation Runner")
        print(f"Documentation: {docs_dir}")
        print(f"Scripts: {scripts_dir}")
    
    try:
        results = orchestrator.run_all_validations(args.validators)
        
        # Save detailed results
        orchestrator.save_results(args.output)
        
        # Print summary
        if not args.quiet:
            orchestrator.print_summary()
        else:
            # Just print the overall status for quiet mode
            print(f"Validation Status: {results['summary']['overall_status']}")
            print(f"Errors: {results['summary']['total_errors']}, Warnings: {results['summary']['total_warnings']}")
        
        # Exit with appropriate code
        if results['summary']['overall_status'] in ['FAILED', 'ERRORS']:
            sys.exit(1)
        
    except KeyboardInterrupt:
        print("\nValidation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"Validation failed with error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()