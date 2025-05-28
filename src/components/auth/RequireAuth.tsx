
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts";
import { UserRole } from "@/types";

interface RequireAuthProps {
  allowedRoles?: UserRole[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role as UserRole;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default RequireAuth;
