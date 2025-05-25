
import { Route } from "react-router-dom";
import { UserRole } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";
import PartnerLayout from "../layouts/PartnerLayout";

// Import pages
import PartnerDashboard from "../pages/partner/Dashboard";
import PartnerClients from "../pages/partner/Clients";
import PartnerSales from "../pages/partner/Sales";
import PartnerCommissions from "../pages/partner/Commissions";
import PartnerReports from "../pages/partner/Reports";
import PartnerSettings from "../pages/partner/Settings";

export const PartnerRoutes = (
  <Route 
    path="/partner/*" 
    element={
      <AuthGuard allowedRoles={[UserRole.PARTNER]}>
        <PartnerLayout />
      </AuthGuard>
    }
  >
    <Route path="dashboard" element={<PartnerDashboard />} />
    <Route path="clients" element={<PartnerClients />} />
    <Route path="sales" element={<PartnerSales />} />
    <Route path="commissions" element={<PartnerCommissions />} />
    <Route path="reports" element={<PartnerReports />} />
    <Route path="settings" element={<PartnerSettings />} />
  </Route>
);
