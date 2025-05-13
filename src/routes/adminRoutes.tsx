
import { Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Clients from "@/pages/admin/Clients";
import Partners from "@/pages/admin/Partners";
import Settings from "@/pages/admin/Settings";
import Payments from "@/pages/admin/Payments";
import PaymentDetails from "@/pages/admin/PaymentDetails";
import Sales from "@/pages/admin/Sales";
import Support from "@/pages/admin/Support";
import Notifications from "@/pages/admin/Notifications";
import { PATHS } from "./paths";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types";

// Client routes
import { adminClientRoutes } from "./admin/clientRoutes";

// Partner routes
import { adminPartnerRoutes } from "./admin/partnerRoutes";

// Payment routes
import { adminPaymentRoutes } from "./admin/paymentRoutes";

// Sales routes
import { adminSalesRoutes } from "./admin/salesRoutes";

// Settings routes
import { adminSettingsRoutes } from "./admin/settingsRoutes";

// Logistics routes
import { adminLogisticsRoutes } from "./admin/logisticsRoutes";

// Notification routes
import { adminNotificationRoutes } from "./admin/notificationRoutes";

const adminRoutes = (
  <Route
    element={
      <RequireAuth allowedRoles={[UserRole.ADMIN]}>
        <AdminLayout />
      </RequireAuth>
    }
  >
    <Route path={PATHS.ADMIN_DASHBOARD} element={<Dashboard />} />
    <Route path={PATHS.ADMIN_CLIENTS} element={<Clients />} />
    <Route path={PATHS.ADMIN_PARTNERS} element={<Partners />} />
    <Route path={PATHS.ADMIN_SETTINGS} element={<Settings />} />
    <Route path={PATHS.ADMIN_PAYMENTS} element={<Payments />} />
    <Route path={PATHS.ADMIN_PAYMENT_DETAILS} element={<PaymentDetails />} />
    <Route path={PATHS.ADMIN_SALES} element={<Sales />} />
    <Route path={PATHS.ADMIN_SUPPORT} element={<Support />} />
    <Route path={PATHS.ADMIN_NOTIFICATIONS} element={<Notifications />} />

    {/* Nested routes */}
    {adminClientRoutes}
    {adminPartnerRoutes}
    {adminPaymentRoutes}
    {adminSalesRoutes}
    {adminSettingsRoutes}
    {adminLogisticsRoutes}
    {adminNotificationRoutes}
  </Route>
);

// Export the routes
export default adminRoutes;

// Add named export for compatibility
export const AdminRoutes = adminRoutes;
