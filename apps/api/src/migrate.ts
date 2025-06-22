import { db } from '@dietkem/db';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Running migration: Adding client_notes column to clients table...');
    
    await db.execute(sql`ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "client_notes" text;`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

runMigration(); 