'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { LogIn, LogOut } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

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
      <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              LocalDesk
            </h1>
          </div>

          {/* Authentication Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              // Authenticated user display
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 ring-2 ring-slate-200 hover:ring-danish-red transition-all">
                  <AvatarFallback className="bg-slate-200 text-slate-700 text-sm font-medium">
                    {getUserInitials(user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-slate-700 hidden sm:inline truncate max-w-[150px] md:max-w-[200px]">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Guest user - show login button
              <Button
                onClick={handleLogin}
                className="bg-danish-red hover:bg-[#A00A28] text-white shadow-sm hover:shadow-md transition-all focus:ring-danish-red"
                aria-label="Log in"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Log In</span>
                <span className="sm:hidden">Login</span>
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
