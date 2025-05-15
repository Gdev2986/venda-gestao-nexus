
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
  <Route path={PATHS.FINANCIAL.DASHBOARD} element={<FinancialLayout />}>
    <Route index element={<Dashboard />} />
    {/* Use relative path "settings" instead of absolute path */}
    <Route path="settings" element={<Settings />} />
  </Route>
);

export default financialRoutes;
