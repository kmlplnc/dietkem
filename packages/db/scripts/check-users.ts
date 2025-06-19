import { db } from '../src/index';
import { users } from '../src/schema';

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    
    const allUsers = await db.query.users.findMany();
    
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.first_name} ${user.last_name}, Role: ${user.role}`);
    });
    
    // Check specifically for user with ID 3
    const user3 = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, 3)
    });
    
    if (user3) {
      console.log('\nUser with ID 3 found:', user3);
    } else {
      console.log('\nNo user found with ID 3');
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    process.exit(0);
  }
}

checkUsers(); 