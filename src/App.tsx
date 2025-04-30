import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { PATHS } from "./routes/paths";

// Import components that definitely exist based on previous files
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Payments from "./pages/Payments";
import ClientPayments from "./pages/ClientPayments";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import Help from "./pages/Help";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";
import Partners from "./pages/Partners";
import Settings from "./pages/Settings";

// Import Index page for homepage
import Index from "./pages/Index";

// Import user role hook
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
        element={
          <ProtectedRoute>
            {userRole === UserRole.CLIENT ? <ClientDashboard /> : <Dashboard />}
          </ProtectedRoute>
        } 
      />
      
      {/* Payment routes */}
      <Route 
        path={PATHS.PAYMENTS} 
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={PATHS.PAYMENT_DETAILS()} 
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={PATHS.PAYMENT_NEW} 
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } 
      />
      
      {/* Client Payments route */}
      <Route 
        path={PATHS.CLIENT_PAYMENTS} 
        element={
          <ProtectedRoute>
            <ClientPayments />
          </ProtectedRoute>
        } 
      />
      
      {/* Partners route */}
      <Route 
        path={PATHS.PARTNERS} 
        element={
          <ProtectedRoute>
            <Partners />
          </ProtectedRoute>
        } 
      />

      {/* Settings route */}
      <Route 
        path={PATHS.SETTINGS} 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      {/* Other routes that we know exist */}
      <Route 
        path={PATHS.FEES} 
        element={
          <ProtectedRoute>
            <Fees />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={PATHS.REPORTS} 
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={PATHS.SUPPORT} 
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={PATHS.HELP} 
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } 
      />

      {/* 404 - Not Found */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
