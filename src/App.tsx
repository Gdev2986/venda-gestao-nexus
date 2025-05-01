import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Auth Protection Component
import RequireAuth from "./components/auth/RequireAuth";

// Dashboard
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import PaymentRequests from "./pages/admin/PaymentRequests";
import SalesAdmin from "./pages/admin/SalesAdmin";
import ClientsAdmin from "./pages/admin/ClientsAdmin";
import PartnersAdmin from "./pages/admin/PartnersAdmin";
import LogisticsAdmin from "./pages/admin/LogisticsAdmin";
import SupportAdmin from "./pages/admin/SupportAdmin";

// Clients
import Clients from "./pages/clients/Clients";
import ClientDetails from "./pages/clients/ClientDetails";
import NewClient from "./pages/clients/NewClient";

// Machines
import Machines from "./pages/machines/Machines";
import MachineDetails from "./pages/machines/MachineDetails";
import NewMachine from "./pages/machines/NewMachine";

// Sales
import Sales from "./pages/sales/Sales";
import SaleDetails from "./pages/sales/SaleDetails";
import NewSale from "./pages/sales/NewSale";

// Payments
import Payments from "./pages/payments/Payments";
import UserPayments from "./pages/UserPayments";

// Partners
import Partners from "./pages/partners/Partners";
import PartnerDetails from "./pages/partners/PartnerDetails";
import NewPartner from "./pages/partners/NewPartner";

// Settings
import Settings from "./pages/settings/Settings";
import UserManagement from "./pages/settings/UserManagement";

// Other
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import Help from "./pages/Help";
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

  // Role-based route access function
  const canAccessRoute = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(userRole) || userRole === UserRole.ADMIN;
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
        {/* Main Client Layout */}
        <Route element={<MainLayout />}>
          <Route
            path={PATHS.DASHBOARD}
            element={
              userRole === UserRole.CLIENT ? <ClientDashboard /> : <Dashboard />
            }
          />
          
          {/* Client Routes */}
          <Route 
            path={PATHS.CLIENTS} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS]) 
                ? <Clients /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.CLIENT_DETAILS()} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS])
                ? <ClientDetails /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.CLIENT_NEW} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL])
                ? <NewClient /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />

          {/* Machine Routes */}
          <Route 
            path={PATHS.MACHINES} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS])
                ? <Machines /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.MACHINE_DETAILS()} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS])
                ? <MachineDetails /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.MACHINE_NEW} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.LOGISTICS])
                ? <NewMachine /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />

          {/* Sales Routes */}
          <Route 
            path={PATHS.SALES} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS])
                ? <Sales /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.SALES_DETAILS()} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER, UserRole.LOGISTICS])
                ? <SaleDetails /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.SALES_NEW} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL])
                ? <NewSale /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />

          {/* Client Payment Routes */}
          <Route 
            path={PATHS.PAYMENTS} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL])
                ? <Payments /> 
                : <Navigate to={PATHS.USER_PAYMENTS} replace />
            } 
          />
          <Route 
            path={PATHS.PAYMENT_DETAILS()} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL])
                ? <Payments /> 
                : <Navigate to={PATHS.USER_PAYMENTS} replace />
            } 
          />
          <Route path={PATHS.PAYMENT_NEW} element={<Payments />} />
          <Route path={PATHS.USER_PAYMENTS} element={<UserPayments />} />
          <Route path={PATHS.CLIENT_PAYMENTS} element={<Navigate to={PATHS.USER_PAYMENTS} replace />} />

          {/* Partner Routes */}
          <Route 
            path={PATHS.PARTNERS} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL])
                ? <Partners /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.PARTNER_DETAILS()} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL])
                ? <PartnerDetails /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />
          <Route 
            path={PATHS.PARTNER_NEW} 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.FINANCIAL])
                ? <NewPartner /> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />

          {/* Logistics Routes */}
          <Route 
            path="/logistics" 
            element={
              canAccessRoute([UserRole.ADMIN, UserRole.LOGISTICS])
                ? <div className="container mx-auto py-10">
                    <h1 className="text-3xl font-semibold mb-6">Módulo de Logística</h1>
                    <p className="text-gray-600">Esta funcionalidade está em desenvolvimento.</p>
                  </div> 
                : <Navigate to={PATHS.DASHBOARD} replace />
            } 
          />

          {/* Settings Routes */}
          <Route path={PATHS.SETTINGS} element={<Settings />} />
          <Route 
            path={PATHS.USER_MANAGEMENT} 
            element={
              canAccessRoute([UserRole.ADMIN])
                ? <UserManagement /> 
                : <Navigate to={PATHS.SETTINGS} replace />
            } 
          />

          {/* Other Routes */}
          <Route 
            path={PATHS.FEES} 
            element={<Fees />} 
          />
          <Route 
            path={PATHS.REPORTS} 
            element={<Reports />} 
          />
          <Route path={PATHS.SUPPORT} element={<Support />} />
          <Route path={PATHS.HELP} element={<Help />} />
        </Route>
        
        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="payment-requests" element={<PaymentRequests />} />
          <Route path="payments" element={<Navigate to="/admin/payment-requests" replace />} />
          <Route path="clients" element={<ClientsAdmin />} />
          <Route path="partners" element={<PartnersAdmin />} />
          <Route path="sales" element={<SalesAdmin />} />
          <Route path="logistics" element={<LogisticsAdmin />} />
          <Route path="support" element={<SupportAdmin />} />
          <Route path="financial-reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}

export default App;
