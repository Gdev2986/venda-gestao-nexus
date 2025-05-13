
import React from "react";
import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminNotifications from "@/pages/admin/Notifications";
import AdminSettings from "@/pages/admin/Settings";
import { dashboardRoute } from "./admin/dashboardRoute";
import { clientRoutes } from "./admin/clientRoutes";
import { logisticsRoutes } from "./admin/logisticsRoutes";
import { salesRoutes } from "./admin/salesRoutes";
import { partnerRoutes } from "./admin/partnerRoutes";
import { paymentRoutes } from "./admin/paymentRoutes";
import { settingsRoutes } from "./admin/settingsRoutes";

// Combine all admin routes into an array of React Route elements
export const adminRoutes = [
  // Basic admin routes
  <Route key="dashboard" path="dashboard" element={<AdminDashboard />} />,
  <Route key="notifications" path="notifications" element={<AdminNotifications />} />,
  <Route key="settings" path="settings" element={<AdminSettings />} />,
  
  // Module specific routes
  dashboardRoute,
  ...clientRoutes,
  ...logisticsRoutes,
  ...salesRoutes,
  ...partnerRoutes,
  ...paymentRoutes,
  ...settingsRoutes
];
