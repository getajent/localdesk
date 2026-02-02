# Database Migrations

This directory contains SQL migration files for the LocalDesk database schema.

## Migration Files

### 001_create_schema.sql

Creates the initial database schema with the following tables:

- **profiles**: Extended user information linked to Supabase Auth users
- **chats**: Chat sessions for authenticated users  
- **messages**: Individual messages within chat sessions

#### Features

- Foreign key relationships between tables
- Indexes for optimal query performance
- Row Level Security (RLS) policies for data protection
- Automatic timestamp updates via triggers
- CHECK constraints for data validation

## Applying Migrations

### Option 1: Supabase SQL Editor (Recommended)

1. Open the Supabase SQL Editor: https://app.supabase.com/project/efmrwyfxpqfroxnguywg/sql/new
2. Copy the contents of the migration file
3. Paste into the SQL Editor
4. Click "Run" to execute

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

### Option 3: Migration Script

Run the helper script to see migration details:

```bash
node scripts/apply-migration.js
```

## Schema Overview

```
auth.users (managed by Supabase Auth)
  ↓
profiles (user_id FK)
  ↓
chats (user_id FK)
  ↓
messages (chat_id FK)
```

## RLS Policies

All tables have Row Level Security enabled with policies that ensure:

- Users can only access their own data
- Profile, chat, and message operations are restricted to the authenticated user
- Messages are accessible only through chats owned by the user

## Indexes

Performance indexes are created on:

- `profiles.user_id`
- `chats.user_id`
- `chats.created_at` (DESC for recent-first queries)
- `messages.chat_id`
- `messages.created_at`
