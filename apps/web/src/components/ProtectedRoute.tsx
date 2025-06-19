import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';
import { trpc } from '../utils/trpc';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'superadmin' | 'dietitian' | 'client';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  // CLERK_DISABLED_TEMP: const { data: currentUser, isLoading } = trpc.users.getCurrentUser.useQuery(undefined, {
  // CLERK_DISABLED_TEMP:   enabled: !!user?.id,
  // CLERK_DISABLED_TEMP: });

  // CLERK_DISABLED_TEMP: if (!isLoaded || isLoading) {
  // CLERK_DISABLED_TEMP:   return <div>Loading...</div>;
  // CLERK_DISABLED_TEMP: }

  // CLERK_DISABLED_TEMP: if (!user) {
  // CLERK_DISABLED_TEMP:   return <Navigate to="/sign-in" replace />;
  // CLERK_DISABLED_TEMP: }

  // CLERK_DISABLED_TEMP: if (requiredRole && currentUser) {
  // CLERK_DISABLED_TEMP:   // Allow superadmin to access everything
  // CLERK_DISABLED_TEMP:   if (currentUser.role === 'superadmin') {
  // CLERK_DISABLED_TEMP:     return <>{children}</>;
  // CLERK_DISABLED_TEMP:   }

  // CLERK_DISABLED_TEMP:   // For admin routes, allow both admin and superadmin
  // CLERK_DISABLED_TEMP:   if (requiredRole === 'admin' && currentUser.role === 'admin') {
  // CLERK_DISABLED_TEMP:     return <>{children}</>;
  // CLERK_DISABLED_TEMP:   }

  // CLERK_DISABLED_TEMP:   // For other roles, require exact match
  // CLERK_DISABLED_TEMP:   if (currentUser.role !== requiredRole) {
  // CLERK_DISABLED_TEMP:     return <Navigate to="/" replace />;
  // CLERK_DISABLED_TEMP:   }
  // CLERK_DISABLED_TEMP: }

  // TEMPORARY: Allow all access during migration
  return <>{children}</>;
};

export default ProtectedRoute; 