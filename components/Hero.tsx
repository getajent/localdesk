'use client';

import { Button } from '@/components/ui/button';

export function Hero() {
  const handleStartChatting = () => {
    // Scroll to chat interface
    const chatElement = document.getElementById('chat-interface');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Navigate Danish Bureaucracy with Confidence
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl leading-relaxed">
            Get instant answers about SKAT, visas, and housing from your AI-powered Danish consultant
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleStartChatting}
            className="bg-danish-red hover:bg-[#A00A28] text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 mt-4 shadow-lg hover:shadow-xl transition-all focus:ring-danish-red"
            size="lg"
            aria-label="Start chatting with the AI assistant"
          >
            Start Chatting
          </Button>
        </div>
      </div>
    </section>
  );
}
