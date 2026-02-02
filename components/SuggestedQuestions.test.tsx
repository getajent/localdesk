import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SuggestedQuestions, SUGGESTED_QUESTIONS } from './SuggestedQuestions';

describe('SuggestedQuestions', () => {
  describe('Question display', () => {
    it('should display exactly 3 questions', () => {
      const mockOnQuestionClick = jest.fn();
      
      render(<SuggestedQuestions onQuestionClick={mockOnQuestionClick} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should display all predefined questions', () => {
      const mockOnQuestionClick = jest.fn();
      
      render(<SuggestedQuestions onQuestionClick={mockOnQuestionClick} />);

      SUGGESTED_QUESTIONS.forEach((question) => {
        expect(screen.getByText(question)).toBeInTheDocument();
      });
    });
  });

  describe('Question click handling', () => {
    it('should call onQuestionClick with correct question text when first question is clicked', async () => {
      const mockOnQuestionClick = jest.fn();
      
      render(<SuggestedQuestions onQuestionClick={mockOnQuestionClick} />);

      const firstButton = screen.getByText(SUGGESTED_QUESTIONS[0]);
      await userEvent.click(firstButton);

      expect(mockOnQuestionClick).toHaveBeenCalledWith(SUGGESTED_QUESTIONS[0]);
      expect(mockOnQuestionClick).toHaveBeenCalledTimes(1);
    });

    it('should call onQuestionClick with correct question text when second question is clicked', async () => {
      const mockOnQuestionClick = jest.fn();
      
      render(<SuggestedQuestions onQuestionClick={mockOnQuestionClick} />);

      const secondButton = screen.getByText(SUGGESTED_QUESTIONS[1]);
      await userEvent.click(secondButton);

      expect(mockOnQuestionClick).toHaveBeenCalledWith(SUGGESTED_QUESTIONS[1]);
      expect(mockOnQuestionClick).toHaveBeenCalledTimes(1);
    });

    it('should call onQuestionClick with correct question text when third question is clicked', async () => {
      const mockOnQuestionClick = jest.fn();
      
      render(<SuggestedQuestions onQuestionClick={mockOnQuestionClick} />);

      const thirdButton = screen.getByText(SUGGESTED_QUESTIONS[2]);
      await userEvent.click(thirdButton);

      expect(mockOnQuestionClick).toHaveBeenCalledWith(SUGGESTED_QUESTIONS[2]);
      expect(mockOnQuestionClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button styling and hover states', () => {
    it('should have outline variant buttons', () => {
      const mockOnQuestionClick = jest.fn();
      const { container } = render(
        <SuggestedQuestions onQuestionClick={mockOnQuestionClick} />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('border');
      });
    });

    it('should have Danish Red hover classes', () => {
      const mockOnQuestionClick = jest.fn();
      const { container } = render(
        <SuggestedQuestions onQuestionClick={mockOnQuestionClick} />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('hover:border-danish-red');
        expect(button).toHaveClass('hover:text-danish-red');
      });
    });

    it('should have transition classes for smooth hover effects', () => {
      const mockOnQuestionClick = jest.fn();
      const { container } = render(
        <SuggestedQuestions onQuestionClick={mockOnQuestionClick} />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('transition-all');
      });
    });
  });
});
