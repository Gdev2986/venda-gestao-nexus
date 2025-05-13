
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";

const Machines = () => {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  
  useEffect(() => {
    if (userRole === UserRole.LOGISTICS) {
      // Redirect to logistics machines page
      navigate(PATHS.LOGISTICS.MACHINES);
    } else {
      // Redirect to user machines page for other roles
      navigate(PATHS.USER.MACHINES);
    }
  }, [navigate, userRole]);
  
  return null; // Component will redirect, no need to render anything
};

// Add a named export for compatibility with imports that expect it
export { Machines };

export default Machines;
