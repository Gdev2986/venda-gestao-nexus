
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { PATHS } from "@/routes/paths";
import { getDashboardPath, isValidUserRole } from "@/utils/auth-utils";

const RootLayout = () => {
  const { user, isLoading, isAuthenticated, userRole, needsPasswordChange } = useAuth();
  const location = useLocation();
  
  console.log("RootLayout render status:", {
    isLoading,
    isAuthenticated,
    userRole,
    needsPasswordChange,
    path: location.pathname,
    user: user?.id
  });
  
  // Se ainda está carregando auth ou user data, mostrar spinner com melhor UI
  if (isLoading) {
    console.log("RootLayout: Still loading, showing spinner");
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se não autenticado, redirecionar para login
  if (!isAuthenticated || !user) {
    console.log("RootLayout: User not authenticated, redirecting to login");
    return <Navigate to={PATHS.LOGIN} replace />;
  }
  
  // Se autenticado e precisa trocar senha, redirecionar para troca de senha
  if (needsPasswordChange) {
    console.log("RootLayout: User needs to change password, redirecting");
    return <Navigate to={PATHS.CHANGE_PASSWORD} replace />;
  }
  
  // Se autenticado e tem role válida, redirecionar para dashboard
  if (userRole && isValidUserRole(userRole)) {
    console.log(`RootLayout: Redirecting user with role ${userRole} to dashboard`);
    const dashboardPath = getDashboardPath(userRole);
    console.log(`RootLayout: Dashboard path: ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }
  
  // Se autenticado mas não tem role ainda, aguardar com timeout
  console.log("RootLayout: User authenticated but no valid role yet, waiting...");
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Configurando seu perfil...</p>
      </div>
    </div>
  );
};

export default RootLayout;
