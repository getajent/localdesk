import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const t = useTranslations('ChatInterface.message');
  const locale = useLocale();
  const isUser = role === 'user';

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        'flex w-full mb-8 sm:mb-10 md:mb-12',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[95%] sm:max-w-[85%] md:max-w-[75%] transition-all duration-300',
          isUser
            ? 'bg-danish-red text-white py-3 px-4 sm:py-4 sm:px-6 rounded-none shadow-soft animate-in fade-in slide-in-from-right-4'
            : 'bg-transparent text-foreground border-l-2 border-danish-red/20 pl-4 sm:pl-6 md:pl-8 py-2 animate-in fade-in slide-in-from-left-4'
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-danish-red uppercase">
              LocalDesk
            </span>
            <div className="h-[1px] flex-1 bg-border/40" />
          </div>
        )}

        <div className={cn(
          "break-words",
          isUser
            ? "text-[15px] leading-[1.6] sm:text-base sm:leading-relaxed font-sans font-medium"
            : "text-[15px] leading-[1.7] sm:text-base sm:leading-[1.8] md:text-[1.05rem] font-sans text-foreground/90 font-normal"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-xl sm:text-2xl font-serif font-medium mb-4 sm:mb-5 md:mb-6 mt-6 sm:mt-7 md:mt-8 tracking-tighter text-foreground" {...props} />,
                h2: ({ ...props }) => <h2 className="text-lg sm:text-xl font-serif font-medium mb-3 sm:mb-4 mt-5 sm:mt-6 tracking-tighter text-foreground" {...props} />,
                h3: ({ ...props }) => <h3 className="text-base sm:text-lg font-serif font-medium mb-2.5 sm:mb-3 mt-4 sm:mt-5 tracking-tighter text-foreground" {...props} />,
                p: ({ ...props }) => <p className="mb-4 sm:mb-5 md:mb-6 last:mb-0 leading-[1.7] sm:leading-[1.8] font-sans font-light text-foreground/80 text-[15px] sm:text-base" {...props} />,
                ul: ({ ...props }) => (
                  <ul className="mb-5 sm:mb-6 md:mb-8 space-y-3 sm:space-y-4 list-none [&>li]:relative [&>li]:pl-5 sm:[&>li]:pl-6 md:[&>li]:pl-7 [&>li]:before:content-[''] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] sm:[&>li]:before:top-[0.8em] [&>li]:before:w-1.5 sm:[&>li]:before:w-2 [&>li]:before:h-[2px] [&>li]:before:bg-danish-red/30" {...props} />
                ),
                ol: ({ ...props }) => <ol className="mb-5 sm:mb-6 md:mb-8 space-y-3 sm:space-y-4 list-decimal pl-5 sm:pl-6 md:pl-8 text-foreground/80 font-light text-[15px] sm:text-base" {...props} />,
                li: ({ ...props }) => (
                  <li className="text-foreground/80 leading-[1.6] sm:leading-relaxed text-[15px] sm:text-base" {...props} />
                ),
                strong: ({ ...props }) => <strong className="font-bold text-foreground border-b border-danish-red/10 pb-[1px]" {...props} />,
                a: ({ ...props }) => <a className="text-danish-red border-b border-danish-red/20 hover:border-danish-red transition-all break-words" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="border-l-2 border-danish-red/20 pl-4 sm:pl-5 md:pl-6 py-1 my-5 sm:my-6 md:my-8 italic text-foreground/70 font-serif text-[15px] sm:text-base" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>

        <div
          className={cn(
            'text-[9px] sm:text-[10px] mt-3 sm:mt-4 font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase opacity-40',
            isUser ? 'text-white text-right' : 'text-muted-foreground'
          )}
        >
          {isUser ? `${t('sent')} ${formatTimestamp(timestamp)}` : `${t('verifiedAnswer')} • ${formatTimestamp(timestamp)}`}
        </div>
      </div>
    </div>
  );
}
