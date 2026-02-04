/**
 * Script to index documentation into Supabase vector store
 * 
 * Usage: npx tsx scripts/index-documentation.ts
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    category: string;
    title: string;
    section?: string;
  };
}

/**
 * Split text into chunks with overlap for better context
 */
function chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
    
    if (start >= text.length - overlap) break;
  }

  return chunks;
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : 'Untitled';
}

/**
 * Process a markdown file and create document chunks
 */
function processMarkdownFile(filePath: string, docsRoot: string): DocumentChunk[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(docsRoot, filePath);
  const pathParts = relativePath.split(path.sep);
  
  // Extract category from path (e.g., "arrival-process", "housing")
  const category = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'general';
  const title = extractTitle(content);
  
  // Split content into chunks
  const textChunks = chunkText(content);
  
  return textChunks.map((chunk, index) => ({
    content: chunk,
    metadata: {
      source: relativePath,
      category,
      title,
      section: textChunks.length > 1 ? `Part ${index + 1}/${textChunks.length}` : undefined,
    },
  }));
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536,
  });
  
  return response.data[0].embedding;
}

/**
 * Main indexing function
 */
async function indexDocumentation() {
  console.log('🚀 Starting documentation indexing...\n');
  
  const docsPath = path.join(process.cwd(), 'docs', 'denmark-living');
  
  if (!fs.existsSync(docsPath)) {
    console.error('❌ Documentation directory not found:', docsPath);
    process.exit(1);
  }
  
  // Find all markdown files
  const markdownFiles = findMarkdownFiles(docsPath);
  console.log(`📄 Found ${markdownFiles.length} markdown files\n`);
  
  // Clear existing documents
  console.log('🗑️  Clearing existing documents...');
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  if (deleteError) {
    console.error('❌ Error clearing documents:', deleteError);
  } else {
    console.log('✅ Existing documents cleared\n');
  }
  
  // Process each file
  let totalChunks = 0;
  let processedFiles = 0;
  
  for (const filePath of markdownFiles) {
    const relativePath = path.relative(docsPath, filePath);
    console.log(`📝 Processing: ${relativePath}`);
    
    try {
      const chunks = processMarkdownFile(filePath, docsPath);
      
      // Generate embeddings and insert chunks
      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.content);
        
        const { error } = await supabase
          .from('documents')
          .insert({
            content: chunk.content,
            metadata: chunk.metadata,
            embedding,
          });
        
        if (error) {
          console.error(`   ❌ Error inserting chunk:`, error.message);
        } else {
          totalChunks++;
        }
      }
      
      processedFiles++;
      console.log(`   ✅ Created ${chunks.length} chunks`);
      
    } catch (error) {
      console.error(`   ❌ Error processing file:`, error);
    }
  }
  
  console.log(`\n✨ Indexing complete!`);
  console.log(`   Files processed: ${processedFiles}/${markdownFiles.length}`);
  console.log(`   Total chunks created: ${totalChunks}`);
}

// Run the indexing
indexDocumentation().catch(console.error);
