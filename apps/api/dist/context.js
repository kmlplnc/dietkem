"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const db_1 = require("@dietkem/db");
const schema_1 = require("@dietkem/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const createContext = async ({ req, res }) => {
    // Debug auth headers
    console.log('Auth headers:', {
        auth: req.auth,
        authorization: req.headers.authorization,
    });
    const userId = req.auth?.userId;
    const userRole = req.auth?.user?.publicMetadata?.role;
    // If user is authenticated, ensure they exist in our database
    if (userId) {
        try {
            // Get user from Clerk
            const clerkUser = await clerk_sdk_node_1.clerkClient.users.getUser(userId);
            console.log('Clerk user:', clerkUser);
            // Check if user exists in our database by email
            const existingUser = await db_1.db.query.users.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.users.email, clerkUser.emailAddresses[0]?.emailAddress || ''),
            });
            if (!existingUser) {
                console.log('Creating new user in database');
                // Create user in our database
                await db_1.db.insert(schema_1.users).values({
                    clerk_id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    role: userRole || 'client', // Default to client if no role is set
                });
            }
            else if (!existingUser.clerk_id) {
                console.log('Updating existing user with clerk_id');
                // Update existing user with clerk_id
                await db_1.db.update(schema_1.users)
                    .set({ clerk_id: userId })
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, existingUser.id));
            }
            else {
                console.log('User already exists with clerk_id');
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
