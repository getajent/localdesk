# Denmark Living Documentation - Validation System

This directory contains the comprehensive validation system for the Denmark Living Documentation System. The validation system ensures documentation quality, consistency, and compliance with the design requirements.

## Overview

The validation system consists of:

1. **Individual Validators** - Specialized scripts that validate specific aspects of the documentation
2. **Validation Orchestrator** - Coordinates all validators and collects results
3. **Report Generator** - Creates comprehensive reports in multiple formats

## Quick Start

### Run All Validations

```bash
# Run all validators with detailed output
python scripts/run_validation.py

# Run all validators quietly (summary only)
python scripts/run_validation.py --quiet

# Run specific validators
python scripts/run_validation.py --validators markdown metadata tokens
```

### Generate Reports

```bash
# Generate console report (default)
python scripts/generate_report.py validation_results.json

# Generate HTML report
python scripts/generate_report.py validation_results.json --html report.html

# Generate Markdown report
python scripts/generate_report.py validation_results.json --markdown report.md

# Generate all formats
python scripts/generate_report.py validation_results.json --html report.html --markdown report.md --console
```

## Available Validators

| Validator | Description | Requirements Validated |
|-----------|-------------|----------------------|
| `markdown` | Markdown format and structure validation | 1.2, 7.1, 8.5 |
| `metadata` | Frontmatter metadata validation | 6.4 |
| `tokens` | Token count validation for RAG optimization | 1.4 |
| `links` | Cross-reference link validation | 1.5 |
| `structure` | Directory structure validation | 1.1, 1.3 |
| `procedures` | Procedural guide completeness validation | 7.2, 7.3, 7.4, 7.5 |
| `translations` | Danish term translation validation | 8.2 |
| `acronyms` | Acronym definition validation | 8.3 |
| `terminology` | Terminology consistency validation | 8.4 |
| `citizenship` | EU/Non-EU citizenship distinction validation | 2.7, 7.6 |

## Command Line Options

### run_validation.py

```bash
python scripts/run_validation.py [OPTIONS]

Options:
  --docs-dir, -d PATH       Documentation directory (default: docs/denmark-living)
  --scripts-dir, -s PATH    Validation scripts directory (default: scripts)
  --output, -o FILE         Output file for results (default: validation_results.json)
  --validators, -v LIST     Specific validators to run (default: all)
  --list-validators, -l     List available validators and exit
  --quiet, -q              Suppress detailed output, show only summary
  --help, -h               Show help message
```

### generate_report.py

```bash
python scripts/generate_report.py RESULTS_FILE [OPTIONS]

Arguments:
  RESULTS_FILE             Path to validation results JSON file

Options:
  --html FILE              Generate HTML report to specified file
  --markdown FILE          Generate Markdown report to specified file
  --console                Display console report (default)
  --detailed, -d           Show detailed information
  --help, -h              Show help message
```

## Validation Results

### Exit Codes

- `0` - All validations passed (or warnings only)
- `1` - Validation errors found or validator failures

### Status Levels

- **PASSED** - All validations successful, no errors or warnings
- **WARNINGS** - All validations successful, but warnings found
- **ERRORS** - All validations successful, but errors found
- **FAILED** - One or more validators failed to run

### Output Files

- `validation_results.json` - Detailed validation results in JSON format
- HTML reports - Styled web-friendly validation reports
- Markdown reports - Documentation-friendly validation reports

## Integration

### CI/CD Integration

```bash
# Basic validation check
python scripts/run_validation.py --quiet
if [ $? -ne 0 ]; then
    echo "Validation failed"
    exit 1
fi

# Generate reports for review
python scripts/generate_report.py validation_results.json --html validation_report.html
```

### Pre-commit Hook

```bash
#!/bin/bash
# Run validation before commit
python scripts/run_validation.py --validators markdown metadata links --quiet
```

## Troubleshooting

### Common Issues

1. **Validator script not found**
   - Ensure all validator scripts exist in the scripts directory
   - Check file permissions

2. **Import errors**
   - Ensure Python path includes the scripts directory
   - Check for missing dependencies

3. **Documentation directory not found**
   - Verify the docs directory path
   - Use `--docs-dir` to specify custom path

### Debug Mode

For detailed debugging, run individual validators:

```bash
python scripts/validate_markdown.py docs/denmark-living --verbose
python scripts/validate_metadata.py docs/denmark-living --verbose
```

## Development

### Adding New Validators

1. Create a new validator script in the `scripts/` directory
2. Follow the standard validator interface:
   - Class with descriptive name
   - Method that takes directory and recursive parameters
   - Returns results dictionary with standard format
3. Add the validator to the `validators` dictionary in `run_validation.py`

### Standard Result Format

```python
{
    'directory': str,           # Directory validated
    'files': [                  # List of file results
        {
            'file': str,        # File path
            'valid': bool,      # Overall file validity
            'errors': [str],    # List of error messages
            'warnings': [str]   # List of warning messages
        }
    ],
    'summary': {
        'total_files': int,     # Number of files processed
        'valid_files': int,     # Number of valid files
        'invalid_files': int,   # Number of invalid files
        'total_errors': int,    # Total error count
        'total_warnings': int   # Total warning count
    }
}
```

## Requirements Mapping

The validation system validates all requirements from the design document:

- **Content Organization** (1.1-1.5) - structure, markdown, tokens, links
- **Source Attribution** (6.1-6.4) - metadata
- **Procedural Guides** (7.1-7.6) - procedures, citizenship
- **Accessibility** (8.1-8.5) - translations, acronyms, terminology, markdown
- **All other requirements** - Covered by specific validators

For detailed requirement mappings, see the individual validator documentation.