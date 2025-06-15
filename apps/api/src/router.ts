import { z } from 'zod';
import { router, publicProcedure, dietitianProcedure, clientProcedure } from './trpc';
import { usersRouter } from './routers/users';

export const appRouter = router({
  // Public routes
  health: publicProcedure.query(() => 'ok'),
  users: usersRouter,

  // Dietitian-only routes
  createClient: dietitianProcedure
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
});

export type AppRouter = typeof appRouter; 