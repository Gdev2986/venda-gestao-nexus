
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";

// Layouts
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import LogisticsLayout from "@/layouts/LogisticsLayout";
import UserLayout from "@/layouts/UserLayout";
import MainLayout from "@/layouts/MainLayout";
import PartnerLayout from "@/layouts/PartnerLayout";
import FinancialLayout from "@/layouts/FinancialLayout";

// Pages
import LandingPage from "@/pages/Index";
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import NewClient from "@/pages/clients/NewClient";
import ClientDetails from "@/pages/clients/ClientDetails";
import AdminPartners from "@/pages/admin/Partners";
import NewPartner from "@/pages/partners/NewPartner";
import PartnerDetails from "@/pages/partners/PartnerDetails";
import AdminSales from "@/pages/admin/Sales";
import NewSale from "@/pages/sales/NewSale";
import SaleDetails from "@/pages/sales/SaleDetails";
import AdminPayments from "@/pages/admin/Payments";
import AdminPaymentDetails from "@/pages/admin/PaymentDetails";
import AdminReports from "@/pages/admin/Reports";
import AdminFees from "@/pages/admin/Fees";
import Notifications from "@/pages/admin/Notifications";
import AdminLogistics from "@/pages/admin/Logistics";
import RequireAuth from "@/components/auth/RequireAuth";

// Logistics pages
import LogisticsDashboard from "@/pages/logistics/Dashboard";
import LogisticsMachines from "@/pages/logistics/Machines";
import LogisticsOperations from "@/pages/logistics/Operations";
import Support from "@/pages/logistics/Support";

// Client pages
import ClientDashboard from "@/pages/user/Dashboard";
import ClientPayments from "@/pages/user/Payments";
import ClientSupport from "@/pages/user/Support";
import ClientMachines from "@/pages/user/Machines";

// Partner pages
import PartnerDashboard from "@/pages/partner/Dashboard";
import PartnerClients from "@/pages/partner/Clients";

// Financial pages
import FinancialDashboard from "@/pages/financial/Dashboard";
import FinancialPayments from "@/pages/financial/Requests";

// Machines pages
import Machines from "@/pages/machines/Machines";
import NewMachine from "@/pages/machines/NewMachine";
import MachineDetails from "@/pages/machines/MachineDetails";

import { PATHS } from "@/routes/paths";

function App() {
  const { userRole } = useUserRole();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
      </Route>

      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      
      {/* Admin routes */}
      <Route element={<RequireAuth allowedRoles={[UserRole.ADMIN]} />}>
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
          <Route path="machines/:id" element={<MachineDetails />} />
          <Route path="machines/new" element={<NewMachine />} />
        </Route>
      </Route>
        
      {/* Logistics routes */}
      <Route element={<RequireAuth allowedRoles={[UserRole.LOGISTICS]} />}>
        <Route path="logistics" element={<LogisticsLayout />}>
          <Route path="dashboard" element={<LogisticsDashboard />} />
          <Route path="machines" element={<LogisticsMachines />} />
          <Route path="machines/new" element={<NewMachine />} />
          <Route path="machines/:id" element={<MachineDetails />} />
          <Route path="operations" element={<LogisticsOperations />} />
          <Route path="support" element={<Support />} />
          <Route path="support/:id" element={<Support />} />
        </Route>
      </Route>

      {/* Client routes */}
      <Route element={<RequireAuth allowedRoles={[UserRole.CLIENT]} />}>
        <Route path="client" element={<UserLayout />}>
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="payments" element={<ClientPayments />} />
          <Route path="payments/new" element={<ClientPayments />} />
          <Route path="payments/:id" element={<ClientPayments />} />
          <Route path="support" element={<ClientSupport />} />
          <Route path="support/new" element={<ClientSupport />} />
          <Route path="support/:id" element={<ClientSupport />} />
          <Route path="machines" element={<ClientMachines />} />
        </Route>
      </Route>
      
      {/* Partner routes */}
      <Route element={<RequireAuth allowedRoles={[UserRole.PARTNER]} />}>
        <Route path="partner" element={<PartnerLayout />}>
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="clients" element={<PartnerClients />} />
        </Route>
      </Route>
      
      {/* Financial routes */}
      <Route element={<RequireAuth allowedRoles={[UserRole.FINANCIAL]} />}>
        <Route path="financial" element={<FinancialLayout />}>
          <Route path="dashboard" element={<FinancialDashboard />} />
          <Route path="payments" element={<FinancialPayments />} />
        </Route>
      </Route>

      {/* Machines routes - temporary */}
      <Route path="machines" element={<MainLayout />}>
        <Route index element={<Machines />} />
        <Route path="new" element={<NewMachine />} />
      </Route>
    </Routes>
  );
}

export default App;
