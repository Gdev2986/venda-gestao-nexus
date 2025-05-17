
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/PartnerLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Pages
import Dashboard from "../pages/partner/Dashboard";
import Clients from "../pages/partner/Clients";
import ClientDetails from "../pages/partner/ClientDetails";
import Commissions from "../pages/partner/Commissions";
import Reports from "../pages/partner/Reports";
import Sales from "../pages/partner/Sales";
import Settings from "../pages/partner/Settings";

export const PartnerRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.PARTNER]} />}>
    <Route element={<MainLayout />}>
      <Route path={PATHS.PARTNER.DASHBOARD} element={<Dashboard />} />
      <Route path={PATHS.PARTNER.CLIENTS} element={<Clients />} />
      <Route path={PATHS.PARTNER.CLIENT_DETAILS(':id')} element={<ClientDetails />} />
      <Route path={PATHS.PARTNER.COMMISSIONS} element={<Commissions />} />
      <Route path={PATHS.PARTNER.REPORTS} element={<Reports />} />
      <Route path={PATHS.PARTNER.SALES} element={<Sales />} />
      <Route path={PATHS.PARTNER.SETTINGS} element={<Settings />} />
    </Route>
  </Route>
);
