import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import PartnerLayout from "./layouts/PartnerLayout";
import FinancialLayout from "./layouts/FinancialLayout";
import LogisticsLayout from "./layouts/LogisticsLayout";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Auth Protection Component
import RequireAuth from "./components/auth/RequireAuth";

// User (Cliente) Pages
import UserDashboard from "./pages/user/UserDashboard";

// Partner Pages
import PartnerDashboard from "./pages/partner/PartnerDashboard";

// Financial Pages
import FinancialDashboard from "./pages/financial/FinancialDashboard";

// Logistics Pages
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import PaymentRequests from "./pages/admin/PaymentRequests";

// Legacy pages that will be used or redirected
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Clients from "./pages/clients/Clients";
import ClientDetails from "./pages/clients/ClientDetails";
import NewClient from "./pages/clients/NewClient";
import Machines from "./pages/machines/Machines";
import MachineDetails from "./pages/machines/MachineDetails";
import NewMachine from "./pages/machines/NewMachine";
import Sales from "./pages/sales/Sales";
import SaleDetails from "./pages/sales/SaleDetails";
import NewSale from "./pages/sales/NewSale";
import Payments from "./pages/payments/Payments";
import UserPayments from "./pages/UserPayments";
import Partners from "./pages/partners/Partners";
import PartnerDetails from "./pages/partners/PartnerDetails";
import NewPartner from "./pages/partners/NewPartner";
import Settings from "./pages/settings/Settings";
import UserManagement from "./pages/settings/UserManagement";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";

