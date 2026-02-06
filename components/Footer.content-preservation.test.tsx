/**
 * Unit Test: Footer Content Preservation
 * Feature: landing-page-redesign
 * Property 28: Footer content preservation
 * Validates: Requirements 9.4
 */

import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

// Mock the Logo component
jest.mock('@/components/Logo', () => ({
  Logo: ({ light }: { light?: boolean }) => <div data-testid="logo">Logo</div>
}));

// Mock the i18n navigation Link
jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>
}));

// Mock next-intl with actual translation values
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: any) => {
    const translations: Record<string, string> = {
      'tagline': 'Your AI-powered guide to navigating life in Denmark. Get instant answers about taxes, housing, healthcare, immigration, and more.',
      'location': 'Location',
      'locationValue': 'Denmark',
      'contact': 'Contact',
      'contactEmail': 'hello@localdesk.dk',
      'resourcesTitle': 'Resources',
      'resourceSkat': 'SKAT (Tax)',
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
      'heritage': 'Denmark Heritage'
    };
    
    // Handle interpolation for copyright
    if (key === 'copyright' && params) {
      return `© ${params.year} LocalDesk / AI Guide for Denmark`;
    }
    
    return translations[key] || key;
  },
}));

describe('Unit Test: Footer Content Preservation', () => {
  /**
   * Property 28: Footer content preservation
   * 
   * For any rendered Footer component, it should contain links with text
   * "Privacy" and "Terms", plus copyright text containing the current year.
   * 
   * **Validates: Requirements 9.4**
   */
  describe('Required Links', () => {
    it('should contain Privacy link', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByText('Privacy').closest('a');
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should contain Terms link', () => {
      render(<Footer />);
      
      const termsLink = screen.getByText('Terms').closest('a');
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', '/terms');
    });

    it('should contain Contact link with mailto', () => {
      render(<Footer />);
      
      const contactLinks = screen.getAllByText('Contact');
      const mailtoLink = contactLinks.find(el => el.closest('a')?.getAttribute('href')?.startsWith('mailto:'));
      expect(mailtoLink).toBeInTheDocument();
      
      const link = mailtoLink?.closest('a');
      expect(link).toHaveAttribute('href', 'mailto:hello@localdesk.dk');
    });

    it('should have legal and contact links present', () => {
      render(<Footer />);
      
      expect(screen.getByText('Privacy')).toBeInTheDocument();
      expect(screen.getByText('Terms')).toBeInTheDocument();
      expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
    });
  });

  describe('Copyright Text', () => {
    it('should display copyright text with current year', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(`© ${currentYear} LocalDesk / AI Guide for Denmark`);
      
      expect(copyright).toBeInTheDocument();
    });

    it('should update copyright year dynamically', () => {
      // Mock the Date to test year updates
      const originalDate = Date;
      const mockDate = new originalDate('2027-01-01');
      global.Date = jest.fn(() => mockDate) as any;
      global.Date.now = originalDate.now;

      render(<Footer />);
      
      const copyright = screen.getByText(/© 2027 LocalDesk \/ AI Guide for Denmark/);
      expect(copyright).toBeInTheDocument();

      // Restore original Date
      global.Date = originalDate;
    });

    it('should include company name in copyright', () => {
      render(<Footer />);
      
      const copyright = screen.getByText(/LocalDesk/);
      expect(copyright).toBeInTheDocument();
    });

    it('should include "AI Guide for Denmark" text', () => {
      render(<Footer />);
      
      const copyright = screen.getByText(/AI Guide for Denmark/);
      expect(copyright).toBeInTheDocument();
    });
  });

  describe('Link Functionality', () => {
    it('should have functional href attributes for legal links', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByText('Privacy').closest('a');
      const termsLink = screen.getByText('Terms').closest('a');

      expect(privacyLink?.getAttribute('href')).toBe('/privacy');
      expect(termsLink?.getAttribute('href')).toBe('/terms');
    });
  });

  describe('Content Preservation After Redesign', () => {
    it('should maintain all essential content elements', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      
      // Verify copyright is present
      expect(screen.getByText(`© ${currentYear} LocalDesk / AI Guide for Denmark`)).toBeInTheDocument();
      
      // Verify legal links are present
      expect(screen.getByText('Privacy')).toBeInTheDocument();
      expect(screen.getByText('Terms')).toBeInTheDocument();
      
      // Verify tagline is present
      expect(screen.getByText(/Your AI-powered guide to navigating life in Denmark/)).toBeInTheDocument();
    });

    it('should maintain semantic HTML structure', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer?.tagName).toBe('FOOTER');
    });

    it('should display logo', () => {
      render(<Footer />);
      
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('should display location and contact information', () => {
      render(<Footer />);
      
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Denmark')).toBeInTheDocument();
      expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
      expect(screen.getByText('hello@localdesk.dk')).toBeInTheDocument();
    });
  });

  describe('Resource and Service Links', () => {
    it('should display resource links section', () => {
      render(<Footer />);
      
      expect(screen.getByText('Resources')).toBeInTheDocument();
      expect(screen.getByText('SKAT (Tax)')).toBeInTheDocument();
      expect(screen.getByText('Immigration')).toBeInTheDocument();
      expect(screen.getByText('Borger.dk')).toBeInTheDocument();
      expect(screen.getByText('Work in DK')).toBeInTheDocument();
    });

    it('should display service links section', () => {
      render(<Footer />);
      
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Healthcare')).toBeInTheDocument();
      expect(screen.getByText('MitID')).toBeInTheDocument();
      expect(screen.getByText('E-Boks')).toBeInTheDocument();
      expect(screen.getByText('CPH Intl')).toBeInTheDocument();
    });

    it('should have external links with proper attributes', () => {
      render(<Footer />);
      
      const skatLink = screen.getByText('SKAT (Tax)').closest('a');
      expect(skatLink).toHaveAttribute('href', 'https://skat.dk/');
      expect(skatLink).toHaveAttribute('target', '_blank');
      expect(skatLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Heritage and Branding', () => {
    it('should display Denmark Heritage text', () => {
      render(<Footer />);
      
      expect(screen.getByText('Denmark Heritage')).toBeInTheDocument();
    });
  });
});
