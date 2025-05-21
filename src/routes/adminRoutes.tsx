
import { Route } from "react-router-dom";
import { UserRole } from "@/types";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Layout Selector
import AdminLayoutSelector from "../layouts/AdminLayoutSelector";

// Import route groups
import { dashboardRoute } from "./admin/dashboardRoute";
import { clientRoutes } from "./admin/clientRoutes";
import { logisticsRoutes } from "./admin/logisticsRoutes";
import { salesRoutes } from "./admin/salesRoutes";
import { partnerRoutes } from "./admin/partnerRoutes";
import { paymentRoutes } from "./admin/paymentRoutes";
import { settingsRoutes } from "./admin/settingsRoutes";

// Combine all admin routes
export const AdminRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.LOGISTICS, UserRole.FINANCIAL]} />}>
    <Route element={<AdminLayoutSelector />}>
      {/* Dashboard Route */}
      {dashboardRoute}
      
      {/* Client Routes */}
      {clientRoutes}
      
      {/* Logistics Routes */}
      {logisticsRoutes}
      
      {/* Sales Routes */}
      {salesRoutes}
      
      {/* Payment Routes */}
      {paymentRoutes}
      
      {/* Partner Routes */}
      {partnerRoutes}
      
      {/* Settings and Other Routes */}
      {settingsRoutes}
    </Route>
  </Route>
);
