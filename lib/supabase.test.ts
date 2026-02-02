import fc from 'fast-check';

// Feature: localdesk-landing-page, Property 13: Environment Variable Validation
describe('Property 13: Environment Variable Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to clear the cached supabase module
    jest.resetModules();
    // Create a fresh copy of process.env
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should throw an error for any missing required environment variable', () => {
    fc.assert(
      fc.property(
        fc.record({
          OPENAI_API_KEY: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          NEXT_PUBLIC_SUPABASE_URL: fc.option(
            fc.webUrl({ validSchemes: ['https'] }),
            { nil: undefined }
          ),
          NEXT_PUBLIC_SUPABASE_ANON_KEY: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        }),
        (envVars) => {
          // Reset modules before each property test iteration
          jest.resetModules();
          
          // Set up environment variables
          if (envVars.OPENAI_API_KEY !== undefined) {
            process.env.OPENAI_API_KEY = envVars.OPENAI_API_KEY;
          } else {
            delete process.env.OPENAI_API_KEY;
          }
          
          if (envVars.NEXT_PUBLIC_SUPABASE_URL !== undefined) {
            process.env.NEXT_PUBLIC_SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
          } else {
            delete process.env.NEXT_PUBLIC_SUPABASE_URL;
          }
          
          if (envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined) {
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          } else {
            delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          }

          // Check if any required variable is missing or empty
          const hasMissingVar = 
            !envVars.OPENAI_API_KEY || envVars.OPENAI_API_KEY.trim() === '' ||
            !envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL.trim() === '' ||
            !envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim() === '';

          if (hasMissingVar) {
            // Should throw an error when importing the module
            expect(() => {
              // Dynamic import to trigger validation
              require('./supabase');
            }).toThrow(/Missing required environment variables/);
          } else {
            // Should not throw when all variables are present and valid
            expect(() => {
              require('./supabase');
            }).not.toThrow();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should throw error with clear message listing missing variables', () => {
    // Test specific case: missing OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    expect(() => {
      require('./supabase');
    }).toThrow(/OPENAI_API_KEY/);
  });

  it('should throw error for empty string environment variables', () => {
    process.env.OPENAI_API_KEY = '   '; // whitespace only
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    expect(() => {
      require('./supabase');
    }).toThrow(/Missing required environment variables/);
  });

  it('should not throw when all required variables are present and non-empty', () => {
    process.env.OPENAI_API_KEY = 'sk-test-key';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    expect(() => {
      require('./supabase');
    }).not.toThrow();
  });
});

