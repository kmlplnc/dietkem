import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';

export async function syncUserWithDatabase(clerkUser: any) {
  try {
    // Check if user exists in our database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });

    if (!existingUser) {
      // Create new user in our database
      await db.insert(users).values({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        role: 'client', // Default role
      });
    }

    return existingUser || await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });
  } catch (error) {
    console.error('Error syncing user with database:', error);
    throw error;
  }
} 