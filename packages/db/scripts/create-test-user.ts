import { db } from '../index';
import { users } from '../schema';

async function createTestUser() {
  try {
    // Test kullanıcısı oluştur
    const [newUser] = await db.insert(users).values({
      id: 1, // Manuel ID atama
      clerk_id: 'test-clerk-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      role: 'admin',
    }).returning();

    console.log('Test user created:', newUser);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser(); 