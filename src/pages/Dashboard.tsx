
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const { userRole, isRoleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRoleLoading) {
      // Redirect based on user role
      switch (userRole) {
        case UserRole.ADMIN:
          navigate(PATHS.ADMIN.DASHBOARD);
          break;
        case UserRole.CLIENT:
          navigate(PATHS.USER.DASHBOARD);
          break;
        case UserRole.FINANCIAL:
          navigate(PATHS.FINANCIAL.DASHBOARD);
          break;
        case UserRole.PARTNER:
          navigate(PATHS.PARTNER.DASHBOARD);
          break;
        case UserRole.LOGISTICS:
          navigate(PATHS.LOGISTICS.DASHBOARD);
          break;
        default:
          navigate(PATHS.LOGIN);
          break;
      }
    }
  }, [userRole, isRoleLoading, navigate]);

  if (isRoleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg">Redirecionando para seu painel...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
