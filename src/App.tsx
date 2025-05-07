
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";

// Route utils
import { getDashboardRedirect } from "./routes/routeUtils";

// Route groups
import { AuthRoutes } from "./routes/authRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
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
  const location = useLocation();
  const { userRole, isRoleLoading } = useUserRole();
  const { toast } = useToast();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Log role changes for debugging
  useEffect(() => {
    if (!isRoleLoading) {
      console.log("Current user role:", userRole);
    }
  }, [userRole, isRoleLoading]);

  return (
    <Routes>
      {/* Root path handling */}
      <Route path={PATHS.HOME} element={<RootLayout />} />
      
      {/* Generic dashboard route */}
      <Route 
        path={PATHS.DASHBOARD} 
        element={getDashboardRedirect(userRole)} 
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
      <Route path="/notifications" element={<Notifications />} />

      {/* 404 */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      
      {/* Catch-all redirect to the appropriate dashboard */}
      <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
    </Routes>
  );
}

export default App;
