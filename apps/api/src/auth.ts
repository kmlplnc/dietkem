import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from './middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
    first_name: string;
    last_name: string;
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: JWT_SECRET,
};

const handler = NextAuth(authOptions);

export default handler; 