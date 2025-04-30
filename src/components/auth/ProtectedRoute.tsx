
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    // Only determine redirect after loading is complete
    if (!isLoading && !user) {
      setShouldRedirect(true);
    }
  }, [isLoading, user]);

  // When loading, show a spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // If no authenticated user and not loading, redirect
  if (shouldRedirect) {
    // Store the current location for redirection after login
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
