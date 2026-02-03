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
    <section className="relative w-full bg-gradient-to-b from-white via-cool-50 to-neutral-100 py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden motion-safe:animate-fade-in">
      {/* Decorative SVG shapes with absolute positioning */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Top-right decorative circle */}
        <svg
          className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 opacity-[0.08]"
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="300" cy="300" r="300" fill="#C8102E" />
        </svg>

        {/* Bottom-left decorative shape */}
        <svg
          className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 opacity-[0.06]"
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="100" y="100" width="300" height="300" rx="60" fill="#64748b" />
        </svg>

        {/* Center decorative accent */}
        <svg
          className="absolute top-1/2 left-1/4 transform -translate-y-1/2 opacity-[0.05]"
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="150" fill="#f4994f" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 md:space-y-8 motion-safe:animate-slide-up">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-[-0.02em]">
            Navigate Danish Bureaucracy with Confidence
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-xl md:text-2xl lg:text-2xl text-slate-700 max-w-[65ch] leading-[1.6] tracking-[-0.01em] font-normal">
            Get instant answers about SKAT, visas, and housing from your AI-powered Danish consultant
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleStartChatting}
            className="bg-danish-red hover:bg-[#A00A28] text-white text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-6 sm:py-7 mt-4 shadow-soft-lg hover:shadow-hover-lg hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-danish-red focus:ring-offset-2 focus:outline-none min-h-[44px]"
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
