# RAG Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ASKS QUESTION                       │
│                  "How do I get a CPR number?"                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT API (route.ts)                           │
│  1. Receives user message                                        │
│  2. Calls searchDocuments(userMessage)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EMBEDDINGS (lib/embeddings.ts)                  │
│  1. Generate embedding for user question                         │
│     → OpenAI text-embedding-3-small                              │
│     → Returns: [0.123, -0.456, ...] (1536 dimensions)            │
│                                                                   │
│  2. Query Supabase with embedding                                │
│     → match_documents(query_embedding, 0.7, 3)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (pgvector)                           │
│  1. Compare query embedding with all document embeddings         │
│  2. Calculate cosine similarity                                  │
│  3. Return top 3 matches with similarity > 0.7                   │
│                                                                   │
│  Example results:                                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Doc 1: "CPR Number Registration" (similarity: 0.89)      │   │
│  │ Doc 2: "Arrival Process Overview" (similarity: 0.82)     │   │
│  │ Doc 3: "ICS Centers" (similarity: 0.75)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT API (route.ts)                           │
│  1. Receives relevant documents                                  │
│  2. Builds enhanced system prompt:                               │
│     - Base prompt (expert persona)                               │
│     - Relevant documentation (3 docs)                            │
│  3. Sends to OpenAI GPT-4o-mini                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OPENAI GPT-4o-mini                          │
│  Generates response using:                                       │
│  - Expert Danish consultant persona                              │
│  - Specific documentation about CPR numbers                      │
│  - Context from related documents                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STREAMING RESPONSE                          │
│  "To get a CPR number, you need to visit your local             │
│   International Citizen Service (ICS) center within 5 days       │
│   of arrival in Denmark. You'll need to bring..."                │
└─────────────────────────────────────────────────────────────────┘
```

## Indexing Flow (One-time Setup)

```
┌─────────────────────────────────────────────────────────────────┐
│                    npm run index-docs                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              INDEXING SCRIPT (index-documentation.ts)            │
│  1. Scan docs/denmark-living/ for .md files                      │
│  2. Read each file                                               │
│  3. Extract metadata (title, category, source)                   │
│  4. Split into chunks (1000 chars, 200 overlap)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         FOR EACH CHUNK                           │
│  1. Generate embedding via OpenAI                                │
│  2. Store in Supabase:                                           │
│     {                                                             │
│       content: "CPR number is...",                               │
│       metadata: {                                                │
│         title: "CPR Number Registration",                        │
│         source: "arrival-process/cpr-number.md",                 │
│         category: "arrival-process"                              │
│       },                                                          │
│       embedding: [0.123, -0.456, ...]                            │
│     }                                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE DOCUMENTS TABLE                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 234 chunks indexed and ready for search                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Documents Table (Supabase)
```sql
CREATE TABLE documents (
  id uuid PRIMARY KEY,
  content text,              -- The actual text chunk
  metadata jsonb,            -- Title, source, category
  embedding vector(1536),    -- OpenAI embedding
  created_at timestamptz
);
```

### 2. Vector Search Function
```sql
CREATE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
```

Uses cosine similarity to find closest matches:
- 1.0 = Identical
- 0.9+ = Very similar
- 0.7-0.9 = Similar (our threshold)
- <0.7 = Not similar enough

### 3. Chunking Strategy

**Why chunk?**
- Large documents exceed token limits
- Smaller chunks = more precise matching
- Overlap ensures context isn't lost

**Example:**
```
Document: 3000 characters
↓
Chunk 1: chars 0-1000
Chunk 2: chars 800-1800 (200 char overlap)
Chunk 3: chars 1600-2600
Chunk 4: chars 2400-3000
```

### 4. Embedding Model

**text-embedding-3-small**
- 1536 dimensions
- $0.00002 per 1K tokens
- Fast and accurate
- Perfect for semantic search

## Token Usage Comparison

### Without RAG:
```
System Prompt: 150 tokens
User Message: 20 tokens
AI Response: 200 tokens
─────────────────────────
Total: 370 tokens
Cost: ~$0.0001
```

### With RAG:
```
System Prompt: 150 tokens
Relevant Docs: 800 tokens (3 chunks × ~250 tokens)
User Message: 20 tokens
AI Response: 200 tokens
─────────────────────────
Total: 1170 tokens
Cost: ~$0.0003
```

**3x more tokens, but:**
- ✅ Accurate, specific answers
- ✅ Based on YOUR documentation
- ✅ Consistent information
- ✅ Still very affordable

## Performance Characteristics

### Indexing:
- **Time**: ~2-3 minutes for 67 files
- **Cost**: ~$0.005 one-time
- **Frequency**: Only when docs change

### Search:
- **Latency**: ~200-300ms
- **Cost**: ~$0.00002 per query
- **Accuracy**: 85-95% relevant results

### Chat Response:
- **Latency**: 2-4 seconds (streaming)
- **Cost**: ~$0.0003 per message
- **Quality**: High (grounded in docs)

## Scaling Considerations

### Current Setup (67 files, 234 chunks):
- ✅ Fast search (<300ms)
- ✅ Low cost
- ✅ Good accuracy

### If you grow to 500+ files:
- Consider using `ivfflat` index tuning
- May need to increase `lists` parameter
- Still very fast and affordable

### If you need multi-language:
- Use separate embeddings per language
- Add `language` field to metadata
- Filter by language in search
