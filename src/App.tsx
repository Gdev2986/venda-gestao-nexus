
import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";

// Route utils
import { getDashboardPath } from "./routes/routeUtils";

// Route groups
import { AuthRoutes } from "./routes/authRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { ClientRoutes } from "./routes/clientRoutes";
import { PartnerRoutes } from "./routes/partnerRoutes";
import { FinancialRoutes } from "./routes/financialRoutes";
import { LogisticsRoutes } from "./routes/logisticsRoutes";

// Layouts
import RootLayout from "./layouts/RootLayout";

// Pages
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

function App() {
  const { userRole, isRoleLoading } = useUserRole();
  const { toast } = useToast();

  // Log role changes for debugging
  useEffect(() => {
    if (!isRoleLoading) {
      console.log("App.tsx - Current user role:", userRole);
      
      try {
        const dashPath = getDashboardPath(userRole);
        console.log("App.tsx - Will redirect to dashboard:", dashPath);
      } catch (error) {
        console.error("Error getting dashboard path:", error);
      }
    }
  }, [userRole, isRoleLoading]);

  // Get the dashboard path safely
  const getDashboardRedirectPath = () => {
    try {
      return getDashboardPath(userRole);
    } catch (error) {
      console.error("Error in getDashboardRedirectPath:", error);
      return PATHS.LOGIN;
    }
  };

  return (
    <Routes>
      {/* Root path handling */}
      <Route path={PATHS.HOME} element={<RootLayout />} />
      
      {/* Generic dashboard route */}
      <Route 
        path="/dashboard" 
        element={<Navigate to={getDashboardRedirectPath()} replace />} 
      />

      {/* Auth Routes */}
      {AuthRoutes}

      {/* Protected Routes by Role */}
      {adminRoutes}
      {ClientRoutes}
      {PartnerRoutes}
      {FinancialRoutes}
      {LogisticsRoutes}

      {/* Shared Routes (accessible by all roles) */}
      <Route path="/notifications" element={<Notifications />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
