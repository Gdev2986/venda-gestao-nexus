
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

// Financial Pages
import Dashboard from "@/pages/financial/Dashboard";
import Settings from "@/pages/financial/Settings";

const FinancialLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const financialRoutes = (
  <Route path={PATHS.FINANCIAL.ROOT} element={<FinancialLayout />}>
    <Route index element={<Dashboard />} />
    <Route path={PATHS.FINANCIAL.SETTINGS} element={<Settings />} />
  </Route>
);

export default financialRoutes;
