'use client';

import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ChatInterface } from '@/components/ChatInterface';
import { Footer } from '@/components/Footer';
import { AuthProvider, useAuth } from '@/components/AuthProvider';

function PageContent() {
  const { user, refreshUser } = useAuth();

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
        <section id="chat-interface" className="w-full bg-white py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Start Your Conversation
                </h2>
                <p className="text-slate-600 text-base sm:text-lg">
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
