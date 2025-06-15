import { router, publicProcedure, middleware } from '../trpc';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/schema';
import { TRPCError } from '@trpc/server';
import { eq, or } from 'drizzle-orm';
import { clerkClient } from '@clerk/clerk-sdk-node';

// Create a middleware to check if user is authenticated
const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

// Create a protected procedure
const protectedProcedure = publicProcedure.use(isAuthed);

export const usersRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        // Get users from our database
        const dbUsers = await db.query.users.findMany();
        
        return dbUsers.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        // Get user from Clerk
        const clerkUser = await clerkClient.users.getUser(ctx.userId);
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User email not found',
          });
        }

        // Try to find user by clerk_id first, then by email
        const user = await db.query.users.findFirst({
          where: or(
            eq(users.clerk_id, ctx.userId),
            eq(users.email, userEmail)
          ),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        };
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    }),
}); 