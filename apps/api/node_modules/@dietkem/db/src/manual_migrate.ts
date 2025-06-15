import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql, { schema });

  console.log('Running manual migration...');
  
  // Read and execute the SQL file
  const sqlFile = path.join(__dirname, '../drizzle/manual_migration.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  
  try {
    await sql.unsafe(sqlContent);
    console.log('Manual migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }

  await sql.end();
  process.exit(0);
};

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 