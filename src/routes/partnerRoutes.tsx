
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

// Partner Pages
import Dashboard from "@/pages/partner/Dashboard";
import Clients from "@/pages/partner/Clients";
import Settings from "@/pages/partner/Settings";

const PartnerLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const partnerRoutes = (
  <Route path={PATHS.PARTNER.DASHBOARD} element={<PartnerLayout />}>
    <Route index element={<Dashboard />} />
    <Route path={PATHS.PARTNER.CLIENTS} element={<Clients />} />
    <Route path={PATHS.PARTNER.SETTINGS} element={<Settings />} />
  </Route>
);

export default partnerRoutes;
