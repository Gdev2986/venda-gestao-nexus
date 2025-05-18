
import { Route } from "react-router-dom";
import { PATHS } from "./paths";

// Financial Pages
import Dashboard from "../pages/financial/Dashboard";
import Settings from "../pages/financial/Settings";

// Import AdminPayments for now - until a dedicated Financial Payments is created
import AdminPayments from "../pages/admin/Payments";

export const financialRoutes = [
  <Route
    key="financial-dashboard"
    path={PATHS.FINANCIAL.DASHBOARD}
    element={<Dashboard />}
  />,
  <Route
    key="financial-payments"
    path={PATHS.FINANCIAL.PAYMENTS}
    element={<AdminPayments />}
  />,
  <Route
    key="financial-settings"
    path={PATHS.FINANCIAL.SETTINGS}
    element={<Settings />}
  />
];
