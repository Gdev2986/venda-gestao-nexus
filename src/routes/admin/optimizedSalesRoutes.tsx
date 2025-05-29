
import { Route } from "react-router-dom";
import { lazy } from "react";

const OptimizedSalesPage = lazy(() => import("../../pages/admin/OptimizedSales"));

export const optimizedSalesRoutes = [
  <Route 
    key="admin-optimized-sales" 
    path="/admin/optimized-sales" 
    element={<OptimizedSalesPage />} 
  />
];
