"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.requireRole = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
// Middleware to check user role
const requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            // Get user role from Clerk metadata
            const userRole = req.auth?.user?.publicMetadata?.role;
            if (!userRole || !roles.includes(userRole)) {
                return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
            }
            // Attach role to request for use in route handlers
            req.userRole = userRole;
            next();
        }
        catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};
exports.requireRole = requireRole;
// Export Clerk's authentication middleware
exports.requireAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
