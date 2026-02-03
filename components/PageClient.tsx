'use client';

import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ChatInterface } from '@/components/ChatInterface';
import { Footer } from '@/components/Footer';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { useEffect, useRef, useState } from 'react';

function PageContent() {
  const { user, refreshUser } = useAuth();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsChatVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (chatSectionRef.current) {
      observer.observe(chatSectionRef.current);
    }

    return () => {
      if (chatSectionRef.current) {
        observer.unobserve(chatSectionRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header user={user} onAuthChange={refreshUser} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Chat Interface Section */}
        <section
          id="chat-section"
          ref={chatSectionRef}
          className={`w-full bg-background py-24 sm:py-32 border-t border-border/40 transition-all duration-1000 ${isChatVisible ? 'opacity-100' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto flex flex-col items-start space-y-12 sm:space-y-16">
              <div className="space-y-6 max-w-4xl">
                <span className="px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/5">
                  Your Assistant
                </span>
                <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-foreground tracking-tight leading-tight">
                  Let’s talk,<br />
                  <span className="text-muted-foreground/60 italic">we’re here to help.</span>
                </h2>
                <p className="text-muted-foreground text-xl sm:text-2xl leading-relaxed font-sans font-light max-w-2xl">
                  Clear, simple answers about taxes, visas, and housing — in the language that feels like home.
                </p>
              </div>
              <div className="w-full">
                <ChatInterface userId={user?.id} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export function PageClient({ initialUser }: { initialUser: User | null }) {
  return (
    <AuthProvider initialUser={initialUser}>
      <PageContent />
    </AuthProvider>
  );
}
