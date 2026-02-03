/**
 * Unit Test: Footer Content Preservation
 * Feature: landing-page-redesign
 * Property 28: Footer content preservation
 * Validates: Requirements 9.4
 */

import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

describe('Unit Test: Footer Content Preservation', () => {
  /**
   * Property 28: Footer content preservation
   * 
   * For any rendered Footer component, it should contain links with text
   * "Privacy Policy", "Terms of Service", and "Contact", plus copyright
   * text containing the current year.
   * 
   * **Validates: Requirements 9.4**
   */
  describe('Required Links', () => {
    it('should contain Privacy Policy link', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should contain Terms of Service link', () => {
      render(<Footer />);
      
      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', '/terms');
    });

    it('should contain Contact link', () => {
      render(<Footer />);
      
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('should have all three required links present', () => {
      render(<Footer />);
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
      
      const linkTexts = links.map(link => link.textContent);
      expect(linkTexts).toContain('Privacy Policy');
      expect(linkTexts).toContain('Terms of Service');
      expect(linkTexts).toContain('Contact');
    });
  });

  describe('Copyright Text', () => {
    it('should display copyright text with current year', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(`© ${currentYear} LocalDesk. All rights reserved.`);
      
      expect(copyright).toBeInTheDocument();
    });

    it('should update copyright year dynamically', () => {
      // Mock the Date to test year updates
      const originalDate = Date;
      const mockDate = new originalDate('2027-01-01');
      global.Date = jest.fn(() => mockDate) as any;
      global.Date.now = originalDate.now;

      render(<Footer />);
      
      const copyright = screen.getByText(/© 2027 LocalDesk. All rights reserved./);
      expect(copyright).toBeInTheDocument();

      // Restore original Date
      global.Date = originalDate;
    });

    it('should include company name in copyright', () => {
      render(<Footer />);
      
      const copyright = screen.getByText(/LocalDesk/);
      expect(copyright).toBeInTheDocument();
    });

    it('should include "All rights reserved" text', () => {
      render(<Footer />);
      
      const copyright = screen.getByText(/All rights reserved/);
      expect(copyright).toBeInTheDocument();
    });
  });

  describe('Link Functionality', () => {
    it('should have functional href attributes for all links', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      const contactLink = screen.getByRole('link', { name: /contact/i });

      expect(privacyLink.getAttribute('href')).toBe('/privacy');
      expect(termsLink.getAttribute('href')).toBe('/terms');
      expect(contactLink.getAttribute('href')).toBe('/contact');
    });

    it('should have accessible link labels', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      const contactLink = screen.getByRole('link', { name: /contact/i });

      expect(privacyLink).toHaveAttribute('aria-label', 'Privacy Policy');
      expect(termsLink).toHaveAttribute('aria-label', 'Terms of Service');
      expect(contactLink).toHaveAttribute('aria-label', 'Contact');
    });
  });

  describe('Content Preservation After Redesign', () => {
    it('should maintain all original content elements', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      
      // Verify copyright is present
      expect(screen.getByText(`© ${currentYear} LocalDesk. All rights reserved.`)).toBeInTheDocument();
      
      // Verify all links are present
      expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    it('should preserve link order (Privacy, Terms, Contact)', () => {
      render(<Footer />);
      
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveTextContent('Privacy Policy');
      expect(links[1]).toHaveTextContent('Terms of Service');
      expect(links[2]).toHaveTextContent('Contact');
    });

    it('should maintain semantic HTML structure', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer?.tagName).toBe('FOOTER');
    });
  });

  describe('Styling Preservation', () => {
    it('should maintain responsive layout classes', () => {
      const { container } = render(<Footer />);
      
      const innerContainer = container.querySelector('.flex.flex-col');
      expect(innerContainer).toBeInTheDocument();
      expect(innerContainer).toHaveClass('md:flex-row', 'items-center', 'justify-between');
    });

    it('should have proper container structure', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('w-full', 'border-t', 'border-slate-200');
    });
  });
});
