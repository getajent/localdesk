import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testFullSearch() {
  const query = "How do I get a CPR number?";
  console.log(`🔍 Testing full search for: "${query}"\n`);
  
  // Generate embedding
  console.log('Generating embedding...');
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    dimensions: 1536,
  });
  
  const queryEmbedding = response.data[0].embedding;
  console.log(`✅ Generated embedding (${queryEmbedding.length} dimensions)\n`);
  
  // Search
  console.log('Searching documents...');
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,  // Lower threshold
    match_count: 5,
  });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('❌ No documents found');
    return;
  }
  
  console.log(`✅ Found ${data.length} documents:\n`);
  
  data.forEach((doc: any, i: number) => {
    console.log(`--- Document ${i + 1} ---`);
    console.log(`Title: ${doc.metadata.title}`);
    console.log(`Source: ${doc.metadata.source}`);
    console.log(`Similarity: ${(doc.similarity * 100).toFixed(1)}%`);
    console.log(`Content: ${doc.content.substring(0, 150)}...`);
    console.log('');
  });
}

testFullSearch();
