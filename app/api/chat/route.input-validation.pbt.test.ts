/**
 * Property-Based Test for API Input Validation
 * Feature: localdesk-landing-page, Property 10: API Input Validation
 * Validates: Requirements 10.2
 * 
 * Property: For any malformed request to /api/chat (missing messages array, 
 * invalid format), the API should reject the request with an appropriate 
 * error response.
 */

import fc from 'fast-check';

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
jest.mock('ai', () => ({
  OpenAIStream: jest.fn(() => 'mock-stream'),
  StreamingTextResponse: jest.fn((stream) => ({
    body: stream,
    headers: new Headers({ 'Content-Type': 'text/plain' }),
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

describe('Property 10: API Input Validation', () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject requests with missing messages array', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Generate any object without a messages field
          randomField: fc.anything(),
        }),
        async (body) => {
          const request = {
            json: async () => body,
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          const response = await POST(request);
          
          expect(response.status).toBe(400);
          const responseBody = await response.json();
          expect(responseBody.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject requests with non-array messages', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.record({ messages: fc.string() }),
          fc.record({ messages: fc.integer() }),
          fc.record({ messages: fc.boolean() }),
          fc.record({ messages: fc.object() })
        ),
        async (body) => {
          const request = {
            json: async () => body,
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          const response = await POST(request);
          
          expect(response.status).toBe(400);
          const responseBody = await response.json();
          expect(responseBody.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject requests with invalid message format', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.oneof(
            // Missing role
            fc.record({ content: fc.string() }),
            // Missing content
            fc.record({ role: fc.constantFrom('user', 'assistant') }),
            // Invalid role
            fc.record({ 
              role: fc.string().filter(s => s !== 'user' && s !== 'assistant'),
              content: fc.string()
            }),
            // Non-string content
            fc.record({ 
              role: fc.constantFrom('user', 'assistant'),
              content: fc.integer()
            })
          ),
          { minLength: 1 }
        ),
        async (messages) => {
          const request = {
            json: async () => ({ messages }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          const response = await POST(request);
          
          expect(response.status).toBe(400);
          const responseBody = await response.json();
          expect(responseBody.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject requests with invalid JSON', async () => {
    const request = {
      json: async () => {
        throw new SyntaxError('Invalid JSON');
      },
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    } as Request;

    const response = await POST(request);
    
    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toContain('Invalid JSON');
  });
});
