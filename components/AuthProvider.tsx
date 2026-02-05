'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, ensureProfile, UserSettings } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  userSettings: UserSettings;
  loading: boolean;
  refreshUser: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userSettings: {},
  loading: true,
  refreshUser: async () => { },
  refreshSettings: async () => { },
  signOut: async () => { },
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [userSettings, setUserSettings] = useState<UserSettings>({});
  const [loading, setLoading] = useState(false);

  const refreshSettings = useCallback(async () => {
    if (!user?.id) {
      setUserSettings({});
      return;
    }
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        setUserSettings(settings);
      }
    } catch (error) {
      console.error('Error refreshing settings:', error);
    }
  }, [user?.id]);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = useCallback(async () => {
    // Immediately clear local state FIRST
    setUser(null);
    setUserSettings({});

    // Then try to sign out from Supabase (fire and forget)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out API error (state already cleared):', error);
    }
  }, []);

  // Load user settings when user changes
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  useEffect(() => {
    // Listen for auth state changes - update state reactively
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user || null;
        setUser(newUser);

        // Ensure profile exists and load settings for new user
        if (newUser?.id) {
          await ensureProfile(newUser.id);
          try {
            const response = await fetch('/api/settings');
            if (response.ok) {
              const settings = await response.json();
              setUserSettings(settings);
            }
          } catch (error) {
            console.error('Error fetching settings on auth change:', error);
          }
        } else {
          setUserSettings({});
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userSettings, loading, refreshUser, refreshSettings, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
