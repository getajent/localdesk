import { createClient } from '@supabase/supabase-js';

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variable is missing
 */
export function validateEnvironmentVariables(): void {
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => {
    const value = varName.startsWith('NEXT_PUBLIC_')
      ? process.env[varName]
      : process.env[varName];
    return !value || value.trim() === '';
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Please check your .env.local file and ensure all variables are set.`
    );
  }
}

// Don't validate on module load - let Next.js load env vars first
// validateEnvironmentVariables();

// Simple direct initialization - env vars should be available in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Gets the current authenticated user session
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Gets the current session
 * @returns The current session or null if not authenticated
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Creates or retrieves a profile for a user
 * @param userId - The user's ID
 * @param userData - Optional user data to populate the profile
 * @returns The profile record or null on error
 */
export async function ensureProfile(userId: string, userData?: { full_name?: string; metadata?: any }) {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      return existingProfile;
    }

    // Create profile if it doesn't exist
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        full_name: userData?.full_name || null,
        metadata: userData?.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return newProfile;
  } catch (error) {
    console.error('Error ensuring profile:', error);
    return null;
  }
}

/**
 * Database helper function to save a message pair (user + assistant)
 * @param userId - The authenticated user's ID
 * @param userMessage - The user's message content
 * @param assistantMessage - The assistant's response content
 */
export async function saveMessage(
  userId: string,
  userMessage: string,
  assistantMessage: string
): Promise<void> {
  try {
    // Get or create chat session
    const { data: chat } = await supabase
      .from('chats')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    let chatId = chat?.id;
    
    if (!chatId) {
      const { data: newChat } = await supabase
        .from('chats')
        .insert({ user_id: userId })
        .select('id')
        .single();
      chatId = newChat!.id;
    }
    
    // Insert both messages
    await supabase.from('messages').insert([
      { chat_id: chatId, role: 'user', content: userMessage },
      { chat_id: chatId, role: 'assistant', content: assistantMessage }
    ]);
  } catch (error) {
    console.error('Database error:', error);
    // Don't throw - message persistence failure shouldn't break chat
  }
}

/**
 * Retrieves chat history for a user
 * @param userId - The authenticated user's ID
 * @returns Array of chat sessions ordered by most recent first
 */
export async function getChatHistory(userId: string): Promise<any[]> {
  try {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

/**
 * Retrieves all messages for a specific chat
 * @param chatId - The chat session ID
 * @returns Array of messages ordered chronologically
 */
export async function getMessages(chatId: string): Promise<any[]> {
  try {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    return data || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}
