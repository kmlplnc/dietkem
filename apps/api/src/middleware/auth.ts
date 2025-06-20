import { Request, Response, NextFunction } from 'express';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
      user?: {
        id: number;
        email: string;
        role: UserRole;
        first_name: string;
        last_name: string;
      };
    }
  }
}

// JWT authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to check user role
export const requireRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: No user' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
      }

      // Attach role to request for use in route handlers
      req.userRole = req.user.role;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Require authentication middleware
export const requireAuth = authenticateToken;

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