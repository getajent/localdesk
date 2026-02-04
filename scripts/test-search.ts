/**
 * Test script to verify document search is working
 * 
 * Usage: npx tsx scripts/test-search.ts "your search query"
 */

import { searchDocuments } from '../lib/embeddings';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

async function testSearch() {
  const query = process.argv[2] || "How do I get a CPR number?";
  
  console.log('🔍 Testing document search...\n');
  console.log(`Query: "${query}"\n`);
  
  try {
    const results = await searchDocuments(query, 0.7, 3);
    
    if (results.length === 0) {
      console.log('❌ No documents found.');
      console.log('\nPossible reasons:');
      console.log('1. Documents not indexed yet - run: npm run index-docs');
      console.log('2. Query too specific - try a broader question');
      console.log('3. Similarity threshold too high - lower it in the code');
      return;
    }
    
    console.log(`✅ Found ${results.length} relevant documents:\n`);
    
    results.forEach((doc, i) => {
      console.log(`--- Document ${i + 1} ---`);
      console.log(`Title: ${doc.metadata.title}`);
      console.log(`Source: ${doc.metadata.source}`);
      console.log(`Category: ${doc.metadata.category}`);
      console.log(`Similarity: ${(doc.similarity * 100).toFixed(1)}%`);
      console.log(`Content preview: ${doc.content.substring(0, 200)}...`);
      console.log('');
    });
    
    console.log('✨ Search test complete!');
    
  } catch (error) {
    console.error('❌ Error during search:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Check that migration 003 was applied in Supabase');
    console.log('2. Verify OPENAI_API_KEY is set in .env.local');
    console.log('3. Verify Supabase credentials are correct');
  }
}

testSearch();
