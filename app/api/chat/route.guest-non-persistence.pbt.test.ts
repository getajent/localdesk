/**
 * Property-Based Test for Guest Message Non-Persistence
 * Feature: localdesk-landing-page, Property 9: Guest Message Non-Persistence
 * Validates: Requirements 9.4
 * 
 * Property: For any message sent by a guest user (no userId), the system 
 * should not create any records in the chats or messages tables.
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
import { saveMessage } from '@/lib/supabase';

describe('Property 9: Guest Message Non-Persistence', () => {
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

    (saveMessage as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not persist messages when userId is not provided', async () => {
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
          (saveMessage as jest.Mock).mockClear();

          // Request without userId
          const request = {
            json: async () => ({ messages }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          await POST(request);

          // Verify saveMessage was NOT called
          expect(saveMessage).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not persist messages when userId is null', async () => {
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
          (saveMessage as jest.Mock).mockClear();

          // Request with null userId
          const request = {
            json: async () => ({ messages, userId: null }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          await POST(request);

          // Verify saveMessage was NOT called
          expect(saveMessage).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not persist messages when userId is undefined', async () => {
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
          (saveMessage as jest.Mock).mockClear();

          // Request with undefined userId
          const request = {
            json: async () => ({ messages, userId: undefined }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          await POST(request);

          // Verify saveMessage was NOT called
          expect(saveMessage).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not persist messages when userId is empty string', async () => {
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
          (saveMessage as jest.Mock).mockClear();

          // Request with empty string userId
          const request = {
            json: async () => ({ messages, userId: '' }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          await POST(request);

          // Verify saveMessage was NOT called
          expect(saveMessage).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not persist messages when userId is whitespace only', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            role: fc.constantFrom('user', 'assistant'),
            content: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 5 }),
        async (messages, whitespaceUserId) => {
          (saveMessage as jest.Mock).mockClear();

          // Request with whitespace-only userId
          const request = {
            json: async () => ({ messages, userId: whitespaceUserId }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          await POST(request);

          // Verify saveMessage was NOT called
          expect(saveMessage).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
});
