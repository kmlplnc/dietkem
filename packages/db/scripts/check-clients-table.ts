import { db } from '../src';
import { sql } from 'drizzle-orm';

async function checkClientsTable() {
  try {
    // Check if the table exists and get its structure
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'clients' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Current clients table structure:');
    console.table(result.rows);
    
    // Check if status column exists
    const statusCheck = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clients' AND column_name = 'status';
    `);
    
    console.log('\nStatus column exists:', statusCheck.rows.length > 0);
    
    // Check if there are any clients in the table
    const clientCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM clients;
    `);
    
    console.log('Number of clients in table:', clientCount.rows[0]?.count);
    
  } catch (error) {
    console.error('Error checking clients table:', error);
  }
}

checkClientsTable(); 