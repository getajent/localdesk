import { Button } from '@/components/ui/button';

export interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const SUGGESTED_QUESTIONS = [
  "How do I register with SKAT as a new resident?",
  "What documents do I need for a work visa?",
  "How can I find housing in Denmark?"
];

export function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-2 sm:px-0">
      <p className="text-[10px] font-black tracking-[0.4em] text-danish-red text-center mb-6 uppercase">
        Common Inquiries
      </p>
      {SUGGESTED_QUESTIONS.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full text-left justify-start h-auto min-h-[64px] py-5 px-8 rounded-none border border-border/60 text-foreground btn-trend-outline text-[11px] font-black tracking-[0.2em] uppercase shadow-sm"
          onClick={() => onQuestionClick(question)}
          aria-label={`Ask: ${question}`}
        >
          {question}
        </Button>
      ))}
    </div>
  );
}
