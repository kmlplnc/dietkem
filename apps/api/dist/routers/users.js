"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const trpc_1 = require("../trpc");
const db_1 = require("@dietkem/db");
const schema_1 = require("@dietkem/db/schema");
const server_1 = require("@trpc/server");
const drizzle_orm_1 = require("drizzle-orm");
exports.usersRouter = (0, trpc_1.router)({
    list: trpc_1.publicProcedure
        .query(async ({ ctx }) => {
        try {
            // Only allow authenticated users
            if (!ctx.userId) {
                throw new server_1.TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to view users',
                });
            }
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
    me: trpc_1.publicProcedure
        .query(async ({ ctx }) => {
        if (!ctx.userId) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You must be logged in',
            });
        }
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.clerk_id, ctx.userId),
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
    }),
});
