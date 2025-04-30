import { useEffect } from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import { PATHS } from "./routes/paths";

// Import components that definitely exist based on previous files
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Payments from "./pages/payments/Payments";
import UserPayments from "./pages/UserPayments";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import Help from "./pages/Help";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";

// Import Index page for homepage
import Index from "./pages/Index";

// Import user role hook
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
      {/* Home route (Index page) */}
      <Route path={PATHS.HOME} element={<Index />} />

      {/* Dashboard routes */}
      <Route 
        path={PATHS.DASHBOARD} 
        element={userRole === UserRole.CLIENT ? <ClientDashboard /> : <Dashboard />} 
      />
      
      {/* Payment routes */}
      <Route path={PATHS.PAYMENTS} element={<Payments />} />
      <Route path={PATHS.PAYMENT_DETAILS()} element={<Payments />} />
      <Route path={PATHS.PAYMENT_NEW} element={<Payments />} />
      <Route path={PATHS.USER_PAYMENTS} element={<UserPayments />} />
      
      {/* Other routes that we know exist */}
      <Route path={PATHS.FEES} element={<Fees />} />
      <Route path={PATHS.REPORTS} element={<Reports />} />
      <Route path={PATHS.SUPPORT} element={<Support />} />
      <Route path={PATHS.HELP} element={<Help />} />

      {/* 404 - Not Found */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}

export default App;
