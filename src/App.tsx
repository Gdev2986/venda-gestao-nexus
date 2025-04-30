import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { PATHS } from "./routes/paths";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";

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

// Layout and Auth
import AuthLayout from "./components/layout/AuthLayout";
import RequireAuth from "./components/auth/RequireAuth";
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";

function App() {
  const location = useLocation();
  const { userRole } = useUserRole();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route
          path={PATHS.DASHBOARD}
          element={
            userRole === UserRole.CLIENT ? <ClientDashboard /> : <Dashboard />
          }
        />

        {/* Client Routes */}
        <Route path={PATHS.CLIENTS} element={<Clients />} />
        <Route path={PATHS.CLIENT_DETAILS()} element={<ClientDetails />} />
        <Route path={PATHS.CLIENT_NEW} element={<NewClient />} />

        {/* Machine Routes */}
        <Route path={PATHS.MACHINES} element={<Machines />} />
        <Route path={PATHS.MACHINE_DETAILS()} element={<MachineDetails />} />
        <Route path={PATHS.MACHINE_NEW} element={<NewMachine />} />

        {/* Sales Routes */}
        <Route path={PATHS.SALES} element={<Sales />} />
        <Route path={PATHS.SALES_DETAILS()} element={<SaleDetails />} />
        <Route path={PATHS.SALES_NEW} element={<NewSale />} />

        {/* Payment Routes */}
        <Route path={PATHS.PAYMENTS} element={<Payments />} />
        <Route path={PATHS.PAYMENT_DETAILS()} element={<Payments />} />
        <Route path={PATHS.PAYMENT_NEW} element={<Payments />} />
        <Route path="/user-payments" element={<UserPayments />} />

        {/* Partner Routes */}
        <Route path={PATHS.PARTNERS} element={<Partners />} />
        <Route path={PATHS.PARTNER_DETAILS()} element={<PartnerDetails />} />
        <Route path={PATHS.PARTNER_NEW} element={<NewPartner />} />

        {/* Settings Routes */}
        <Route path={PATHS.SETTINGS} element={<Settings />} />
        <Route path={PATHS.USER_MANAGEMENT} element={<UserManagement />} />

        {/* Other Routes */}
        <Route path={PATHS.FEES} element={<Fees />} />
        <Route path={PATHS.REPORTS} element={<Reports />} />
        <Route path={PATHS.SUPPORT} element={<Support />} />
        <Route path={PATHS.HELP} element={<Help />} />
      </Route>

      {/* Redirect from root to dashboard */}
      <Route path={PATHS.HOME} element={<Login />} />

      {/* 404 */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}

export default App;
