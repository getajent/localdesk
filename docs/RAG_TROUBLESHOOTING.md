# RAG Troubleshooting Guide

Common issues and solutions for the RAG implementation.

## Setup Issues

### ❌ "OPENAI_API_KEY not configured"

**Problem**: OpenAI API key is missing or invalid.

**Solution**:
1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-...
   ```
3. Restart dev server

**Verify**:
```bash
# Check if key is set
echo $OPENAI_API_KEY  # Linux/Mac
echo %OPENAI_API_KEY%  # Windows
```

---

### ❌ "Missing Supabase environment variables"

**Problem**: Supabase credentials not configured.

**Solution**:
1. Go to Supabase Dashboard → Settings → API
2. Copy these values to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
3. Restart dev server

**Note**: `SUPABASE_SERVICE_ROLE_KEY` is required for indexing.

---

### ❌ "Error: relation 'documents' does not exist"

**Problem**: Database migration not applied.

**Solution**:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of `supabase/migrations/003_create_documents_table.sql`
4. Paste and click "Run"
5. Verify success message

**Verify**:
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM documents;
```

Should return `0` (or number of indexed documents).

---

### ❌ "Error: function match_documents does not exist"

**Problem**: Same as above - migration not applied.

**Solution**: Apply migration 003 (see above).

**Verify**:
```sql
-- Run in Supabase SQL Editor
SELECT match_documents(
  ARRAY[0.1, 0.2]::vector(1536),
  0.7,
  5
);
```

Should return empty array (no documents yet) without error.

---

## Indexing Issues

### ❌ "No markdown files found"

**Problem**: Documentation directory doesn't exist or is empty.

**Solution**:
1. Verify `docs/denmark-living/` exists
2. Check it contains `.md` files
3. Verify path in `scripts/index-documentation.ts`:
   ```typescript
   const docsPath = path.join(process.cwd(), 'docs', 'denmark-living');
   ```

**Verify**:
```bash
# Check files exist
ls docs/denmark-living/**/*.md  # Linux/Mac
dir /s /b docs\denmark-living\*.md  # Windows
```

---

### ❌ Indexing is very slow

**Problem**: Normal behavior, but can be optimized.

**Explanation**:
- OpenAI API has rate limits
- Free tier: 3 requests/min
- Paid tier 1: 3000 requests/min
- Script processes sequentially to avoid limits

**Solutions**:
1. **Upgrade OpenAI tier** for faster indexing
2. **Add delays** if hitting rate limits:
   ```typescript
   // In index-documentation.ts
   await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
   ```
3. **Be patient** - 2-3 minutes for 67 files is normal

---

### ❌ "Rate limit exceeded"

**Problem**: Too many API requests too quickly.

**Solution**:
1. Wait a few minutes and try again
2. Check your OpenAI usage limits
3. Add delays between requests (see above)
4. Upgrade OpenAI tier

**Check limits**:
- Go to https://platform.openai.com/account/limits
- View your current tier and limits

---

### ❌ Some files fail to index

**Problem**: Individual files have issues.

**Common causes**:
- File encoding issues (non-UTF-8)
- Very large files (>100KB)
- Malformed markdown

**Solution**:
1. Check error message for specific file
2. Verify file encoding is UTF-8
3. Check file for special characters
4. Try splitting very large files

**Debug**:
```typescript
// Add to index-documentation.ts
console.log('File size:', fs.statSync(filePath).size);
console.log('File encoding:', chardet.detect(fs.readFileSync(filePath)));
```

---

## Search Issues

### ❌ "No documents found" in search

**Problem**: Documents not indexed or search too specific.

**Solutions**:
1. **Index documents first**:
   ```bash
   npm run index-docs
   ```
2. **Verify indexing worked**:
   - Check Supabase Dashboard → Table Editor → documents
   - Should see ~234 rows
3. **Try broader query**:
   ```bash
   npm run test-search "Denmark"  # Very broad
   npm run test-search "CPR"      # More specific
   ```
