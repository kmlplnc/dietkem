"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientProcedure = exports.dietitianProcedure = exports.middleware = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
// Initialize tRPC
const t = server_1.initTRPC.context().create();
// Export reusable router and procedure helpers
exports.router = t.router;
exports.publicProcedure = t.procedure;
exports.middleware = t.middleware;
// Helper to create role-protected procedures
const createRoleProtectedProcedure = (allowedRoles) => {
    return t.procedure.use(async ({ ctx, next }) => {
        if (!ctx.userRole || !allowedRoles.includes(ctx.userRole)) {
            throw new server_1.TRPCError({
                code: 'FORBIDDEN',
                message: 'Insufficient permissions',
            });
        }
        return next();
    });
};
// Role-specific procedures
exports.dietitianProcedure = createRoleProtectedProcedure(['dietitian']);
exports.clientProcedure = createRoleProtectedProcedure(['client']);
