import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkDocuments() {
  console.log('Checking documents table...\n');
  
  const { data, error, count } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: false })
    .limit(5);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Total documents: ${count}`);
  console.log(`\nFirst 5 documents:`);
  data?.forEach((doc, i) => {
    console.log(`\n${i + 1}. ${doc.metadata.title}`);
    console.log(`   Source: ${doc.metadata.source}`);
    console.log(`   Content length: ${doc.content.length} chars`);
  });
}

checkDocuments();
