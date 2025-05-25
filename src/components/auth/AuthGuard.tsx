
import { useEffect, startTransition } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin/dashboard';
    case UserRole.CLIENT:
      return '/user/dashboard';
    case UserRole.PARTNER:
      return '/partner/dashboard';
    case UserRole.FINANCIAL:
      return '/financial/dashboard';
    case UserRole.LOGISTICS:
      return '/logistics/dashboard';
    default:
      return '/login';
  }
};

export const AuthGuard = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    userRole, 
    isLoading, 
    authLoading, 
    isAuthenticated 
  } = useAuthStore();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading || authLoading) return;

    // Use startTransition to avoid React suspense errors during navigation
    startTransition(() => {
      // If auth is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }

      // If user is authenticated but accessing login page
      if (isAuthenticated && location.pathname === '/login') {
        if (userRole) {
          navigate(getDashboardPath(userRole), { replace: true });
        }
        return;
      }

      // Check role permissions
      if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
        if (!userRole || !allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard or login
          if (userRole) {
            navigate(getDashboardPath(userRole), { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
          return;
        }
      }

      // Handle generic dashboard route
      if (location.pathname === '/dashboard' && userRole) {
        navigate(getDashboardPath(userRole), { replace: true });
        return;
      }
    });
  }, [
    isLoading, 
    authLoading, 
    isAuthenticated, 
    userRole, 
    location.pathname, 
    navigate, 
    allowedRoles, 
    requireAuth
  ]);

  // Show loading while auth is being determined
  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Verificando credenciais...</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
