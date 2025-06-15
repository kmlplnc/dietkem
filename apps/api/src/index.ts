import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { appRouter } from './router';
import { createContext } from './context';

// Debug environment variables
console.log('Environment variables:', {
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set'
});

const app = express();

// Enable CORS
app.use(cors());

// Add Clerk authentication middleware
app.use(ClerkExpressWithAuth());

// Create tRPC middleware
const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
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
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}); 