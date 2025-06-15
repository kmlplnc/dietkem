"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const trpc_1 = require("../trpc");
const db_1 = require("@dietkem/db");
const schema_1 = require("@dietkem/db/schema");
const server_1 = require("@trpc/server");
const drizzle_orm_1 = require("drizzle-orm");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
// Create a middleware to check if user is authenticated
const isAuthed = (0, trpc_1.middleware)(({ next, ctx }) => {
    if (!ctx.userId) {
        throw new server_1.TRPCError({
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
const protectedProcedure = trpc_1.publicProcedure.use(isAuthed);
exports.usersRouter = (0, trpc_1.router)({
    list: protectedProcedure
        .query(async ({ ctx }) => {
        try {
            // Get users from our database
            const dbUsers = await db_1.db.query.users.findMany();
            return dbUsers.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.created_at,
            }));
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }),
    me: protectedProcedure
        .query(async ({ ctx }) => {
        try {
            // Get user from Clerk
            const clerkUser = await clerk_sdk_node_1.clerkClient.users.getUser(ctx.userId);
            const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
            if (!userEmail) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User email not found',
                });
            }
            // Try to find user by clerk_id first, then by email
            const user = await db_1.db.query.users.findFirst({
                where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.clerk_id, ctx.userId), (0, drizzle_orm_1.eq)(schema_1.users.email, userEmail)),
            });
            if (!user) {
                throw new server_1.TRPCError({
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
        }
        catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }),
});
