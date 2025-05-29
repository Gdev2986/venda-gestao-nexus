// src/App.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PATHS } from "./routes/paths";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
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
    location.pathname.startsWith("/login");

  useEffect(() => {
    console.log("App.tsx - location:", location.pathname);
    console.log("App.tsx - role:", userRole, "auth:", isAuthenticated, "loading:", isLoading);
  }, [location.pathname, userRole, isLoading]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (isLoading) {
        toast({
          title: "Erro de login",
          description: "Sistema demorou para carregar. Recarregue a página.",
          variant: "destructive",
        });
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [isLoading]);

  const getDashboardRedirectPath = () => (userRole ? getDashboardPath(userRole) : PATHS.LOGIN);

  const isProtectedRoute = !isPublicRoute && (!isAuthenticated || isLoading || !userRole);
  if (isProtectedRoute)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );

  return (
    <Routes>
      <Route path={PATHS.HOME} element={<Landing />} />
      <Route
        path={PATHS.DASHBOARD}
        element={
          isLoading || !userRole ? (
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
