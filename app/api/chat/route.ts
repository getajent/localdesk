import { openai } from '@ai-sdk/openai';
import { streamText, stepCountIs } from 'ai';
import { z } from 'zod';
import { saveMessage, UserSettings, getUserSettings, updateUserSettings } from '@/lib/supabase';
import { searchDocuments } from '@/lib/embeddings';
import { createClient } from '@supabase/supabase-js';

const ALL_ROADMAP_STEPS = ['profile', 'visa', 'cpr', 'housing', 'work', 'health'];

/**
 * Builds user context string from settings
 */
function buildUserContext(settings?: UserSettings): string {
  if (!settings || Object.keys(settings).length === 0) {
    return '';
  }

  const parts: string[] = [];

  if (settings.displayName) {
    parts.push(`Preferred Name: ${settings.displayName}`);
  }

  if (settings.residencyStatus) {
    const residencyLabels: Record<string, string> = {
      'eu_citizen': 'EU/EEA citizen',
      'non_eu_citizen': 'Non-EU citizen (requires visa/work permit)',
      'unknown': 'Residency status not yet determined'
    };
    parts.push(`Residency: ${residencyLabels[settings.residencyStatus] || settings.residencyStatus}`);
  }

  if (settings.occupationStatus) {
    const occupationLabels: Record<string, string> = {
      'student': 'Student',
      'employed': 'Employed',
      'self_employed': 'Self-employed',
      'job_seeker': 'Job seeker',
      'other': 'Other occupation'
    };
    parts.push(`Status: ${occupationLabels[settings.occupationStatus] || settings.occupationStatus}`);
  }

  if (settings.hasArrived !== undefined) {
    parts.push(`Location: ${settings.hasArrived ? 'Already in Denmark' : 'Planning to move to Denmark'}`);
  }

  // Include completed roadmap steps
  const completedSteps = settings.completedSteps || [];
  const stepLabels: Record<string, string> = {
    'profile': 'Profile Setup',
    'visa': 'Visa/EU Registration',
    'cpr': 'CPR Number',
    'housing': 'Housing',
    'work': 'Employment/University',
    'health': 'Healthcare Registration'
  };

  if (completedSteps.length > 0) {
    const completedLabels = completedSteps.map(s => stepLabels[s] || s).join(', ');
    parts.push(`Completed roadmap steps: ${completedLabels}`);
  }

  if (parts.length === 0) return '';

  return `

USER CONTEXT:
${parts.map(p => `- ${p}`).join('\n')}

IMPORTANT: Tailor your advice based on this context:
- For non-EU citizens: Always mention visa/permit requirements first
- For students: Include SU (student grants) and student-specific resources
- For those planning to move: Focus on pre-arrival steps and preparation
- For those already in Denmark: Focus on immediate registration and practical steps
- Provide a clear, numbered roadmap of steps when asked what to do first

ROADMAP AWARENESS:
The user has a personalized roadmap in the app with these steps: Profile Setup, Visa/EU Registration, CPR Number, Housing, Employment/University, Healthcare Registration.
- When the user mentions completing a milestone (e.g., "I got my CPR!", "I found an apartment", "My visa was approved"), acknowledge their achievement enthusiastically and remind them: "Don't forget to mark this step as complete in your Roadmap tab!"
- When discussing next steps, reference where they are in their journey based on their completed steps
- If they seem stuck on a step, offer specific, actionable guidance for that step
- If the user asks to regenerate or update their roadmap based on new settings (e.g., 'I changed my status to worker', 'make a new roadmap'), analyze their profile and use the \`modifyRoadmap\` tool with \`action: 'set_visible'\` to set the exact list of relevant steps.
- When the user asks to mark a step as complete (e.g., "I got my CPR", "Mark visa as done"), use the \`modifyRoadmap\` tool with \`action: 'mark_complete'\`.`;
}


/**
 * Builds the system prompt with Expert Danish Consultant persona and knowledge base
 */
