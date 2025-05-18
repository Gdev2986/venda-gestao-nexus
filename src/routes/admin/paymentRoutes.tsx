
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Payment Pages
import PaymentDetails from "../../pages/admin/PaymentDetails";
import AdminPayments from "../../pages/admin/Payments"; // Import AdminPayments component

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
  />
];
