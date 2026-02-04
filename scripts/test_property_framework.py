#!/usr/bin/env python3
"""
Test suite for the Property-Based Testing Framework

This module contains tests to verify that the property testing framework
is correctly set up and configured for the Denmark Living Documentation System.

Requirements: All (Property-based testing framework validation)
"""

import pytest
import sys
from pathlib import Path

# Add the scripts directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

from property_test_config import (
    PropertyTestConfig,
    TestTagging,
    DocumentGenerators,
    PropertyTestUtils
)

try:
    from hypothesis import given, strategies as st, settings
    HYPOTHESIS_AVAILABLE = True
except ImportError:
    HYPOTHESIS_AVAILABLE = False


class TestPropertyTestFramework:
    """Test suite for the property testing framework."""
    
    def test_hypothesis_available(self):
        """Test that Hypothesis library is available."""
        assert HYPOTHESIS_AVAILABLE, "Hypothesis library is not installed"
    
    def test_config_values(self):
        """Test that configuration values are properly set."""
        assert PropertyTestConfig.MIN_EXAMPLES >= 100, "Minimum examples should be at least 100"
        assert PropertyTestConfig.MAX_EXAMPLES >= PropertyTestConfig.MIN_EXAMPLES
        assert PropertyTestConfig.DEADLINE > 0, "Deadline should be positive"
        assert len(PropertyTestConfig.REQUIRED_CATEGORIES) > 0, "Should have required categories"
    
    def test_test_tagging(self):
        """Test the test tagging system."""
        tag = TestTagging.create_tag(1, "Test Property")
        expected = "Feature: denmark-living-docs, Property 1: Test Property"
        assert tag == expected, f"Expected '{expected}', got '{tag}'"
        
        all_tags = TestTagging.get_all_property_tags()
        assert len(all_tags) == 22, f"Expected 22 property tags, got {len(all_tags)}"
        
        # Check that all tags follow the correct format
        for i, tag in enumerate(all_tags, 1):
            assert tag.startswith(f"Feature: denmark-living-docs, Property {i}:"), f"Invalid tag format: {tag}"
    
    def test_document_generators(self):
        """Test document generator functions."""
        # Test that generators don't crash (even if no files exist yet)
        all_files = DocumentGenerators.get_all_documentation_files()
        assert isinstance(all_files, list), "Should return a list"
        
        categories = DocumentGenerators.get_category_directories()
        assert isinstance(categories, list), "Should return a list"
        
        procedural_docs = DocumentGenerators.get_procedural_documents()
        assert isinstance(procedural_docs, list), "Should return a list"
        
        citizenship_docs = DocumentGenerators.get_citizenship_dependent_documents()
        assert isinstance(citizenship_docs, list), "Should return a list"
        
        social_benefits_docs = DocumentGenerators.get_social_benefits_documents()
        assert isinstance(social_benefits_docs, list), "Should return a list"
    
    def test_property_test_utils(self):
        """Test utility functions."""
        # Test heading extraction
        content = "# Main Title\n\n## Section 1\n\nContent here.\n\n### Subsection\n\nMore content."
        headings = PropertyTestUtils.extract_headings(content)
        
        assert len(headings) == 3, f"Expected 3 headings, got {len(headings)}"
        assert headings[0]['level'] == 1 and headings[0]['text'] == "Main Title"
        assert headings[1]['level'] == 2 and headings[1]['text'] == "Section 1"
        assert headings[2]['level'] == 3 and headings[2]['text'] == "Subsection"
        
        # Test H2 section extraction
        h2_sections = PropertyTestUtils.extract_h2_sections(content)
        assert len(h2_sections) == 1, f"Expected 1 H2 section, got {len(h2_sections)}"
        assert h2_sections[0]['heading'] == "Section 1"
        
        # Test token counting
        token_count = PropertyTestUtils.count_tokens("This is a test sentence with several words.")
        assert token_count > 0, "Token count should be positive"
        
        # Test link extraction
        link_content = "Check out [this link](../other/file.md) and [another](https://example.com)."
        links = PropertyTestUtils.extract_links(link_content)
        assert len(links) == 2, f"Expected 2 links, got {len(links)}"
        assert links[0]['text'] == "this link" and links[0]['url'] == "../other/file.md"
        
        # Test frontmatter detection
        frontmatter_content = "---\ntitle: Test\ncategory: test\n---\n\n# Content"
        assert PropertyTestUtils.has_frontmatter(frontmatter_content), "Should detect frontmatter"
        
        no_frontmatter_content = "# Just a title\n\nSome content."
        assert not PropertyTestUtils.has_frontmatter(no_frontmatter_content), "Should not detect frontmatter"
        
        # Test frontmatter extraction
        frontmatter = PropertyTestUtils.extract_frontmatter(frontmatter_content)
        assert frontmatter['title'] == "Test", "Should extract title from frontmatter"
        assert frontmatter['category'] == "test", "Should extract category from frontmatter"
    
    @pytest.mark.skipif(not HYPOTHESIS_AVAILABLE, reason="Hypothesis not available")
    def test_hypothesis_integration(self):
        """Test that Hypothesis is properly integrated."""
        
        @given(st.text())
        def property_test_example(text):
            # Simple property: text length should be non-negative
            assert len(text) >= 0
        
        # Run the property test
        property_test_example()
    
    def test_required_categories_exist(self):
        """Test that all required categories are defined."""
        required = PropertyTestConfig.REQUIRED_CATEGORIES
        expected_categories = [
            "before-moving",
            "arrival-process", 
            "essential-services",
            "social-benefits",
            "employment",
            "tax-finance",
            "housing",
            "practical-living",
            "metadata"
        ]
        
        for category in expected_categories:
            assert category in required, f"Missing required category: {category}"
    
    def test_danish_terms_defined(self):
        """Test that Danish terms are defined in configuration."""
        danish_terms = PropertyTestConfig.DANISH_TERMS
        
        # Should have common Danish terms
        expected_terms = ["CPR-nummer", "boligstøtte", "dagpenge"]
        for term in expected_terms:
            assert term in danish_terms, f"Missing Danish term: {term}"
    
    def test_procedural_sections_defined(self):
        """Test that required procedural sections are defined."""
        sections = PropertyTestConfig.REQUIRED_PROCEDURAL_SECTIONS
        
        expected_sections = ["prerequisites", "required documents", "steps"]
        for section in expected_sections:
            assert section in sections, f"Missing required procedural section: {section}"


