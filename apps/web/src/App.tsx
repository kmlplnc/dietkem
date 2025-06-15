import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import { Dashboard } from "./pages/Dashboard";
import { useAuth, useClerk } from "@clerk/clerk-react";

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { getToken, isSignedIn } = useAuth();
  const { loaded } = useClerk();

  // Create TRPC client
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3001/trpc",
        async headers() {
          const token = await getToken();
          return {
            Authorization: token ? `Bearer ${token}` : "",
          };
        },
      }),
    ],
  });

  // Show loading state while Clerk is initializing
  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isSignedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
            <Route
              path="/sign-in"
              element={
                isSignedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignInPage />
                )
              }
            />
            <Route
              path="/sign-up"
              element={
                isSignedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignUpPage />
                )
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

export default App; 