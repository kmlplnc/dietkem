import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function syncUserWithDatabase(clerkUser) {
  try {
    // Check if user exists in our database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });

    if (!existingUser) {
      // Create new user in our database
      await db.insert(users).values({
        id: crypto.randomUUID(),
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        role: 'subscriber_basic',
        subscriptionPlan: 'free',
      });
    }

    return existingUser || await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });
  } catch (error) {
    console.error('Error syncing user with database:', error);
    throw error;
  }
} 