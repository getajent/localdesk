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
import { useTranslations } from 'next-intl';

type TabId = 'chat' | 'settings';

function LoggedInView() {
  const { user, userSettings, signOut, refreshSettings } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');
  const t = useTranslations('HomePage.WelcomeBack');
  // Use ref to track header visibility to avoid re-rendering Header on scroll
  const isHeaderVisibleRef = useRef(true);
  const [sidebarHeight, setSidebarHeight] = useState('calc(100vh - 97px)');
  const [isFullPageChat, setIsFullPageChat] = useState(false);
  const lastScrollY = useRef(0);

  // Content transition refs
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track header visibility for sidebar height only (doesn't re-render Header)
  useEffect(() => {
    const updateSidebarHeight = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        const wasVisible = isHeaderVisibleRef.current;

        if (currentScrollY < 100) {
          isHeaderVisibleRef.current = true;
        } else {
          if (currentScrollY > lastScrollY.current) {
            isHeaderVisibleRef.current = false;
          } else {
            isHeaderVisibleRef.current = true;
          }
        }

        // Only update sidebar height state when visibility actually changes
        if (wasVisible !== isHeaderVisibleRef.current) {
          setSidebarHeight(isHeaderVisibleRef.current ? 'calc(100vh - 97px)' : '100vh');
        }

        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', updateSidebarHeight, { passive: true });
    return () => window.removeEventListener('scroll', updateSidebarHeight);
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
      {!isFullPageChat && <Header onAuthChange={signOut} />}

      <main className={`flex-1 ${isFullPageChat ? 'relative h-screen' : ''}`}>
        {/* Main Content Area - Aligned with Header Grid */}
        <div className={isFullPageChat ? 'absolute inset-0 z-10 bg-background' : 'container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-4 sm:pt-5 md:pt-6 pb-8 sm:pb-10 md:pb-12'}>
          <div className={isFullPageChat ? 'h-full flex flex-col' : 'max-w-7xl mx-auto'}>
            {!isFullPageChat && (
              <>
                {/* Welcome Section */}
                <div className="mb-6 sm:mb-7 md:mb-8 space-y-2 sm:space-y-2.5 md:space-y-3">
                  <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary text-primary text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase border border-primary/5">
                    {t('label')}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
                    {t('titlePrefix')}<span className="text-muted-foreground/60 italic">{userSettings?.displayName || user?.email?.split('@')[0]}</span>
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light max-w-xl">
                    {t('description')}
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
                </div>
              </>
            )}

            {/* Roadmap Sidebar - Hidden on mobile/tablet */}
            <aside className="hidden lg:flex fixed left-0 bottom-0 h-screen z-40 items-end pointer-events-none">
              <div
                className={`
                  w-[420px] xl:w-[520px] bg-background/95 backdrop-blur-2xl border-r border-t border-border/40 
                  transition-all duration-500 ease-in-out cursor-default
                  -translate-x-[calc(100%-40px)] xl:-translate-x-[calc(100%-48px)] hover:translate-x-0 
                  pointer-events-auto flex group
                  ${isFullPageChat ? 'h-screen' : `h-[${sidebarHeight}]`}
                `}
              >
                <div className="flex-1 h-full overflow-y-auto custom-scrollbar px-8 xl:px-14 py-12 xl:py-20 space-y-8 xl:space-y-12">
                  <RoadmapProgress onStepClick={handleStepClick} />

                  {/* Roadmap Tips */}
                  <div className="p-6 xl:p-8 border border-border/40 bg-card/50 backdrop-blur-xl space-y-3 xl:space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-danish-red" />
                      <h3 className="text-[9px] xl:text-[10px] font-black tracking-[0.2em] text-foreground uppercase">
                        Expert Advice
                      </h3>
                    </div>
                    <ul className="space-y-3 xl:space-y-4 text-[10px] xl:text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                      <li className="flex items-start gap-3 xl:gap-4">
                        <span className="text-danish-red mt-0.5 opacity-50">•</span>
                        <span>Click any step for detailed help</span>
                      </li>
                      <li className="flex items-start gap-3 xl:gap-4">
                        <span className="text-danish-red mt-0.5 opacity-50">•</span>
                        <span>Notify Assistant upon completion</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Vertical Label / Handle */}
                <div className="w-10 xl:w-12 h-full bg-secondary/20 backdrop-blur-md flex flex-col items-center justify-center border-l border-border/10 cursor-pointer group-hover:bg-danish-red transition-all duration-700 ease-in-out">
                  <div className="flex items-center gap-3 xl:gap-4 [writing-mode:vertical-lr] rotate-180">
                    <span className="text-[8px] xl:text-[9px] font-black tracking-[0.4em] xl:tracking-[0.5em] text-muted-foreground/60 group-hover:text-white/80 uppercase transition-colors">
                      Relocation
                    </span>
                    <div className="h-12 xl:h-16 w-[1px] bg-border group-hover:bg-white/20 transition-colors" />
                    <span className="text-[9px] xl:text-[10px] font-black tracking-[0.25em] xl:tracking-[0.3em] text-danish-red group-hover:text-white uppercase transition-colors">
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
              <div className={`space-y-6 sm:space-y-7 md:space-y-8 ${activeTab === 'chat' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'} ${isFullPageChat ? 'h-full' : ''}`}>
                <div className={`${isFullPageChat ? 'h-full w-full' : 'max-w-4xl mx-auto space-y-8 sm:space-y-10 md:space-y-12'}`}>
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
  const t = useTranslations('HomePage.ChatSection');

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
      <Header onAuthChange={refreshUser} />

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
          className={`w-full bg-background py-16 sm:py-20 md:py-24 lg:py-32 border-t border-border/40 transition-all duration-1000 ${isChatVisible ? 'opacity-100' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto flex flex-col items-start space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
              <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-4xl">
                <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary text-primary text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase border border-primary/5">
                  {t('label')}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-foreground tracking-tight leading-tight">
                  {t('title')}<br />
                  <span className="text-muted-foreground/60 italic">{t('subtitle')}</span>
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-sans font-light max-w-2xl">
                  {t('description')}
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
