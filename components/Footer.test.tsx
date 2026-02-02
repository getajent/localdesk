import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

describe('Footer Component - Unit Tests', () => {
  describe('Copyright Notice', () => {
    it('should display copyright notice with current year', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(`© ${currentYear} LocalDesk. All rights reserved.`);
      
      expect(copyright).toBeInTheDocument();
      expect(copyright).toHaveClass('text-slate-600', 'text-sm');
    });
  });

  describe('Legal Links', () => {
    it('should display Privacy Policy link', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should display Terms of Service link', () => {
      render(<Footer />);
      
      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', '/terms');
    });

    it('should display Contact link', () => {
      render(<Footer />);
      
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('should have all three legal links present', () => {
      render(<Footer />);
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
      
      const linkTexts = links.map(link => link.textContent);
      expect(linkTexts).toContain('Privacy Policy');
      expect(linkTexts).toContain('Terms of Service');
      expect(linkTexts).toContain('Contact');
    });
  });

  describe('Styling', () => {
    it('should style links with slate-600 text', () => {
      render(<Footer />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('text-slate-600', 'text-sm');
      });
    });

    it('should have minimal design with proper spacing', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('w-full', 'bg-white', 'border-t', 'border-slate-200', 'py-8');
    });
  });

  describe('Layout', () => {
    it('should use flexbox layout', () => {
      const { container } = render(<Footer />);
      
      const innerContainer = container.querySelector('.flex.flex-col');
      expect(innerContainer).toBeInTheDocument();
      expect(innerContainer).toHaveClass('md:flex-row', 'items-center', 'justify-between');
    });

    it('should have responsive layout classes', () => {
      const { container } = render(<Footer />);
      
      const innerContainer = container.querySelector('.flex.flex-col');
      expect(innerContainer).toHaveClass('flex-col', 'md:flex-row');
    });
  });
});
