'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Profile will be created by database trigger
          onSuccess?.();
          onClose();
        }
      } else {
        // Sign in existing user
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.session) {
          onSuccess?.();
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 motion-safe:animate-fade-in"
      onClick={handleClose}
    >
      <Card
        className="w-full max-w-md relative rounded-none border border-border bg-card shadow-xl motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-danish-red transition-colors p-2"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="p-10 pb-2 space-y-6 text-center border-b border-transparent">
          <div className="flex flex-col items-center justify-center space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-danish-red uppercase">
              {isSignUp ? 'New Member' : 'Welcome Back'}
            </span>
            <CardTitle className="text-4xl font-serif font-light text-foreground">
              {isSignUp ? 'Join the Club' : 'Sign In'}
            </CardTitle>
          </div>
          <p className="text-muted-foreground font-sans font-light leading-relaxed max-w-xs mx-auto">
            {isSignUp
              ? 'Create an account to save your conversations and preferences.'
              : 'Enter your credentials to access your personal dashboard.'}
          </p>
        </CardHeader>

        <CardContent className="p-10 pt-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isLoading}
                className="h-12 rounded-none border-border bg-transparent focus:border-danish-red focus:ring-0 text-base font-normal placeholder:text-muted-foreground/30 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="h-12 rounded-none border-border bg-transparent focus:border-danish-red focus:ring-0 text-base font-normal placeholder:text-muted-foreground/30 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/5 text-destructive text-xs font-medium tracking-wide uppercase text-center border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-foreground text-background btn-trend rounded-none h-14 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.99]"
              disabled={isLoading}
            >
              <span className="relative z-10">
                {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </span>
            </Button>

            <div className="text-center pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground hover:text-danish-red transition-colors"
                disabled={isLoading}
              >
                {isSignUp ? 'Already a member? Sign in' : 'New here? Create account'}
              </button>

              <p className="text-[10px] text-muted-foreground/60 text-center mt-6 font-sans leading-tight max-w-[240px] mx-auto">
                By continuing, you agree to our{' '}
                <a href="/terms" className="underline hover:text-foreground transition-colors">Terms</a>
                {' '}and{' '}
                <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>
                {' '}including cookie usage.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
