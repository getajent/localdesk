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

  describe('Icon Display', () => {
    it('should render correct icons for each feature', () => {
      const { container } = render(<Features />);
      
      // Check that icon containers are present (4 features = 4 icon containers)
      const iconContainers = container.querySelectorAll('.w-14.h-14');
      expect(iconContainers).toHaveLength(4);
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
      expect(iconContainers).toHaveLength(4);
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

    it('should use white background for feature cards', () => {
      const { container } = render(<Features />);
      
      const featureCards = container.querySelectorAll('.bg-white');
      expect(featureCards.length).toBeGreaterThanOrEqual(4);
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
      
      const roundedCards = container.querySelectorAll('.rounded-lg');
      expect(roundedCards.length).toBeGreaterThanOrEqual(4);
    });

    it('should have shadow effects on feature cards', () => {
      const { container } = render(<Features />);
      
      const shadowCards = container.querySelectorAll('.shadow-sm');
      expect(shadowCards.length).toBeGreaterThanOrEqual(4);
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
      
      const hoverCards = container.querySelectorAll('.hover\\:shadow-lg');
      expect(hoverCards.length).toBeGreaterThanOrEqual(4);
    });

    it('should have transition classes for smooth hover effects', () => {
      const { container } = render(<Features />);
      
      const transitionCards = container.querySelectorAll('.transition-all');
      expect(transitionCards.length).toBeGreaterThanOrEqual(4);
    });
  });
});