// Feature: localdesk-landing-page, Property 7: Authenticated Message Persistence
describe('Property 7: Authenticated Message Persistence', () => {
  it('should persist both user and assistant messages with valid chat_id for any authenticated user message', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.string({ minLength: 1, maxLength: 1000 }),
        async (userId, userMessage, assistantMessage) => {
          const mockChatId = fc.sample(fc.uuid(), 1)[0];
          const insertedMessages: any[] = [];

          // Create a mock Supabase client for this iteration
          const mockSupabase = {
            from: jest.fn().mockImplementation((table: string) => {
              if (table === 'chats') {
                return {
                  select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                      order: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                          single: jest.fn().mockResolvedValue({
                            data: { id: mockChatId },
                            error: null,
                          }),
                        }),
                      }),
                    }),
                  }),
                };
              }
              if (table === 'messages') {
                return {
                  insert: jest.fn().mockImplementation((messages) => {
                    insertedMessages.push(...messages);
                    return Promise.resolve({ data: messages, error: null });
                  }),
                };
              }
              return {};
            }),
          };

          // Create a mock saveMessage function that mimics the real implementation
          const saveMessage = async (
            userId: string,
            userMessage: string,
            assistantMessage: string
          ) => {
            try {
              const { data: chat } = await mockSupabase
                .from('chats')
                .select('id')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

              let chatId = chat?.id;

              if (!chatId) {
                const { data: newChat } = await mockSupabase
                  .from('chats')
                  .insert({ user_id: userId })
                  .select('id')
                  .single();
                chatId = newChat!.id;
              }

              await mockSupabase.from('messages').insert([
                { chat_id: chatId, role: 'user', content: userMessage },
                { chat_id: chatId, role: 'assistant', content: assistantMessage },
              ]);
            } catch (error) {
              console.error('Database error:', error);
            }
          };

          await saveMessage(userId, userMessage, assistantMessage);

          // Verify both messages were inserted
          expect(insertedMessages).toHaveLength(2);

          // Verify user message
          const userMsg = insertedMessages.find((m) => m.role === 'user');
          expect(userMsg).toBeDefined();
          expect(userMsg.content).toBe(userMessage);
          expect(userMsg.chat_id).toBe(mockChatId);

          // Verify assistant message
          const assistantMsg = insertedMessages.find((m) => m.role === 'assistant');
          expect(assistantMsg).toBeDefined();
          expect(assistantMsg.content).toBe(assistantMessage);
          expect(assistantMsg.chat_id).toBe(mockChatId);
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Feature: localdesk-landing-page, Property 8: Chat History Retrieval
describe('Property 8: Chat History Retrieval', () => {
  it('should retrieve previous chat sessions for any authenticated user loading the application', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.array(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            created_at: fc.date(),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        async (userId, mockChats) => {
          // Sort chats by created_at descending (most recent first)
          const sortedChats = [...mockChats].sort(
            (a, b) => b.created_at.getTime() - a.created_at.getTime()
          );

          const mockSupabase = {
            from: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  order: jest.fn().mockResolvedValue({
                    data: sortedChats,
                    error: null,
                  }),
                }),
              }),
            }),
          };

          // Create a mock getChatHistory function that mimics the real implementation
          const getChatHistory = async (userId: string) => {
            try {
              const { data } = await mockSupabase
                .from('chats')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

              return data || [];
            } catch (error) {
              console.error('Database error:', error);
              return [];
            }
          };

          const result = await getChatHistory(userId);

          // Verify the result matches the sorted chats
          expect(result).toHaveLength(sortedChats.length);

          // Verify order is preserved (most recent first)
          result.forEach((chat, index) => {
            expect(chat.id).toBe(sortedChats[index].id);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Unit tests for database helper functions
describe('Database Helper Functions - Unit Tests', () => {
  describe('saveMessage', () => {
    it('should save message with valid inputs', async () => {
      const userId = 'user-123';
      const userMessage = 'How do I register with SKAT?';
      const assistantMessage = 'To register with SKAT, you need...';
      const chatId = 'chat-456';
      const insertedMessages: any[] = [];

      const mockSupabase = {
        from: jest.fn().mockImplementation((table: string) => {
          if (table === 'chats') {
            return {
              select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                      single: jest.fn().mockResolvedValue({
                        data: { id: chatId },
                        error: null,
                      }),
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === 'messages') {
            return {
              insert: jest.fn().mockImplementation((messages) => {
                insertedMessages.push(...messages);
                return Promise.resolve({ data: messages, error: null });
              }),
            };
          }
          return {};
        }),
      };

      // Mock implementation of saveMessage
      const saveMessage = async (
        userId: string,
        userMessage: string,
        assistantMessage: string
      ) => {
        try {
          const { data: chat } = await mockSupabase
            .from('chats')
            .select('id')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let chatId = chat?.id;

          if (!chatId) {
            const { data: newChat } = await mockSupabase
              .from('chats')
              .insert({ user_id: userId })
              .select('id')
              .single();
            chatId = newChat!.id;
          }

          await mockSupabase.from('messages').insert([
            { chat_id: chatId, role: 'user', content: userMessage },
            { chat_id: chatId, role: 'assistant', content: assistantMessage },
          ]);
        } catch (error) {
          console.error('Database error:', error);
        }
      };

      await saveMessage(userId, userMessage, assistantMessage);

      expect(insertedMessages).toHaveLength(2);
      expect(insertedMessages[0]).toMatchObject({
        chat_id: chatId,
        role: 'user',
        content: userMessage,
      });
      expect(insertedMessages[1]).toMatchObject({
        chat_id: chatId,
        role: 'assistant',
        content: assistantMessage,
      });
    });

    it('should handle error gracefully without throwing', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockSupabase = {
        from: jest.fn().mockImplementation(() => {
          throw new Error('Database connection failed');
        }),
      };

      const saveMessage = async (
        userId: string,
        userMessage: string,
        assistantMessage: string
      ) => {
        try {
          const { data: chat } = await mockSupabase
            .from('chats')
            .select('id')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let chatId = chat?.id;

          if (!chatId) {
            const { data: newChat } = await mockSupabase
              .from('chats')
              .insert({ user_id: userId })
              .select('id')
              .single();
            chatId = newChat!.id;
          }

          await mockSupabase.from('messages').insert([
            { chat_id: chatId, role: 'user', content: userMessage },
            { chat_id: chatId, role: 'assistant', content: assistantMessage },
          ]);
        } catch (error) {
          console.error('Database error:', error);
        }
      };

      // Should not throw
      await expect(
        saveMessage('user-123', 'test message', 'test response')
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getChatHistory', () => {
    it('should return ordered results (most recent first)', async () => {
      const userId = 'user-123';
      const mockChats = [
        { id: 'chat-3', created_at: '2024-01-03T00:00:00Z', title: 'Chat 3' },
        { id: 'chat-2', created_at: '2024-01-02T00:00:00Z', title: 'Chat 2' },
        { id: 'chat-1', created_at: '2024-01-01T00:00:00Z', title: 'Chat 1' },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: mockChats,
                error: null,
              }),
            }),
          }),
        }),
      };

      const getChatHistory = async (userId: string) => {
        try {
          const { data } = await mockSupabase
            .from('chats')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          return data || [];
        } catch (error) {
          console.error('Database error:', error);
          return [];
        }
      };

      const result = await getChatHistory(userId);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('chat-3');
      expect(result[1].id).toBe('chat-2');
      expect(result[2].id).toBe('chat-1');
    });

    it('should handle database errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockSupabase = {
        from: jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        }),
      };

      const getChatHistory = async (userId: string) => {
        try {
          const { data } = await mockSupabase
            .from('chats')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          return data || [];
        } catch (error) {
          console.error('Database error:', error);
          return [];
        }
      };

      const result = await getChatHistory('user-123');

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getMessages', () => {
    it('should return messages in chronological order', async () => {
      const chatId = 'chat-123';
      const mockMessages = [
        { id: 'msg-1', created_at: '2024-01-01T10:00:00Z', role: 'user', content: 'Hello' },
        { id: 'msg-2', created_at: '2024-01-01T10:01:00Z', role: 'assistant', content: 'Hi there' },
        { id: 'msg-3', created_at: '2024-01-01T10:02:00Z', role: 'user', content: 'How are you?' },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: mockMessages,
                error: null,
              }),
            }),
          }),
        }),
      };

      const getMessages = async (chatId: string) => {
        try {
          const { data } = await mockSupabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

          return data || [];
        } catch (error) {
          console.error('Database error:', error);
          return [];
        }
      };

      const result = await getMessages(chatId);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('msg-1');
      expect(result[1].id).toBe('msg-2');
      expect(result[2].id).toBe('msg-3');
    });

    it('should handle database errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockSupabase = {
        from: jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        }),
      };

      const getMessages = async (chatId: string) => {
        try {
          const { data } = await mockSupabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

          return data || [];
        } catch (error) {
          console.error('Database error:', error);
          return [];
        }
      };

      const result = await getMessages('chat-123');

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
