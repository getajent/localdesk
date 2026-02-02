/**
 * Property-Based Test for Error Response Handling
 * Feature: localdesk-landing-page, Property 12: Error Response Handling
 * Validates: Requirements 10.5
 * 
 * Property: For any error condition in the API route (OpenAI failure, 
 * database error), the system should return an appropriate error message 
 * rather than crashing.
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

describe('Property 12: Error Response Handling', () => {
  let mockCreate: jest.Mock;
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'test-api-key';

    mockCreate = jest.fn();

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

  it('should return error response when OpenAI API fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            role: fc.constantFrom('user', 'assistant'),
            content: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.string({ minLength: 1, maxLength: 100 }), // error message
        async (messages, errorMessage) => {
          // Mock OpenAI to throw an error
          mockCreate.mockRejectedValue(new Error(errorMessage));

          const request = {
            json: async () => ({ messages }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          const response = await POST(request);

          // Verify error response
          expect(response.status).toBe(500);
          const responseBody = await response.json();
          expect(responseBody.error).toBeDefined();
          expect(typeof responseBody.error).toBe('string');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return error response when OPENAI_API_KEY is missing', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            role: fc.constantFrom('user', 'assistant'),
            content: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (messages) => {
          // Remove API key
          delete process.env.OPENAI_API_KEY;

          const request = {
            json: async () => ({ messages }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          const response = await POST(request);

          // Verify error response
          expect(response.status).toBe(500);
          const responseBody = await response.json();
          expect(responseBody.error).toContain('OPENAI_API_KEY');

          // Restore API key for next iteration
          process.env.OPENAI_API_KEY = 'test-api-key';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle various OpenAI error types gracefully', async () => {
    const errorTypes = [
      new Error('Network error'),
      new Error('Rate limit exceeded'),
      new Error('Invalid API key'),
      new Error('Model not found'),
      new TypeError('Invalid argument'),
    ];

    for (const error of errorTypes) {
      mockCreate.mockRejectedValue(error);

      const request = {
        json: async () => ({ 
          messages: [{ role: 'user', content: 'test' }] 
        }),
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      } as Request;

      const response = await POST(request);

      // Should return error response, not crash
      expect(response.status).toBe(500);
      const responseBody = await response.json();
      expect(responseBody.error).toBeDefined();
    }
  });
});
