
import { Route } from "react-router-dom";
import { PATHS } from "./paths";

// Admin layouts
import AdminLayout from "@/layouts/AdminLayout";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import Clients from "@/pages/admin/Clients";
import ClientDetails from "@/pages/clients/ClientDetails";
import NewClient from "@/pages/clients/NewClient";
import Partners from "@/pages/admin/Partners";
import PartnerDetails from "@/pages/partners/PartnerDetails";
import NewPartner from "@/pages/partners/NewPartner";
import Machines from "@/pages/admin/Machines";
import Payments from "@/pages/admin/Payments";
import PaymentDetails from "@/pages/admin/PaymentDetails";
import Sales from "@/pages/admin/Sales";
import Fees from "@/pages/admin/Fees";
import Reports from "@/pages/admin/Reports";
import AdminNotifications from "@/pages/admin/Notifications";
import Settings from "@/pages/admin/Settings";
import Support from "@/pages/admin/Support";

// Export as a named constant to match the import in App.tsx
export const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path={PATHS.ADMIN.DASHBOARD} element={<Dashboard />} />
    <Route path={PATHS.ADMIN.CLIENTS} element={<Clients />} />
    <Route path={`${PATHS.ADMIN.CLIENTS}/:id`} element={<ClientDetails />} />
    <Route path={PATHS.ADMIN.CLIENT_NEW} element={<NewClient />} />
    <Route path={PATHS.ADMIN.PARTNERS} element={<Partners />} />
    <Route path={`${PATHS.ADMIN.PARTNERS}/:id`} element={<PartnerDetails />} />
    <Route path={PATHS.ADMIN.PARTNER_NEW} element={<NewPartner />} />
    <Route path={PATHS.ADMIN.MACHINES} element={<Machines />} />
    <Route path={PATHS.ADMIN.PAYMENTS} element={<Payments />} />
    <Route path={`${PATHS.ADMIN.PAYMENTS}/:id`} element={<PaymentDetails />} />
    <Route path={PATHS.ADMIN.SALES} element={<Sales />} />
    <Route path={PATHS.ADMIN.FEES} element={<Fees />} />
    <Route path={PATHS.ADMIN.REPORTS} element={<Reports />} />
    <Route path={PATHS.ADMIN.NOTIFICATIONS} element={<AdminNotifications />} />
    <Route path={PATHS.ADMIN.SETTINGS} element={<Settings />} />
    <Route path={PATHS.ADMIN.SUPPORT} element={<Support />} />
  </Route>
);
