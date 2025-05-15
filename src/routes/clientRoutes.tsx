
import { Route } from "react-router-dom";
import { lazy } from "react";

// Client Pages
const ClientDashboard = lazy(() => import("@/pages/user/Dashboard"));
const UserMachines = lazy(() => import("@/pages/user/Machines"));
const UserPayments = lazy(() => import("@/pages/user/Payments"));
const UserSettings = lazy(() => import("@/pages/user/Settings"));
const UserSupport = lazy(() => import("@/pages/user/Support"));

// Client Routes - defined as Route elements
export const ClientRoutes = [
  <Route key="client-index" index element={<ClientDashboard />} />,
  <Route key="client-dashboard" path="dashboard" element={<ClientDashboard />} />,
  <Route key="client-machines" path="machines" element={<UserMachines />} />,
  <Route key="client-payments" path="payments" element={<UserPayments />} />,
  <Route key="client-settings" path="settings" element={<UserSettings />} />,
  <Route key="client-support" path="support" element={<UserSupport />} />
];
