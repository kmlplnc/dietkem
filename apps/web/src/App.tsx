import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { Dashboard } from "./pages/Dashboard";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import LandingPage from "./pages/landing";
import WelcomePage from './pages/welcome';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
        }),
      ],
    })
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/welcome"
          element={
            <SignedIn>
              <WelcomePage />
            </SignedIn>
          }
        />
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/sign-in"
          element={
            <SignedOut>
              <SignInPage />
            </SignedOut>
          }
        />
        <Route
          path="/sign-up"
          element={
            <SignedOut>
              <SignUpPage />
            </SignedOut>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 