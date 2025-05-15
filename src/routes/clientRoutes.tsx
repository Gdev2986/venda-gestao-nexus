
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
  <Route path={PATHS.CLIENT.ROOT} element={<ClientLayout />}>
    <Route index element={<ClientDashboard />} />
    <Route path={PATHS.CLIENT.NEW} element={<ClientNew />} />
    <Route path={`${PATHS.CLIENT.DETAIL}/:id`} element={<ClientDetail />} />
  </Route>
);

export default clientRoutes;
