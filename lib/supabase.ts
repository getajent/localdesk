import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Main Supabase browser client for use in client components.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

/**
 * Common settings interface
 */
export interface UserSettings {
  displayName?: string;
  residencyStatus?: 'eu_citizen' | 'non_eu_citizen' | 'unknown';
  occupationStatus?: 'student' | 'employed' | 'self_employed' | 'job_seeker' | 'other';
  hasArrived?: boolean;
  roadmapModifications?: {
    hiddenStepIds?: string[];
    customSteps?: Array<{ id: string; title: string; description: string; status: 'completed' | 'current' | 'upcoming'; iconName?: string }>;
  };
  completedSteps?: string[];
}

/**
 * Standard error handler for DB operations
 */
async function handleDbError(error: any, context: string) {
  if (error) {
    console.error(`[Supabase] Error in ${context}:`, error);
    return error;
  }
  return null;
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    handleDbError(error, 'getCurrentUser');
    return null;
  }
}

/**
 * Gets the current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Creates or retrieves a profile for a user
 */
export async function ensureProfile(userId: string, userData?: { full_name?: string; metadata?: any }, client?: SupabaseClient) {
  const sb = client || supabase;
  try {
    // Check if profile exists
    const { data: existingProfile, error: selectError } = await sb
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      return existingProfile;
    }

    // Profile doesn't exist (PGRST116 = no rows), create it
    if (selectError?.code === 'PGRST116' || !existingProfile) {
      const { data: newProfile, error: insertError } = await sb
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: userData?.full_name || null,
          metadata: userData?.metadata || {},
        })
        .select()
        .single();

      if (insertError) {
        // Handle race condition - profile might have been created by another request
        if (insertError.code === '23505') {
          const { data: retryProfile } = await sb
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
          return retryProfile;
        }
        throw insertError;
      }
      return newProfile;
    }

    if (selectError) throw selectError;
    return null;
  } catch (error) {
    handleDbError(error, 'ensureProfile');
    return null;
  }
}

/**
 * Retrieves user settings from profile metadata
 */
export async function getUserSettings(userId: string, client?: SupabaseClient): Promise<UserSettings> {
  const sb = client || supabase;
  try {
    const { data, error } = await sb
      .from('profiles')
      .select('metadata')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return {};
      throw error;
    }

    return (data?.metadata as UserSettings) || {};
  } catch (error) {
    handleDbError(error, 'getUserSettings');
    return {};
  }
}

/**
 * Updates user settings in profile metadata
 */
export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
  client?: SupabaseClient
): Promise<UserSettings | null> {

  const sb = client || supabase;

  try {
    // Get existing settings
    const { data: profile, error: selectError } = await sb
      .from('profiles')
      .select('metadata')
      .eq('user_id', userId)
      .single();

    let existing: UserSettings = {};

    if (selectError) {
      if (selectError.code === 'PGRST116') {
        // Profile doesn't exist, will be handled by the update if possible,
        // but it's safer to ensure profile exists first.
        await ensureProfile(userId, undefined, client);
      } else {
        throw selectError;
      }
    } else {
      existing = (profile?.metadata as UserSettings) || {};
    }

    // Merge and update
    const merged = { ...existing, ...settings };
    const { data, error: updateError } = await sb
      .from('profiles')
      .update({ metadata: merged })
      .eq('user_id', userId)
      .select('metadata')
      .single();

    if (updateError) throw updateError;

    return (data?.metadata as UserSettings) || null;
  } catch (error) {
    handleDbError(error, 'updateUserSettings');
    return null;
  }
}

/**
 * Saves a message pair (user + assistant) to the database
 */
export async function saveMessage(
  userId: string,
  userMessage: string,
  assistantMessage: string,
  client?: SupabaseClient
): Promise<void> {
  const sb = client || supabase;
  try {
    // Get or create chat session
    const { data: chat } = await sb
      .from('chats')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let chatId = chat?.id;

    if (!chatId) {
      const { data: newChat } = await sb
        .from('chats')
        .insert({ user_id: userId })
        .select('id')
        .single();
      chatId = newChat!.id;
    }

    // Insert both messages
    await sb.from('messages').insert([
      { chat_id: chatId, role: 'user', content: userMessage },
      { chat_id: chatId, role: 'assistant', content: assistantMessage }
    ]);
  } catch (error) {
    handleDbError(error, 'saveMessage');
  }
}

/**
 * Retrieves chat history for a user
 */
export async function getChatHistory(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleDbError(error, 'getChatHistory');
    return [];
  }
}

/**
 * Retrieves all messages for a specific chat
 */
export async function getMessages(chatId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleDbError(error, 'getMessages');
    return [];
  }
}
