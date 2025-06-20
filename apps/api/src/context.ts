import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  // Debug auth headers
  console.log('Auth headers:', {
    authorization: req.headers.authorization,
  });

  // Try JWT authentication
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      console.log('JWT decoded:', decoded);
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.userId),
      });

      console.log('User found by ID:', user);

      if (user) {
        return {
          userId: user.id.toString(),
          user,
          userRole: user.role,
          db,
          headers: req.headers,
          authType: 'jwt' as const,
        };
      } else {
        console.log('No user found with ID:', decoded.userId);
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
    }
  }

  // If not authenticated, return context without user info
  return {
    userId: null,
    user: null,
    userRole: null,
    db,
    headers: req.headers,
    authType: null,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>; 