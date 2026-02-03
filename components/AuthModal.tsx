'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <Card
        className="w-full max-w-md relative rounded-[2rem] border border-border shadow-soft-xl overflow-hidden bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-muted-foreground hover:text-danish-red transition-colors p-2 rounded-full hover:bg-danish-red/10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="bg-muted/30 border-b border-border p-8 space-y-4 text-center">
          <CardTitle className="text-3xl font-serif font-medium tracking-tight text-foreground">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm font-normal">
            {isSignUp
              ? 'Join to save your chat history and preferences.'
              : 'Enter your details to access your dashboard.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isLoading}
                className="h-12 rounded-xl border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-base font-normal placeholder:text-muted-foreground/50 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="h-12 rounded-xl border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-base font-normal placeholder:text-muted-foreground/50 shadow-sm"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg text-center border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-danish-red hover:bg-danish-red/90 text-white rounded-full h-12 text-sm font-bold uppercase tracking-wide shadow-md transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-sm font-medium text-muted-foreground hover:text-danish-red transition-colors hover:underline underline-offset-4"
                disabled={isLoading}
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
