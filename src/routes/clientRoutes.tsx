
import { Route, Outlet } from "react-router-dom";
import { PATHS } from "./paths";

// Layouts and Components
import MainLayout from "../layouts/MainLayout";

// Clients Pages
import ClientDashboard from "../pages/ClientDashboard";
import ClientDetail from "../pages/ClientDetail";
import ClientNew from "../pages/ClientNew";
import ClientRegister from "../pages/ClientRegister";
import ClientPayments from "../pages/ClientPayments";

export const clientRoutes = (
  <Route path="/client" element={<MainLayout><Outlet /></MainLayout>}>
    <Route index element={<ClientDashboard />} />
    <Route path="dashboard" element={<ClientDashboard />} />
    <Route path="detail/:id" element={<ClientDetail />} />
    <Route path="new" element={<ClientNew />} />
    <Route path="register" element={<ClientRegister />} />
    <Route path="payments" element={<ClientPayments />} />
  </Route>
);
