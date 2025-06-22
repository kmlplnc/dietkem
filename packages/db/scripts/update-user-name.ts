import { db } from '../src';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

async function updateUser() {
  const userIdToUpdate = 4; // Güncellenecek kullanıcının ID'si
  const newFirstName = 'Kemal';
  const newLastName = 'Palancı';

  try {
    console.log(`🔄 Updating user with ID ${userIdToUpdate}...`);
    
    const updatedUser = await db.update(users)
      .set({ 
        first_name: newFirstName,
        last_name: newLastName 
      })
      .where(eq(users.id, userIdToUpdate))
      .returning();

    if (updatedUser.length > 0) {
      console.log('✅ User updated successfully:');
      console.table(updatedUser);
    } else {
      console.log(`⚠️ User with ID ${userIdToUpdate} not found.`);
    }
    
  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    process.exit(0);
  }
}

updateUser(); 