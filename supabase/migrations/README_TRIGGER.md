# Profile Auto-Creation Trigger

This migration adds a database trigger that automatically creates a profile record when a new user signs up via Supabase Auth.

## What it does

When a user successfully signs up through Supabase Auth:
1. A new record is created in the `auth.users` table (managed by Supabase)
2. The trigger `on_auth_user_created` fires automatically
3. A corresponding profile record is created in the `public.profiles` table
4. The profile includes any metadata from the user's sign-up (e.g., full_name)

## How to apply

### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project root
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `002_create_profile_trigger.sql`
4. Paste and run the SQL in the editor

### Option 3: Manual SQL Execution

Connect to your Supabase database and run:

```sql
-- Copy and paste the contents of 002_create_profile_trigger.sql
```

## Verification

To verify the trigger is working:

1. Sign up a new user through your application
2. Check the `profiles` table - a new record should exist with the user's ID
3. The profile should have the same `user_id` as the user in `auth.users`

## Rollback

If you need to remove the trigger:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

## Notes

- The trigger uses `SECURITY DEFINER` to ensure it has the necessary permissions to insert into the profiles table
- The function extracts `full_name` from the user's metadata if provided during sign-up
- If profile creation fails, the user sign-up will still succeed (the trigger doesn't block authentication)
