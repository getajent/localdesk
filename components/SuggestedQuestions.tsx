import { Button } from '@/components/ui/button';

export interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const SUGGESTED_QUESTIONS = [
  "How do I register with SKAT as a new resident?",
  "What documents do I need for a work visa?",
  "How can I find housing in Copenhagen?"
];

export function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto px-2 sm:px-0">
      <p className="text-sm text-slate-600 text-center mb-2">
        Try asking about:
      </p>
      {SUGGESTED_QUESTIONS.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full text-left justify-start h-auto py-3 px-4 hover:border-danish-red hover:text-danish-red hover:bg-red-50 transition-all focus:border-danish-red focus:ring-danish-red text-sm sm:text-base"
          onClick={() => onQuestionClick(question)}
          aria-label={`Ask: ${question}`}
        >
          {question}
        </Button>
      ))}
    </div>
  );
}
