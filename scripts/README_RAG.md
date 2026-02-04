# RAG Scripts Documentation

This folder contains scripts for managing the RAG (Retrieval Augmented Generation) system.

## Available Scripts

### 1. index-documentation.ts

**Purpose**: Index all documentation from `docs/denmark-living/` into Supabase vector database.

**Usage**:
```bash
npm run index-docs
```

**What it does**:
1. Scans `docs/denmark-living/` for all `.md` files
2. Reads each file and extracts metadata (title, category, source)
3. Splits large documents into chunks (1000 chars, 200 overlap)
4. Generates embeddings for each chunk using OpenAI
5. Stores chunks in Supabase `documents` table
6. Clears old documents before indexing new ones

**Output**:
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

**When to run**:
- After initial setup
- When documentation is added or updated
- When document structure changes

**Requirements**:
- `OPENAI_API_KEY` in `.env.local`
- `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Migration 003 applied in Supabase

**Time**: ~2-3 minutes for 67 files

**Cost**: ~$0.005 (one-time per indexing)

---

### 2. test-search.ts

**Purpose**: Test the document search functionality to verify RAG is working.

**Usage**:
```bash
npm run test-search "your search query"
```

**Examples**:
```bash
npm run test-search "How do I get a CPR number?"
npm run test-search "tenant rights"
npm run test-search "tax deductions"
```

**What it does**:
1. Takes your query as input
2. Generates embedding for the query
3. Searches Supabase for similar documents
4. Displays results with similarity scores

**Output**:
```
🔍 Testing document search...

Query: "How do I get a CPR number?"

✅ Found 3 relevant documents:

--- Document 1 ---
Title: CPR Number Registration
Source: arrival-process/cpr-number.md
Category: arrival-process
Similarity: 89.2%
Content preview: # CPR Number Registration

The CPR number (Central Person Register) is your personal 
identification number in Denmark. You need it for...

--- Document 2 ---
Title: Arrival Process Overview
Source: arrival-process/overview.md
Category: arrival-process
Similarity: 82.5%
Content preview: # Arrival Process Overview

When you first arrive in Denmark, there are several important...

--- Document 3 ---
Title: ICS Centers
Source: arrival-process/ics-centers.md
Category: arrival-process
Similarity: 75.8%
Content preview: # International Citizen Service Centers

ICS centers are your first point of contact for...

✨ Search test complete!
```

**When to run**:
- After indexing to verify it worked
- To test search quality
- To debug search issues
- To see what documents match specific queries

**Requirements**:
- Same as index-documentation.ts
- Documents must be indexed first

**Time**: ~1-2 seconds

**Cost**: ~$0.00002 per search

---

## Script Configuration

### Chunking Parameters

In `index-documentation.ts`:

```typescript
function chunkText(
  text: string, 
  maxChunkSize: number = 1000,  // Max characters per chunk
  overlap: number = 200          // Overlap between chunks
): string[]
```

**Adjust these if**:
- Documents are very long → Increase `maxChunkSize`
- Losing context between chunks → Increase `overlap`
- Too many chunks → Increase `maxChunkSize`, decrease `overlap`

### Search Parameters

In `test-search.ts` and `lib/embeddings.ts`:

```typescript
searchDocuments(
  query: string,
  matchThreshold: number = 0.7,  // Minimum similarity (0-1)
  matchCount: number = 5         // Max results to return
)
```

**Adjust these if**:
- Too few results → Lower `matchThreshold` (try 0.5-0.6)
- Too many irrelevant results → Raise `matchThreshold` (try 0.8)
- Need more context → Increase `matchCount` (try 5-10)

## Troubleshooting

### "OPENAI_API_KEY not configured"
- Add `OPENAI_API_KEY` to `.env.local`
- Verify the key is valid at https://platform.openai.com/api-keys

### "Missing Supabase environment variables"
- Add `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- Get these from Supabase Dashboard → Settings → API

### "Error: relation 'documents' does not exist"
- Apply migration 003 in Supabase SQL Editor
- File: `supabase/migrations/003_create_documents_table.sql`

### "Error: function match_documents does not exist"
- Same as above - migration not applied

### "No documents found" in test-search
- Run `npm run index-docs` first
- Check that `docs/denmark-living/` has `.md` files
- Verify indexing completed successfully

### Indexing is slow
- Normal for large documentation sets
- OpenAI API has rate limits
- Script processes files sequentially to avoid limits
- Expected: ~2-3 seconds per file

### Rate limit errors
- OpenAI free tier: 3 requests/min
- Paid tier 1: 3000 requests/min
- Add delays in script if needed

## Advanced Usage

### Index specific directory

Modify `index-documentation.ts`:

```typescript
const docsPath = path.join(process.cwd(), 'docs', 'your-folder');
```

### Change embedding model

In `lib/embeddings.ts`:

```typescript
const response = await openai.embeddings.create({
  model: 'text-embedding-3-large',  // More accurate, more expensive
  dimensions: 3072,                  // Must match vector size in DB
});
```

**Note**: If changing dimensions, update migration 003 and re-create table.

### Filter by category

In `lib/embeddings.ts`, modify `searchDocuments`:

```typescript
const { data, error } = await supabase
  .rpc('match_documents', { ... })
  .eq('metadata->category', 'arrival-process');  // Add filter
```

## Performance Metrics

### Indexing
- **67 files**: ~2-3 minutes
- **234 chunks**: ~$0.005
- **Rate**: ~1 file per 2-3 seconds

### Search
- **Latency**: 200-300ms
- **Cost**: $0.00002 per query
- **Accuracy**: 85-95% relevant results

## Best Practices

1. **Re-index regularly** when docs change
2. **Test search** after indexing to verify quality
3. **Monitor costs** in OpenAI dashboard
4. **Backup database** before major changes
5. **Version control** your documentation
6. **Document changes** in update logs

## Future Enhancements

Potential improvements:
- Incremental indexing (only changed files)
- Multi-language support
- Category-based filtering
- Metadata-based search
- Search analytics and logging
- Automatic re-indexing on file changes

## Resources

- **Setup Guide**: `docs/RAG_SETUP.md`
- **Architecture**: `docs/RAG_ARCHITECTURE.md`
- **Comparison**: `docs/RAG_COMPARISON.md`
- **Migration**: `supabase/migrations/README_VECTOR_SEARCH.md`
