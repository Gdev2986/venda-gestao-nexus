import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import { AuthProvider } from "../providers/AuthProvider";
import { RequireAuth } from "../components/auth/RequireAuth";
import { AuthRoutes } from "./authRoutes";
import { AdminRoutes } from "./adminRoutes";
import { ClientRoutes } from "./clientRoutes";
import { NotFound } from "../pages/NotFound";
import { Unauthorized } from "../pages/Unauthorized";

export const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        {AuthRoutes}

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          {/* Admin Routes */}
          {AdminRoutes}

          {/* Client Routes */}
          {ClientRoutes}
        </Route>

        {/* Error Routes */}
        <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
        <Route path={PATHS.UNAUTHORIZED} element={<Unauthorized />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to={PATHS.LOGIN} replace />} />

        {/* Catch all - redirect to 404 */}
        <Route path="*" element={<Navigate to={PATHS.NOT_FOUND} replace />} />
      </Routes>
    </AuthProvider>
  );
}; 