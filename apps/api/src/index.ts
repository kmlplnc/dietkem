import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './context';
import nextAuthHandler from './auth';
import bcrypt from 'bcryptjs';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';
import recipesRouter from './routers/recipes';
import jwt from 'jsonwebtoken';

// Debug environment variables
console.log('Environment variables:', {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
});

const app = express();

// Enable CORS with specific origins for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://dietkem-web.onrender.com',
  'https://dietkem.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and network IP addresses for development
    if (allowedOrigins.indexOf(origin) !== -1 || 
        origin.startsWith('http://192.168.') ||
        origin.startsWith('http://10.') ||
        origin.startsWith('http://172.') ||
        origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
  console.log('=== Direct login endpoint called ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ error: 'Missing email or password' });
  }
  
  try {
    console.log('Direct login attempt for:', email);
    
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user || !user.password) {
      console.log('Invalid user or password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      NEXTAUTH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Direct login successful for:', email);
    console.log('Generated token length:', token.length);

    const response = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      token,
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    return res.json(response);
  } catch (error) {
    console.error('Direct login error:', error);
    return res.status(500).json({ 
      error: 'Login failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
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

// Blog endpoints for direct API access
app.get('/api/blogs', (req, res) => {
  // Şimdilik örnek veri
  const samplePosts: any[] = [
    // Eğer hiç blog kalmasın isteniyorsa, bu satırı boş bırak:
    //
    // Eğer orijinal 3 örnek blog kalacaksa, aşağıdaki gibi bırakabilirsiniz:
    // {
    //   id: '1',
    //   title: 'Yapay Zeka ile Diyet Planlaması',
    //   summary: 'Yapay zeka teknolojilerinin diyet planlamasında kullanımı ve avantajları.',
    //   category: 'AI',
    //   author: 'Dr. Mehmet Yılmaz',
    //   date: '2024-03-15',
    //   image: '/assets/blog/ai-diet.png',
    //   status: 'approved',
    //   content: 'Yapay zeka ile diyet planlaması hakkında detaylı içerik burada yer alacak.'
    // },
    // ...
  ];
  
  res.json(samplePosts);
});

app.get('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  
  // Şimdilik örnek veri
  const samplePosts: any[] = [
    // Eğer hiç blog kalmasın isteniyorsa, bu satırı boş bırak:
    //
    // Eğer orijinal 3 örnek blog kalacaksa, aşağıdaki gibi bırakabilirsiniz:
    // {
    //   id: '1',
    //   title: 'Yapay Zeka ile Diyet Planlaması',
    //   summary: 'Yapay zeka teknolojilerinin diyet planlamasında kullanımı ve avantajları.',
    //   category: 'AI',
    //   author: 'Dr. Mehmet Yılmaz',
    //   date: '2024-03-15',
    //   image: '/assets/blog/ai-diet.png',
    //   status: 'approved',
    //   content: 'Yapay zeka ile diyet planlaması hakkında detaylı içerik burada yer alacak.'
    // },
    // ...
  ];
  
  const post = samplePosts.find(post => post.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  
  res.json(post);
});

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server listening on port ${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`tRPC endpoint: http://0.0.0.0:${PORT}/trpc`);
  console.log(`Network access: http://[YOUR_IP]:${PORT}`);
}); 