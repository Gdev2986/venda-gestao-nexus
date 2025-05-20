
import { AdminRoutes } from "./adminRoutes";
import { AuthRoutes } from "./authRoutes";
import { ClientRoutes } from "./clientRoutes";
import { FinancialRoutes } from "./financialRoutes";
import { LogisticsRoutes } from "./logisticsRoutes";
import { PartnerRoutes } from "./partnerRoutes";

// Combine all routes into a single array
// Use array spread for proper TypeScript typing
const routes = [
  ...Array.isArray(AdminRoutes) ? AdminRoutes : [AdminRoutes],
  ...Array.isArray(AuthRoutes) ? AuthRoutes : [AuthRoutes],
  ...Array.isArray(ClientRoutes) ? ClientRoutes : [ClientRoutes],
  ...Array.isArray(FinancialRoutes) ? FinancialRoutes : [FinancialRoutes],
  ...Array.isArray(LogisticsRoutes) ? LogisticsRoutes : [LogisticsRoutes],
  ...Array.isArray(PartnerRoutes) ? PartnerRoutes : [PartnerRoutes]
];

export default routes;
