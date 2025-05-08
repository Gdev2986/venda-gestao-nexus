
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";

const Machines = () => {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  
  useEffect(() => {
    console.log("Admin Machines page redirect - userRole:", userRole);
    
    // Always redirect to logistics machines page - admin can access logistics routes
    navigate(PATHS.LOGISTICS.MACHINES);
  }, [navigate, userRole]);
  
  return null; // Component will redirect, no need to render anything
};

export default Machines;
