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
      <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed font-medium">
        Suggested Inquiries
      </p>
      {SUGGESTED_QUESTIONS.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full text-left justify-start h-auto min-h-[52px] py-4 px-6 rounded-xl border-border/60 hover:border-danish-red/30 hover:bg-danish-red/5 text-foreground transition-all duration-200 text-sm sm:text-base font-normal shadow-sm hover:shadow-md"
          onClick={() => onQuestionClick(question)}
          aria-label={`Ask: ${question}`}
        >
          {question}
        </Button>
      ))}
    </div>
  );
}
