
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { user, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute: Checking auth status", { user, isLoading, userRole, roles });
  }, [user, isLoading, userRole, roles]);

  if (isLoading) {
    // Show a loading spinner
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  if (!user) {
    // Not authenticated, redirect to login
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    return <Navigate to="/" replace />;
  }

  // If roles are specified, check if user has required role
  if (roles.length > 0 && userRole && !roles.includes(userRole)) {
    console.log(`ProtectedRoute: User role ${userRole} not in allowed roles:`, roles);
    // User doesn't have required role, redirect based on their role
    if (userRole === UserRole.CLIENT) {
      return <Navigate to="/client/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  console.log("ProtectedRoute: Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
