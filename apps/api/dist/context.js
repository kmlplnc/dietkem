"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const express_1 = require("@clerk/express");
const db_1 = require("@dietkem/db");
const schema_1 = require("@dietkem/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createContext = async ({ req, res }) => {
    const userId = req.auth?.userId;
    const userRole = req.auth?.user?.publicMetadata?.role;
    // If user is authenticated, ensure they exist in our database
    if (userId) {
        try {
            // Get user from Clerk
            const clerkUser = await express_1.clerkClient.users.getUser(userId);
            // Check if user exists in our database
            const existingUser = await db_1.db.query.users.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.users.clerk_id, userId),
            });
            if (!existingUser) {
                // Create user in our database
                await db_1.db.insert(schema_1.users).values({
                    clerk_id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    role: userRole || 'client', // Default to client if no role is set
                });
            }
        }
        catch (error) {
            console.error('Error syncing user:', error);
        }
    }
    return {
        req,
        res,
        userId,
        userRole,
    };
};
exports.createContext = createContext;
