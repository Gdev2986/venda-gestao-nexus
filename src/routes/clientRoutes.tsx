
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import ClientDashboard from "@/pages/ClientDashboard";
import ClientDetail from "@/pages/ClientDetail";
import ClientNew from "@/pages/ClientNew";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const clientRoutes = (
  <Route path={PATHS.USER.DASHBOARD} element={<ClientLayout />}>
    <Route index element={<ClientDashboard />} />
    <Route path="payments" element={<ClientNew />} />
    <Route path="clients/:id" element={<ClientDetail />} />
  </Route>
);

export default clientRoutes;
