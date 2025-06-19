import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';

// Define user roles
export type UserRole =
  | 'subscriber_basic'
  | 'subscriber_pro'
  | 'clinic_admin'
  | 'dietitian_team_member'
  | 'admin'
  | 'superadmin';

// Extend Express Request type to include user role and auth
declare global {
  namespace Express {
    interface Request {
      userRole?: UserRole;
      auth?: {
        userId?: string;
      };
      user?: {
        userId?: string | number;
      };
    }
  }
}

// Function to sync user with database
export async function syncUserWithDatabase(clerkUser: any) {
  try {
    // Check if user exists in our database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerk_id, clerkUser.id),
    });

    if (!existingUser) {
      // Create new user in our database
      await db.insert(users).values({
        clerk_id: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        role: 'subscriber_basic', // Default role
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        username: clerkUser.username || '',
      });
    }

    return existingUser || await db.query.users.findFirst({
      where: eq(users.clerk_id, clerkUser.id),
    });
  } catch (error) {
    console.error('Error syncing user with database:', error);
    throw error;
  }
}

// Middleware to check user role
export const requireRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ error: 'Unauthorized: No user ID' });
      }

      // Get user from database
      const user = await db.query.users.findFirst({
        where: eq(users.clerk_id, req.auth.userId),
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found in database' });
      }

      if (!roles.includes(user.role as UserRole)) {
        return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
      }

      // Attach role to request for use in route handlers
      req.userRole = user.role as UserRole;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Export Clerk's authentication middleware
export const requireAuth = ClerkExpressRequireAuth();

// Geliştirme/test için basit bir authenticateToken middleware
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Gerçek uygulamada JWT decode işlemi yapılmalı
    // Şimdilik basit bir kontrol yapıyoruz
    if (token === 'test-token') {
      // Gerçek kullanıcı ID'si kullanıyoruz
      req.user = { userId: 4 };
      next();
    } else {
      return res.status(403).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
} 