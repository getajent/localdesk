'use client';

import { useEffect, useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { getChatHistory, getMessages } from '@/lib/supabase';

export interface ChatInterfaceProps {
  userId?: string | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadChatHistory() {
      if (!userId) return;

      setIsLoadingHistory(true);
      try {
        const chats = await getChatHistory(userId);
        if (chats.length > 0) {
          const mostRecentChat = chats[0];
          const historicalMessages = await getMessages(mostRecentChat.id);

          const formattedMessages: Message[] = historicalMessages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          }));

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadChatHistory();
  }, [userId]);

  useEffect(() => {
    if (messages.length > 0 && showSuggestions) {
      setShowSuggestions(false);
    }
  }, [messages.length, showSuggestions]);

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentInput,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          userId: userId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read the text stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let assistantText = '';
      const assistantId = `assistant-${Date.now()}`;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;

        // Update assistant message with streaming content
        setMessages(prev => {
          const withoutLastAssistant = prev.filter(m => m.id !== assistantId);
          return [
            ...withoutLastAssistant,
            {
              id: assistantId,
              role: 'assistant' as const,
              content: assistantText,
            }
          ];
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[700px] border border-border bg-card rounded-[2rem] shadow-soft-xl overflow-hidden mt-12 mb-20">
      {/* Header Info */}
      <div className="border-b border-border/60 px-8 py-5 flex justify-between items-center bg-muted/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <span className="text-sm font-semibold tracking-wide text-muted-foreground/90 font-sans">
            AI Consultant Active
          </span>
        </div>
        <div className="flex space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-border/80"></div>
          <div className="w-2 h-2 rounded-full bg-border/80"></div>
          <div className="w-2 h-2 rounded-full bg-border/80"></div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-thin">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Loading History...</p>
            </div>
          </div>
        ) : messages.length === 0 && showSuggestions ? (
          <div className="flex items-center justify-center h-full">
            <SuggestedQuestions onQuestionClick={handleQuestionClick} />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={new Date()}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 rounded-2xl rounded-tl-sm px-6 py-4 flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive text-sm font-medium rounded-xl text-center border border-destructive/20">
                Unable to connect. Please try again shortly.
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-border/60 p-6 bg-white/50 backdrop-blur-sm">
        <form onSubmit={onSubmit} className="relative flex gap-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about SKAT, visas, or housing..."
            disabled={isLoading}
            className="flex-1 h-16 pl-6 pr-32 rounded-full border-border bg-background hover:border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/20 text-base font-normal placeholder:text-muted-foreground/60 shadow-sm transition-all"
            aria-label="Chat message input"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 rounded-full px-6 bg-danish-red hover:bg-danish-red/90 text-white transition-all shadow-md active:scale-95"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
