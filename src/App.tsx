import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import { useAuth } from './hooks/use-auth';
import { Toaster } from './components/ui/toaster';
import { UserRole } from '@/types'; // Changed from './types' to '@/types'
import { PATHS } from './routes/paths';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const publicRoutes = [PATHS.LOGIN, PATHS.REGISTER, PATHS.FORGOT_PASSWORD, PATHS.RESET_PASSWORD];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (!isAuthenticated && !isPublicRoute) {
      navigate(PATHS.LOGIN);
    } else if (isAuthenticated && location.pathname === PATHS.LOGIN) {
      // Redirect based on role after login
      switch (user?.role) {
        case UserRole.ADMIN:
          navigate(PATHS.ADMIN_DASHBOARD);
          break;
        case UserRole.FINANCIAL:
          navigate(PATHS.FINANCIAL_DASHBOARD);
          break;
        case UserRole.LOGISTICS:
          navigate(PATHS.LOGISTICS_DASHBOARD);
          break;
        case UserRole.PARTNER:
          navigate(PATHS.PARTNER_DASHBOARD);
          break;
        case UserRole.CLIENT:
          navigate(PATHS.CLIENT_DASHBOARD);
          break;
        default:
          navigate(PATHS.DASHBOARD);
          break;
      }
    }
  }, [isAuthenticated, user, navigate, location, isLoading]);

  return (
    <>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