4. **Lower similarity threshold**:
   ```typescript
   // In lib/embeddings.ts
   const docs = await searchDocuments(query, 0.5, 5);  // Lower from 0.7
   ```

---

### ❌ Search returns irrelevant results

**Problem**: Similarity threshold too low.

**Solution**:
1. **Raise threshold**:
   ```typescript
   // In app/api/chat/route.ts
   const docs = await searchDocuments(userMessage, 0.8, 3);  // Raise from 0.7
   ```
2. **Reduce result count**:
   ```typescript
   const docs = await searchDocuments(userMessage, 0.7, 2);  // Reduce from 3
   ```
3. **Improve documentation**:
   - Add clear headings
   - Use consistent terminology
   - Include keywords in content

---

### ❌ Search is slow (>1 second)

**Problem**: Database not optimized or too many documents.

**Solutions**:
1. **Check index exists**:
   ```sql
   -- In Supabase SQL Editor
   SELECT indexname FROM pg_indexes WHERE tablename = 'documents';
   ```
   Should show `documents_embedding_idx`.

2. **Rebuild index**:
   ```sql
   REINDEX INDEX documents_embedding_idx;
   ```

3. **Tune ivfflat parameters** (for >1000 documents):
   ```sql
   DROP INDEX documents_embedding_idx;
   CREATE INDEX documents_embedding_idx 
     ON documents 
     USING ivfflat (embedding vector_cosine_ops)
     WITH (lists = 200);  -- Increase from 100
   ```

---

## Chat Issues

### ❌ Chat gives generic answers (not using docs)

**Problem**: RAG not working or search failing silently.

**Debug steps**:
1. **Check browser console** for errors
2. **Check server logs** for search errors
3. **Test search directly**:
   ```bash
   npm run test-search "How do I get a CPR number?"
   ```
4. **Verify documents indexed**:
   - Supabase Dashboard → Table Editor → documents
   - Should have rows

**Solution**:
If search works but chat doesn't:
1. Check `app/api/chat/route.ts` has search code
2. Verify no errors in try-catch block
3. Add logging:
   ```typescript
   console.log('Found docs:', docs.length);
   console.log('Relevant docs:', relevantDocs.substring(0, 200));
   ```

---

### ❌ "Error searching documents" in logs

**Problem**: Search function failing.

**Common causes**:
1. Migration not applied
2. Invalid embedding dimensions
3. Supabase connection issues

**Solution**:
1. **Check migration applied** (see above)
2. **Verify embedding dimensions**:
   ```sql
   -- Should return 1536
   SELECT vector_dims(embedding) FROM documents LIMIT 1;
   ```
3. **Check Supabase status**:
   - https://status.supabase.com/
4. **Test connection**:
   ```typescript
   // In test-search.ts
   const { data, error } = await supabase.from('documents').select('count');
   console.log('Connection test:', data, error);
   ```

---

### ❌ Chat response includes "[Document 1: ...]" in output

**Problem**: AI is including the document markers in response.

**Solution**:
Update system prompt in `app/api/chat/route.ts`:
```typescript
const systemPrompt = buildSystemPrompt(relevantDocs);
// Add instruction:
// "Use the documentation to inform your answer, but don't mention 
//  the document markers or structure in your response."
```

---

## Performance Issues

### ❌ High OpenAI costs

**Problem**: Too many tokens per request.

**Analysis**:
```typescript
// Check token usage
console.log('System prompt tokens:', systemPrompt.length / 4);  // Rough estimate
console.log('Docs tokens:', relevantDocs.length / 4);
```

**Solutions**:
1. **Reduce document count**:
   ```typescript
   const docs = await searchDocuments(userMessage, 0.7, 2);  // Reduce from 3
   ```
2. **Reduce chunk size** in indexing:
   ```typescript
   chunkText(text, 800, 150);  // Reduce from 1000, 200
   ```
