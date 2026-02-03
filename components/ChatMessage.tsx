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
        'flex w-full mb-3 sm:mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[90%] sm:max-w-[85%] md:max-w-[70%] rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow-sm',
          isUser
            ? 'bg-danish-red text-white'
            : 'bg-slate-100 text-slate-900'
        )}
      >
        <div className="break-words text-sm sm:text-base leading-[1.6] font-normal">
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown
              className="prose prose-sm max-w-none prose-p:my-2 prose-p:leading-[1.6] prose-ul:my-2 prose-ol:my-2 prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-danish-red hover:prose-a:text-[#A00A28]"
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        <div
          className={cn(
            'text-xs mt-1 sm:mt-2 leading-[1.5] font-normal',
            isUser ? 'text-white/70' : 'text-gray-500'
          )}
        >
          {formatTimestamp(timestamp)}
        </div>
      </div>
    </div>
  );
}
