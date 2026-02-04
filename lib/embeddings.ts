import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

/**
 * Generate embeddings for text using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient();
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536, // Match our vector size in Supabase
  });

  return response.data[0].embedding;
}

/**
 * Search for relevant documents using vector similarity
 */
export async function searchDocuments(
  query: string,
  matchThreshold: number = 0.7,
  matchCount: number = 5
): Promise<Array<{
  id: string;
  content: string;
  metadata: any;
  similarity: number;
}>> {
  const { createServerClient } = await import('@/lib/supabase-server');
  const supabase = createServerClient();

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Search for similar documents
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error('Error searching documents:', error);
    throw error;
  }

  return data || [];
}
