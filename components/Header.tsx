'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/components/AuthProvider';

export interface HeaderProps {
  onAuthChange?: () => void;
}

const HeaderComponent = ({ onAuthChange }: HeaderProps) => {
  const { user, signOut, userSettings } = useAuth();
  const t = useTranslations('Common');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const pendingVisibilityRef = useRef<boolean | null>(null);

  const displayName = userSettings?.displayName || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const applyPendingVisibility = () => {
      // Apply any pending visibility change after scroll has stopped
      if (pendingVisibilityRef.current !== null) {
        setIsVisible(pendingVisibilityRef.current);
        pendingVisibilityRef.current = null;
      }
      isScrollingRef.current = false;
    };

    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        isScrollingRef.current = true;
        const currentScrollY = window.scrollY;

        // Calculate what visibility should be
        let shouldBeVisible = true;
        if (currentScrollY < 100) {
          shouldBeVisible = true;
        } else {
          shouldBeVisible = currentScrollY <= lastScrollY.current;
        }

        // Store pending visibility but don't apply immediately
        pendingVisibilityRef.current = shouldBeVisible;
        lastScrollY.current = currentScrollY;

        // Clear any existing scroll-end timeout
        if (scrollEndTimeoutRef.current) {
          clearTimeout(scrollEndTimeoutRef.current);
        }

        // Set a timeout to detect when scrolling has stopped
        // Only then apply the visibility change
        scrollEndTimeoutRef.current = setTimeout(() => {
          applyPendingVisibility();
        }, 150); // Wait 150ms after last scroll event
      }
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });

    return () => {
      window.removeEventListener('scroll', controlNavbar);
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, []);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = useCallback(async () => {
    console.log('handleLogout called');
    // Use signOut from context - it handles everything
    await signOut();
  }, [signOut]);

  const handleAuthSuccess = () => {
    onAuthChange?.();
  };

  return (
    <>
      <header
        className={`w-full bg-background/90 backdrop-blur-xl sticky top-0 z-50 border-b border-border/40 transition-transform ${isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 md:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Logo />
            </div>

            <div className="hidden lg:flex items-center gap-8 xl:gap-12">
              <nav className="flex items-center gap-6 xl:gap-8">
                {[
                  { label: t('nav.services'), href: '/services' },
                  { label: t('nav.knowledge'), href: '/knowledge' },
                  { label: t('nav.guidance'), href: '/guidance' }
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-[9px] xl:text-[10px] font-black tracking-[0.25em] xl:tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-danish-red transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="h-6 w-[1px] bg-border/60" />
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Language Switcher */}
              <LanguageSwitcher />
              {/* Authentication Section */}
              <div className="flex items-center gap-3 xl:gap-4">
                {user ? (
                  <div className="flex items-center gap-4 xl:gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] xl:text-[10px] font-black tracking-widest text-foreground uppercase truncate max-w-[120px]">
                        {displayName}
                      </span>
                      <span className="text-[7px] xl:text-[8px] font-bold text-emerald-500 uppercase tracking-widest">{t('auth.verifiedUser')}</span>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="h-9 xl:h-10 px-4 xl:px-6 rounded-none border border-border btn-trend-outline text-[9px] xl:text-[10px] font-black uppercase tracking-[0.15em] xl:tracking-[0.2em]"
                      aria-label="Log out"
                    >
                      {t('auth.signOut')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleLogin}
                    className="bg-foreground text-background btn-trend rounded-none h-10 xl:h-11 px-6 xl:px-8 text-[9px] xl:text-[10px] font-black uppercase tracking-[0.15em] xl:tracking-[0.2em] transition-all active:scale-95 shadow-sm"
                    aria-label="Log in"
                  >
                    <span className="relative z-10">{t('auth.memberAccess')}</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile & Tablet Auth & Theme */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
              <Button
                onClick={user ? handleLogout : handleLogin}
                variant="ghost"
                className="h-8 sm:h-9 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] border border-border rounded-none hover:border-danish-red/40 hover:bg-danish-red/5 transition-all"
              >
                {user ? t('auth.signOut') : t('auth.access')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export const Header = memo(HeaderComponent);
