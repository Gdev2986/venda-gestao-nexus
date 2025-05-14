
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
import { Spinner } from "@/components/ui/spinner";

const Machines = () => {
  const navigate = useNavigate();
  const { userRole, isRoleLoading } = useUserRole();
  
  useEffect(() => {
    if (!isRoleLoading) {
      if (userRole === UserRole.LOGISTICS || userRole === UserRole.ADMIN) {
        // Redirect to logistics machines page
        navigate(PATHS.LOGISTICS.MACHINES);
      } else {
        // Redirect to user machines page for other roles
        navigate(PATHS.USER.MACHINES);
      }
    }
  }, [navigate, userRole, isRoleLoading]);
  
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Spinner size="lg" />
    </div>
  );
};

export default Machines;
