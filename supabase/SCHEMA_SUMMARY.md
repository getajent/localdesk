# LocalDesk Database Schema Summary

## Overview

This document provides a quick reference for the LocalDesk database schema.

## Tables

### 1. profiles
Extended user information linked to Supabase Auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique profile identifier |
| user_id | UUID | FK → auth.users, UNIQUE, NOT NULL | Link to auth user |
| full_name | TEXT | - | User's full name |
| metadata | JSONB | DEFAULT '{}' | Flexible user preferences |
| created_at | TIMESTAMPTZ | NOT NULL | Profile creation time |
| updated_at | TIMESTAMPTZ | NOT NULL | Last update time |

**Indexes**: `idx_profiles_user_id`

### 2. chats
Chat sessions for authenticated users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique chat identifier |
| user_id | UUID | FK → auth.users, NOT NULL | Chat owner |
| title | TEXT | NOT NULL, DEFAULT 'New Chat' | Chat title |
| created_at | TIMESTAMPTZ | NOT NULL | Chat creation time |
| updated_at | TIMESTAMPTZ | NOT NULL | Last update time |

**Indexes**: `idx_chats_user_id`, `idx_chats_created_at`

### 3. messages
Individual messages within chat sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique message identifier |
| chat_id | UUID | FK → chats, NOT NULL | Parent chat |
| role | TEXT | CHECK IN ('user', 'assistant'), NOT NULL | Message sender |
| content | TEXT | NOT NULL | Message text |
| created_at | TIMESTAMPTZ | NOT NULL | Message timestamp |

**Indexes**: `idx_messages_chat_id`, `idx_messages_created_at`

## Relationships

```
auth.users
    ↓ (1:1)
    profiles
    
auth.users
    ↓ (1:N)
    chats
        ↓ (1:N)
        messages
```

## Row Level Security

All tables have RLS enabled with policies ensuring users can only access their own data.

### Profiles
- SELECT: Own profile only
- INSERT: Own profile only
- UPDATE: Own profile only

### Chats
- SELECT: Own chats only
- INSERT: Own chats only
- UPDATE: Own chats only
- DELETE: Own chats only

### Messages
- SELECT: Messages from own chats only
- INSERT: Messages to own chats only
- DELETE: Messages from own chats only

## Triggers

- `update_profiles_updated_at`: Auto-updates `updated_at` on profile changes
- `update_chats_updated_at`: Auto-updates `updated_at` on chat changes

## Usage Examples

### Create a profile
```sql
INSERT INTO profiles (user_id, full_name, metadata)
VALUES (auth.uid(), 'John Doe', '{"preferences": {"theme": "dark"}}');
```

### Create a chat
```sql
INSERT INTO chats (user_id, title)
VALUES (auth.uid(), 'SKAT Questions')
RETURNING id;
```

### Add messages
```sql
INSERT INTO messages (chat_id, role, content)
VALUES 
  ('chat-uuid', 'user', 'How do I register with SKAT?'),
  ('chat-uuid', 'assistant', 'To register with SKAT...');
```

### Get user's chats
```sql
SELECT * FROM chats
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Get chat messages
```sql
SELECT * FROM messages
WHERE chat_id = 'chat-uuid'
ORDER BY created_at ASC;
```

## Migration File

Location: `supabase/migrations/001_create_schema.sql`

Apply via:
1. Supabase SQL Editor
2. Supabase CLI: `supabase db push`
3. See `MIGRATION_INSTRUCTIONS.md` for details
