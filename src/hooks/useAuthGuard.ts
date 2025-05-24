import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath, hasRoleAccess } from '@/routes/routeUtils';
import { PATHS } from '@/routes/paths';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

interface UseAuthGuardOptions {
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { isAuthenticated, userRole, isLoading, user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Evita múltiplas validações enquanto ainda está carregando
    if (isLoading) {
      return;
    }

    const validateAccess = () => {
      setIsValidating(true);

      // 1. Verificar se está autenticado
      if (!isAuthenticated || !user || !session) {
        console.log('useAuthGuard: Usuário não autenticado, redirecionando para login');
        navigate(PATHS.LOGIN, { 
          state: { from: location.pathname },
          replace: true 
        });
        setIsValidating(false);
        return;
      }

      // 2. Verificar se tem role válida
      if (!userRole) {
        console.log('useAuthGuard: Role não encontrada, redirecionando para login');
        toast({
          title: "Erro de autenticação",
          description: "Sua conta não possui permissões válidas.",
          variant: "destructive",
        });
        navigate(PATHS.LOGIN, { replace: true });
        setIsValidating(false);
        return;
      }

      // 3. Verificar se a role tem acesso à rota atual
      const currentPath = location.pathname;
      
      // Se há roles específicas permitidas, verificar se a role do usuário está incluída
      if (options.allowedRoles && options.allowedRoles.length > 0) {
        const normalizedUserRole = userRole.toString().toUpperCase() as UserRole;
        const normalizedAllowedRoles = options.allowedRoles.map(role => 
          role.toString().toUpperCase() as UserRole
        );
        
        if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
          console.log('useAuthGuard: Role não permitida para esta rota');
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta página.",
            variant: "destructive",
          });
          
          // Redireciona para dashboard padrão da role
          const defaultDashboard = getDashboardPath(userRole);
          navigate(defaultDashboard, { replace: true });
          setIsValidating(false);
          return;
        }
      }

      // 4. Verificar role específica requerida
      if (options.requiredRole) {
        const normalizedUserRole = userRole.toString().toUpperCase();
        const normalizedRequiredRole = options.requiredRole.toString().toUpperCase();
        
        if (normalizedUserRole !== normalizedRequiredRole) {
          console.log('useAuthGuard: Role específica não atendida');
          toast({
            title: "Acesso negado",
            description: "Esta página requer permissões específicas.",
            variant: "destructive",
          });
          
          const defaultDashboard = getDashboardPath(userRole);
          navigate(defaultDashboard, { replace: true });
          setIsValidating(false);
          return;
        }
      }

      // 5. Verificar acesso geral baseado no path
      if (!hasRoleAccess(userRole, currentPath)) {
        console.log('useAuthGuard: Acesso negado para o path atual');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta seção.",
          variant: "destructive",
        });
        
        const defaultDashboard = getDashboardPath(userRole);
        navigate(defaultDashboard, { replace: true });
        setIsValidating(false);
        return;
      }

      // Se chegou até aqui, o acesso é válido
      setIsValidating(false);
    };

    // Executar validação apenas uma vez quando os dados estiverem prontos
    validateAccess();
  }, [
    isAuthenticated, 
    userRole, 
    isLoading, 
    user, 
    session, 
    location.pathname,
    options.requiredRole,
    options.allowedRoles,
    navigate,
    toast
  ]);

  return {
    isValidating: isLoading || isValidating,
    isAuthenticated,
    userRole,
    hasAccess: isAuthenticated && userRole && !isValidating
  };
};

/**
 * Hook simplificado para proteger rotas que requerem apenas autenticação
 */
export const useRequireAuth = () => {
  return useAuthGuard();
};

/**
 * Hook para proteger rotas administrativas
 */
export const useRequireAdmin = () => {
  return useAuthGuard({ requiredRole: 'ADMIN' as UserRole });
};

/**
 * Hook para proteger rotas de cliente
 */
export const useRequireClient = () => {
  return useAuthGuard({ allowedRoles: ['CLIENT', 'USER'] as UserRole[] });
}; 