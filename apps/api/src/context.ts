import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@dietkem/db';
import { users, userRoleEnum } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  // Debug auth headers
  console.log('Auth headers:', {
    auth: req.auth,
    authorization: req.headers.authorization,
  });

  // Try JWT authentication first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      console.log('JWT decoded:', decoded);
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.userId),
      });

      console.log('User found by ID:', user);

      if (user) {
        return {
          userId: user.id.toString(),
          user,
          userRole: user.role,
          clerk: clerkClient,
          headers: req.headers,
          authType: 'jwt' as const,
        };
      } else {
        console.log('No user found with ID:', decoded.userId);
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
    }
  }

  // Fall back to Clerk authentication
  const userId = req.auth?.userId;

  // If user is authenticated, ensure they exist in our database
  if (userId) {
    try {
      // Get user from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      console.log('Clerk user:', clerkUser);
      
      // Check if user exists in our database by clerk_id first
      let existingUser = await db.query.users.findFirst({
        where: eq(users.clerk_id, userId),
      });

      // If not found by clerk_id, try to find by email
      if (!existingUser && clerkUser.emailAddresses[0]?.emailAddress) {
        existingUser = await db.query.users.findFirst({
          where: eq(users.email, clerkUser.emailAddresses[0].emailAddress),
        });
      }

      // If user exists in database, return context with user info
      if (existingUser) {
        return {
          userId,
          user: existingUser,
          userRole: existingUser.role,
          clerk: clerkClient,
          headers: req.headers,
          authType: 'clerk' as const,
        };
      }

      // If user doesn't exist in database, create them
      const [newUser] = await db.insert(users).values({
        clerk_id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        role: 'subscriber_basic',
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        username: clerkUser.username || '',
      }).returning();

      return {
        userId,
        user: newUser,
        userRole: newUser.role,
        clerk: clerkClient,
        headers: req.headers,
        authType: 'clerk' as const,
      };
    } catch (error) {
      console.error('Error in createContext:', error);
      return {
        userId: null,
        user: null,
        userRole: null,
        clerk: clerkClient,
        headers: req.headers,
        authType: null,
      };
    }
  }

  // If not authenticated, return context without user info
  return {
    userId: null,
    user: null,
    userRole: null,
    clerk: clerkClient,
    headers: req.headers,
    authType: null,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>; 