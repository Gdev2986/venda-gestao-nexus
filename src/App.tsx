
// src/App.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PATHS } from "./routes/paths";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardPath } from "./utils/auth-utils";

// Route groups
import { AuthRoutes } from "./routes/authRoutes";
import AdminRoutes from "./routes/adminRoutes";
import ClientRoutes from "./routes/clientRoutes";
import PartnerRoutes from "./routes/partnerRoutes";
import FinancialRoutes from "./routes/financialRoutes";
import LogisticsRoutes from "./routes/logisticsRoutes";

// Layouts & Pages
import MainLayout from "./components/layout/MainLayout";
import Landing from "./pages/landing/Landing";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Notifications from "./pages/Notifications";

function App() {
  const location = useLocation();
  const { userRole, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const isPublicRoute =
    location.pathname === PATHS.HOME ||
    location.pathname === PATHS.UNAUTHORIZED ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  useEffect(() => {
    console.log("App.tsx - Auth State:", {
      path: location.pathname,
      role: userRole,
      authenticated: isAuthenticated,
      loading: isLoading
    });
  }, [location.pathname, userRole, isLoading, isAuthenticated]);

  const getDashboardRedirectPath = () => {
    if (userRole) {
      return getDashboardPath(userRole);
    }
    return PATHS.LOGIN;
  };

  // Show loading only when we're checking auth for protected routes
  if (!isPublicRoute && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path={PATHS.HOME} element={<Landing />} />
      <Route
        path={PATHS.DASHBOARD}
        element={
          isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
            </div>
          ) : (
            <Navigate to={getDashboardRedirectPath()} replace />
          )
        }
      />
      {AuthRoutes}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/client/*" element={<ClientRoutes />} />
      <Route path="/partner/*" element={<PartnerRoutes />} />
      <Route path="/financial/*" element={<FinancialRoutes />} />
      <Route path="/logistics/*" element={<LogisticsRoutes />} />
      <Route element={<MainLayout />}>
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path={PATHS.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<Navigate to={PATHS.NOT_FOUND} replace />} />
    </Routes>
  );
}

export default App;
