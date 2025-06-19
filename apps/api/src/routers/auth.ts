import { router, publicProcedure } from '../trpc';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { email, password, firstName, lastName } = input;
        console.log('Register input:', input);

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const [newUser] = await db.insert(users).values({
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          role: 'subscriber_basic',
        }).returning();
        console.log('New user inserted:', newUser);

        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: newUser.id, 
            email: newUser.email,
            role: newUser.role 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            role: newUser.role,
          },
          token,
        };
      } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Registration failed',
        });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { email, password } = input;

        // Find user by email
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.password) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: user.id, 
            email: user.email,
            role: user.role 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return {
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
      } catch (error) {
        console.error('Login error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Login failed',
        });
      }
    }),

  me: publicProcedure
    .query(async ({ ctx }) => {
      try {
        // Get user from JWT token
        const authHeader = ctx.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'No token provided',
          });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        const user = await db.query.users.findFirst({
          where: eq(users.id, decoded.userId),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          avatar_url: user.avatar_url,
        };
      } catch (error) {
        console.error('Get user error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid token',
        });
      }
    }),

  startTrial: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        // Get user from JWT token
        const authHeader = ctx.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'No token provided',
          });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = decoded.userId;

        if (!userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }

        // Get current user
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Check if user already used trial
        if (user.trial_used === 'true') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Trial already used',
          });
        }

        // Check if user already has an active trial
        if (user.trial_started_at) {
          const trialEndDate = new Date(user.trial_started_at);
          trialEndDate.setDate(trialEndDate.getDate() + 7);
          
          if (trialEndDate > new Date()) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Trial already active',
            });
          }
        }

        // Start trial
        const trialStartDate = new Date();
        const [updatedUser] = await db
          .update(users)
          .set({
            trial_started_at: trialStartDate,
            trial_used: 'true',
            role: 'subscriber_basic', // Give basic access during trial
          })
          .where(eq(users.id, userId))
          .returning();

        return {
          success: true,
          trial_started_at: updatedUser.trial_started_at,
          trial_end_date: new Date(trialStartDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          message: 'Trial started successfully',
        };
      } catch (error) {
        console.error('Start trial error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to start trial',
        });
      }
    }),
}); 