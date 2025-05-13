
// Admin Routes
import { Route } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import { UserRole } from "@/types";
import RequireAuth from "../components/auth/RequireAuth";

// Client Routes (within Admin module)
import { clientRoutes } from "./admin/clientRoutes";

// Partner Routes (within Admin module)
import { partnerRoutes } from "./admin/partnerRoutes";

// Payment Routes (within Admin module)
import { paymentRoutes } from "./admin/paymentRoutes";

// Sales Routes (within Admin module)
import { salesRoutes } from "./admin/salesRoutes";

// Logistics Routes (within Admin module)
import { logisticsRoutes } from "./admin/logisticsRoutes";

// Dashboard Route
import { dashboardRoute } from "./admin/dashboardRoute";

// Settings Routes
import { settingsRoutes } from "./admin/settingsRoutes";

// Notification Routes
import { notificationRoutes } from "./admin/notificationRoutes";

export const adminRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.LOGISTICS, UserRole.FINANCIAL]} />}>
    <Route element={<AdminLayout />}>
      {/* Dashboard */}
      {dashboardRoute}
      
      {/* Client Routes */}
      {clientRoutes}
      
      {/* Partner Routes */}
      {partnerRoutes}
      
      {/* Payment Routes */}
      {paymentRoutes}
      
      {/* Sales Routes */}
      {salesRoutes}
      
      {/* Logistics Routes */}
      {logisticsRoutes}
      
      {/* Settings Routes */}
      {settingsRoutes}

      {/* Notification Routes */}
      {notificationRoutes}
    </Route>
  </Route>
);

// Add named export to match the import in App.tsx
export const AdminRoutes = adminRoutes;
