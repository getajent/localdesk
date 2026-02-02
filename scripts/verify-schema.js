/**
 * Script to verify database schema in Supabase
 * Run with: node scripts/verify-schema.js
 * 
 * This script checks if the required tables exist in the database.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
let supabaseUrl = '';
let supabaseKey = '';
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
} catch (error) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
  console.log('\n' + '='.repeat(60));
  console.log('  Database Schema Verification');
  console.log('='.repeat(60) + '\n');

  const tables = ['profiles', 'chats', 'messages'];
  const results = [];

  for (const table of tables) {
    try {
      // Try to query the table (will fail if it doesn't exist)
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      if (error) {
        if (error.message.includes('does not exist') || error.code === '42P01') {
          results.push({ table, exists: false, error: 'Table does not exist' });
        } else {
          results.push({ table, exists: false, error: error.message });
        }
      } else {
        results.push({ table, exists: true });
      }
    } catch (error) {
      results.push({ table, exists: false, error: error.message });
    }
  }

  // Display results
  console.log('Table Status:\n');
  results.forEach(({ table, exists, error }) => {
    if (exists) {
      console.log(`  ✅ ${table.padEnd(15)} - EXISTS`);
    } else {
      console.log(`  ❌ ${table.padEnd(15)} - MISSING`);
      if (error) {
        console.log(`     Error: ${error}`);
      }
    }
  });

  const allExist = results.every(r => r.exists);
  
  console.log('\n' + '='.repeat(60));
  if (allExist) {
    console.log('✅ All required tables exist!');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } else {
    console.log('❌ Some tables are missing!');
    console.log('='.repeat(60));
    console.log('\nPlease apply the migration:');
    console.log('  1. Run: node scripts/apply-migration.js');
    console.log('  2. Follow the instructions to apply the SQL migration\n');
    process.exit(1);
  }
}

verifySchema();
