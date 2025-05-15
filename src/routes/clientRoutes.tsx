
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

// Using USER paths instead of CLIENT since CLIENT doesn't exist in the paths file
export const clientRoutes = (
  <Route path={PATHS.USER.ROOT} element={<ClientLayout />}>
    <Route index element={<ClientDashboard />} />
    <Route path={PATHS.USER.NEW} element={<ClientNew />} />
    <Route path={`${PATHS.USER.DETAIL}/:id`} element={<ClientDetail />} />
  </Route>
);

export default clientRoutes;
