import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { saveMessage } from '@/lib/supabase';

/**
 * Builds the system prompt with Expert Danish Consultant persona and knowledge base
 */
function buildSystemPrompt(): string {
  return `You are an expert Danish consultant specializing in helping expats navigate Danish bureaucracy.

Your expertise covers:
- SKAT (Danish Tax Authority): Registration, tax cards, annual returns
- Visas and Permits: Work permits, residence permits, documentation
- Housing: Rental market, contracts, tenant rights, finding apartments

Guidelines:
1. Provide accurate, actionable information about Danish procedures
2. Be warm and supportive - moving to a new country is challenging
3. If you don't know something, admit it and suggest official resources
4. Stay focused on Denmark-related topics
5. If asked about unrelated topics, politely redirect to Danish bureaucracy matters

Tone: Professional yet friendly, like a knowledgeable local helping a newcomer.`;
}

/**
 * POST handler for chat API route
 * Handles streaming chat responses with OpenAI integration
 */
export async function POST(req: Request) {
  try {
    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body = await req.json();

    // Handle both old format (messages array) and new format (from @ai-sdk/react)
    let messages = body.messages || [];
    const userId = body.userId;

    // If no messages array, this might be from the new SDK format
    if (messages.length === 0 && body.message) {
      // New SDK sends a single message object
      messages = [{ role: 'user', content: body.message.text || body.message.content }];
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format: messages required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userMessage = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || '';

    // Build system prompt
    const systemPrompt = buildSystemPrompt();

    // Call OpenAI with streaming using AI SDK
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content || m.text || ''
      })),
      onFinish: async ({ text }) => {
        // Persist messages for authenticated users only
        if (userId && typeof userId === 'string' && userId.trim() !== '') {
          await saveMessage(userId, userMessage, text);
        }
      }
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('API error:', error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
