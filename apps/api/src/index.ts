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
import jwt from 'jsonwebtoken';

// Debug environment variables
console.log('Environment variables:', {
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set',
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ? 'Set' : 'Not set',
  RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not set'
});

const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Geliştirme için tüm originlere izin ver
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC health check endpoint
app.get('/trpc', (req, res) => {
  res.json({ 
    status: 'tRPC endpoint is working',
    timestamp: new Date().toISOString(),
    availableProcedures: Object.keys(appRouter._def.procedures)
  });
});

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

// Direct login endpoint for fallback
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  
  try {
    console.log('Direct login attempt for:', email);
    
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Direct login successful for:', email);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      token,
    });
  } catch (error) {
    console.error('Direct login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

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

// Create tRPC middleware with better error handling
const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error, type, path, input, ctx, req }) => {
    console.error('tRPC error:', { 
      error: error.message, 
      code: error.code,
      type, 
      path, 
      input,
      url: req.url,
      method: req.method,
      headers: req.headers
    });
    
    if (error.code === 'UNAUTHORIZED') {
      return {
        status: 401,
        body: { error: 'Unauthorized' }
      };
    }
    
    return {
      status: 500,
      body: { error: 'Internal server error', message: error.message }
    };
  }
});

// Use tRPC middleware
app.use('/trpc', trpcMiddleware);

// Add a simple test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'API server is running!', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`tRPC endpoint: http://localhost:${port}/trpc`);
}); 