@pytest.mark.property
class TestPropertyTestExecution:
    """Test actual property test execution."""
    
    @pytest.mark.skipif(not HYPOTHESIS_AVAILABLE, reason="Hypothesis not available")
    def test_simple_property(self):
        """Test a simple property to verify execution works."""
        
        @given(st.lists(st.text(), min_size=0, max_size=10))
        @settings(max_examples=10)  # Small number for testing
        def test_list_length_property(text_list):
            # Property: list length should equal the number of items
            assert len(text_list) == len(list(text_list))
        
        # This should pass
        test_list_length_property()
    
    @pytest.mark.skipif(not HYPOTHESIS_AVAILABLE, reason="Hypothesis not available")
    def test_documentation_property_example(self):
        """Test a documentation-specific property example."""
        
        @given(st.text(min_size=1))
        @settings(max_examples=10)  # Small number for testing
        def test_heading_extraction_property(content):
            # Property: extracted headings should be consistent
            headings1 = PropertyTestUtils.extract_headings(f"# {content}")
            headings2 = PropertyTestUtils.extract_headings(f"# {content}")
            
            assert headings1 == headings2, "Heading extraction should be deterministic"
        
        test_heading_extraction_property()


if __name__ == '__main__':
    # Run tests when executed directly
    pytest.main([__file__, '-v'])