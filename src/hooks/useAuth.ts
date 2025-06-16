import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { syncUserWithDatabase } from '../middleware/auth';
import type { User } from '@dietkem/db/src/schema';

export function useAuth() {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkAuth();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncUser() {
      if (isLoaded && isSignedIn && clerkUser) {
        try {
          const syncedUser = await syncUserWithDatabase(clerkUser);
          setDbUser(syncedUser);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
      setLoading(false);
    }

    syncUser();
  }, [isLoaded, isSignedIn, clerkUser]);

  return {
    user: dbUser,
    clerkUser,
    isLoaded: isLoaded && !loading,
    isSignedIn,
  };
} 