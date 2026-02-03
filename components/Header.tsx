'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { LogIn, LogOut } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { Logo } from '@/components/Logo';

export interface HeaderProps {
  user: User | null;
  onAuthChange?: () => void;
}

export function Header({ user, onAuthChange }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      onAuthChange?.();
    }
  };

  const handleAuthSuccess = () => {
    onAuthChange?.();
  };

  const getUserInitials = (email: string): string => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="w-full bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all border-b border-border/40 selection:bg-danish-red/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Authentication Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium tracking-wide text-muted-foreground hidden sm:inline font-sans">
                  {user.email?.split('@')[0]}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="h-10 px-6 rounded-full border border-border hover:bg-danish-red hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                  aria-label="Log out"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-danish-red hover:bg-danish-red/90 text-white rounded-full h-11 px-8 text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-sm"
                aria-label="Log in"
              >
                Access Portal
              </Button>
            )}
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
