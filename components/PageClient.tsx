'use client';

import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ChatInterface } from '@/components/ChatInterface';
import { Footer } from '@/components/Footer';
import { Settings } from '@/components/Settings';
import { UsefulLinks } from '@/components/UsefulLinks';
import { RoadmapProgress } from '@/components/RoadmapProgress';
import { DashboardTabs } from '@/components/DashboardTabs';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { useEffect, useRef, useState } from 'react';

type TabId = 'chat' | 'settings';

function LoggedInView() {
  const { user, userSettings, signOut, refreshSettings } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFullPageChat, setIsFullPageChat] = useState(false);
  const lastScrollY = useRef(0);

  // Content transition refs
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY < 100) {
          setIsHeaderVisible(true);
        } else {
          if (currentScrollY > lastScrollY.current) {
            setIsHeaderVisible(false);
          } else {
            setIsHeaderVisible(true);
          }
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, []);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    // Refresh settings when entering settings to ensure up-to-date data
    if (tabId === 'settings') {
      refreshSettings();
    }

    setIsTransitioning(true);

    // Quick fade out, change tab, fade in
    setTimeout(() => {
      setActiveTab(tabId as TabId);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const handleStepClick = (stepId: string, title: string) => {
    setChatInitialQuestion(`How do I complete the "${title}" step?`);
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col ${isFullPageChat ? 'h-screen overflow-hidden' : ''}`}>
      {!isFullPageChat && <Header user={user} onAuthChange={signOut} />}

      <main className={`flex-1 ${isFullPageChat ? 'relative h-screen' : ''}`}>
        {/* Main Content Area - Aligned with Header Grid */}
        <div className={isFullPageChat ? 'absolute inset-0 z-10 bg-background' : 'container mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-12'}>
          <div className={isFullPageChat ? 'h-full flex flex-col' : 'max-w-7xl mx-auto'}>
            {!isFullPageChat && (
              <>
                {/* Welcome Section */}
                <div className="mb-8 space-y-3">
                  <span className="px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/5">
                    Welcome Back
                  </span>
                  <h1 className="font-serif text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
                    Hello, <span className="text-muted-foreground/60 italic">{userSettings?.displayName || user?.email?.split('@')[0]}</span>
                  </h1>
                  <p className="text-muted-foreground text-lg font-light max-w-xl">
                    Set your profile, track your journey, and ask anything about living in Denmark.
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6">
                  <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
                </div>
              </>
            )}

            {/* Roadmap Sidebar */}
            <aside className="fixed left-0 bottom-0 h-screen z-40 flex items-end pointer-events-none">
              <div
                className={`
                  w-[520px] bg-background/95 backdrop-blur-2xl border-r border-t border-border/40 
                  transition-all duration-500 ease-in-out cursor-default
                  -translate-x-[calc(100%-48px)] hover:translate-x-0 
                  pointer-events-auto flex group
                  ${isFullPageChat ? 'h-screen' : (isHeaderVisible ? 'h-[calc(100vh-97px)]' : 'h-screen')}
                `}
              >
                <div className="flex-1 h-full overflow-y-auto custom-scrollbar px-14 py-20 space-y-12">
                  <RoadmapProgress onStepClick={handleStepClick} />

                  {/* Roadmap Tips */}
                  <div className="p-8 border border-border/40 bg-card/50 backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                      <h3 className="text-[10px] font-black tracking-[0.2em] text-foreground uppercase">
                        Expert Advice
                      </h3>
                    </div>
                    <ul className="space-y-4 text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                      <li className="flex items-start gap-4">
                        <span className="text-danish-red mt-0.5 opacity-50">•</span>
                        <span>Click any step for detailed help</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-danish-red mt-0.5 opacity-50">•</span>
                        <span>Notify Assistant upon completion</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Vertical Label / Handle */}
                <div className="w-12 h-full bg-secondary/20 backdrop-blur-md flex flex-col items-center justify-center border-l border-border/10 cursor-pointer group-hover:bg-danish-red transition-all duration-700 ease-in-out">
                  <div className="flex items-center gap-4 [writing-mode:vertical-lr] rotate-180">
                    <span className="text-[9px] font-black tracking-[0.5em] text-muted-foreground/60 group-hover:text-white/80 uppercase transition-colors">
                      Relocation
                    </span>
                    <div className="h-16 w-[1px] bg-border group-hover:bg-white/20 transition-colors" />
                    <span className="text-[10px] font-black tracking-[0.3em] text-danish-red group-hover:text-white uppercase transition-colors">
                      Journey
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Tab Content */}
            <div
              ref={contentRef}
              className={`
                transition-all duration-200 ease-out
                ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
                ${isFullPageChat ? 'flex-1 overflow-hidden pl-12' : ''}
              `}
            >
              {/* Chat Tab */}
              <div className={`space-y-8 ${activeTab === 'chat' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'} ${isFullPageChat ? 'h-full' : ''}`}>
                <div className={`${isFullPageChat ? 'h-full w-full' : 'max-w-4xl mx-auto space-y-12'}`}>
                  <ChatInterface
                    userId={user?.id}
                    userSettings={userSettings}
                    initialQuestion={chatInitialQuestion}
                    isFullPage={isFullPageChat}
                    onToggleFullPage={() => setIsFullPageChat(!isFullPageChat)}
                  />
                  {!isFullPageChat && <UsefulLinks />}
                </div>
              </div>

              {/* Settings Tab */}
              {!isFullPageChat && (
                <div className={`max-w-xl mx-auto ${activeTab === 'settings' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}`}>
                  <Settings />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {!isFullPageChat && <Footer />}
    </div>
  );
}

function LoggedOutView() {
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
                  Let's talk,<br />
                  <span className="text-muted-foreground/60 italic">we're here to help.</span>
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

function PageContent() {
  const { user } = useAuth();

  // Show logged-in view if user exists
  if (user) {
    return <LoggedInView />;
  }

  // Show landing page for logged-out users
  return <LoggedOutView />;
}

export function PageClient({ initialUser }: { initialUser: User | null }) {
  return (
    <AuthProvider initialUser={initialUser}>
      <PageContent />
    </AuthProvider>
  );
}
