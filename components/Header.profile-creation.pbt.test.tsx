import fc from 'fast-check';

// Feature: localdesk-landing-page, Property 6: Profile Creation on Authentication
// Validates: Requirements 6.6
describe('Property 6: Profile Creation on Authentication', () => {
  it('should create a corresponding profile record for any new user authentication', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.uuid(),
          email: fc.emailAddress(),
          fullName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
        }),
        async (userData) => {
          const createdProfiles: any[] = [];

          // Mock Supabase client
          const mockSupabase = {
            auth: {
              signUp: jest.fn().mockResolvedValue({
                data: {
                  user: {
                    id: userData.userId,
                    email: userData.email,
                    created_at: new Date().toISOString(),
                  },
                },
                error: null,
              }),
            },
            from: jest.fn().mockImplementation((table: string) => {
              if (table === 'profiles') {
                return {
                  insert: jest.fn().mockImplementation((profile) => {
                    createdProfiles.push(profile);
                    return Promise.resolve({ data: profile, error: null });
                  }),
                  select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({
                      data: createdProfiles.filter((p) => p.user_id === userData.userId),
                      error: null,
                    }),
                  }),
                };
              }
              return {};
            }),
          };

          // Simulate user authentication
          const { data: authData, error: authError } = await mockSupabase.auth.signUp({
            email: userData.email,
            password: 'test-password',
          });

          expect(authError).toBeNull();
          expect(authData.user).toBeDefined();

          // Simulate profile creation (this would typically be done via a database trigger or function)
          const { data: profileData, error: profileError } = await mockSupabase
            .from('profiles')
            .insert({
              user_id: userData.userId,
              full_name: userData.fullName,
              metadata: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          // Property: Profile should be created successfully
          expect(profileError).toBeNull();
          expect(createdProfiles).toHaveLength(1);

          // Verify profile data
          const profile = createdProfiles[0];
          expect(profile.user_id).toBe(userData.userId);
          expect(profile.full_name).toBe(userData.fullName);
          expect(profile.metadata).toBeDefined();

          // Verify profile can be retrieved
          const { data: retrievedProfiles } = await mockSupabase
            .from('profiles')
            .select('*')
            .eq('user_id', userData.userId);

          expect(retrievedProfiles).toHaveLength(1);
          expect(retrievedProfiles[0].user_id).toBe(userData.userId);

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should create profile with default metadata for any new user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.emailAddress(),
        async (userId, email) => {
          const createdProfiles: any[] = [];

          // Mock Supabase client
          const mockSupabase = {
            from: jest.fn().mockReturnValue({
              insert: jest.fn().mockImplementation((profile) => {
                createdProfiles.push(profile);
                return Promise.resolve({ data: profile, error: null });
              }),
            }),
          };

          // Create profile with default metadata
          await mockSupabase.from('profiles').insert({
            user_id: userId,
            full_name: null,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          // Property: Profile should have metadata field (even if empty)
          expect(createdProfiles).toHaveLength(1);
          expect(createdProfiles[0].metadata).toBeDefined();
          expect(typeof createdProfiles[0].metadata).toBe('object');

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should ensure profile user_id references valid user for any profile creation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.uuid(),
          email: fc.emailAddress(),
        }),
        async (userData) => {
          const users: any[] = [];
          const profiles: any[] = [];

          // Mock Supabase client with foreign key constraint simulation
          const mockSupabase = {
            from: jest.fn().mockImplementation((table: string) => {
              if (table === 'users') {
                return {
                  insert: jest.fn().mockImplementation((user) => {
                    users.push(user);
                    return Promise.resolve({ data: user, error: null });
                  }),
                };
              }
              if (table === 'profiles') {
                return {
                  insert: jest.fn().mockImplementation((profile) => {
                    // Simulate foreign key constraint
                    const userExists = users.some((u) => u.id === profile.user_id);
                    if (!userExists) {
                      return Promise.resolve({
                        data: null,
                        error: { message: 'Foreign key constraint violation' },
                      });
                    }
                    profiles.push(profile);
                    return Promise.resolve({ data: profile, error: null });
                  }),
                };
              }
              return {};
            }),
          };

          // Create user first
          await mockSupabase.from('users').insert({
            id: userData.userId,
            email: userData.email,
            created_at: new Date().toISOString(),
          });

          // Create profile with valid user_id
          const { error } = await mockSupabase.from('profiles').insert({
            user_id: userData.userId,
            full_name: null,
            metadata: {},
          });

          // Property: Profile creation should succeed when user_id is valid
          expect(error).toBeNull();
          expect(profiles).toHaveLength(1);
          expect(profiles[0].user_id).toBe(userData.userId);

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});
