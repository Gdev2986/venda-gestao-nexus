
import { Route } from "react-router-dom";
import { lazy } from "react";

// Partner Pages
const PartnerDashboard = lazy(() => import("@/pages/partner/Dashboard"));
const PartnerClients = lazy(() => import("@/pages/partner/Clients"));
const PartnerSettings = lazy(() => import("@/pages/partner/Settings"));

// Partner Routes - defined as Route elements
export const PartnerRoutes = [
  <Route key="partner-index" index element={<PartnerDashboard />} />,
  <Route key="partner-dashboard" path="dashboard" element={<PartnerDashboard />} />,
  <Route key="partner-clients" path="clients" element={<PartnerClients />} />
];
