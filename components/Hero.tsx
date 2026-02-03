'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const handleStartChatting = () => {
    const chatElement = document.getElementById('chat-section');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full py-24 lg:py-40 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top Detail */}
          <div className="flex items-center space-x-3 mb-16 motion-safe:animate-fade-in">
            <span className="px-4 py-1.5 rounded-full border border-border bg-white/50 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase backdrop-blur-sm">
              Navigating Denmark
            </span>
          </div>

          {/* Statement Headline */}
          <h1 className="font-serif text-[12vw] lg:text-[8rem] font-medium leading-[1] lg:leading-[0.95] tracking-tight text-foreground mb-20 motion-safe:animate-slide-up">
            Danish life,<br />
            <span className="text-muted-foreground/60 italic">simplified.</span>
          </h1>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-end border-t border-border/60 pt-16">
            <div className="lg:col-span-7">
              <p className="text-2xl sm:text-3xl text-muted-foreground font-sans font-extralight leading-relaxed max-w-2xl motion-safe:animate-fade-in delay-100">
                The premier digital consultancy designed specifically for the nuanced challenges of building a life in Denmark.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-12 items-start lg:items-end w-full">
              <Button
                onClick={handleStartChatting}
                className="w-full sm:w-auto bg-danish-red hover:bg-danish-red/90 text-white rounded-full h-18 px-12 text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-layered hover:shadow-layered-lg group"
              >
                Access System
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">
                <span className="hover:text-danish-red transition-colors cursor-default">Skat</span>
                <span className="hover:text-danish-red transition-colors cursor-default">Visas</span>
                <span className="hover:text-danish-red transition-colors cursor-default">Housing</span>
                <span className="hover:text-danish-red transition-colors cursor-default">NemID</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Background Mark */}
      <div className="absolute -bottom-32 -right-32 pointer-events-none select-none opacity-[0.04] -z-0">
        <span className="font-serif text-[45rem] leading-none text-foreground select-none">dk</span>
      </div>
    </section>
  );
}
