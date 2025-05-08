
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const Machines = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to logistics machines page
    navigate(PATHS.LOGISTICS.MACHINES);
  }, [navigate]);
  
  return null; // Component will redirect, no need to render anything
};

export default Machines;
