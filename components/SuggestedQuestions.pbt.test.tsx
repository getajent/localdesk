import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import { SuggestedQuestions, SUGGESTED_QUESTIONS } from './SuggestedQuestions';

// Feature: localdesk-landing-page, Property 3: Suggested Question Population
describe('Property 3: Suggested Question Population', () => {
  afterEach(() => {
    cleanup();
  });

  it('should populate input field with exact question text for any suggested question clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: SUGGESTED_QUESTIONS.length - 1 }),
        async (questionIndex) => {
          const mockOnQuestionClick = jest.fn();
          
          render(
            <SuggestedQuestions onQuestionClick={mockOnQuestionClick} />
          );

          const buttons = screen.getAllByRole('button');
          const selectedButton = buttons[questionIndex];
          
          fireEvent.click(selectedButton);

          // Verify the callback was called with the exact question text
          expect(mockOnQuestionClick).toHaveBeenCalledWith(
            SUGGESTED_QUESTIONS[questionIndex]
          );
          expect(mockOnQuestionClick).toHaveBeenCalledTimes(1);
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  }, 10000);

  it('should maintain question text integrity across multiple clicks', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.integer({ min: 0, max: SUGGESTED_QUESTIONS.length - 1 }),
          { minLength: 1, maxLength: 5 }
        ),
        async (clickSequence) => {
          const mockOnQuestionClick = jest.fn();
          
          render(
            <SuggestedQuestions onQuestionClick={mockOnQuestionClick} />
          );

          const buttons = screen.getAllByRole('button');
          
          for (const questionIndex of clickSequence) {
            fireEvent.click(buttons[questionIndex]);
          }

          // Verify all clicks were recorded with correct question texts
          expect(mockOnQuestionClick).toHaveBeenCalledTimes(clickSequence.length);
          
          clickSequence.forEach((index, callIndex) => {
            expect(mockOnQuestionClick).toHaveBeenNthCalledWith(
              callIndex + 1,
              SUGGESTED_QUESTIONS[index]
            );
          });
          
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  }, 15000);
});
