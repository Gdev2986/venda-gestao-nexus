
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Sales pages
import AdminSales from "../../pages/admin/Sales";
import SaleDetails from "../../pages/sales/SaleDetails";
import NewSale from "../../pages/sales/NewSale";

// Sales Routes for Admin Module
export const salesRoutes = [
  <Route 
    key="admin-sales" 
    path={PATHS.ADMIN.SALES} 
    element={<AdminSales />} 
  />,
  <Route 
    key="admin-sales-details" 
    path={PATHS.ADMIN.SALE_DETAILS()} 
    element={<SaleDetails />} 
  />,
  <Route 
    key="admin-sales-new" 
    path={PATHS.ADMIN.SALES_NEW} 
    element={<NewSale />} 
  />
];
