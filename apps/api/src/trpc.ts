import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import { UserRole } from './middleware/auth';

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not authenticated',
    });
  }
  return next();
});
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
export const dietitianProcedure = createRoleProtectedProcedure(['dietitian_team_member']);
export const clientProcedure = createRoleProtectedProcedure(['subscriber_basic', 'subscriber_pro']);
export const clinicAdminProcedure = createRoleProtectedProcedure(['clinic_admin']);
export const adminProcedure = createRoleProtectedProcedure(['admin', 'superadmin']);

// Export router and types
export { appRouter } from './router';
export type { AppRouter } from './router'; 