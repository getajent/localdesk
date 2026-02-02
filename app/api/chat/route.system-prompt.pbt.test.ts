/**
 * Property-Based Test for System Prompt Injection
 * Feature: localdesk-landing-page, Property 4: System Prompt Injection
 * Validates: Requirements 3.1, 3.4, 10.3
 * 
 * Property: For any API request to /api/chat, the system prompt defining 
 * the Expert Danish Consultant persona should be included in the messages 
 * sent to OpenAI.
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
  constructor(public body: any, public init?: ResponseInit) {}
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

describe('Property 4: System Prompt Injection', () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    // Set up environment variable
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

  it('should inject system prompt for any valid message array', async () => {
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
          // Reset mock before each test
          mockCreate.mockClear();
          
          // Create a mock Request object
          const request = {
            json: async () => ({ messages }),
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          } as Request;

          await POST(request);

          // Verify OpenAI was called
          expect(mockCreate).toHaveBeenCalled();

          // Get the messages passed to OpenAI
          const callArgs = mockCreate.mock.calls[0][0];
          const sentMessages = callArgs.messages;

          // Verify system prompt is the first message
          expect(sentMessages[0].role).toBe('system');
          expect(sentMessages[0].content).toContain('expert Danish consultant');
          expect(sentMessages[0].content).toContain('SKAT');
          expect(sentMessages[0].content).toContain('Visas');
          expect(sentMessages[0].content).toContain('Housing');

          // Verify original messages follow the system prompt
          expect(sentMessages.length).toBe(messages.length + 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
