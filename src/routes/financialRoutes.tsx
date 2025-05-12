
import { Route } from "react-router-dom";
import { lazy } from "react";

// Financial Pages
const FinancialDashboard = lazy(() => import("@/pages/financial/Dashboard"));
const FinancialSettings = lazy(() => import("@/pages/financial/Settings"));

// Financial Routes - defined as Route elements
export const FinancialRoutes = [
  <Route key="financial-index" index element={<FinancialDashboard />} />,
  <Route key="financial-dashboard" path="dashboard" element={<FinancialDashboard />} />,
  <Route key="financial-settings" path="settings" element={<FinancialSettings />} />
];
