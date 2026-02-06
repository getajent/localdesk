'use client';

import { useEffect, useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Sparkles, PlusCircle, Square, Maximize2, Minimize2 } from 'lucide-react';
import { UserSettings } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslations } from 'next-intl';

export interface ChatInterfaceProps {
  userId?: string | null;
  userSettings?: UserSettings;
  initialQuestion?: string;
  isFullPage?: boolean;
  onToggleFullPage?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface({ userId, userSettings, initialQuestion, isFullPage, onToggleFullPage }: ChatInterfaceProps) {
  const { refreshSettings } = useAuth();
  const t = useTranslations('ChatInterface');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    // Always reset to a fresh state when userId changes
    // Skip history loading for now to avoid hanging issues
    setMessages([]);
    setShowSuggestions(true);
    setIsLoadingHistory(false);
  }, [userId]);

  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
    }
  }, [initialQuestion]);

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

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    setAbortController(controller);

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
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          userId: userId || undefined,
          userSettings: userSettings || undefined,
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
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error sending message:', err);
        setError(err as Error);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
      // Refresh settings in case the assistant modified the roadmap
      if (userId) {
        refreshSettings();
      }
    }
  };

  const startNewSession = () => {
    if (messages.length > 0) {
      setIsConfirmModalOpen(true);
      return;
    }
    handleConfirmNewSession();
  };

  const handleConfirmNewSession = () => {
    setMessages([]);
    setShowSuggestions(true);
    setError(null);
    setInput('');
  };

  return (
    <div id="chat-section" className={`w-full mx-auto flex flex-col ${isFullPage ? 'h-full border-none m-0' : 'h-[600px] sm:h-[700px] md:h-[800px] lg:h-[850px] border mt-0 mb-8 sm:mb-10 md:mb-12'} border-border/40 bg-card/70 backdrop-blur-2xl rounded-none shadow-soft-xl overflow-hidden transition-all duration-500 hover:shadow-hover-lg border-b-[4px] sm:border-b-[6px] border-b-danish-red/10`}>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmNewSession}
        title={t('confirmModal.title')}
        description={t('confirmModal.description')}
        confirmLabel={t('confirmModal.confirm')}
        cancelLabel={t('confirmModal.cancel')}
        variant="danger"
      />
      {/* Header Info */}
      <div className="border-b border-border/40 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 flex justify-between items-center bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="p-1.5 sm:p-2 bg-danish-red/5">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-danish-red" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.2em] text-foreground uppercase block">
              {t('header.title')}
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground/60 uppercase">
              {t('header.version')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {isFullPage && (
            <div className="hidden md:flex items-center gap-2 md:gap-3 pr-3 md:pr-4 border-r border-border/40">
              <span className="hidden lg:inline text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">{t('header.mode')}</span>
              <ThemeToggle />
            </div>
          )}
          {onToggleFullPage && (
            <Button
              onClick={onToggleFullPage}
              variant="ghost"
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 md:px-4 rounded-none border border-border/40 hover:border-danish-red/40 hover:bg-danish-red/5 text-[9px] sm:text-[10px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all"
              title={isFullPage ? t('header.exitFull') : t('header.fullPage')}
            >
              {isFullPage ? <Minimize2 className="h-3 w-3 text-danish-red" /> : <Maximize2 className="h-3 w-3 text-danish-red" />}
              <span className="hidden md:inline">{isFullPage ? t('header.exitFull') : t('header.fullPage')}</span>
            </Button>
          )}
          <Button
            onClick={startNewSession}
            disabled={messages.length === 0}
            variant="ghost"
            className="hidden md:flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 md:px-4 rounded-none border border-border/40 hover:border-danish-red/40 hover:bg-danish-red/5 text-[9px] sm:text-[10px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border/40"
          >
            <PlusCircle className={`h-3 w-3 ${messages.length === 0 ? 'text-muted-foreground/40' : 'text-danish-red'}`} />
            <span className="hidden lg:inline">{t('header.newSession')}</span>
          </Button>
          <div className="hidden xl:flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500"></div>
            <span className="text-[10px] font-black tracking-[0.1em] text-emerald-600/80 uppercase">{t('header.systemsOnline')}</span>
          </div>
          <div className="hidden sm:flex space-x-1">
            <div className="w-1 h-3 bg-border/40"></div>
            <div className="w-1 h-3 bg-border/40"></div>
            <div className="w-1 h-3 bg-border/40"></div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8 md:space-y-10 scrollbar-thin scroll-smooth select-text">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-danish-red/40" />
              <p className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase text-muted-foreground/50">{t('loading')}</p>
            </div>
          </div>
        ) : messages.length === 0 && showSuggestions ? (
          <div className="flex items-center justify-center h-full max-w-2xl mx-auto px-2 sm:px-4">
            <div className="text-center space-y-6 sm:space-y-8 w-full">
              <div className="space-y-2 sm:space-y-3">
                <span className="text-[9px] sm:text-[10px] font-black tracking-[0.4em] sm:tracking-[0.5em] text-danish-red uppercase block">{t('welcome.label')}</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-foreground tracking-tight px-4">{t('welcome.title')}</h3>
              </div>
              <SuggestedQuestions onQuestionClick={handleQuestionClick} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-8 sm:space-y-10 md:space-y-12">
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
                <div className="bg-muted/30 px-8 py-3 flex items-center space-x-3 border border-border/20">
                  <div className="w-1.5 h-1.5 bg-danish-red/40 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-danish-red/40 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-danish-red/40 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
            {error && (
              <div className="p-6 bg-destructive/5 text-destructive text-xs font-bold tracking-[0.1em] uppercase rounded-none text-center border border-destructive/10 max-w-md mx-auto">
                {t('error')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-border/40 p-4 sm:p-6 md:p-8 bg-muted/10 backdrop-blur-sm">
        <form onSubmit={onSubmit} className="relative flex gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={t('placeholder')}
            disabled={isLoading}
            className="flex-1 h-14 sm:h-16 md:h-18 lg:h-20 pl-4 sm:pl-6 md:pl-8 lg:pl-10 pr-24 sm:pr-32 md:pr-36 lg:pr-40 rounded-none border border-border/60 bg-background hover:border-danish-red/30 focus:border-danish-red/50 focus:ring-2 sm:focus:ring-4 focus:ring-danish-red/5 text-sm sm:text-base md:text-lg font-light placeholder:text-muted-foreground/40 shadow-soft transition-all"
            aria-label="Chat message input"
          />
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 flex gap-1 sm:gap-2">
            {isLoading ? (
              <Button
                type="button"
                onClick={stopGeneration}
                className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 lg:px-10 rounded-none bg-danish-red text-white hover:bg-danish-red/90 transition-all duration-300 shadow-md active:scale-95 text-[10px] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase group"
                aria-label="Stop generation"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="relative z-10">{t('stop')}</span>
                  <Square className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current relative z-10" />
                </div>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 lg:px-10 rounded-none bg-foreground text-background btn-trend transition-all duration-500 shadow-md active:scale-95 text-[10px] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase group"
                aria-label="Send message"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="relative z-10">{t('send')}</span>
                  <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10" />
                </div>
              </Button>
            )}
          </div>
        </form>
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-[7px] sm:text-[8px] font-bold tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground/30 uppercase">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </div>
  );
}
