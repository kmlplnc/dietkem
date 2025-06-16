import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { syncUserWithDatabase } from '../middleware/auth';

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useClerkAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncUser() {
      if (isLoaded && isSignedIn && user) {
        try {
          const syncedUser = await syncUserWithDatabase(user);
          setDbUser(syncedUser);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
      setLoading(false);
    }

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return {
    user: dbUser,
    clerkUser: user,
    isLoaded: isLoaded && !loading,
    isSignedIn,
  };
} 