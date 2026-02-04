# RAG (Retrieval Augmented Generation) Setup Guide

This guide explains how to set up and use the documentation search system that powers the chat with your Denmark living documentation.

## Overview

The system uses:
- **Supabase + pgvector** for vector storage
- **OpenAI text-embedding-3-small** for generating embeddings
- **Cosine similarity** for finding relevant documentation
- **Automatic chunking** to handle large documents efficiently

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This installs `tsx` for running TypeScript scripts and `openai` for embeddings.

### 2. Configure Environment Variables

Add to your `.env.local`:

```bash
# Required for embeddings
OPENAI_API_KEY=sk-...

# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Required for indexing (get from Supabase Dashboard > Settings > API)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Apply Database Migration

Go to your Supabase Dashboard:
1. Navigate to **SQL Editor**
2. Open `supabase/migrations/003_create_documents_table.sql`
3. Copy and paste the SQL
4. Click **Run**

This creates:
- `documents` table with vector column
- `match_documents()` RPC function
- Necessary indexes for fast search

### 4. Index Your Documentation

Run the indexing script:

```bash
npm run index-docs
```

This will:
- Scan all markdown files in `docs/denmark-living/`
- Split large documents into chunks (1000 chars with 200 char overlap)
- Generate embeddings for each chunk
- Store everything in Supabase

**Expected output:**
```
🚀 Starting documentation indexing...

📄 Found 67 markdown files

🗑️  Clearing existing documents...
✅ Existing documents cleared

📝 Processing: arrival-process/cpr-number.md
   ✅ Created 3 chunks
📝 Processing: housing/rental-contracts.md
   ✅ Created 5 chunks
...

✨ Indexing complete!
   Files processed: 67/67
   Total chunks created: 234
```

### 5. Test the System

Start your dev server:

```bash
npm run dev
```

Go to http://localhost:3000 and ask a question like:
- "How do I get a CPR number?"
- "What are my rights as a tenant?"
- "How does the Danish tax system work?"

The chat will now search your documentation and provide answers based on your curated content!

## How It Works

### 1. User asks a question
```
"How do I register for a CPR number?"
```

### 2. System generates embedding
```typescript
const queryEmbedding = await generateEmbedding(userQuestion);
// Returns: [0.123, -0.456, 0.789, ...] (1536 dimensions)
```

### 3. Search for similar documents
```typescript
const docs = await searchDocuments(userQuestion, 0.7, 3);
// Returns top 3 documents with similarity > 0.7
```

### 4. Build enhanced prompt
```typescript
const systemPrompt = buildSystemPrompt(relevantDocs);
// Includes: base prompt + relevant documentation
```

### 5. AI generates response
The AI now has specific documentation context and provides accurate answers!

## Token Efficiency

### Before RAG:
- Every question uses ~500 tokens (base prompt only)
- AI relies on general knowledge (may be outdated/incorrect)

### After RAG:
- Questions use ~1500-2500 tokens (base prompt + 3 relevant docs)
- AI uses your specific, curated documentation
- More accurate answers
- Still efficient (only includes relevant sections, not entire docs folder)

## Maintenance

### Re-indexing Documentation

When you update your documentation:

```bash
npm run index-docs
```

This clears old chunks and re-indexes everything.

### Adjusting Search Parameters

In `app/api/chat/route.ts`:

```typescript
const docs = await searchDocuments(
  userMessage,
  0.7,  // matchThreshold: Lower = more results (0.5-0.8 recommended)
  3     // matchCount: Number of documents to include (3-5 recommended)
);
```

**matchThreshold**: Minimum similarity score (0-1)
- 0.8+ = Very strict (only highly relevant docs)
- 0.7 = Balanced (recommended)
- 0.5-0.6 = Loose (more results, may include less relevant docs)

**matchCount**: Number of documents to return
- 3 = Focused context (recommended for most questions)
- 5 = Broader context (for complex questions)
- 10+ = May exceed token limits

## Troubleshooting

### "Error searching documents"
- Check that migration was applied successfully
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase logs for errors

### "No documents found"
- Run `npm run index-docs` to index documentation
- Check that `docs/denmark-living/` contains markdown files
- Verify OpenAI API key is valid

### Slow indexing
- Normal for large documentation sets
- OpenAI API has rate limits (3000 requests/min for tier 1)
- Script processes files sequentially to avoid rate limits

### Poor search results
- Lower `matchThreshold` to get more results
- Increase `matchCount` for more context
- Check that documentation is well-structured with clear headings

## Cost Estimation

### Indexing (one-time):
- 67 files → ~234 chunks
- Embeddings: 234 × $0.00002 = **$0.0047**
- Re-run when docs change

### Per Chat Message:
- 1 query embedding: $0.00002
- GPT-4o-mini: ~$0.0001-0.0003 per message
- **Total: ~$0.0003 per message**

Very affordable! 🎉

## Next Steps

- Monitor search quality and adjust thresholds
- Add more documentation as needed
- Consider adding filters by category in the future
- Track which documents are most frequently retrieved