function buildSystemPrompt(relevantDocs?: string, userSettings?: UserSettings): string {
  const userContext = buildUserContext(userSettings);

  const basePrompt = `You are an expert Danish consultant specializing in helping expats navigate Danish bureaucracy.

Your expertise covers:
- SKAT (Danish Tax Authority): Registration, tax cards, annual returns
- Visas and Permits: Work permits, residence permits, documentation
- Housing: Rental market, contracts, tenant rights, finding apartments
- Banking, healthcare, education, and all aspects of Danish life

Guidelines:
1. Provide accurate, actionable information about Danish procedures
2. Be warm and supportive - moving to a new country is challenging
3. If you don't know something, admit it and suggest official resources
4. Stay focused on Denmark-related topics
5. If asked about unrelated topics, politely redirect to Danish bureaucracy matters
6. When giving roadmaps, provide clear numbered steps in order of priority

Tone: Professional yet friendly, like a knowledgeable local helping a newcomer.${userContext}

CRITICAL: When asked to update the roadmap based on settings (e.g., "update based on my settings", "on settings tab", "based on my profile"):
1. IMMEDIATELY check the 'USER CONTEXT' block below. This represents their "Settings tab" information.
2. If you see specific choices (e.g., "Residency: EU/EEA citizen" or "Status: Student"), proceed IMMEDIATELY with the modifyRoadmap tool using action 'set_visible' to configure the roadmap correctly.
3. If the user context is entirely empty or only contains 'unknown' values, explain that their profile in the "Settings" tab is currently empty and ask them for the missing details.
4. ALWAYS confirm what specific information you "caught" from their settings in your response (e.g., "I see you've set your residency to EU Citizen in your settings...").
5. Do NOT ask for permission or confirmation before taking action; their request is the permission. Use the set_visible action to ensure their roadmap is clean and relevant.`;

  if (relevantDocs) {
    return `${basePrompt}

RELEVANT DOCUMENTATION:
${relevantDocs}

Use the above documentation to provide accurate, specific answers. Always prioritize information from the documentation when available.`;
  }

  return basePrompt;
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

    // Initialize admin client for DB operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Parse and validate request body
    const body = await req.json();

    // Handle both old format (messages array) and new format (from @ai-sdk/react)
    let messages = body.messages || [];
    const userId = body.userId;
    const userSettings: UserSettings | undefined = body.userSettings;

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

    // Search for relevant documentation
    let relevantDocs = '';
    try {
      const docs = await searchDocuments(userMessage, 0.7, 3);
      if (docs.length > 0) {
        relevantDocs = docs
          .map((doc, i) => `[Document ${i + 1}: ${doc.metadata.title}]\n${doc.content}`)
          .join('\n\n---\n\n');
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      // Continue without docs if search fails
    }

    // Build system prompt with relevant documentation and user context
    const systemPrompt = buildSystemPrompt(relevantDocs, userSettings);

    // Call OpenAI with streaming using AI SDK
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      stopWhen: stepCountIs(5),
      messages: messages.map(m => ({
        role: (m.role === 'user' || m.role === 'assistant' || m.role === 'system') ? m.role : 'user',
        content: m.content || m.text || ''
      })),
      tools: {
        modifyRoadmap: {
          description: 'Manage the user\'s roadmap. Can hide/show steps (visibility), set the entire list of visible steps, or mark specific steps as complete/incomplete.',
          inputSchema: z.object({
            action: z.enum(['hide', 'show', 'set_visible', 'mark_complete', 'mark_incomplete']).describe('The action to perform.'),
            stepId: z.enum(['profile', 'visa', 'cpr', 'housing', 'work', 'health']).optional().describe('The ID of the step to modify (required for hide/show/mark_complete/mark_incomplete)'),
            visibleSteps: z.array(z.enum(['profile', 'visa', 'cpr', 'housing', 'work', 'health'])).optional().describe('List of step IDs to show (required for set_visible)'),
          }),
          execute: async ({ action, stepId, visibleSteps }) => {
            if (!userId) return 'User not authenticated. Cannot modify roadmap.';

            try {
              const currentSettings = await getUserSettings(userId, supabaseAdmin);

              // Handle Visibility Changes
              if (action === 'set_visible' || action === 'hide' || action === 'show') {
                const currentHidden = currentSettings.roadmapModifications?.hiddenStepIds || [];
                let newHidden = [...currentHidden];

                if (action === 'set_visible') {
                  if (!visibleSteps) return 'visibleSteps array is required for set_visible action';
                  newHidden = ALL_ROADMAP_STEPS.filter(step => !visibleSteps.includes(step));
                } else if (stepId) {
                  if (action === 'hide') {
                    if (!newHidden.includes(stepId)) newHidden.push(stepId);
                  } else if (action === 'show') {
                    newHidden = newHidden.filter(id => id !== stepId);
                  }
                } else {
                  return 'stepId is required for hide/show actions';
                }

                await updateUserSettings(userId, {
                  roadmapModifications: {
                    ...currentSettings.roadmapModifications,
                    hiddenStepIds: newHidden
                  }
                }, supabaseAdmin);

                if (action === 'set_visible') {
                  return `Successfully updated roadmap visibility in the database. Now inform the user that their roadmap has been updated based on their profile.`;
                }
                return `Successfully updated visibility for step: ${stepId}. Now confirm this to the user.`;
              }

              // Handle Completion Changes
              if (action === 'mark_complete' || action === 'mark_incomplete') {
                if (!stepId) return 'stepId is required for completion actions';

                const currentCompleted = currentSettings.completedSteps || [];
                let newCompleted = [...currentCompleted];

                if (action === 'mark_complete') {
                  if (!newCompleted.includes(stepId)) newCompleted.push(stepId);
                } else {
                  newCompleted = newCompleted.filter(id => id !== stepId);
                }

                await updateUserSettings(userId, {
                  completedSteps: newCompleted
                }, supabaseAdmin);

                return `Successfully ${action === 'mark_complete' ? 'marked as complete' : 'marked as incomplete'} the step "${stepId}" in the database. Now confirm this to the user.`;
              }

              return 'Invalid action specified.';
            } catch (error) {
              console.error('Error modifying roadmap:', error);
              return 'Failed to modify roadmap due to a database error.';
            }
          },
        },
      },

      onFinish: async ({ text }) => {
        // Persist messages for authenticated users only
        if (userId && typeof userId === 'string' && userId.trim() !== '') {
          // Only save if there is text content (tools might not produce text immediately in some flows, but usually final response does)
          if (text) {
            await saveMessage(userId, userMessage, text, supabaseAdmin);
          }
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
