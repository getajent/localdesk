# Quick Start: RAG Implementation

Your chat now uses your documentation! Here's what to do:

## 1. Add Environment Variable

Add to `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get it from: Supabase Dashboard → Settings → API → `service_role` key

## 2. Apply Database Migration

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Copy contents of `supabase/migrations/003_create_documents_table.sql`
4. Paste and click **Run**

## 3. Index Your Documentation

```bash
npm run index-docs
```

Wait for it to complete (~2-3 minutes for 67 files).

## 4. Test It!

```bash
npm run dev
```

Ask: "How do I get a CPR number?" 

The AI will now use your actual documentation! 🎉

## What Changed?

### Before:
- AI used general knowledge
- No reference to your docs
- Potentially outdated info

### After:
- AI searches your `docs/denmark-living/` folder
- Finds 3 most relevant sections
- Provides accurate answers from YOUR content
- Token-efficient (only includes relevant parts)

## Files Created:

- `lib/embeddings.ts` - Search functionality
- `lib/supabase-server.ts` - Server-side Supabase client
- `scripts/index-documentation.ts` - Indexing script
- `supabase/migrations/003_create_documents_table.sql` - Database schema

## Files Modified:

- `app/api/chat/route.ts` - Now searches docs before responding
- `package.json` - Added `index-docs` script
- `.env.example` - Added `SUPABASE_SERVICE_ROLE_KEY`

---

See `docs/RAG_SETUP.md` for detailed documentation.
