"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@trpc/server/adapters/express");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const router_1 = require("./router");
const context_1 = require("./context");
// Debug environment variables
console.log('Environment variables:', {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set'
});
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)());
// Add Clerk authentication middleware
app.use((0, clerk_sdk_node_1.ClerkExpressWithAuth)());
// Create tRPC middleware
const trpcMiddleware = (0, express_2.createExpressMiddleware)({
    router: router_1.appRouter,
    createContext: context_1.createContext,
    onError: ({ error, type, path, input }) => {
        console.error('tRPC error:', { error, type, path, input });
        if (error.code === 'UNAUTHORIZED') {
            return {
                status: 401,
                body: { error: 'Unauthorized' }
            };
        }
        return {
            status: 500,
            body: { error: 'Internal server error' }
        };
    }
});
// Use tRPC middleware
app.use('/trpc', trpcMiddleware);
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
        process.exit(1);
    }
    else {
        console.error('Error starting server:', err);
        process.exit(1);
    }
});