3. **Use cheaper model** (not recommended - quality drops):
   ```typescript
   model: openai('gpt-3.5-turbo')  // Instead of gpt-4o-mini
   ```

**Expected costs**:
- With 3 docs: ~$0.0003 per message
- With 2 docs: ~$0.0002 per message
- With 5 docs: ~$0.0005 per message

---

### ❌ Slow chat responses

**Problem**: Multiple factors can cause delays.

**Breakdown**:
- Search: 200-300ms
- OpenAI: 2-3 seconds (streaming)
- Total: 2.5-3.5 seconds (normal)

**If slower than 5 seconds**:
1. **Check search performance** (see above)
2. **Check OpenAI status**: https://status.openai.com/
3. **Reduce document count** (see above)
4. **Check network latency**

---

## Data Issues

### ❌ Outdated information in responses

**Problem**: Documentation changed but not re-indexed.

**Solution**:
```bash
npm run index-docs
```

**Best practice**:
- Re-index after any documentation changes
- Set up automated re-indexing (future enhancement)
- Document update dates in metadata

---

### ❌ Duplicate or conflicting information

**Problem**: Multiple documents with similar content.

**Solution**:
1. **Consolidate documentation**:
   - Merge similar documents
   - Remove duplicates
   - Create clear hierarchy
2. **Improve chunking**:
   - Adjust chunk size
   - Ensure chunks have context
3. **Filter by category**:
   ```typescript
   // In lib/embeddings.ts
   .eq('metadata->category', 'arrival-process')
   ```

---

## Testing & Debugging

### Useful Commands

```bash
# Test search
npm run test-search "your query"

# Re-index everything
npm run index-docs

# Check Supabase connection
npx supabase status

# View logs
npm run dev  # Check console output
```

### Useful SQL Queries

```sql
-- Count documents
SELECT COUNT(*) FROM documents;

-- View sample documents
SELECT 
  metadata->>'title' as title,
  metadata->>'category' as category,
  LENGTH(content) as content_length
FROM documents
LIMIT 10;

-- Find documents by category
SELECT 
  metadata->>'title' as title,
  metadata->>'source' as source
FROM documents
WHERE metadata->>'category' = 'arrival-process';

-- Check embedding dimensions
SELECT vector_dims(embedding) FROM documents LIMIT 1;

-- Test search function
SELECT * FROM match_documents(
  (SELECT embedding FROM documents LIMIT 1),
  0.7,
  5
);
```

### Debug Logging

Add to `app/api/chat/route.ts`:

```typescript
console.log('User message:', userMessage);
console.log('Search results:', docs.length);
console.log('Relevant docs length:', relevantDocs.length);
console.log('System prompt length:', systemPrompt.length);
```

---

## Getting Help

### Before asking for help:

1. ✅ Check this troubleshooting guide
2. ✅ Review setup documentation (`docs/RAG_SETUP.md`)
3. ✅ Test search with `npm run test-search`
4. ✅ Check Supabase logs
5. ✅ Check browser console
6. ✅ Check server logs

### Include in your question:

- Error message (full text)
- What you were trying to do
- What you've already tried
- Relevant logs or screenshots
- Environment (OS, Node version, etc.)

### Resources:

- **Setup**: `docs/RAG_SETUP.md`
- **Architecture**: `docs/RAG_ARCHITECTURE.md`
- **Scripts**: `scripts/README_RAG.md`
- **Comparison**: `docs/RAG_COMPARISON.md`

---

## Common Gotchas

1. **Forgot to apply migration** → No documents table
2. **Forgot to index** → No search results
3. **Wrong API key** → Authentication errors
4. **Threshold too high** → No results
5. **Threshold too low** → Irrelevant results
6. **Forgot to restart server** → Changes not applied
7. **Using anon key for indexing** → Permission errors (use service role key)

---

**Still stuck?** Check the documentation files or create an issue with details!
