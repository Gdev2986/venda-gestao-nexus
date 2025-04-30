
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function Index() {
  const navigate = useNavigate();
  
  // Redirect to login or dashboard based on authentication
  useEffect(() => {
    // For now, just redirect to the dashboard
    navigate(PATHS.DASHBOARD);
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecionando...</p>
    </div>
  );
}
