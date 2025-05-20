
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { clientRoutes } from "./clientRoutes";
import { financialRoutes } from "./financialRoutes";
import { logisticsRoutes } from "./logisticsRoutes";
import { partnerRoutes } from "./partnerRoutes";

// Combine all routes into a single array
const routes = [
  ...adminRoutes,
  ...authRoutes,
  ...clientRoutes,
  ...financialRoutes,
  ...logisticsRoutes,
  ...partnerRoutes
];

export default routes;
