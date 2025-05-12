
import { Fragment } from "react";
import { dashboardRoute } from "./dashboardRoute";
import { clientRoutes } from "./clientRoutes";
import { logisticsRoutes } from "./logisticsRoutes";
import { salesRoutes } from "./salesRoutes";
import { partnerRoutes } from "./partnerRoutes";
import { paymentRoutes } from "./paymentRoutes";
import { settingsRoutes } from "./settingsRoutes";

// Combine all admin routes into a flat array
export const adminRoutes = [
  // Dashboard Route
  ...dashboardRoute,
  
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
