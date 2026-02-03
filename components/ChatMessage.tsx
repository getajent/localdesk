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
            ? 'bg-danish-red text-white py-4 px-6 rounded-2xl rounded-tr-sm shadow-soft animate-in fade-in slide-in-from-right-4'
            : 'bg-transparent text-foreground border-l-2 border-danish-red/20 pl-8 py-2 animate-in fade-in slide-in-from-left-4'
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-danish-red uppercase">
              System Briefing
            </span>
            <div className="h-[1px] flex-1 bg-border/40" />
          </div>
        )}

        <div className={cn(
          "break-words leading-relaxed",
          isUser ? "text-sm sm:text-base font-sans font-medium" : "text-lg sm:text-xl font-serif text-foreground/90 font-medium"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown
              className="prose prose-zinc max-w-none prose-p:my-4 prose-p:leading-[1.6] prose-ul:my-4 prose-ol:my-4 prose-headings:text-foreground prose-headings:font-serif prose-headings:font-semibold prose-a:text-danish-red prose-a:underline hover:prose-a:text-danish-red/80 prose-strong:font-bold prose-blockquote:border-l-danish-red prose-blockquote:bg-danish-red/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
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
          {isUser ? `Sent ${formatTimestamp(timestamp)}` : `Consultant ID: DK-2026 • ${formatTimestamp(timestamp)}`}
        </div>
      </div>
    </div>
  );
}
