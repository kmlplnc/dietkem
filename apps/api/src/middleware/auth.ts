import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Define user roles
export type UserRole = 'dietitian' | 'client';

// Extend Express Request type to include user role and auth
declare global {
  namespace Express {
    interface Request {
      userRole?: UserRole;
      auth?: {
        userId?: string;
        user?: {
          publicMetadata?: {
            role?: UserRole;
          };
        };
      };
    }
  }
}

// Middleware to check user role
export const requireRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user role from Clerk metadata
      const userRole = req.auth?.user?.publicMetadata?.role as UserRole;
      
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
      }

      // Attach role to request for use in route handlers
      req.userRole = userRole;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Export Clerk's authentication middleware
export const requireAuth = ClerkExpressRequireAuth(); 