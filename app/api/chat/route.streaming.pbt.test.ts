/**
 * Property-Based Test for Streaming Response Delivery
 * Feature: localdesk-landing-page, Property 11: Streaming Response Delivery
 * Validates: Requirements 10.4
 * 
 * Property: For any valid chat request, the API should return a streaming 
 * response (Server-Sent Events) rather than a single JSON response.
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
import { OpenAIStream, StreamingTextResponse } from 'ai';

describe('Property 11: Streaming Response Delivery', () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-api-key';

    // Mock OpenAI stream response
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
    jest.clearAllMocks();
  });

  it('should return streaming response for any valid message array', async () => {
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
          mockCreate.mockClear();
          (StreamingTextResponse as jest.Mock).mockClear();

          const request = {
            json: async () => ({ messages }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          const response = await POST(request);

          // Verify OpenAIStream was called
          expect(OpenAIStream).toHaveBeenCalled();

          // Verify StreamingTextResponse was called with the stream
          expect(StreamingTextResponse).toHaveBeenCalledWith('mock-stream');

          // Verify response is a streaming response (not a JSON error response)
          expect(response).toHaveProperty('isStreaming', true);
          expect(response).toHaveProperty('body', 'mock-stream');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should configure OpenAI for streaming', async () => {
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
          mockCreate.mockClear();

          const request = {
            json: async () => ({ messages }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          await POST(request);

          // Verify OpenAI was called with stream: true
          expect(mockCreate).toHaveBeenCalled();
          const callArgs = mockCreate.mock.calls[0][0];
          expect(callArgs.stream).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
