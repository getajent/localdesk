/**
 * Unit Tests for /api/chat route
 * Tests specific examples, edge cases, and error conditions
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

// Mock OpenAI before importing anything else
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});

// Mock AI SDK
let mockOnCompletion: ((completion: string) => Promise<void>) | undefined;
jest.mock('ai', () => ({
  OpenAIStream: jest.fn((response, options) => {
    // Store the onCompletion callback
    mockOnCompletion = options?.onCompletion;
    // Simulate stream completion after a short delay
    setTimeout(async () => {
      if (mockOnCompletion) {
        await mockOnCompletion('Mocked assistant response');
      }
    }, 10);
    return 'mock-stream';
  }),
  StreamingTextResponse: jest.fn((stream) => ({
    body: stream,
    isStreaming: true,
    headers: { 'Content-Type': 'text/plain' },
  })),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  saveMessage: jest.fn(),
}));

// Polyfill Response for Node environment
global.Response = class Response {
  public status: number;
  public body: any;
  public headers: Headers;
  
  constructor(body: any, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.headers = new Headers(init?.headers);
  }
  
  async json() {
    return JSON.parse(this.body);
  }
} as any;

global.Headers = class Headers {
  private headers: Record<string, string> = {};
  constructor(init?: Record<string, string>) {
    if (init) {
      this.headers = { ...init };
    }
  }
  get(name: string) {
    return this.headers[name];
  }
  set(name: string, value: string) {
    this.headers[name] = value;
  }
} as any;

import { POST } from './route';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { saveMessage } from '@/lib/supabase';

describe('/api/chat route', () => {
  let mockCreate: jest.Mock;
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'test-api-key';

    mockCreate = jest.fn().mockResolvedValue({
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: 'Test response' } }] };
      }
    });

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    } as any));
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalEnv;
    jest.clearAllMocks();
  });

  describe('Request Validation', () => {
    it('should reject request with missing messages array', async () => {
      const request = {
        json: async () => ({}),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('messages array required');
    });

    it('should reject request with non-array messages', async () => {
      const request = {
        json: async () => ({ messages: 'not an array' }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('messages array required');
    });

    it('should reject request with invalid message format (missing role)', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('Invalid message format');
    });

    it('should reject request with invalid message format (missing content)', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'user' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('Invalid message format');
    });

    it('should reject request with invalid role', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'invalid', content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('Invalid message format');
    });
  });

  describe('System Prompt Injection', () => {
    it('should include system prompt in OpenAI request', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      await POST(request);

      expect(mockCreate).toHaveBeenCalled();
      const callArgs = mockCreate.mock.calls[0][0];
      const messages = callArgs.messages;

      expect(messages[0].role).toBe('system');
      expect(messages[0].content).toContain('expert Danish consultant');
      expect(messages[0].content).toContain('SKAT');
      expect(messages[0].content).toContain('Visas');
      expect(messages[0].content).toContain('Housing');
    });

    it('should include user messages after system prompt', async () => {
      const userMessages = [
        { role: 'user', content: 'How do I register with SKAT?' },
        { role: 'assistant', content: 'You need to...' },
        { role: 'user', content: 'What documents do I need?' }
      ];

      const request = {
        json: async () => ({ messages: userMessages }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      await POST(request);

      const callArgs = mockCreate.mock.calls[0][0];
      const messages = callArgs.messages;

      expect(messages.length).toBe(userMessages.length + 1);
      expect(messages[0].role).toBe('system');
      expect(messages[1]).toEqual(userMessages[0]);
      expect(messages[2]).toEqual(userMessages[1]);
      expect(messages[3]).toEqual(userMessages[2]);
    });
  });

  describe('Streaming Response', () => {
    it('should return streaming response for valid request', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(OpenAIStream).toHaveBeenCalled();
      expect(StreamingTextResponse).toHaveBeenCalledWith('mock-stream');
      expect(response).toHaveProperty('isStreaming', true);
    });

    it('should configure OpenAI with streaming enabled', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      await POST(request);

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.stream).toBe(true);
      expect(callArgs.model).toBe('gpt-4o-mini');
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when OPENAI_API_KEY is missing', async () => {
      delete process.env.OPENAI_API_KEY;

      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toContain('OPENAI_API_KEY');
    });

    it('should return 500 when OpenAI API fails', async () => {
      mockCreate.mockRejectedValue(new Error('OpenAI API error'));

      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBeDefined();
    });

    it('should return 400 for invalid JSON', async () => {
      const request = {
        json: async () => {
          throw new SyntaxError('Invalid JSON');
        },
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('Invalid JSON');
    });
  });

  describe('Message Persistence', () => {
    it('should persist messages for authenticated users', async () => {
      const userId = 'test-user-123';
      const userMessage = 'How do I register with SKAT?';

      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: userMessage }],
          userId
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      await POST(request);

      // Wait for onCompletion callback
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(saveMessage).toHaveBeenCalledWith(
        userId,
        userMessage,
        expect.any(String)
      );
    });

    it('should not persist messages for guest users (no userId)', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }]
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      await POST(request);

      // Wait to ensure onCompletion would have been called
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(saveMessage).not.toHaveBeenCalled();
    });

    it('should not persist messages for guest users (null userId)', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }],
          userId: null
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      await POST(request);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(saveMessage).not.toHaveBeenCalled();
    });

    it('should not persist messages for guest users (empty userId)', async () => {
      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }],
          userId: ''
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      await POST(request);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(saveMessage).not.toHaveBeenCalled();
    });
  });
});
