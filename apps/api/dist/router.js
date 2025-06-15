"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("./trpc");
const users_1 = require("./routers/users");
exports.appRouter = (0, trpc_1.router)({
    // Public routes
    health: trpc_1.publicProcedure.query(() => 'ok'),
    users: users_1.usersRouter,
    // Dietitian-only routes
    createClient: trpc_1.dietitianProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        name: zod_1.z.string(),
    }))
        .mutation(async () => {
        // Implementation for creating a new client
        return { success: true };
    }),
    getClients: trpc_1.dietitianProcedure
        .query(async () => {
        // Implementation for getting all clients
        return [];
    }),
    createPlan: trpc_1.dietitianProcedure
        .input(zod_1.z.object({
        clientId: zod_1.z.string(),
        plan: zod_1.z.object({
        // Add plan schema here
        }),
    }))
        .mutation(async () => {
        // Implementation for creating a diet plan
        return { success: true };
    }),
    // Client-only routes
    getMyPlans: trpc_1.clientProcedure
        .query(async () => {
        // Implementation for getting client's own plans
        return [];
    }),
    getMyProfile: trpc_1.clientProcedure
        .query(async () => {
        // Implementation for getting client's profile
        return {};
    }),
});
