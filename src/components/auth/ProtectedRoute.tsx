
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("ProtectedRoute render - isLoading:", isLoading, "user:", !!user);

  // Handle any errors in component initialization
  if (error) {
    console.error("Error in ProtectedRoute:", error);
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If still loading or showing animation, show a spinner
  if (isLoading || showLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando aplicação...</p>
        </motion.div>
      </div>
    );
  }

  // If not authenticated and not loading, redirect
  if (!user) {
    console.log("Redirecting to / from", location.pathname);
    // Store the current location for redirect after login
    try {
      sessionStorage.setItem("redirectPath", location.pathname);
    } catch (err) {
      console.error("Error setting redirectPath:", err);
    }
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the content
  return <>{children}</>;
};

export default ProtectedRoute;
