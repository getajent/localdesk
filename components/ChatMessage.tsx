import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        'flex w-full mb-12',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[95%] sm:max-w-[85%] md:max-w-[75%] transition-all duration-300',
          isUser
            ? 'bg-danish-red text-white py-4 px-6 rounded-none shadow-soft animate-in fade-in slide-in-from-right-4'
            : 'bg-transparent text-foreground border-l-2 border-danish-red/20 pl-8 py-2 animate-in fade-in slide-in-from-left-4'
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-danish-red uppercase">
              LocalDesk
            </span>
            <div className="h-[1px] flex-1 bg-border/40" />
          </div>
        )}

        <div className={cn(
          "break-words leading-relaxed",
          isUser ? "text-sm sm:text-base font-sans font-medium" : "text-base sm:text-[1.1rem] font-sans text-foreground/90 font-normal"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => <h1 className="text-2xl font-serif font-medium mb-6 mt-8 tracking-tighter text-foreground" {...props} />,
                h2: ({ ...props }) => <h2 className="text-xl font-serif font-medium mb-4 mt-6 tracking-tighter text-foreground" {...props} />,
                h3: ({ ...props }) => <h3 className="text-lg font-serif font-medium mb-3 mt-5 tracking-tighter text-foreground" {...props} />,
                p: ({ ...props }) => <p className="mb-6 last:mb-0 leading-[1.8] font-sans font-light text-foreground/80" {...props} />,
                ul: ({ ...props }) => (
                  <ul className="mb-8 space-y-4 list-none [&>li]:relative [&>li]:pl-7 [&>li]:before:content-[''] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.9em] [&>li]:before:w-2 [&>li]:before:h-[2px] [&>li]:before:bg-danish-red/30" {...props} />
                ),
                ol: ({ ...props }) => <ol className="mb-8 space-y-4 list-decimal pl-8 text-foreground/80 font-light" {...props} />,
                li: ({ ...props }) => (
                  <li className="text-foreground/80 leading-relaxed" {...props} />
                ),
                strong: ({ ...props }) => <strong className="font-bold text-foreground border-b border-danish-red/10 pb-[1px]" {...props} />,
                a: ({ ...props }) => <a className="text-danish-red border-b border-danish-red/20 hover:border-danish-red transition-all" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="border-l-2 border-danish-red/20 pl-6 py-1 my-8 italic text-foreground/70 font-serif" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>

        <div
          className={cn(
            'text-[10px] mt-4 font-bold tracking-widest uppercase opacity-40',
            isUser ? 'text-white text-right' : 'text-muted-foreground'
          )}
        >
          {isUser ? `Sent ${formatTimestamp(timestamp)}` : `Verified Answer • ${formatTimestamp(timestamp)}`}
        </div>
      </div>
    </div>
  );
}
