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

describe('Footer Component - Unit Tests', () => {
  describe('Brand and Tagline', () => {
    it('should display the logo', () => {
      render(<Footer />);
      
      const logo = screen.getByTestId('logo');
      expect(logo).toBeInTheDocument();
    });

    it('should display the tagline', () => {
      render(<Footer />);
      
      const tagline = screen.getByText(/Your AI-powered guide to navigating life in Denmark/i);
      expect(tagline).toBeInTheDocument();
    });

    it('should display location information', () => {
      render(<Footer />);
      
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Denmark')).toBeInTheDocument();
    });

    it('should display contact information', () => {
      render(<Footer />);
      
      const contactLabels = screen.getAllByText('Contact');
      expect(contactLabels.length).toBeGreaterThan(0);
      expect(screen.getByText('hello@localdesk.dk')).toBeInTheDocument();
    });
  });

  describe('Resources Section', () => {
    it('should display Resources title', () => {
      render(<Footer />);
      
      expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    it('should display all resource links', () => {
      render(<Footer />);
      
      expect(screen.getByText('SKAT (Tax)')).toBeInTheDocument();
      expect(screen.getByText('Immigration')).toBeInTheDocument();
      expect(screen.getByText('Borger.dk')).toBeInTheDocument();
      expect(screen.getByText('Work in DK')).toBeInTheDocument();
    });

    it('should have correct external links for resources', () => {
      render(<Footer />);
      
      const skatLink = screen.getByText('SKAT (Tax)').closest('a');
      expect(skatLink).toHaveAttribute('href', 'https://skat.dk/');
      expect(skatLink).toHaveAttribute('target', '_blank');
      expect(skatLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Services Section', () => {
    it('should display Services title', () => {
      render(<Footer />);
      
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('should display all service links', () => {
      render(<Footer />);
      
      expect(screen.getByText('Healthcare')).toBeInTheDocument();
      expect(screen.getByText('MitID')).toBeInTheDocument();
      expect(screen.getByText('E-Boks')).toBeInTheDocument();
      expect(screen.getByText('CPH Intl')).toBeInTheDocument();
    });
  });

  describe('Legal Links', () => {
    it('should display Legal title', () => {
      render(<Footer />);
      
      expect(screen.getByText('Legal')).toBeInTheDocument();
    });

    it('should display Privacy link', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByText('Privacy').closest('a');
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should display Terms link', () => {
      render(<Footer />);
      
      const termsLink = screen.getByText('Terms').closest('a');
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', '/terms');
    });
  });

  describe('Connect Section', () => {
    it('should display Connect title', () => {
      render(<Footer />);
      
      expect(screen.getByText('Connect')).toBeInTheDocument();
    });

    it('should display Contact link with mailto', () => {
      render(<Footer />);
      
      const contactLinks = screen.getAllByText('Contact');
      const contactLink = contactLinks.find(el => el.closest('a')?.getAttribute('href')?.startsWith('mailto:'));
      expect(contactLink).toBeInTheDocument();
      
      const link = contactLink?.closest('a');
      expect(link).toHaveAttribute('href', 'mailto:hello@localdesk.dk');
    });
  });

  describe('Copyright Notice', () => {
    it('should display copyright notice with current year', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(`© ${currentYear} LocalDesk / AI Guide for Denmark`);
      
      expect(copyright).toBeInTheDocument();
    });

    it('should display heritage text', () => {
      render(<Footer />);
      
      expect(screen.getByText('Denmark Heritage')).toBeInTheDocument();
    });
  });
});
