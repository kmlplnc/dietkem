"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@trpc/server/adapters/express");
const clerk = __importStar(require("@clerk/express"));
const router_1 = require("./router");
const context_1 = require("./context");
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)());
// Add Clerk authentication middleware
app.use(clerk.requireAuth());
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
