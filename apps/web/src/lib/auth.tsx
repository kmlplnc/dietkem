import { useState, useEffect, createContext, useContext } from 'react';
import { trpc } from '../utils/trpc';

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    try {
      const storedToken = localStorage.getItem('token');
      return storedToken && storedToken.trim() !== '' ? storedToken : null;
    } catch {
      return null;
    }
  });

  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  
  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: !!token && token.trim() !== '', // Only run if token exists and is not empty
    retry: false,
    onSuccess: (data) => {
      console.log('AuthProvider - User authenticated:', data?.email);
      setUser(data);
      setLoading(false);
    },
    onError: (error) => {
      console.log('AuthProvider - Authentication error:', error.message);
      // Only remove token if it's a specific authentication error
      if (error.message?.includes('No token provided') || error.message?.includes('Invalid token')) {
        console.log('AuthProvider - Removing invalid token');
        try {
          localStorage.removeItem('token');
        } catch {
          // Ignore localStorage errors
        }
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    }
  });

  // Initialize auth state on mount
  useEffect(() => {
    if (!token || token.trim() === '') {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider - Login attempt for:', email);
      
      // Try tRPC first
      try {
        const result = await loginMutation.mutateAsync({ email, password });
        console.log('AuthProvider - Login successful via tRPC');
        try {
          localStorage.setItem('token', result.token);
        } catch {
          console.warn('AuthProvider - Could not save token to localStorage');
        }
        setToken(result.token);
        setUser(result.user);
        return { success: true };
      } catch (tRPCError: any) {
        console.log('AuthProvider - tRPC login failed, trying direct API:', tRPCError.message);
        
        // Fallback to direct API call in production
        if (import.meta.env.PROD) {
          try {
            const response = await fetch('https://dietkem.onrender.com/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            if (!text) {
              throw new Error('Empty response from API');
            }
            
            const result = JSON.parse(text);
            console.log('AuthProvider - Login successful via direct API');
            
            try {
              localStorage.setItem('token', result.token);
            } catch {
              console.warn('AuthProvider - Could not save token to localStorage');
            }
            setToken(result.token);
            setUser(result.user);
            return { success: true };
          } catch (directApiError: any) {
            console.log('AuthProvider - Direct API login also failed:', directApiError.message);
            throw tRPCError; // Throw the original tRPC error
          }
        } else {
          throw tRPCError;
        }
      }
    } catch (error: any) {
      console.log('AuthProvider - Login error:', error.message);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('AuthProvider - Register attempt for:', email);
      const result = await registerMutation.mutateAsync({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      console.log('AuthProvider - Registration successful');
      try {
        localStorage.setItem('token', result.token);
      } catch {
        console.warn('AuthProvider - Could not save token to localStorage');
      }
      setToken(result.token);
      setUser(result.user);
      return { success: true };
    } catch (error: any) {
      console.log('AuthProvider - Registration error:', error.message);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('AuthProvider - Logout called');
    try {
      localStorage.removeItem('token');
    } catch {
      console.warn('AuthProvider - Could not remove token from localStorage');
    }
    setToken(null);
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    loading,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 