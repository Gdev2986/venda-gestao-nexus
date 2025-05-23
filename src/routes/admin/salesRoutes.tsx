
import { Route } from "react-router-dom";
import { lazy } from "react";
import { PATHS } from "../paths";

// Lazy load the sales pages
const AdminSales = lazy(() => import("../../pages/admin/Sales"));
const SaleDetails = lazy(() => import("../../pages/sales/SaleDetails"));
const NewSale = lazy(() => import("../../pages/sales/NewSale"));

export const salesRoutes = [
  <Route 
    key="admin-sales" 
    path={PATHS.ADMIN.SALES} 
    element={<AdminSales />} 
  />,
  <Route 
    key="admin-sales-details" 
    path={PATHS.ADMIN.SALES_DETAILS()} 
    element={<SaleDetails />} 
  />,
  <Route 
    key="admin-sales-new" 
    path={PATHS.ADMIN.SALES_NEW} 
    element={<NewSale />} 
  />
];
