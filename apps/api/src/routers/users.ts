import { router, publicProcedure, middleware } from '../trpc';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { TRPCError } from '@trpc/server';
import { eq, or, desc } from 'drizzle-orm';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { z } from 'zod';
import { syncUserWithDatabase } from '../middleware/auth';
import bcrypt from 'bcryptjs';

// Create a middleware to check if user is authenticated
const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

// Create a middleware to check if user is admin
const isAdmin = middleware(async ({ next, ctx }) => {
  if (!ctx.userId || !ctx.userRole) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }

  if (ctx.userRole !== 'admin' && ctx.userRole !== 'superadmin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Create protected procedures
const protectedProcedure = publicProcedure.use(isAuthed);
const adminProcedure = publicProcedure.use(isAdmin);

export const usersRouter = router({
  getCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated',
        });
      }

      try {
        // If we have a user object in context (from JWT auth), return it directly
        if (ctx.user) {
          return {
            id: ctx.user.id,
            email: ctx.user.email,
            name: `${ctx.user.first_name || ''} ${ctx.user.last_name || ''}`.trim() || 'Unnamed User',
            role: ctx.user.role,
            avatar_url: ctx.user.avatar_url,
            first_name: ctx.user.first_name,
            last_name: ctx.user.last_name,
            created_at: ctx.user.created_at,
          };
        }

        // For JWT authentication, get user directly from database
        if (ctx.authType === 'jwt') {
          const user = await db.query.users.findFirst({
            where: eq(users.id, parseInt(ctx.userId)),
          });

          if (!user) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found in database',
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User',
            role: user.role,
            avatar_url: user.avatar_url,
            first_name: user.first_name,
            last_name: user.last_name,
            created_at: user.created_at,
          };
        }

        // For Clerk authentication, try to get user from database first
        let user = await db.query.users.findFirst({
          where: eq(users.clerk_id, ctx.userId),
        });

        if (!user) {
          // If not found by clerk_id, try to get from Clerk and sync
          try {
            const clerkUser = await ctx.clerk.users.getUser(ctx.userId);
            
            // Try to find by email as fallback
            user = await db.query.users.findFirst({
              where: eq(users.email, clerkUser.emailAddresses[0]?.emailAddress || ''),
            });

            if (!user) {
              // Create new user if not found
              const [newUser] = await db.insert(users).values({
                clerk_id: ctx.userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                role: 'subscriber_basic',
                first_name: clerkUser.firstName || '',
                last_name: clerkUser.lastName || '',
                avatar_url: 'https://res.cloudinary.com/dietkem/image/upload/v1/avatar.jpg',
              }).returning();

              user = newUser;
            } else if (!user.clerk_id) {
              // Update existing user with clerk_id
              await db.update(users)
                .set({ 
                  clerk_id: ctx.userId,
                  first_name: clerkUser.firstName || user.first_name,
                  last_name: clerkUser.lastName || user.last_name,
                })
                .where(eq(users.id, user.id));
            }
          } catch (clerkError) {
            console.error('Error fetching from Clerk:', clerkError);
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found in database',
            });
          }
        }

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found in database',
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User',
          role: user.role,
          avatar_url: user.avatar_url,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at,
        };
      } catch (error) {
        console.error('Error in getCurrentUser:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user',
        });
      }
    }),

  list: adminProcedure
    .query(async ({ ctx }) => {
      try {
        const allUsers = await db.query.users.findMany({
          orderBy: (users, { desc }) => [desc(users.created_at)],
        });

        return allUsers.map(user => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User',
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        }));
      } catch (error) {
        console.error('Error in list users:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list users',
        });
      }
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        // For JWT authentication, get user directly from database
        if (ctx.authType === 'jwt') {
          const user = await db.query.users.findFirst({
            where: eq(users.id, parseInt(ctx.userId)),
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
            role: user.role,
            createdAt: user.created_at,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar_url: user.avatar_url,
          };
        }

        // For Clerk authentication
        const clerkUser = await clerkClient.users.getUser(ctx.userId);
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User email not found',
          });
        }

        // Try to find user by clerk_id first, then by email
        const user = await db.query.users.findFirst({
          where: or(
            eq(users.clerk_id, ctx.userId),
            eq(users.email, userEmail)
          ),
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
          role: user.role,
          createdAt: user.created_at,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar_url: user.avatar_url,
        };
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        username: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { clerkId, email, firstName, lastName, username } = input;
        console.log('Updating profile for user:', { clerkId, email });

        // First check if user exists by clerk_id or email
        let existingUser = await db.query.users.findFirst({
          where: or(
            eq(users.clerk_id, clerkId),
            eq(users.email, email)
          ),
        });
        console.log('Existing user:', existingUser);

        // If user doesn't exist, create them
        if (!existingUser) {
          console.log('User not found, creating new user');
          try {
            const [newUser] = await db
              .insert(users)
              .values({
                clerk_id: clerkId,
                email,
                first_name: firstName,
                last_name: lastName,
                username: username || undefined,
                role: 'subscriber_basic', // Default role for new users
                created_at: new Date(),
                updated_at: new Date(),
                avatar_url: 'https://res.cloudinary.com/dietkem/image/upload/v1/avatar.jpg',
              })
              .returning();

            console.log('New user created:', newUser);

            if (!newUser) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create user - no user returned',
              });
            }

            return {
              success: true,
              user: newUser
            };
          } catch (createError) {
            console.error('Error creating user:', createError);
            if (createError instanceof Error && createError.message.includes('users_email_unique')) {
              throw new TRPCError({
                code: 'CONFLICT',
                message: 'A user with this email already exists',
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Failed to create user: ${createError instanceof Error ? createError.message : 'Unknown error'}`,
            });
          }
        }

        // If user exists but with different clerk_id, update clerk_id
        if (existingUser.clerk_id !== clerkId) {
          console.log('Updating clerk_id for existing user');
          try {
            const [updatedUser] = await db
              .update(users)
              .set({
                clerk_id: clerkId,
                first_name: firstName,
                last_name: lastName,
                ...(username !== undefined ? { username } : {}),
                updated_at: new Date(),
              })
              .where(eq(users.email, email))
              .returning();

            console.log('User updated with new clerk_id:', updatedUser);

            if (!updatedUser) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update user - no user returned',
              });
            }

            return {
              success: true,
              user: updatedUser
            };
          } catch (updateError) {
            console.error('Error updating user:', updateError);
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Failed to update user: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`,
            });
          }
        }

        // Update existing user
        console.log('Updating existing user');
        try {
          const [updatedUser] = await db
            .update(users)
            .set({
              first_name: firstName,
              last_name: lastName,
              ...(username !== undefined ? { username } : {}),
              updated_at: new Date(),
            })
            .where(eq(users.clerk_id, clerkId))
            .returning();

          console.log('User updated:', updatedUser);

          if (!updatedUser) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to update user - no user returned',
            });
          }

          return {
            success: true,
            user: updatedUser
          };
        } catch (updateError) {
          console.error('Error updating user:', updateError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update user: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`,
          });
        }
      } catch (error) {
        console.error('Error in updateProfile:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to update user profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  updateRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(['subscriber_basic', 'subscriber_pro', 'clinic_admin', 'dietitian_team_member', 'admin', 'superadmin']),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log('updateRole called with:', { ctxUserId: ctx.userId, input });
      try {
        const [updatedUser] = await db.update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.userId))
          .returning();
        console.log('updateRole: update result:', updatedUser);

        if (!updatedUser) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update user role - no user returned',
          });
        }

        return { success: true, user: updatedUser };
      } catch (error) {
        console.error('Error in updateRole:', error, (error as Error)?.stack);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user role',
        });
      }
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(users).where(eq(users.id, input.userId));
      return { success: true };
    }),

  updateAvatar: protectedProcedure
    .input(z.object({
      avatarUrl: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
      const [updatedUser] = await db
        .update(users)
        .set({ avatar_url: input.avatarUrl, updated_at: new Date() })
        .where(
          or(
            eq(users.clerk_id, ctx.userId),
            eq(users.id, Number(ctx.userId))
          )
        )
        .returning();
      if (!updatedUser) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      return { success: true, avatarUrl: updatedUser.avatar_url };
    }),

  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const { email, password, name } = input;
      // Check if user exists
      const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' });
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
        avatar_url: 'https://res.cloudinary.com/dietkem/image/upload/v1/avatar.jpg',
      }).returning();
      // JWT üret
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return { id: user.id, email: user.email, token };
    }),

  getTrialInfo: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        if (!ctx.userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }

        // Get user from database
        const user = await db.query.users.findFirst({
          where: eq(users.id, parseInt(ctx.userId)),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        const now = new Date();
        let trialStatus = 'not_started';
        let trialEndDate = null;
        let canStartTrial = false;

        if (user.trial_used === 'true' && user.trial_started_at) {
          const trialStart = new Date(user.trial_started_at);
          trialEndDate = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          if (trialEndDate > now) {
            trialStatus = 'active';
          } else {
            trialStatus = 'expired';
          }
        } else {
          canStartTrial = true;
        }

        return {
          trial_used: user.trial_used === 'true',
          trial_started_at: user.trial_started_at,
          trial_end_date: trialEndDate,
          trial_status: trialStatus,
          can_start_trial: canStartTrial,
        };
      } catch (error) {
        console.error('Get trial info error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get trial info',
        });
      }
    }),

  getSubscriptionInfo: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(ctx.userId)),
      });
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const now = new Date();
      let subscriptionStatus = 'none';
      let subscriptionEndDate = null;

      // Check if user has an active subscription
      if (user.first_subscription_started_at) {
        const startDate = new Date(user.first_subscription_started_at);
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        
        if (endDate > now) {
          subscriptionStatus = 'active';
          subscriptionEndDate = endDate;
        } else {
          subscriptionStatus = 'expired';
          subscriptionEndDate = endDate;
        }
      }

      return {
        canGetFreeMonth: !user.first_subscription_started_at,
        first_subscription_started_at: user.first_subscription_started_at,
        subscription_status: subscriptionStatus,
        subscription_end_date: subscriptionEndDate,
      };
    }),

  startFreeMonth: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        if (!ctx.userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }

        // Get current user
        const user = await db.query.users.findFirst({
          where: eq(users.id, parseInt(ctx.userId)),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Check if user already has a subscription started
        if (user.first_subscription_started_at) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Free month already used',
          });
        }

        // Start free month by setting first_subscription_started_at
        const [updatedUser] = await db
          .update(users)
          .set({
            first_subscription_started_at: new Date(),
            updated_at: new Date(),
          })
          .where(eq(users.id, parseInt(ctx.userId)))
          .returning();

        if (!updatedUser) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to start free month',
          });
        }

        return {
          success: true,
          first_subscription_started_at: updatedUser.first_subscription_started_at,
          free_month_end_date: new Date(updatedUser.first_subscription_started_at!.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from start
        };
      } catch (error) {
        console.error('Start free month error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to start free month',
        });
      }
    }),
}); 