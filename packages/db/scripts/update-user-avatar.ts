import { db } from '../src/index';
import { users } from '../src/schema';
import { eq } from 'drizzle-orm';

async function updateUserAvatar() {
  try {
    console.log('Updating user avatar...');
    
    const result = await db.update(users)
      .set({ 
        avatar_url: 'https://res.cloudinary.com/dietkem/image/upload/v1/avatar.jpg' 
      })
      .where(eq(users.id, 3))
      .returning();
    
    console.log('Updated user:', result[0]);
    
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    process.exit(0);
  }
}

updateUserAvatar(); 