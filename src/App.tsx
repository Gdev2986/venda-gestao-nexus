import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "./hooks/use-user-role";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "./types";

// Route utils
import { getDashboardPath } from "./routes/routeUtils";

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
import { Spinner } from "./components/ui/spinner";

function App() {
  const { userRole, isRoleLoading } = useUserRole();
  const { session, isLoading } = useAuth();
  const { toast } = useToast();
  const [dashboardPath, setDashboardPath] = useState<string | null>(null);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Log role changes for debugging
  useEffect(() => {
    if (!isRoleLoading && !isLoading) {
      console.log("App.tsx - Current user role:", userRole, "Session exists:", !!session);
      
      if (session && userRole) {
        try {
          const dashPath = getDashboardPath(userRole);
          console.log("App.tsx - Will redirect to dashboard:", dashPath);
          setDashboardPath(dashPath);
        } catch (error) {
          console.error("Error getting dashboard path:", error);
          setDashboardPath(PATHS.LOGIN);
        }
      } else {
        console.log("App.tsx - No session or role, no dashboard redirect");
        setDashboardPath(PATHS.LOGIN);
      }
    }
  }, [userRole, isRoleLoading, session, isLoading]);

  // Show loading state while determining the dashboard path
  if ((isLoading || isRoleLoading) && dashboardPath === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }
  
  // If we're already redirecting, don't trigger additional redirects
  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root path handling */}
      <Route path={PATHS.HOME} element={
        dashboardPath && dashboardPath !== PATHS.LOGIN ? 
          <Navigate to={dashboardPath} replace /> : 
          <Navigate to={PATHS.LOGIN} replace />
      } />
      
      {/* Generic dashboard route */}
      <Route 
        path={PATHS.DASHBOARD} 
        element={
          dashboardPath && dashboardPath !== PATHS.LOGIN ? 
            <Navigate to={dashboardPath} replace /> : 
            <Navigate to={PATHS.LOGIN} replace />
        } 
      />

      {/* Auth Routes - Important: keep these before other routes */}
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
      
      {/* Catch-all redirect to the appropriate dashboard or login */}
      <Route path="*" element={
        dashboardPath ? 
          <Navigate to={dashboardPath} replace /> : 
          <Navigate to={PATHS.LOGIN} replace />
      } />
    </Routes>
  );
}

export default App;
