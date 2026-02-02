/**
 * Script to apply database migration to Supabase
 * Run with: node scripts/apply-migration.js
 */

const fs = require('fs');
const path = require('path');

// Read .env.local file manually
let supabaseUrl = '';
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  if (match) {
    supabaseUrl = match[1].trim();
  }
} catch (error) {
  console.error('Could not read .env.local file');
}

const projectRef = supabaseUrl ? supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] : null;

console.log('\n' + '='.repeat(70));
console.log('  LocalDesk Database Migration');
console.log('='.repeat(70));
console.log('\n📋 Migration Summary:');
console.log('  File: supabase/migrations/001_create_schema.sql');
console.log('  Project: ' + (projectRef || 'Unknown'));
console.log('\n📦 Tables to create:');
console.log('  ✓ profiles (user_id FK → auth.users)');
console.log('  ✓ chats (user_id FK → auth.users)');
console.log('  ✓ messages (chat_id FK → chats, role CHECK constraint)');
console.log('\n📊 Indexes to create:');
console.log('  ✓ idx_profiles_user_id');
console.log('  ✓ idx_chats_user_id');
console.log('  ✓ idx_chats_created_at');
console.log('  ✓ idx_messages_chat_id');
console.log('  ✓ idx_messages_created_at');
console.log('\n🔒 Security:');
console.log('  ✓ Row Level Security (RLS) enabled on all tables');
console.log('  ✓ RLS policies for authenticated user access');
console.log('\n' + '='.repeat(70));
console.log('\n⚠️  MANUAL ACTION REQUIRED\n');
console.log('To apply this migration, please use the Supabase SQL Editor:\n');
console.log('1. Open: https://app.supabase.com/project/' + projectRef + '/sql/new');
console.log('2. Copy the entire contents of: supabase/migrations/001_create_schema.sql');
console.log('3. Paste into the SQL Editor');
console.log('4. Click "Run" to execute the migration\n');
console.log('Alternative: Install Supabase CLI and run: supabase db push\n');
console.log('='.repeat(70) + '\n');

// Verify migration file exists
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_create_schema.sql');
if (fs.existsSync(migrationPath)) {
  console.log('✅ Migration file verified at: ' + migrationPath);
  const stats = fs.statSync(migrationPath);
  console.log('   Size: ' + Math.round(stats.size / 1024) + ' KB\n');
} else {
  console.log('❌ Migration file not found!\n');
  process.exit(1);
}
