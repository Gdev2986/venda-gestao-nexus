
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Clients Pages
import AdminClients from "../../pages/admin/Clients";
import ClientDetails from "../../pages/clients/ClientDetails";
import NewClient from "../../pages/clients/NewClient";
import Clients from "../../pages/clients/Clients";

// Client Routes for Admin Module
export const clientRoutes = [
  <Route 
    key="admin-clients" 
    path={PATHS.ADMIN.CLIENTS} 
    element={<AdminClients />} 
  />,
  <Route 
    key="admin-client-details" 
    path={PATHS.ADMIN.CLIENT_DETAILS()} 
    element={<ClientDetails />} 
  />,
  <Route 
    key="admin-client-new" 
    path={PATHS.ADMIN.CLIENT_NEW} 
    element={<NewClient />} 
  />
  // Remove the logistics client route from here as it's not valid under admin routes
];

