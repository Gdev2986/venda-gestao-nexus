
import { AdminRoutes } from "./adminRoutes";
import { AuthRoutes } from "./authRoutes";
import { ClientRoutes } from "./clientRoutes";
import { FinancialRoutes } from "./financialRoutes";
import { LogisticsRoutes } from "./logisticsRoutes";
import { PartnerRoutes } from "./partnerRoutes";

// Combine all routes into a single array
const routes = [
  AdminRoutes,
  AuthRoutes,
  ClientRoutes,
  FinancialRoutes,
  LogisticsRoutes,
  PartnerRoutes
].flat();

export default routes;
