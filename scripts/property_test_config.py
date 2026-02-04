#!/usr/bin/env python3
"""
Property-Based Testing Configuration for Denmark Living Documentation System

This module provides configuration and utilities for property-based testing
using the Hypothesis library. It sets up test parameters, tagging system,
and common generators for testing documentation properties.

Requirements: All (Property-based testing framework)
"""

from hypothesis import settings, Verbosity
from hypothesis.strategies import SearchStrategy
from pathlib import Path
from typing import List, Dict, Any, Optional
import os


# Test Configuration
class PropertyTestConfig:
    """Configuration class for property-based testing."""
    
    # Minimum iterations per property test (as specified in requirements)
    MIN_EXAMPLES = 100
    
    # Maximum iterations for complex tests
    MAX_EXAMPLES = 1000
    
    # Test timeout in seconds
    DEADLINE = 60000  # 60 seconds
    
    # Verbosity level for test output
    VERBOSITY = Verbosity.normal
    
    # Documentation root directory
    DOCS_ROOT = Path("docs/denmark-living")
    
    # Required category directories
    REQUIRED_CATEGORIES = [
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
    
    # File patterns for different document types
    PROCEDURAL_PATTERNS = [
        "**/cpr-number.md",
        "**/mitid.md", 
        "**/bank-account.md",
        "**/health-insurance.md",
        "**/residence-permits.md",
        "**/work-permits.md",
        "**/boligstotte.md",
        "**/unemployment-benefits.md",
        "**/tax-card.md",
        "**/rental-contracts.md"
    ]
    
    # Documents that should have citizenship distinctions
    CITIZENSHIP_DEPENDENT_DOCS = [
        "residence-permits.md",
        "work-permits.md", 
        "health-insurance.md",
        "tax-system-overview.md"
    ]
    
    # Social benefits documents
    SOCIAL_BENEFITS_DOCS = [
        "boligstotte.md",
        "unemployment-benefits.md",
        "child-benefits.md",
        "pension-system.md",
        "parental-leave.md",
        "student-support.md",
        "social-assistance.md",
        "disability-benefits.md",
        "elderly-care.md"
    ]
    
    # Required sections for procedural guides
    REQUIRED_PROCEDURAL_SECTIONS = [
        "prerequisites",
        "required documents", 
        "steps",
        "location",
        "processing time",
        "next steps"
    ]
    
    # Danish terms that should have translations
    DANISH_TERMS = [
        "CPR-nummer",
        "boligstøtte", 
        "dagpenge",
        "børnepenge",
        "kontanthjælp",
        "årsopgørelse",
        "lejekontrakt",
        "depositum",
        "indboforsikring",
        "andelsbolig"
    ]
    
    # Common acronyms that should be defined
    COMMON_ACRONYMS = [
        "CPR",
        "EU", 
        "EEA",
        "GP",
        "ICS",
        "SKAT",
        "SU",
        "VAT"
    ]


# Hypothesis settings profile for property tests
settings.register_profile(
    "property_tests",
    max_examples=PropertyTestConfig.MIN_EXAMPLES,
    deadline=PropertyTestConfig.DEADLINE,
    verbosity=PropertyTestConfig.VERBOSITY,
    suppress_health_check=[],
    print_blob=True
)

# Activate the property test profile
settings.load_profile("property_tests")


class TestTagging:
    """Utility class for test tagging and categorization."""
    
    @staticmethod
    def create_tag(property_number: int, property_name: str) -> str:
        """
        Create a standardized test tag.
        
        Args:
            property_number: The property number (1-22)
            property_name: Descriptive name of the property
            
        Returns:
            Formatted test tag string
        """
        return f"Feature: denmark-living-docs, Property {property_number}: {property_name}"
    
    @staticmethod
    def get_all_property_tags() -> List[str]:
        """
        Get all property test tags.
        
        Returns:
            List of all property test tags
        """
        properties = [
            (1, "Required Documentation Completeness"),
            (2, "Category Organization Structure"), 
            (3, "Markdown Format Compliance"),
            (4, "Overview-Details Pattern"),
            (5, "Section Token Limit"),
            (6, "Cross-Reference Validity"),
            (7, "Citizenship Distinction"),
            (8, "Complete Source Attribution"),
            (9, "Procedural Guide Completeness"),
            (10, "Deadline Highlighting"),
            (11, "Processing Time Documentation"),
            (12, "Source Type Distinction"),
            (13, "Danish Term Translation"),
            (14, "Acronym Definition"),
            (15, "Terminology Consistency"),
            (16, "Keyword Optimization"),
            (17, "Procedure Continuity"),
            (18, "Dual-Level Documentation"),
            (19, "Troubleshooting Information"),
            (20, "Rejection Scenario Documentation"),
            (21, "Contact Information Inclusion"),
            (22, "Benefits Eligibility Requirements")
        ]
        
        return [TestTagging.create_tag(num, name) for num, name in properties]


class DocumentGenerators:
    """Common generators for property-based testing."""
    
    @staticmethod
    def get_all_documentation_files() -> List[Path]:
        """
        Get all documentation files in the system.
        
        Returns:
            List of Path objects for all markdown files
        """
        docs_root = PropertyTestConfig.DOCS_ROOT
        if not docs_root.exists():
            return []
        
        return list(docs_root.glob("**/*.md"))
    
    @staticmethod
    def get_files_by_category(category: str) -> List[Path]:
        """
        Get all files in a specific category.
        
        Args:
            category: Category name (e.g., "before-moving")
            
        Returns:
            List of Path objects for files in the category
        """
        category_path = PropertyTestConfig.DOCS_ROOT / category
        if not category_path.exists():
            return []
        
        return list(category_path.glob("*.md"))
    
    @staticmethod
    def get_procedural_documents() -> List[Path]:
        """
        Get all procedural documents.
        
        Returns:
            List of Path objects for procedural documents
        """
        docs_root = PropertyTestConfig.DOCS_ROOT
        if not docs_root.exists():
            return []
        
        procedural_docs = []
        for pattern in PropertyTestConfig.PROCEDURAL_PATTERNS:
            procedural_docs.extend(docs_root.glob(pattern))
        
        return procedural_docs
    
    @staticmethod
    def get_citizenship_dependent_documents() -> List[Path]:
        """
        Get documents that should have citizenship distinctions.
        
        Returns:
            List of Path objects for citizenship-dependent documents
        """
        docs_root = PropertyTestConfig.DOCS_ROOT
        if not docs_root.exists():
            return []
        
        citizenship_docs = []
        for doc_name in PropertyTestConfig.CITIZENSHIP_DEPENDENT_DOCS:
            matches = list(docs_root.glob(f"**/{doc_name}"))
            citizenship_docs.extend(matches)
        
        return citizenship_docs
    
    @staticmethod
    def get_social_benefits_documents() -> List[Path]:
        """
        Get all social benefits documents.
        
        Returns:
            List of Path objects for social benefits documents
        """
        social_benefits_path = PropertyTestConfig.DOCS_ROOT / "social-benefits"
        if not social_benefits_path.exists():
            return []
        
        return list(social_benefits_path.glob("*.md"))
    
    @staticmethod
    def get_category_directories() -> List[Path]:
        """
        Get all category directories.
        
        Returns:
            List of Path objects for category directories
        """
        docs_root = PropertyTestConfig.DOCS_ROOT
        if not docs_root.exists():
            return []
        
        categories = []
        for category in PropertyTestConfig.REQUIRED_CATEGORIES:
            category_path = docs_root / category
            if category_path.exists() and category_path.is_dir():
                categories.append(category_path)
        
        return categories


class PropertyTestUtils:
    """Utility functions for property-based testing."""
    
    @staticmethod
    def read_file_content(file_path: Path) -> Optional[str]:
        """
        Safely read file content.
        
        Args:
            file_path: Path to the file
            
        Returns:
            File content as string, or None if error
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception:
            return None
    
    @staticmethod
    def extract_headings(content: str) -> List[Dict[str, Any]]:
        """
        Extract headings from markdown content.
        
        Args:
            content: Markdown content
            
        Returns:
            List of heading dictionaries with level and text
        """
        import re
        
        headings = []
        heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
        
        for match in heading_pattern.finditer(content):
            level = len(match.group(1))
            text = match.group(2).strip()
            headings.append({
                'level': level,
                'text': text
            })
        
        return headings
    
    @staticmethod
    def extract_h2_sections(content: str) -> List[Dict[str, Any]]:
        """
        Extract H2 sections from markdown content.
        
        Args:
            content: Markdown content
            
        Returns:
            List of H2 section dictionaries
        """
        import re
        
        sections = []
        h2_pattern = re.compile(r'^## (.+)$', re.MULTILINE)
        
        matches = list(h2_pattern.finditer(content))
        
        for i, match in enumerate(matches):
            section_start = match.end()
            section_end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
            
            section_content = content[section_start:section_end].strip()
            
            sections.append({
                'heading': match.group(1).strip(),
                'content': section_content,
                'start_pos': section_start,
                'end_pos': section_end
            })
        
        return sections
    
    @staticmethod
    def count_tokens(text: str) -> int:
        """
        Count tokens in text (approximate).
        
        Args:
            text: Text to count tokens for
            
        Returns:
            Approximate token count
        """
        # Simple approximation: split by whitespace and punctuation
        import re
        
        # Remove markdown formatting
        text = re.sub(r'[#*_`\[\]()]', ' ', text)
        
        # Split by whitespace and count
        tokens = text.split()
        
        # Rough approximation: 1 token per word, plus some for punctuation
        return len(tokens)
    
    @staticmethod
    def extract_links(content: str) -> List[Dict[str, str]]:
        """
        Extract markdown links from content.
        
        Args:
            content: Markdown content
            
        Returns:
            List of link dictionaries with text and url
        """
        import re
        
        links = []
        link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
        
        for match in link_pattern.finditer(content):
            links.append({
                'text': match.group(1),
                'url': match.group(2)
            })
        
        return links
    
    @staticmethod
    def has_frontmatter(content: str) -> bool:
        """
        Check if content has YAML frontmatter.
        
        Args:
            content: Markdown content
            
        Returns:
            True if frontmatter is present
        """
        lines = content.split('\n')
        return len(lines) > 0 and lines[0].strip() == '---'
    
    @staticmethod
    def extract_frontmatter(content: str) -> Dict[str, Any]:
        """
        Extract YAML frontmatter from content.
        
        Args:
            content: Markdown content
            
        Returns:
            Dictionary of frontmatter data
        """
        if not PropertyTestUtils.has_frontmatter(content):
            return {}
        
        lines = content.split('\n')
        frontmatter_end = -1
        
        for i, line in enumerate(lines[1:], 1):
            if line.strip() == '---':
                frontmatter_end = i
                break
        
        if frontmatter_end == -1:
            return {}
        
        frontmatter_content = '\n'.join(lines[1:frontmatter_end])
        
        # Simple YAML parsing for basic key-value pairs
        frontmatter = {}
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


# Export main classes and functions
__all__ = [
    'PropertyTestConfig',
    'TestTagging', 
    'DocumentGenerators',
    'PropertyTestUtils'
]