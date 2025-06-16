import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@dietkem/db';
import { users, userRoleEnum } from '@dietkem/db/schema';
import { eq } from 'drizzle-orm';

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  // Debug auth headers
  console.log('Auth headers:', {
    auth: req.auth,
    authorization: req.headers.authorization,
  });

  const userId = req.auth?.userId;
  const userRole = req.auth?.user?.publicMetadata?.role as typeof userRoleEnum.enumValues[number];

  // If user is authenticated, ensure they exist in our database
  if (userId) {
    try {
      // Get user from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      console.log('Clerk user:', clerkUser);
      
      // Check if user exists in our database by email
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, clerkUser.emailAddresses[0]?.emailAddress || ''),
      });

      if (!existingUser) {
        console.log('Creating new user in database');
        // Create user in our database
        await db.insert(users).values({
          clerk_id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          role: userRole || 'subscriber_basic', // Default to subscriber_basic if no role is set
        });
      } else if (!existingUser.clerk_id) {
        console.log('Updating existing user with clerk_id');
        // Update existing user with clerk_id
        await db.update(users)
          .set({ clerk_id: userId })
          .where(eq(users.id, existingUser.id));
      } else {
        console.log('User already exists with clerk_id');
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  }

  return {
    req,
    res,
    userId,
    userRole,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>; 