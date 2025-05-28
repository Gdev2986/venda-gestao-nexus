
import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./hooks/use-auth";
import { UserRole } from "./types";

// Route utils
import { getDashboardPath } from "./utils/auth-utils";

// Route groups
import { AuthRoutes } from "./routes/authRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
import { ClientRoutes } from "./routes/clientRoutes";
import { PartnerRoutes } from "./routes/partnerRoutes";
import { FinancialRoutes } from "./routes/financialRoutes";
import { LogisticsRoutes } from "./routes/logisticsRoutes";

// Layouts
import MainLayout from "./components/layout/MainLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Notifications from "./pages/Notifications";

function App() {
  const { userRole, isLoading } = useAuth();
  const { toast } = useToast();

  // Log role changes for debugging
  useEffect(() => {
    if (!isLoading) {
      console.log("App.tsx - Current user role:", userRole);
      
      try {
        const dashPath = getDashboardPath(userRole);
        console.log("App.tsx - Will redirect to dashboard:", dashPath);
      } catch (error) {
        console.error("Error getting dashboard path:", error);
      }
    }
  }, [userRole, isLoading]);

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
      {/* Landing Page */}
      <Route path={PATHS.HOME} element={<LandingPage />} />
      
      {/* Generic dashboard route */}
      <Route 
        path={PATHS.DASHBOARD} 
        element={<Navigate to={getDashboardRedirectPath()} replace />} 
      />

      {/* Auth Routes */}
      {AuthRoutes}

      {/* Protected Routes by Role */}
      {AdminRoutes}
      {ClientRoutes}
      {PartnerRoutes}
      {FinancialRoutes}
      {LogisticsRoutes}

      {/* Shared Routes (accessible by all roles) */}
      <Route element={<MainLayout />}>
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Error Pages */}
      <Route path={PATHS.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      
      {/* Catch-all redirect to landing page */}
      <Route path="*" element={<Navigate to={PATHS.NOT_FOUND} replace />} />
    </Routes>
  );
}

export default App;
