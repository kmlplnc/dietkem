import { db } from '../src';
import { users } from '../schema';

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\\n');
    
    const allUsers = await db.select().from(users);
    
    if (allUsers.length === 0) {
        console.log('No users found in the database.');
        return;
    }

    console.log(`📊 Total users: ${allUsers.length}\\n`);
    
    console.table(allUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
    })));
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    process.exit(0);
  }
}

checkUsers(); 