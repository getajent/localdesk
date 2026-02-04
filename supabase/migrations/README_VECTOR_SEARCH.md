# Vector Search Setup

This migration sets up vector similarity search for documentation using pgvector.

## What it does

1. **Enables pgvector extension** - PostgreSQL extension for vector operations
2. **Creates documents table** - Stores documentation chunks with embeddings
3. **Creates indexes** - Optimizes vector similarity search and metadata queries
4. **Creates match_documents function** - RPC function for searching similar documents
5. **Sets up RLS** - Row Level Security for public read access

## Schema

```sql
documents (
  id uuid PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb NOT NULL,
  embedding vector(1536),
  created_at timestamptz
)
```

### Metadata Structure

```json
{
  "source": "arrival-process/cpr-number.md",
  "category": "arrival-process",
  "title": "CPR Number Registration",
  "section": "Part 1/3"
}
```

## Usage

### Search for similar documents

```typescript
const { data } = await supabase.rpc('match_documents', {
  query_embedding: [0.1, 0.2, ...], // 1536-dimensional vector
  match_threshold: 0.7,              // Minimum similarity (0-1)
  match_count: 5                     // Max results
});
```

### Returns

```typescript
[
  {
    id: "uuid",
    content: "Document content...",
    metadata: { source: "...", title: "..." },
    similarity: 0.85
  }
]
```

## Applying the Migration

Run this migration in your Supabase project:

1. Go to SQL Editor in Supabase Dashboard
2. Copy the contents of `003_create_documents_table.sql`
3. Execute the SQL
4. Verify the `documents` table and `match_documents` function exist

## Indexing Documentation

After applying the migration, index your documentation:

```bash
npm run index-docs
```

This will:
- Read all markdown files from `docs/denmark-living/`
- Split them into chunks
- Generate embeddings using OpenAI
- Store them in the documents table
