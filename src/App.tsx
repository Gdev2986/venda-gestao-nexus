import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "./routes/routeUtils";
import { AuthRoutes } from "./routes/authRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
import { ClientRoutes } from "./routes/clientRoutes";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

function App() {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  // Redirecionamento padrão para login ou dashboard específico da role
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

      {/* Error Routes */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      <Route path={PATHS.UNAUTHORIZED} element={<Unauthorized />} />

      {/* Redirecionamento da raiz para login ou dashboard específico */}
      <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />

      {/* Catch-all: qualquer rota desconhecida redireciona baseado na autenticação */}
      <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
    </Routes>
  );
}

export default App;
