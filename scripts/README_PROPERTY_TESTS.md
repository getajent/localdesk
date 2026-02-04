# Property-Based Testing Framework

This directory contains the property-based testing framework for the Denmark Living Documentation System. The framework uses the Hypothesis library to verify correctness properties across all documentation.

## Quick Start

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run All Property Tests

```bash
python scripts/run_property_tests.py
```

### Run Tests with Custom Configuration

```bash
# Run with more examples per test
python scripts/run_property_tests.py --examples 200

# Run with verbose output
python scripts/run_property_tests.py --verbose

# Save results to JSON file
python scripts/run_property_tests.py --output results.json
```

### Run Framework Tests

```bash
# Test the framework itself
python scripts/test_property_framework.py

# Or use pytest
pytest scripts/test_property_framework.py -v
```

## Framework Components

### Core Files

- **`property_test_config.py`** - Configuration and utilities for property-based testing
- **`run_property_tests.py`** - Main test runner that executes all 22 property tests
- **`test_property_framework.py`** - Unit tests for the framework itself

### Configuration Files

- **`requirements.txt`** - Python dependencies including Hypothesis
- **`pytest.ini`** - Pytest configuration with property test settings

## Property Tests

The framework implements 22 property tests that validate the correctness of the documentation system:

1. **Required Documentation Completeness** - All required documents exist
2. **Category Organization Structure** - Files are in correct categories
3. **Markdown Format Compliance** - Valid markdown with proper heading hierarchy
4. **Overview-Details Pattern** - Each category has overview.md
5. **Section Token Limit** - H2 sections don't exceed 1000 tokens
6. **Cross-Reference Validity** - All relative links point to existing files
7. **Citizenship Distinction** - EU/Non-EU procedures are clearly distinguished
8. **Complete Source Attribution** - All documents have proper source metadata
9. **Procedural Guide Completeness** - Procedural docs have required sections
10. **Deadline Highlighting** - Time-sensitive requirements are highlighted
11. **Processing Time Documentation** - Processing times are documented
12. **Source Type Distinction** - Official vs community sources are distinguished
13. **Danish Term Translation** - Danish terms have English translations
14. **Acronym Definition** - Acronyms are defined on first use
15. **Terminology Consistency** - Consistent terminology across documents
16. **Keyword Optimization** - Sections contain relevant keywords
17. **Procedure Continuity** - Steps aren't split across sections
18. **Dual-Level Documentation** - Complex topics have overview and details
19. **Troubleshooting Information** - Procedural docs include troubleshooting
20. **Rejection Scenario Documentation** - Application rejection scenarios covered
21. **Contact Information Inclusion** - Official procedures include contact info
22. **Benefits Eligibility Requirements** - Benefits docs specify eligibility

## Test Configuration

### Hypothesis Settings

- **Minimum Examples**: 100 per test (configurable)
- **Maximum Examples**: 1000 per test
- **Deadline**: 60 seconds per test
- **Profile**: `property_tests`

### Test Tags

All property tests use standardized tags:
```
Feature: denmark-living-docs, Property {N}: {Property Name}
```

## Usage Examples

### Basic Usage

```python
from property_test_config import PropertyTestConfig, DocumentGenerators

# Get all documentation files
files = DocumentGenerators.get_all_documentation_files()

# Get files by category
social_benefits = DocumentGenerators.get_files_by_category("social-benefits")

# Get procedural documents
procedural = DocumentGenerators.get_procedural_documents()
```

### Running Individual Properties

```python
from run_property_tests import PropertyTestRunner

runner = PropertyTestRunner(verbose=True)

# Run a specific property test
result = runner._test_property_1()  # Required Documentation Completeness
print(f"Passed: {result['passed']}")
print(f"Errors: {result['errors']}")
```

### Custom Property Tests

```python
from hypothesis import given, strategies as st
from property_test_config import PropertyTestConfig, TestTagging

@given(st.sampled_from(DocumentGenerators.get_all_documentation_files()))
def test_custom_property(file_path):
    # Your custom property logic here
    content = PropertyTestUtils.read_file_content(file_path)
    assert content is not None, f"Could not read file: {file_path}"

# Tag your test
test_custom_property.__name__ = TestTagging.create_tag(23, "Custom Property")
```

## Integration with CI/CD

The property tests can be integrated into continuous integration:

```yaml
# Example GitHub Actions workflow
- name: Run Property Tests
  run: |
    pip install -r requirements.txt
    python scripts/run_property_tests.py --output property_results.json
    
- name: Upload Results
  uses: actions/upload-artifact@v2
  with:
    name: property-test-results
    path: property_results.json
```

## Troubleshooting

### Common Issues

1. **Hypothesis not installed**: Run `pip install hypothesis`
2. **Documentation not found**: Ensure `docs/denmark-living/` directory exists
3. **Import errors**: Make sure you're running from the project root

### Debugging Failed Tests

```bash
# Run with verbose output to see detailed errors
python scripts/run_property_tests.py --verbose

# Run framework tests to verify setup
python scripts/test_property_framework.py

# Check specific property implementation
python -c "from run_property_tests import PropertyTestRunner; r = PropertyTestRunner(); print(r._test_property_1())"
```

## Extending the Framework

### Adding New Properties

1. Add the property test method to `PropertyTestRunner`
2. Update the `property_tests` list in `run_all_tests()`
3. Add appropriate configuration to `PropertyTestConfig`
4. Update the total property count

### Customizing Configuration

Edit `property_test_config.py` to modify:
- Required categories
- Document patterns
- Token limits
- Danish terms
- Test parameters

## Performance

- **Typical runtime**: 30-60 seconds for all 22 properties
- **Memory usage**: Low (processes files sequentially)
- **Parallelization**: Not currently implemented (can be added)

## Reporting

The framework generates detailed reports including:
- Pass/fail status for each property
- Number of examples tested
- Specific error messages
- Success rate percentage
- JSON output for integration