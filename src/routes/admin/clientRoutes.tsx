
import { Route } from "react-router-dom";
import { lazy } from "react";
import { PATHS } from "../paths";

// Layouts
import AdminLayout from "../../layouts/AdminLayout";

// Client Pages
const ClientsList = lazy(() => import("../../pages/admin/Clients"));
const ClientDetails = lazy(() => import("../../pages/clients/ClientDetails"));
const ClientNew = lazy(() => import("../../pages/clients/NewClient"));

export const clientRoutes = (
  <Route path={PATHS.ADMIN.CLIENTS} element={<AdminLayout />}>
    <Route index element={<ClientsList />} />
    <Route path=":id" element={<ClientDetails />} />
    <Route path="new" element={<ClientNew />} />
  </Route>
);
