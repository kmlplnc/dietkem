import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

const checkSchema = async () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = postgres(connectionString, { max: 1 });

  console.log('Checking measurements table schema...');
  
  try {
    // Check the current columns in the measurements table
    const result = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'measurements' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Current measurements table columns:');
    result.forEach((row: any) => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }

  await sql.end();
  process.exit(0);
};

checkSchema().catch((err) => {
  console.error('Schema check failed:', err);
  process.exit(1);
}); 