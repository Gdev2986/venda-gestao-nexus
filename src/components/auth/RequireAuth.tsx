
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { PATHS } from "@/routes/paths";

const RequireAuth = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    console.log("RequireAuth effect - isLoading:", isLoading, "user:", !!user);
    
    // Only determine redirect after loading is complete
    if (!isLoading && !user) {
      console.log("Setting shouldRedirect to true");
      setShouldRedirect(true);
    }
  }, [isLoading, user]);

  console.log("RequireAuth render - isLoading:", isLoading, "shouldRedirect:", shouldRedirect);

  // If still loading, show a spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  // If not authenticated and not loading, redirect to login
  if (shouldRedirect) {
    console.log("Redirecting to login from", location.pathname);
    // Store the current location using sessionStorage for better security
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to={PATHS.HOME} state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default RequireAuth;
