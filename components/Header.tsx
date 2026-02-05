'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/AuthProvider';

export interface HeaderProps {
  user: User | null;
  onAuthChange?: () => void;
}

export function Header({ user, onAuthChange }: HeaderProps) {
  const { signOut, userSettings } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const displayName = userSettings?.displayName || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Always show at the very top
        if (currentScrollY < 100) {
          setIsVisible(true);
        } else {
          // If scrolling down, hide; if scrolling up, show
          if (currentScrollY > lastScrollY.current) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        }

        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Logo />
            </div>

            <div className="hidden lg:flex items-center gap-12">
              <nav className="flex items-center gap-8">
                {['Services', 'Knowledge', 'Guidance'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-danish-red transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <div className="h-6 w-[1px] bg-border/60" />
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Authentication Section */}
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black tracking-widest text-foreground uppercase">
                        {displayName}
                      </span>
                      <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Verified User</span>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="h-10 px-6 rounded-none border border-border btn-trend-outline text-[10px] font-black uppercase tracking-[0.2em]"
                      aria-label="Log out"
                    >
                      Exit
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleLogin}
                    className="bg-foreground text-background btn-trend rounded-none h-11 px-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-sm"
                    aria-label="Log in"
                  >
                    <span className="relative z-10">Member Access</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Auth & Theme (simplified) */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={user ? handleLogout : handleLogin}
                variant="ghost"
                className="p-2 h-auto text-[10px] font-black uppercase tracking-widest border border-border"
              >
                {user ? 'Exit' : 'Access'}
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
}
