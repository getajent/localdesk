'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { getChatHistory, getMessages } from '@/lib/supabase';

export interface ChatInterfaceProps {
  userId?: string | null;
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        userId: userId || undefined,
      },
    }),
    onFinish: () => {
      // Hide suggestions after first message
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Load chat history for authenticated users on mount
  useEffect(() => {
    async function loadChatHistory() {
      if (!userId) return;

      setIsLoadingHistory(true);
      try {
        // Get the most recent chat session
        const chats = await getChatHistory(userId);
        if (chats.length > 0) {
          const mostRecentChat = chats[0];
          
          // Fetch messages from the most recent chat
          const historicalMessages = await getMessages(mostRecentChat.id);
          
          // Convert to the format expected by useChat (v6 uses parts)
          const formattedMessages = historicalMessages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            parts: [{ type: 'text' as const, text: msg.content }],
          }));
          
          // Set the messages in the chat interface
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadChatHistory();
  }, [userId, setMessages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hide suggestions when messages exist
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
    if (input.trim()) {
      await sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[500px] sm:h-[600px] md:h-[650px] border border-slate-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
              <p className="text-sm text-slate-600">Loading your chat history...</p>
            </div>
          </div>
        ) : messages.length === 0 && showSuggestions ? (
          <div className="flex items-center justify-center h-full px-4">
            <SuggestedQuestions onQuestionClick={handleQuestionClick} />
          </div>
        ) : (
          <>
            {messages.map((message) => {
              // Extract text content from message parts
              const content = message.parts
                .filter((part: any) => part.type === 'text')
                .map((part: any) => part.text)
                .join('');
              
              return (
                <ChatMessage
                  key={message.id}
                  role={message.role as 'user' | 'assistant'}
                  content={content}
                  timestamp={new Date()}
                />
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
                  Sorry, I encountered an error. Please try again.
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about SKAT, visas, or housing..."
            disabled={isLoading}
            className="flex-1 focus:ring-danish-red focus:border-danish-red"
            aria-label="Chat message input"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-danish-red hover:bg-[#A00A28] text-white shadow-sm hover:shadow-md transition-all focus:ring-danish-red"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
