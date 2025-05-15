
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { getDashboardRedirect } from "@/routes/routeUtils";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { PATHS } from "@/routes/paths";

const Index = () => {
  const navigate = useNavigate();
  const { userRole, isRoleLoading } = useUserRole();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // First check if user is authenticated
    if (!isLoading) {
      if (user) {
        if (!isRoleLoading && userRole) {
          // Get the appropriate dashboard path based on user role
          const redirectPath = getDashboardRedirect(userRole);
          navigate(redirectPath, { replace: true });
        }
      } else {
        // If not authenticated, redirect to login
        navigate(PATHS.LOGIN, { replace: true });
      }
    }
  }, [navigate, userRole, isRoleLoading, user, isLoading]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="lg" className="text-primary" />
      <span className="ml-2 text-lg">Redirecionando...</span>
    </div>
  );
};

export default Index;
