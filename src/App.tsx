
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { MainRoutes } from "@/routes/mainRoutes";
import { AuthRoutes } from "@/routes/authRoutes";
import { ProtectedRoute } from "@/routes/protectedRoute";
import { GuestRoute } from "@/routes/guestRoute";
import { PATHS } from "@/routes/paths";
import { useAutoCreateClient } from "@/hooks/useAutoCreateClient";

function App() {
  useAutoCreateClient();
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;
  const [queryClient] = useState(() => new QueryClient());

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<GuestRoute isAuthenticated={isAuthenticated} />}>
            {AuthRoutes}
          </Route>

          {/* Main Routes */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} redirectTo={PATHS.LOGIN} />}>
            {MainRoutes}
          </Route>

          {/* Redirect to dashboard if authenticated, otherwise to login */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={PATHS.DASHBOARD} replace />
              ) : (
                <Navigate to={PATHS.LOGIN} replace />
              )
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
