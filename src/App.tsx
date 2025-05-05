import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

// Layouts
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import LogisticsLayout from "@/layouts/LogisticsLayout";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import NewClient from "@/pages/admin/NewClient";
import ClientDetails from "@/pages/admin/ClientDetails";
import AdminPartners from "@/pages/admin/Partners";
import NewPartner from "@/pages/admin/NewPartner";
import PartnerDetails from "@/pages/admin/PartnerDetails";
import AdminSales from "@/pages/admin/Sales";
import NewSale from "@/pages/admin/NewSale";
import SaleDetails from "@/pages/admin/SaleDetails";
import AdminPayments from "@/pages/admin/Payments";
import AdminPaymentDetails from "@/pages/admin/PaymentDetails";
import AdminReports from "@/pages/admin/Reports";
import AdminFees from "@/pages/admin/Fees";
import Notifications from "@/pages/admin/Notifications";
import AdminLogistics from "@/pages/admin/Logistics";
import LogisticsDashboard from "@/pages/logistics/Dashboard";
import LogisticsMachines from "@/pages/logistics/Machines";
import LogisticsOperations from "@/pages/logistics/Operations";
import Support from "@/pages/logistics/Support";
import Machines from "@/pages/machines/Machines";
import NewMachine from "@/pages/machines/NewMachine";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/" element={<RootLayout />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="clients/new" element={<NewClient />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="partners/new" element={<NewPartner />} />
          <Route path="partners/:id" element={<PartnerDetails />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="sales/new" element={<NewSale />} />
          <Route path="sales/:id" element={<SaleDetails />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="payments/:id" element={<AdminPaymentDetails />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="logistics" element={<AdminLogistics />} />
        </Route>
        
        {/* Logistics routes */}
        <Route path="logistics" element={<LogisticsLayout />}>
          <Route path="dashboard" element={<LogisticsDashboard />} />
          <Route path="machines" element={<LogisticsMachines />} />
          <Route path="operations" element={<LogisticsOperations />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Machines routes - temporary */}
        <Route path="machines" element={<RootLayout />}>
          <Route index element={<Machines />} />
          <Route path="new" element={<NewMachine />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
