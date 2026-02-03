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
    <div className="min-h-screen bg-white flex flex-col">
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
          id="chat-interface" 
          ref={chatSectionRef}
          className={`w-full bg-gradient-to-b from-neutral-50 to-white py-12 sm:py-16 md:py-24 transition-opacity duration-300 ${
            isChatVisible ? 'motion-safe:animate-fade-in' : 'opacity-0'
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              <div className="text-center space-y-3 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-[-0.01em] leading-[1.2]">
                  Start Your Conversation
                </h2>
                <p className="text-slate-700 text-lg sm:text-xl leading-[1.6] font-normal max-w-[65ch] mx-auto">
                  Ask anything about Danish bureaucracy
                </p>
              </div>
              <ChatInterface userId={user?.id} />
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
