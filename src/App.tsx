import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";
import { useAuth } from "@/contexts/AuthContext";

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
import MainLayout from "./components/layout/MainLayout";

// Pages
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Unauthorized from "./pages/Unauthorized";

function App() {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Log role changes for debugging
  useEffect(() => {
    if (!isLoading && userRole) {
      console.log("App.tsx - Current user role:", userRole);
      
      try {
        const dashPath = getDashboardPath(userRole);
        console.log("App.tsx - Will redirect to dashboard:", dashPath);
      } catch (error) {
        console.error("Error getting dashboard path:", error);
      }
    }
  }, [userRole, isLoading]);

  // Redirecionamento padrão para login ou dashboard
  const getDefaultRedirect = () => {
    if (isAuthenticated && userRole) {
      return getDashboardPath(userRole);
    }
    return PATHS.LOGIN;
  };

  // Se ainda estiver carregando, não renderiza nada
  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      {AuthRoutes}

      {/* Protected Routes */}
      {AdminRoutes}
      {ClientRoutes}
      {PartnerRoutes}
      {FinancialRoutes}
      {LogisticsRoutes}

      {/* Shared Routes (accessible by all roles) */}
      <Route element={<MainLayout />}>
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Error Routes */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      <Route path={PATHS.UNAUTHORIZED} element={<Unauthorized />} />

      {/* Redirecionamento da raiz */}
      <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />

      {/* Catch-all: qualquer rota desconhecida redireciona para login ou dashboard */}
      <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
    </Routes>
  );
}

export default App;
