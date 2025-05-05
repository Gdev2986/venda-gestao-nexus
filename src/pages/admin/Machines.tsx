
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const Machines = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Since Machines is now in the logistics module, redirect to logistics machines
    navigate(PATHS.LOGISTICS.MACHINES);
  }, [navigate]);
  
  return null; // Component will redirect, no need to render anything
};

export default Machines;