function App() {
  const location = useLocation();
  const { userRole, isRoleLoading } = useUserRole();
  const { toast } = useToast();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Log role changes for debugging
  useEffect(() => {
    if (!isRoleLoading) {
      console.log("Current user role:", userRole);
    }
  }, [userRole, isRoleLoading]);

  // Redirect function based on user role
  const redirectToDashboard = () => {
    switch(userRole) {
      case UserRole.ADMIN:
        return <Navigate to={PATHS.ADMIN.DASHBOARD} replace />;
      case UserRole.FINANCIAL:
        return <Navigate to={PATHS.FINANCIAL.DASHBOARD} replace />;
      case UserRole.PARTNER:
        return <Navigate to={PATHS.PARTNER.DASHBOARD} replace />;
      case UserRole.CLIENT:
        return <Navigate to={PATHS.USER.DASHBOARD} replace />;
      case UserRole.LOGISTICS:
        return <Navigate to={PATHS.LOGISTICS.DASHBOARD} replace />;
      default:
        return <Navigate to={PATHS.LOGIN} replace />;
    }
  };

  return (
    <Routes>
      {/* Root path handling */}
      <Route path={PATHS.HOME} element={<RootLayout />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        {/* Legacy Dashboard - Redirects based on role */}
        <Route path={PATHS.DASHBOARD} element={redirectToDashboard()} />
        
        {/* Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={PATHS.ADMIN.CLIENTS} element={<Clients />} />
          <Route path={PATHS.ADMIN.CLIENT_DETAILS()} element={<ClientDetails />} />
          <Route path={PATHS.ADMIN.CLIENT_NEW} element={<NewClient />} />
          <Route path={PATHS.ADMIN.MACHINES} element={<Machines />} />
          <Route path={PATHS.ADMIN.MACHINE_DETAILS()} element={<MachineDetails />} />
          <Route path={PATHS.ADMIN.MACHINE_NEW} element={<NewMachine />} />
          <Route path={PATHS.ADMIN.SALES} element={<Sales />} />
          <Route path={PATHS.ADMIN.SALES_DETAILS()} element={<SaleDetails />} />
          <Route path={PATHS.ADMIN.SALES_NEW} element={<NewSale />} />
          <Route path={PATHS.ADMIN.PAYMENTS} element={<Payments />} />
          <Route path={PATHS.ADMIN.PAYMENT_REQUESTS} element={<PaymentRequests />} />
          <Route path={PATHS.ADMIN.PARTNERS} element={<Partners />} />
          <Route path={PATHS.ADMIN.PARTNER_DETAILS()} element={<PartnerDetails />} />
          <Route path={PATHS.ADMIN.PARTNER_NEW} element={<NewPartner />} />
          <Route path={PATHS.ADMIN.FEES} element={<Fees />} />
          <Route path={PATHS.ADMIN.REPORTS} element={<Reports />} />
          <Route path={PATHS.ADMIN.SETTINGS} element={<Settings />} />
          <Route path={PATHS.ADMIN.SUPPORT} element={<Support />} />
          <Route path={PATHS.ADMIN.USERS} element={<UserManagement />} />
          <Route path={PATHS.ADMIN.LOGISTICS} element={<div className="p-4">Módulo de Logística - Em construção</div>} />
          <Route path={PATHS.ADMIN.COMMISSIONS} element={<div className="p-4">Módulo de Comissões - Em construção</div>} />
          <Route path={PATHS.ADMIN.NOTIFICATIONS} element={<div className="p-4">Central de Notificações - Em construção</div>} />
          <Route path={PATHS.ADMIN.FINANCIAL_REPORTS} element={<div className="p-4">Relatórios financeiros - Em construção</div>} />
        </Route>

        {/* User (Cliente) Layout */}
        <Route element={<UserLayout />}>
          <Route path={PATHS.USER.DASHBOARD} element={<UserDashboard />} />
          <Route path={PATHS.USER.MACHINES} element={<div className="p-4">Minhas Máquinas - Em construção</div>} />
          <Route path={PATHS.USER.PAYMENTS} element={<UserPayments />} />
          <Route path={PATHS.USER.REPORTS} element={<div className="p-4">Meus Relatórios - Em construção</div>} />
          <Route path={PATHS.USER.SUPPORT} element={<div className="p-4">Central de Suporte - Em construção</div>} />
          <Route path={PATHS.USER.PROFILE} element={<div className="p-4">Meu Perfil - Em construção</div>} />
          <Route path={PATHS.USER.SETTINGS} element={<div className="p-4">Minhas Configurações - Em construção</div>} />
        </Route>

        {/* Partner Layout */}
        <Route element={<PartnerLayout />}>
          <Route path={PATHS.PARTNER.DASHBOARD} element={<PartnerDashboard />} />
          <Route path={PATHS.PARTNER.CLIENTS} element={<div className="p-4">Meus Clientes - Em construção</div>} />
          <Route path={PATHS.PARTNER.SALES} element={<div className="p-4">Vendas - Em construção</div>} />
          <Route path={PATHS.PARTNER.COMMISSIONS} element={<div className="p-4">Minhas Comissões - Em construção</div>} />
          <Route path={PATHS.PARTNER.REPORTS} element={<div className="p-4">Relatórios - Em construção</div>} />
          <Route path={PATHS.PARTNER.SUPPORT} element={<div className="p-4">Central de Suporte - Em construção</div>} />
          <Route path={PATHS.PARTNER.SETTINGS} element={<div className="p-4">Configurações - Em construção</div>} />
        </Route>

        {/* Financial Layout */}
        <Route element={<FinancialLayout />}>
          <Route path={PATHS.FINANCIAL.DASHBOARD} element={<FinancialDashboard />} />
          <Route path={PATHS.FINANCIAL.PAYMENTS} element={<div className="p-4">Gestão de Pagamentos - Em construção</div>} />
          <Route path={PATHS.FINANCIAL.REQUESTS} element={<div className="p-4">Solicitações - Em construção</div>} />
          <Route path={PATHS.FINANCIAL.REPORTS} element={<div className="p-4">Relatórios Financeiros - Em construção</div>} />
          <Route path={PATHS.FINANCIAL.SUPPORT} element={<div className="p-4">Central de Suporte - Em construção</div>} />
          <Route path={PATHS.FINANCIAL.SETTINGS} element={<div className="p-4">Configurações Financeiras - Em construção</div>} />
        </Route>

        {/* Logistics Layout */}
        <Route element={<LogisticsLayout />}>
          <Route path={PATHS.LOGISTICS.DASHBOARD} element={<LogisticsDashboard />} />
          <Route path={PATHS.LOGISTICS.MACHINES} element={<div className="p-4">Gestão de Máquinas - Em construção</div>} />
          <Route path={PATHS.LOGISTICS.REQUESTS} element={<div className="p-4">Solicitações de Logística - Em construção</div>} />
          <Route path={PATHS.LOGISTICS.REPORTS} element={<div className="p-4">Relatórios de Logística - Em construção</div>} />
          <Route path={PATHS.LOGISTICS.SUPPORT} element={<div className="p-4">Central de Suporte - Em construção</div>} />
          <Route path={PATHS.LOGISTICS.SETTINGS} element={<div className="p-4">Configurações de Logística - Em construção</div>} />
        </Route>

        {/* Legacy Routes - Redirects to new admin paths */}
        <Route path={PATHS.CLIENTS} element={<Navigate to={PATHS.ADMIN.CLIENTS} replace />} />
        <Route path={PATHS.CLIENT_DETAILS()} element={<Navigate to={`/admin/clients/${location.pathname.split('/')[2]}`} replace />} />
        <Route path={PATHS.CLIENT_NEW} element={<Navigate to={PATHS.ADMIN.CLIENT_NEW} replace />} />
        <Route path={PATHS.MACHINES} element={<Navigate to={PATHS.ADMIN.MACHINES} replace />} />
        <Route path={PATHS.MACHINE_DETAILS()} element={<Navigate to={`/admin/machines/${location.pathname.split('/')[2]}`} replace />} />
        <Route path={PATHS.MACHINE_NEW} element={<Navigate to={PATHS.ADMIN.MACHINE_NEW} replace />} />
        <Route path={PATHS.SALES} element={<Navigate to={PATHS.ADMIN.SALES} replace />} />
        <Route path={PATHS.SALES_DETAILS()} element={<Navigate to={`/admin/sales/${location.pathname.split('/')[2]}`} replace />} />
        <Route path={PATHS.SALES_NEW} element={<Navigate to={PATHS.ADMIN.SALES_NEW} replace />} />
        <Route path={PATHS.PAYMENTS} element={<Navigate to={PATHS.ADMIN.PAYMENTS} replace />} />
        <Route path={PATHS.PAYMENT_DETAILS()} element={<Navigate to={`/admin/payments/${location.pathname.split('/')[2]}`} replace />} />
        <Route path={PATHS.PAYMENT_NEW} element={<Navigate to={PATHS.ADMIN.PAYMENT_NEW} replace />} />
        <Route path={PATHS.PARTNERS} element={<Navigate to={PATHS.ADMIN.PARTNERS} replace />} />
        <Route path={PATHS.PARTNER_DETAILS()} element={<Navigate to={`/admin/partners/${location.pathname.split('/')[2]}`} replace />} />
        <Route path={PATHS.PARTNER_NEW} element={<Navigate to={PATHS.ADMIN.PARTNER_NEW} replace />} />
        <Route path={PATHS.FEES} element={<Navigate to={PATHS.ADMIN.FEES} replace />} />
        <Route path={PATHS.REPORTS} element={<Navigate to={PATHS.ADMIN.REPORTS} replace />} />
        <Route path={PATHS.SETTINGS} element={<Navigate to={PATHS.ADMIN.SETTINGS} replace />} />
        <Route path={PATHS.USER_MANAGEMENT} element={<Navigate to={PATHS.ADMIN.USERS} replace />} />
        <Route path={PATHS.SUPPORT} element={<Navigate to={PATHS.ADMIN.SUPPORT} replace />} />
        <Route path={PATHS.USER_PAYMENTS} element={<Navigate to={PATHS.USER.PAYMENTS} replace />} />
        <Route path={PATHS.CLIENT_PAYMENTS} element={<Navigate to={PATHS.USER.PAYMENTS} replace />} />
      </Route>

      {/* 404 */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}

export default App;
