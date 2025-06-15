import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import { UserRole } from './middleware/auth';

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Helper to create role-protected procedures
const createRoleProtectedProcedure = (allowedRoles: UserRole[]) => {
  return t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.userRole || !allowedRoles.includes(ctx.userRole)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      });
    }
    return next();
  });
};

// Role-specific procedures
export const dietitianProcedure = createRoleProtectedProcedure(['dietitian']);
export const clientProcedure = createRoleProtectedProcedure(['client']); 