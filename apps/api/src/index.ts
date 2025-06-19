import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
// CLERK_DISABLED_TEMP: import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { appRouter } from './router';
import { createContext } from './context';
import { handleClerkWebhook } from './webhooks/clerk';
import nextAuthHandler from './auth';
import bcrypt from 'bcryptjs';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';
import recipesRouter from './routers/recipes';

// Debug environment variables
console.log('Environment variables:', {
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set',
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ? 'Set' : 'Not set',
  RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not set'
});

const app = express();

// Enable CORS
debugger;
app.use(cors({
  origin: '*', // Geliştirme için tüm originlere izin ver
  credentials: true
}));

// CLERK_DISABLED_TEMP: app.use(ClerkExpressWithAuth());

// Register webhook route
// CLERK_DISABLED_TEMP: app.post('/webhooks/clerk', express.json({ limit: '10mb' }), handleClerkWebhook);

// NextAuth.js route
app.use('/api/auth', (req, res, next) => {
  // NextAuth expects req.query, req.body, req.cookies
  // Express 4.x+ parses query and body by default
  return nextAuthHandler(req, res);
});

// Register endpoint
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');
    const [user] = await db.insert(users).values({
      email,
      password: hashed,
      first_name: firstName,
      last_name: lastName,
      role: 'subscriber_basic',
    }).returning();
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Recipes routes
app.use('/api/recipes', recipesRouter);

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

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
}); 