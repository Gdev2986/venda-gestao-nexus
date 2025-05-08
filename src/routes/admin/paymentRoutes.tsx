
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Payment pages
import AdminPayments from "../../pages/admin/Payments";
import PaymentDetails from "../../pages/admin/PaymentDetails";

// Payment Routes for Admin Module
export const paymentRoutes = [
  <Route 
    key="admin-payments" 
    path={PATHS.ADMIN.PAYMENTS} 
    element={<AdminPayments />} 
  />,
  <Route 
    key="admin-payment-details" 
    path={PATHS.ADMIN.PAYMENT_DETAILS()} 
    element={<PaymentDetails />} 
  />,
  <Route 
    key="admin-payment-new" 
    path={PATHS.ADMIN.PAYMENT_NEW} 
    element={<AdminPayments />} 
  />
];
