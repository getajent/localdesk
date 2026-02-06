import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  const t = useTranslations('SuggestedQuestions');
  const questionKeys = ['q1', 'q2', 'q3'] as const;

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-2xl mx-auto px-2 sm:px-0">
      <p className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-danish-red text-center mb-2 sm:mb-4 uppercase">
        {t('label')}
      </p>
      {questionKeys.map((key, index) => {
        const question = t(`questions.${key}`);
        return (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left justify-start h-auto min-h-[60px] sm:min-h-[56px] py-4 sm:py-4 px-5 sm:px-6 md:px-8 rounded-none border border-border/60 text-foreground btn-trend-outline text-[13px] sm:text-sm md:text-sm font-semibold tracking-normal sm:tracking-wide normal-case shadow-sm leading-[1.5] whitespace-normal"
            onClick={() => onQuestionClick(question)}
            aria-label={`Ask: ${question}`}
          >
            {question}
          </Button>
        );
      })}
    </div>
  );
}
