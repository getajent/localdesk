import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testRPC() {
  console.log('Testing match_documents RPC function...\n');
  
  // Get a sample embedding from an existing document
  const { data: sampleDoc, error: sampleError } = await supabase
    .from('documents')
    .select('embedding')
    .limit(1)
    .single();
  
  if (sampleError || !sampleDoc) {
    console.error('❌ Error getting sample document:', sampleError);
    return;
  }
  
  console.log('✅ Got sample embedding');
  
  // Test the RPC function
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: sampleDoc.embedding,
    match_threshold: 0.5,
    match_count: 3,
  });
  
  if (error) {
    console.error('❌ RPC Error:', error);
    return;
  }
  
  console.log(`✅ RPC function works! Found ${data?.length || 0} matches\n`);
  
  data?.forEach((doc: any, i: number) => {
    console.log(`${i + 1}. ${doc.metadata.title}`);
    console.log(`   Similarity: ${(doc.similarity * 100).toFixed(1)}%`);
  });
}

testRPC();
