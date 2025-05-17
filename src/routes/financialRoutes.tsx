
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Pages
import Dashboard from "../pages/financial/Dashboard";
import Payments from "../pages/Payments";
import Settings from "../pages/financial/Settings";

export const FinancialRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.FINANCIAL]} />}>
    <Route element={<MainLayout />}>
      <Route path={PATHS.FINANCIAL.DASHBOARD} element={<Dashboard />} />
      <Route path={PATHS.FINANCIAL.PAYMENTS} element={<Payments />} />
      <Route path={PATHS.FINANCIAL.SETTINGS} element={<Settings />} />
    </Route>
  </Route>
);
