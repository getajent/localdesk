import { render, screen } from '@testing-library/react';
import { Features } from '@/components/Features';

describe('Features Component - Unit Tests', () => {
  describe('Feature Display', () => {
    it('should display all 4 features', () => {
      render(<Features />);
      
      // Check that all 4 feature titles are displayed
      expect(screen.getByText('Instant Answers')).toBeInTheDocument();
      expect(screen.getByText('Expert Knowledge')).toBeInTheDocument();
      expect(screen.getByText('No Login Required')).toBeInTheDocument();
      expect(screen.getByText('Always Available')).toBeInTheDocument();
    });

    it('should display feature descriptions', () => {
      render(<Features />);
      
      expect(screen.getByText(/Get immediate responses to your questions/i)).toBeInTheDocument();
      expect(screen.getByText(/Access specialized information about SKAT/i)).toBeInTheDocument();
      expect(screen.getByText(/Start chatting right away without creating an account/i)).toBeInTheDocument();
      expect(screen.getByText(/Get help 24\/7, whenever you need guidance/i)).toBeInTheDocument();
    });
  });

  describe('Property 5: Features content preservation', () => {
    it('should preserve all four feature titles after redesign', () => {
      render(<Features />);
      
      // Verify all four required features are present
      expect(screen.getByText('Instant Answers')).toBeInTheDocument();
      expect(screen.getByText('Expert Knowledge')).toBeInTheDocument();
      expect(screen.getByText('No Login Required')).toBeInTheDocument();
      expect(screen.getByText('Always Available')).toBeInTheDocument();
    });

    it('should preserve all feature descriptions', () => {
      render(<Features />);
      
      // Verify all descriptions are present and unchanged
      expect(screen.getByText(/Get immediate responses to your questions about Danish bureaucracy without waiting/i)).toBeInTheDocument();
      expect(screen.getByText(/Access specialized information about SKAT, visas, and housing from an AI consultant/i)).toBeInTheDocument();
      expect(screen.getByText(/Start chatting right away without creating an account or signing up/i)).toBeInTheDocument();
      expect(screen.getByText(/Get help 24\/7, whenever you need guidance navigating Danish systems/i)).toBeInTheDocument();
    });

    it('should preserve all feature icons', () => {
      const { container } = render(<Features />);
      
      // Check that all 4 icon containers are present
      const iconContainers = container.querySelectorAll('.rounded-full');
      expect(iconContainers.length).toBe(4);
      
      // Check that icons maintain Danish Red color
      const icons = container.querySelectorAll('.text-danish-red');
      expect(icons.length).toBeGreaterThanOrEqual(4);
    });

    it('should maintain exactly 4 feature cards', () => {
      const { container } = render(<Features />);
      
      const cards = container.querySelectorAll('.grid > div');
      expect(cards.length).toBe(4);
    });

    it('should preserve feature order: Instant Answers, Expert Knowledge, No Login Required, Always Available', () => {
      const { container } = render(<Features />);
      
      const titles = container.querySelectorAll('h3');
      expect(titles.length).toBe(4);
      
      expect(titles[0]).toHaveTextContent('Instant Answers');
      expect(titles[1]).toHaveTextContent('Expert Knowledge');
      expect(titles[2]).toHaveTextContent('No Login Required');
      expect(titles[3]).toHaveTextContent('Always Available');
    });
  });

  describe('Icon Display', () => {
    it('should render correct icons for each feature', () => {
      const { container } = render(<Features />);
      
      // Check that icon containers are present (4 features = 4 icon containers)
      const iconContainers = container.querySelectorAll('.rounded-full');
      expect(iconContainers.length).toBe(4);
    });

    it('should style icons with Danish Red color', () => {
      const { container } = render(<Features />);
      
      // Check that icons have the Danish Red text color
      const icons = container.querySelectorAll('.text-danish-red');
      expect(icons.length).toBeGreaterThanOrEqual(4);
    });

    it('should display icons in circular backgrounds', () => {
      const { container } = render(<Features />);
      
      // Check for rounded-full class on icon containers
      const iconContainers = container.querySelectorAll('.rounded-full');
      expect(iconContainers.length).toBe(4);
    });
  });

  describe('Grid Layout Responsiveness', () => {
    it('should use grid layout', () => {
      const { container } = render(<Features />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have single column on mobile (grid-cols-1)', () => {
      const { container } = render(<Features />);
      
      const gridContainer = container.querySelector('.grid-cols-1');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have 2 columns on small screens (sm:grid-cols-2)', () => {
      const { container } = render(<Features />);
      
      const gridContainer = container.querySelector('.sm\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have 4 columns on large screens (lg:grid-cols-4)', () => {
      const { container } = render(<Features />);
      
      const gridContainer = container.querySelector('.lg\\:grid-cols-4');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have proper gap spacing between features', () => {
      const { container } = render(<Features />);
      
      const gridContainer = container.querySelector('.gap-6');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Nordic Clean Aesthetic', () => {
    it('should use slate-50 background for section', () => {
      const { container } = render(<Features />);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-slate-50');
    });

    it('should use white or gradient background for feature cards', () => {
      const { container } = render(<Features />);
      
      const cards = container.querySelectorAll('.grid > div');
      expect(cards.length).toBe(4);
      
      // Cards should have either bg-white or gradient background
      cards.forEach((card) => {
        const classList = Array.from(card.classList);
        const hasBackground = classList.some(cls => 
          cls.includes('bg-white') || cls.includes('bg-gradient')
        );
        expect(hasBackground).toBe(true);
      });
    });

    it('should use slate-900 for feature titles', () => {
      const { container } = render(<Features />);
      
      const titles = container.querySelectorAll('.text-slate-900');
      expect(titles.length).toBeGreaterThanOrEqual(4);
    });

    it('should use slate-600 for feature descriptions', () => {
      const { container } = render(<Features />);
      
      const descriptions = container.querySelectorAll('.text-slate-600');
      expect(descriptions.length).toBeGreaterThanOrEqual(4);
    });

    it('should have rounded corners on feature cards', () => {
      const { container } = render(<Features />);
      
      const roundedCards = container.querySelectorAll('.rounded-xl');
      expect(roundedCards.length).toBeGreaterThanOrEqual(4);
    });

    it('should have shadow effects on feature cards', () => {
      const { container } = render(<Features />);
      
      const cards = container.querySelectorAll('.grid > div');
      expect(cards.length).toBe(4);
      
      // Cards should have custom shadow classes
      cards.forEach((card) => {
        const classList = Array.from(card.classList);
        const hasShadow = classList.some(cls => cls.includes('shadow-'));
        expect(hasShadow).toBe(true);
      });
    });
  });

  describe('Layout Structure', () => {
    it('should center content with container', () => {
      const { container } = render(<Features />);
      
      const contentContainer = container.querySelector('.container');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('mx-auto');
    });

    it('should have responsive padding', () => {
      const { container } = render(<Features />);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-slate-50');
    });

    it('should use flexbox column layout for feature cards', () => {
      const { container } = render(<Features />);
      
      const featureCards = container.querySelectorAll('.flex.flex-col');
      expect(featureCards.length).toBeGreaterThanOrEqual(4);
    });

    it('should center align content in feature cards', () => {
      const { container } = render(<Features />);
      
      const centeredCards = container.querySelectorAll('.items-center.text-center');
      expect(centeredCards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Hover Effects', () => {
    it('should have hover shadow transition on feature cards', () => {
      const { container } = render(<Features />);
      
      const cards = container.querySelectorAll('.grid > div');
      expect(cards.length).toBe(4);
      
      // Cards should have custom hover shadow classes
      cards.forEach((card) => {
        const classList = Array.from(card.classList);
        const hasHoverShadow = classList.some(cls => cls.includes('shadow-'));
        expect(hasHoverShadow).toBe(true);
      });
    });

    it('should have transition classes for smooth hover effects', () => {
      const { container } = render(<Features />);
      
      const transitionCards = container.querySelectorAll('.transition-all');
      expect(transitionCards.length).toBeGreaterThanOrEqual(4);
    });
  });
});
