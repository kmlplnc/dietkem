"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
exports.appRouter = (0, trpc_1.router)({
    users: (0, trpc_1.router)({
        list: trpc_1.publicProcedure.query(async () => {
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
        me: trpc_1.publicProcedure.query(async () => {
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
