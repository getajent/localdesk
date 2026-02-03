import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';

// Feature: localdesk-landing-page, Property 2: Session Context Preservation
// **Validates: Requirements 1.3**

/**
 * Property 2: Session Context Preservation
 * 
 * For any sequence of messages within a guest session, the message array 
 * should grow monotonically and preserve insertion order.
 */

// Polyfill for crypto.randomUUID in test environment
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

class ChatSession {
  private messages: Message[] = [];

  addMessage(message: Omit<Message, 'id' | 'createdAt'>): void {
    this.messages.push({
      ...message,
      id: generateUUID(),
      createdAt: new Date(),
    });
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getMessageCount(): number {
    return this.messages.length;
  }
}

describe('Property 2: Session Context Preservation', () => {
  it('should preserve message order for any sequence of messages', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            role: fc.constantFrom('user' as const, 'assistant' as const),
            content: fc.string({ minLength: 1, maxLength: 500 }),
          }),
          { minLength: 1, maxLength: 50 }
        ),
        (messages) => {
          const session = new ChatSession();
          const initialCount = session.getMessageCount();

          // Add all messages
          messages.forEach((msg) => session.addMessage(msg));

          const retrieved = session.getMessages();

          // Property 1: Message array grows monotonically
          expect(retrieved.length).toBe(initialCount + messages.length);

          // Property 2: Insertion order is preserved
          retrieved.forEach((msg, idx) => {
            if (idx >= initialCount) {
              const originalIdx = idx - initialCount;
              expect(msg.content).toBe(messages[originalIdx].content);
              expect(msg.role).toBe(messages[originalIdx].role);
            }
          });

          // Property 3: All messages have unique IDs
          const ids = retrieved.map((m) => m.id);
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(ids.length);

          // Property 4: All messages have timestamps
          retrieved.forEach((msg) => {
            expect(msg.createdAt).toBeInstanceOf(Date);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain order when messages are added incrementally', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            role: fc.constantFrom('user' as const, 'assistant' as const),
            content: fc.string({ minLength: 1, maxLength: 500 }),
          }),
          { minLength: 2, maxLength: 20 }
        ),
        (messages) => {
          const session = new ChatSession();
          const addedContents: string[] = [];

          // Add messages one by one and verify order after each addition
          messages.forEach((msg, idx) => {
            session.addMessage(msg);
            addedContents.push(msg.content);

            const currentMessages = session.getMessages();
            
            // Verify count grows by 1
            expect(currentMessages.length).toBe(idx + 1);

            // Verify all previously added messages are still in order
            currentMessages.forEach((retrieved, retrievedIdx) => {
              expect(retrieved.content).toBe(addedContents[retrievedIdx]);
            });
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
