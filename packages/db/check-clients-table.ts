import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

const checkClientsTable = async () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = postgres(connectionString, { max: 1 });

  console.log('Checking clients table schema...');
  
  try {
    // Check the current columns in the clients table
    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'clients' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Current clients table columns:');
    result.forEach((row: any) => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default})`);
    });

    // Check if activity_level column exists
    const activityLevelExists = result.some((row: any) => row.column_name === 'activity_level');
    console.log(`\nActivity level column exists: ${activityLevelExists}`);

    // Check all clients data
    const allClients = await sql`
      SELECT id, name, activity_level, created_at
      FROM clients 
      ORDER BY created_at DESC;
    `;
    
    console.log('\nAll client data:');
    allClients.forEach((row: any) => {
      console.log(`- ID: ${row.id}, Name: ${row.name}, Activity Level: ${row.activity_level}, Created: ${row.created_at}`);
    });

    // Count clients with null activity_level
    const nullCount = allClients.filter((row: any) => row.activity_level === null).length;
    console.log(`\nClients with null activity_level: ${nullCount}/${allClients.length}`);
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }

  await sql.end();
  process.exit(0);
};

checkClientsTable().catch((err) => {
  console.error('Schema check failed:', err);
  process.exit(1);
}); 