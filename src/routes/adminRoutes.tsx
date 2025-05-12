
import { Fragment } from "react";
import { Route } from "react-router-dom";
import { adminRoutes as adminRoutesConfig } from "./admin/adminRoutes";

// Convert the admin route config array to actual Route components
export const adminRoutes = adminRoutesConfig.map((route, index) => (
  <Route 
    key={`admin-route-${index}`}
    path={route.path}
    element={route.element}
  />
));
