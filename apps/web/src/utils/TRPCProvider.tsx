import { ReactNode, useState, useEffect } from 'react';
import { trpc, createTRPCClient } from './trpc';

// TRPC Provider component that uses a single client with dynamic token reading
export const TRPCProvider = ({ children, queryClient }: { children: ReactNode; queryClient: any }) => {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  });

  // Initialize client
  useEffect(() => {
    const initClient = async () => {
      try {
        const newClient = await createTRPCClient();
        setClient(newClient);
      } catch (error) {
        console.error('Failed to create tRPC client:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initClient();
  }, []);

  useEffect(() => {
    const checkToken = () => {
      try {
        const currentToken = localStorage.getItem('token');
        if (currentToken !== token) {
          console.log('TRPCProvider - Token changed, recreating client');
          setToken(currentToken);
          // Recreate client when token changes
          createTRPCClient().then(newClient => {
            setClient(newClient);
          }).catch(error => {
            console.error('Failed to recreate tRPC client:', error);
          });
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    // Check token every 2 seconds instead of 100ms
    const interval = setInterval(checkToken, 2000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading || !client) {
    return <div>Loading...</div>;
  }

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}; 