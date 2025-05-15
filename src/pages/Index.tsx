
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { getDashboardRedirect } from "@/routes/routeUtils";
import { Spinner } from "@/components/ui/spinner";

const Index = () => {
  const navigate = useNavigate();
  const { userRole, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && userRole) {
      // Get the appropriate dashboard path based on user role
      const redirectPath = getDashboardRedirect(userRole);
      console.log("Redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, userRole, isLoading]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="lg" className="text-primary" />
      <span className="ml-2 text-lg">Redirecionando para o dashboard...</span>
    </div>
  );
};

export default Index;
