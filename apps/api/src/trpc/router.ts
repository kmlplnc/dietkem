import { publicProcedure, router } from '../trpc';

export const appRouter = router({
  users: router({
    list: publicProcedure.query(async () => {
      // TODO: Implement user list query
      return [
        {
          id: '1',
          email: 'user1@example.com',
          role: 'admin',
          createdAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          role: 'user',
          createdAt: new Date(),
        },
      ];
    }),
    me: publicProcedure.query(async () => {
      // TODO: Implement me query
      return {
        id: '1',
        email: 'user1@example.com',
        role: 'admin',
        createdAt: new Date(),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter; 