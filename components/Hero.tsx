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
    <section className="relative w-full min-h-[calc(100vh-88px)] flex flex-col justify-center py-16 lg:py-20 bg-background overflow-hidden">
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top Detail */}
          <div className="flex items-center justify-between mb-8 lg:mb-12 motion-safe:animate-fade-in">
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-black tracking-[0.4em] text-danish-red uppercase">
                Est. 2026
              </span>
              <div className="h-[1px] w-12 bg-border" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Personal Advisor .01
              </span>
            </div>
            <div className="hidden lg:block text-[10px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">
              Danish // Hospitality
            </div>
          </div>

          {/* Statement Headline */}
          <div className="relative mb-12 lg:mb-20">
            <h1 className="font-serif text-[13vw] lg:text-[8rem] font-medium leading-[0.9] tracking-tighter text-foreground motion-safe:animate-slide-up">
              Making <br />
              <span className="relative inline-block">
                Denmark
                <div className="absolute -right-12 top-0 text-[1.5rem] font-sans font-black text-danish-red opacity-40 hidden lg:block">
                  &reg;
                </div>
              </span>
              <br />
              <span className="text-muted-foreground/40 italic font-light decoration-danish-red/20 underline decoration-1 underline-offset-[1rem]">feel like Home.</span>
            </h1>
          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start pt-12 border-t border-border/40">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-[10px] font-black tracking-[0.3em] text-danish-red uppercase">
                The Mission
              </h2>
              <p className="text-xl sm:text-3xl lg:text-4xl text-foreground/90 font-serif font-light leading-[1.15] max-w-2xl motion-safe:animate-fade-in delay-200">
                A thoughtful digital companion designed to help you navigate life in Denmark with <span className="italic font-normal">clarity</span> and absolute ease.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-8 items-start lg:items-end w-full">
              <div className="space-y-6 w-full lg:max-w-xs">
                <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed">
                  We turn complex Danish rules into clear, simple answers so you can focus on what matters most.
                </p>
                <Button
                  onClick={handleStartChatting}
                  className="w-full bg-foreground text-background btn-trend rounded-none h-14 lg:h-16 px-12 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 active:scale-95 group"
                >
                  <span className="relative z-10">Start a Conversation</span>
                  <ArrowRight className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-2 relative z-10" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 text-[9px] font-black tracking-[0.4em] text-muted-foreground/30 uppercase w-full justify-start lg:justify-end">
                <span className="hover:text-danish-red transition-colors cursor-pointer">Skat</span>
                <span className="hover:text-danish-red transition-colors cursor-pointer">Visas</span>
                <span className="hover:text-danish-red transition-colors cursor-pointer">Siri</span>
                <span className="hover:text-danish-red transition-colors cursor-pointer">Housing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-border/20 hidden xl:block" />
    </section>
  );
}
