# Database Migration Instructions

## ✅ Task 3: Create Database Schema - COMPLETED

The database schema has been created and is ready to be applied to your Supabase project.

## 📋 What Was Created

### Migration File
- **Location**: `supabase/migrations/001_create_schema.sql`
- **Size**: ~6 KB
- **Status**: Ready to apply

### Database Tables

1. **profiles**
   - Stores extended user information
   - Links to `auth.users` via `user_id` foreign key
   - Fields: `id`, `user_id`, `full_name`, `metadata` (JSONB), `created_at`, `updated_at`
   - Unique constraint on `user_id`

2. **chats**
   - Stores chat sessions for authenticated users
   - Links to `auth.users` via `user_id` foreign key
   - Fields: `id`, `user_id`, `title`, `created_at`, `updated_at`

3. **messages**
   - Stores individual messages within chat sessions
   - Links to `chats` via `chat_id` foreign key
   - Fields: `id`, `chat_id`, `role`, `content`, `created_at`
   - CHECK constraint: `role IN ('user', 'assistant')`

### Indexes Created

- `idx_profiles_user_id` - Fast user profile lookups
- `idx_chats_user_id` - Fast user chat queries
- `idx_chats_created_at` - Recent chats first (DESC)
- `idx_messages_chat_id` - Fast message retrieval by chat
- `idx_messages_created_at` - Chronological message ordering

### Security Features

✅ **Row Level Security (RLS)** enabled on all tables

**Profiles Policies:**
- Users can view their own profile
- Users can insert their own profile
- Users can update their own profile

**Chats Policies:**
- Users can view their own chats
- Users can insert their own chats
- Users can update their own chats
- Users can delete their own chats

**Messages Policies:**
- Users can view messages from their own chats
- Users can insert messages to their own chats
- Users can delete messages from their own chats

### Automatic Features

- **Triggers**: Auto-update `updated_at` timestamp on profiles and chats
- **Cascading Deletes**: Deleting a user removes their profiles, chats, and messages
- **Default Values**: Sensible defaults for all fields

## 🚀 How to Apply the Migration

### Option 1: Supabase SQL Editor (Recommended)

1. **Open the SQL Editor**:
   ```
   https://app.supabase.com/project/efmrwyfxpqfroxnguywg/sql/new
   ```

2. **Copy the migration SQL**:
   - Open: `supabase/migrations/001_create_schema.sql`
   - Select all (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

3. **Paste and Run**:
   - Paste into the SQL Editor
   - Click the "Run" button
   - Wait for confirmation

4. **Verify**:
   ```bash
   node scripts/verify-schema.js
   ```

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref efmrwyfxpqfroxnguywg

# Push the migration
supabase db push
```

## ✅ Verification

After applying the migration, run the verification script:

```bash
node scripts/verify-schema.js
```

Expected output:
```
============================================================
  Database Schema Verification
============================================================

Table Status:

  ✅ profiles        - EXISTS
  ✅ chats           - EXISTS
  ✅ messages        - EXISTS

============================================================
✅ All required tables exist!
============================================================
```

## 📚 Helper Scripts

### View Migration Details
```bash
node scripts/apply-migration.js
```

### Verify Schema
```bash
node scripts/verify-schema.js
```

## 🔗 Schema Relationships

```
auth.users (Supabase Auth)
    ↓
    ├─→ profiles (user_id FK)
    │
    └─→ chats (user_id FK)
            ↓
            └─→ messages (chat_id FK)
```

## 📝 Requirements Satisfied

This migration satisfies the following requirements from the spec:

- ✅ **Requirement 6.1**: Users table (managed by Supabase Auth)
- ✅ **Requirement 6.2**: Profiles table with user_id, full_name, metadata
- ✅ **Requirement 6.3**: Chats table with id, user_id, title, timestamps
- ✅ **Requirement 6.4**: Messages table with id, chat_id, role, content, timestamp
- ✅ **Requirement 6.5**: Foreign key relationships established
- ✅ **All required indexes created**
- ✅ **Row Level Security policies configured**

## 🎯 Next Steps

After applying this migration, you can proceed to:

1. **Task 4**: Implement Supabase helper functions (`lib/supabase.ts`)
2. Test database operations with the new schema
3. Implement authentication and profile creation

## ⚠️ Important Notes

- The migration uses `CREATE TABLE IF NOT EXISTS` - safe to run multiple times
- All tables have RLS enabled - only authenticated users can access their own data
- The `metadata` JSONB field in profiles allows for flexible future extensions
- Cascading deletes ensure data integrity when users are removed

## 🆘 Troubleshooting

**Issue**: "Table already exists" error
- **Solution**: This is normal if you've run the migration before. The `IF NOT EXISTS` clause prevents errors.

**Issue**: "Permission denied" error
- **Solution**: Make sure you're using the SQL Editor in the Supabase Dashboard, which has full permissions.

**Issue**: Verification script shows tables as missing
- **Solution**: 
  1. Check that you ran the migration in the correct project
  2. Refresh the Supabase schema cache
  3. Verify the project URL in `.env.local` matches your Supabase project

---

**Status**: ✅ Migration file created and ready to apply
**Date**: 2026-02-02
**Task**: 3. Create database schema in Supabase
