
import { Fragment } from "react";
import { Route } from "react-router-dom";
import { dashboardRoute } from "./admin/dashboardRoute";
import { clientRoutes } from "./admin/clientRoutes";
import { logisticsRoutes } from "./admin/logisticsRoutes";
import { salesRoutes } from "./admin/salesRoutes";
import { partnerRoutes } from "./admin/partnerRoutes";
import { paymentRoutes } from "./admin/paymentRoutes";
import { settingsRoutes } from "./admin/settingsRoutes";

// Combine all admin routes into a flat array
export const adminRoutes = [
  // Dashboard Route
  dashboardRoute,
  
  // Client Routes
  ...clientRoutes,
  
  // Logistics Routes
  ...logisticsRoutes,
  
  // Sales Routes
  ...salesRoutes,
  
  // Payment Routes
  ...paymentRoutes,
  
  // Partner Routes
  ...partnerRoutes,
  
  // Settings and Other Routes
  ...settingsRoutes,
];
