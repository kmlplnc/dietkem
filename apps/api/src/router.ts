import { z } from 'zod';
import { router, publicProcedure, dietitianProcedure, clientProcedure } from './trpc';
import { usersRouter } from './routers/users';
import { blogsRouter } from './routers/blogs';
import { authRouter } from './routers/auth';
import { clientsRouter } from './routers/clients';
import { measurementsRouter } from './routers/measurements';
import { db } from '@dietkem/db';
import { users as dbUsers } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';

export const appRouter = router({
  // Public routes
  health: publicProcedure.query(() => 'ok'),
  users: usersRouter,
  blogs: blogsRouter,
  auth: authRouter,
  clients: clientsRouter,
  measurements: measurementsRouter,

  // Dietitian-only routes
  addClient: dietitianProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string(),
    }))
    .mutation(async () => {
      // Implementation for creating a new client
      return { success: true };
    }),

  getClients: dietitianProcedure
    .query(async () => {
      // Implementation for getting all clients
      return [];
    }),

  createPlan: dietitianProcedure
    .input(z.object({
      clientId: z.string(),
      plan: z.object({
        // Add plan schema here
      }),
    }))
    .mutation(async () => {
      // Implementation for creating a diet plan
      return { success: true };
    }),

  // Client-only routes
  getMyPlans: clientProcedure
    .query(async () => {
      // Implementation for getting client's own plans
      return [];
    }),

  getMyProfile: clientProcedure
    .query(async () => {
      // Implementation for getting client's profile
      return {};
    }),

  // Profile update route
  updateProfile: clientProcedure
    .input(z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error('User not authenticated');
      }

      try {
        await db.update(dbUsers)
          .set({
            email: input.email,
            first_name: input.firstName,
            last_name: input.lastName,
            username: input.username,
            updated_at: new Date(),
          })
          .where(eq(dbUsers.clerk_id, ctx.userId));

        return { message: 'Profile updated successfully' };
      } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
      }
    }),
});

export type AppRouter = typeof appRouter; 