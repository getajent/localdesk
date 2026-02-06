/**
 * Tests for variable interpolation in translations
 * Validates Requirement 5.4: Variable interpolation support
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { KnowledgeCategories } from './knowledge/KnowledgeCategories';

// Mock the Logo component
jest.mock('@/components/Logo', () => ({
  Logo: ({ light }: { light?: boolean }) => <div data-testid="logo">Logo</div>
}));

// Mock the i18n navigation Link
jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>
}));

// Mock next-intl with interpolation support
jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => (key: string, params?: any) => {
    const translations: Record<string, any> = {
      // Footer translations
      'tagline': 'Your AI-powered guide',
      'location': 'Location',
      'locationValue': 'Denmark',
      'contact': 'Contact',
      'contactEmail': 'hello@localdesk.dk',
      'resourcesTitle': 'Resources',
      'resourceSkat': 'SKAT',
      'resourceImmigration': 'Immigration',
      'resourceBorger': 'Borger.dk',
      'resourceWork': 'Work in DK',
      'servicesTitle': 'Services',
      'serviceHealthcare': 'Healthcare',
      'serviceMitID': 'MitID',
      'serviceEBoks': 'E-Boks',
      'serviceCPH': 'CPH Intl',
      'legalTitle': 'Legal',
      'privacy': 'Privacy',
      'terms': 'Terms',
      'connectTitle': 'Connect',
      'contactLink': 'Contact',
      'heritage': 'Denmark Heritage',
      // Knowledge categories
      'arrival.title': 'Arrival Process',
      'arrival.description': 'Essential registrations',
      'employment.title': 'Employment',
      'employment.description': 'Working in Denmark'
    };
    
    // Handle interpolation for copyright with year
    if (key === 'copyright' && params?.year) {
      return `© ${params.year} LocalDesk / AI Guide for Denmark`;
    }
    
    // Handle interpolation for document count
    if (key.endsWith('.documentCount') && params?.count !== undefined) {
      return `${params.count} documents`;
    }
    
    // Handle interpolation for lastUpdated with date
    if (key === 'lastUpdated' && params?.date) {
      return `Last updated: ${params.date}`;
    }
    
    return translations[key] || key;
  },
}));

describe('Variable Interpolation in Translations', () => {
  describe('Footer Component - Year Interpolation', () => {
    it('should interpolate year variable in copyright text', () => {
      const currentYear = new Date().getFullYear();
      
      render(<Footer />);

      const copyright = screen.getByText(`© ${currentYear} LocalDesk / AI Guide for Denmark`);
      expect(copyright).toBeInTheDocument();
    });

    it('should not show placeholder when variable is interpolated', () => {
      render(<Footer />);

      // Should not contain the placeholder
      expect(screen.queryByText(/\{year\}/)).not.toBeInTheDocument();
    });
  });

  describe('KnowledgeCategories Component - Count Interpolation', () => {
    const mockCategories = [
      {
        id: 'arrival',
        title: 'Arrival Process',
        description: 'Essential registrations',
        icon: 'Plane',
        topics: ['CPR', 'MitID'],
        documentCount: 10
      },
      {
        id: 'employment',
        title: 'Employment',
        description: 'Working in Denmark',
        icon: 'Briefcase',
        topics: ['Contracts', 'Rights'],
        documentCount: 7
      }
    ];

    it('should interpolate count variable in document count', () => {
      render(<KnowledgeCategories categories={mockCategories} />);

      expect(screen.getByText('10 documents')).toBeInTheDocument();
      expect(screen.getByText('7 documents')).toBeInTheDocument();
    });

    it('should not show placeholder when count is interpolated', () => {
      render(<KnowledgeCategories categories={mockCategories} />);

      // Should not contain the placeholder
      expect(screen.queryByText(/\{count\}/)).not.toBeInTheDocument();
    });

    it('should handle different count values', () => {
      const categoriesWithDifferentCounts = [
        {
          id: 'arrival',
          title: 'Arrival Process',
          description: 'Essential registrations',
          icon: 'Plane',
          topics: ['CPR'],
          documentCount: 1
        },
        {
          id: 'employment',
          title: 'Employment',
          description: 'Working in Denmark',
          icon: 'Briefcase',
          topics: ['Contracts'],
          documentCount: 100
        }
      ];

      render(<KnowledgeCategories categories={categoriesWithDifferentCounts} />);

      expect(screen.getByText('1 documents')).toBeInTheDocument();
      expect(screen.getByText('100 documents')).toBeInTheDocument();
    });
  });

  describe('Multiple Variables in Same Component', () => {
    it('should handle multiple interpolated values in Footer', () => {
      const currentYear = new Date().getFullYear();
      
      render(<Footer />);

      // Verify year is interpolated
      expect(screen.getByText(`© ${currentYear} LocalDesk / AI Guide for Denmark`)).toBeInTheDocument();
      
      // Verify other static translations are also present
      expect(screen.getByText('Resources')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });
  });

  describe('Interpolation with Different Data Types', () => {
    it('should handle numeric values in interpolation', () => {
      const mockCategories = [
        {
          id: 'arrival',
          title: 'Arrival Process',
          description: 'Essential registrations',
          icon: 'Plane',
          topics: ['CPR'],
          documentCount: 42
        }
      ];

      render(<KnowledgeCategories categories={mockCategories} />);

      expect(screen.getByText('42 documents')).toBeInTheDocument();
    });

    it('should handle zero count', () => {
      const mockCategories = [
        {
          id: 'arrival',
          title: 'Arrival Process',
          description: 'Essential registrations',
          icon: 'Plane',
          topics: [],
          documentCount: 0
        }
      ];

      render(<KnowledgeCategories categories={mockCategories} />);

      expect(screen.getByText('0 documents')).toBeInTheDocument();
    });
  });
});
