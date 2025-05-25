
import { Route } from "react-router-dom";
import { UserRole } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";
import AdminLayoutSelector from "../layouts/AdminLayoutSelector";

// Import route groups
import { dashboardRoute } from "./admin/dashboardRoute";
import { clientRoutes } from "./admin/clientRoutes";
import { logisticsRoutes } from "./admin/logisticsRoutes";
import { salesRoutes } from "./admin/salesRoutes";
import { partnerRoutes } from "./admin/partnerRoutes";
import { paymentRoutes } from "./admin/paymentRoutes";
import { settingsRoutes } from "./admin/settingsRoutes";
import { companyRoutes } from "./admin/companyRoutes";

export const AdminRoutes = (
  <Route 
    path="/admin/*" 
    element={
      <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.LOGISTICS, UserRole.FINANCIAL]}>
        <AdminLayoutSelector />
      </AuthGuard>
    }
  >
    {dashboardRoute}
    {clientRoutes}
    {logisticsRoutes}
    {salesRoutes}
    {paymentRoutes}
    {partnerRoutes}
    {companyRoutes}
    {settingsRoutes}
  </Route>
);
