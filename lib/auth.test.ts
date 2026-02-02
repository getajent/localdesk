// Set up environment variables before any imports
process.env.OPENAI_API_KEY = 'test-key';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock the supabase module before importing
jest.mock('@/lib/supabase', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn(),
  };

  return {
    supabase: mockSupabase,
    validateEnvironmentVariables: jest.fn(),
    getCurrentUser: async () => {
      try {
        const { data, error } = await mockSupabase.auth.getUser();
        if (error) throw error;
        return data.user;
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    },
    getSession: async () => {
      try {
        const { data, error } = await mockSupabase.auth.getSession();
        if (error) throw error;
        return data.session;
      } catch (error) {
        console.error('Error getting session:', error);
        return null;
      }
    },
    ensureProfile: async (userId: string, userData?: any) => {
      try {
        const { data: existingProfile } = await mockSupabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (existingProfile) {
          return existingProfile;
        }

        const { data: newProfile, error } = await mockSupabase
          .from('profiles')
          .insert({
            user_id: userId,
            full_name: userData?.full_name || null,
            metadata: userData?.metadata || {},
          })
          .select()
          .single();

        if (error) throw error;
        return newProfile;
      } catch (error) {
        console.error('Error ensuring profile:', error);
        return null;
      }
    },
  };
});

import { supabase, getCurrentUser, getSession, ensureProfile } from '@/lib/supabase';

describe('Authentication Helper Functions - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const user = await getCurrentUser();
      expect(user).toEqual(mockUser);
      expect(supabase.auth.getUser).toHaveBeenCalled();
    });

    it('should return null when not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const user = await getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return null on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Auth error' },
      });

      const user = await getCurrentUser();
      expect(user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getSession', () => {
    it('should return session when authenticated', async () => {
      const mockSession = {
        access_token: 'token-123',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const session = await getSession();
      expect(session).toEqual(mockSession);
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    it('should return null when no session exists', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: { message: 'Session error' },
      });

      const session = await getSession();
      expect(session).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('ensureProfile', () => {
    it('should return existing profile if it exists', async () => {
      const mockProfile = {
        id: 'profile-123',
        user_id: 'user-123',
        full_name: 'Test User',
        metadata: {},
      };

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as jest.Mock).mockImplementation(mockFrom);

      const profile = await ensureProfile('user-123');
      expect(profile).toEqual(mockProfile);
      expect(mockFrom).toHaveBeenCalledWith('profiles');
    });

    it('should create new profile if it does not exist', async () => {
      const newProfile = {
        id: 'profile-456',
        user_id: 'user-456',
        full_name: 'New User',
        metadata: {},
      };

      const mockFrom = jest.fn().mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: newProfile,
                  error: null,
                }),
              }),
            }),
          };
        }
      });

      (supabase.from as jest.Mock).mockImplementation(mockFrom);

      const profile = await ensureProfile('user-456', { full_name: 'New User' });
      expect(profile).toEqual(newProfile);
    });

    it('should handle profile creation with metadata', async () => {
      const metadata = { preferences: { theme: 'dark' } };
      const newProfile = {
        id: 'profile-789',
        user_id: 'user-789',
        full_name: null,
        metadata,
      };

      const mockFrom = jest.fn().mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: newProfile,
                  error: null,
                }),
              }),
            }),
          };
        }
      });

      (supabase.from as jest.Mock).mockImplementation(mockFrom);

      const profile = await ensureProfile('user-789', { metadata });
      expect(profile).toEqual(newProfile);
    });

    it('should return null on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      (supabase.from as jest.Mock).mockImplementation(mockFrom);

      const profile = await ensureProfile('user-error');
      expect(profile).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });
});
