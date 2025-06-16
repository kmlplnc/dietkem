import { db, queryClient } from '../src';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '../drizzle/manual_migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await queryClient.unsafe(statement);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    await queryClient.end();
  }
}

runMigration(); 